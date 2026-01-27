/**
 * POML Orchestrator - Context Preservation System
 *
 * Prevents context loss during long development sessions by:
 * 1. Creating checkpoints at regular intervals
 * 2. Saving state to POML files
 * 3. Generating continuation prompts
 * 4. Tracking progress and next steps
 */

import { SpecKit } from './spec-kit.js';
import { AIAdapter } from '../adapters/ai-adapter.interface.js';

export interface POMLCheckpoint {
  id: string;
  timestamp: string;
  phase: 'planning' | 'setup' | 'development' | 'testing' | 'deployment' | 'complete';
  completedTasks: string[];
  currentTask: string | null;
  nextTasks: string[];
  contextSummary: string;
  issuesEncountered: string[];
  decisionsLog: {
    timestamp: string;
    decision: string;
    rationale: string;
  }[];
  codeMetrics: {
    filesCreated: number;
    linesOfCode: number;
    testsWritten: number;
    coveragePercent?: number;
  };
}

export interface POMLState {
  projectName: string;
  specKit: SpecKit;
  checkpoints: POMLCheckpoint[];
  currentCheckpoint: POMLCheckpoint;
  overallProgress: number;
  estimatedCompletion: string;
}

export class POMLOrchestrator {
  private aiAdapter: AIAdapter;
  private checkpointInterval: number; // in minutes
  private lastCheckpointTime: number;

  constructor(aiAdapter: AIAdapter, checkpointInterval: number = 15) {
    this.aiAdapter = aiAdapter;
    this.checkpointInterval = checkpointInterval;
    this.lastCheckpointTime = Date.now();
  }

  /**
   * Initialize POML state from Spec-Kit
   */
  initializePOML(specKit: SpecKit): POMLState {
    const initialCheckpoint: POMLCheckpoint = {
      id: 'CP000',
      timestamp: new Date().toISOString(),
      phase: 'planning',
      completedTasks: [],
      currentTask: null,
      nextTasks: specKit.tasks.slice(0, 5).map(t => t.id),
      contextSummary: `Project initialized: ${specKit.constitution.projectName}`,
      issuesEncountered: [],
      decisionsLog: [],
      codeMetrics: {
        filesCreated: 0,
        linesOfCode: 0,
        testsWritten: 0,
      },
    };

    return {
      projectName: specKit.constitution.projectName,
      specKit,
      checkpoints: [initialCheckpoint],
      currentCheckpoint: initialCheckpoint,
      overallProgress: 0,
      estimatedCompletion: this.estimateCompletion(specKit),
    };
  }

  /**
   * Check if checkpoint is needed based on time interval
   */
  shouldCreateCheckpoint(): boolean {
    const now = Date.now();
    const elapsed = (now - this.lastCheckpointTime) / 1000 / 60; // minutes
    return elapsed >= this.checkpointInterval;
  }

  /**
   * Create checkpoint with AI-generated context summary
   */
  async createCheckpoint(
    state: POMLState,
    completedTaskIds: string[],
    currentTaskId: string | null,
    issuesEncountered: string[] = []
  ): Promise<POMLCheckpoint> {
    const checkpointId = `CP${String(state.checkpoints.length).padStart(3, '0')}`;

    // Get completed task details
    const completedTasks = state.specKit.tasks.filter(t =>
      completedTaskIds.includes(t.id)
    );

    // Get next tasks (uncompleted, ordered by priority)
    const nextTasks = state.specKit.tasks
      .filter(t => !completedTaskIds.includes(t.id))
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 5)
      .map(t => t.id);

    // Generate AI context summary
    const contextSummary = await this.generateContextSummary(
      state,
      completedTasks.map(t => t.title),
      currentTaskId
    );

    // Determine current phase
    const phase = this.determinePhase(state.overallProgress);

    const checkpoint: POMLCheckpoint = {
      id: checkpointId,
      timestamp: new Date().toISOString(),
      phase,
      completedTasks: completedTaskIds,
      currentTask: currentTaskId,
      nextTasks,
      contextSummary,
      issuesEncountered,
      decisionsLog: [],
      codeMetrics: {
        filesCreated: 0,
        linesOfCode: 0,
        testsWritten: 0,
      },
    };

    state.checkpoints.push(checkpoint);
    state.currentCheckpoint = checkpoint;
    state.overallProgress = (completedTaskIds.length / state.specKit.tasks.length) * 100;

    this.lastCheckpointTime = Date.now();

    return checkpoint;
  }

  /**
   * Generate AI context summary for checkpoint
   */
  private async generateContextSummary(
    state: POMLState,
    completedTitles: string[],
    currentTaskId: string | null
  ): Promise<string> {
    const currentTask = currentTaskId
      ? state.specKit.tasks.find(t => t.id === currentTaskId)
      : null;

    const prompt = `Summarize the current project state in 2-3 sentences for context preservation.

Project: ${state.projectName}
Completed tasks (${completedTitles.length}):
${completedTitles.slice(-5).map(t => `- ${t}`).join('\n')}

Current task: ${currentTask ? currentTask.title : 'None'}

Create a concise summary that captures:
1. What has been accomplished
2. Current focus
3. What's coming next

Return ONLY the summary text, no markdown, no extra formatting.`;

    return await this.aiAdapter.generateText(prompt, 300);
  }

  /**
   * Determine project phase based on progress
   */
  private determinePhase(progress: number): POMLCheckpoint['phase'] {
    if (progress === 0) return 'planning';
    if (progress < 20) return 'setup';
    if (progress < 80) return 'development';
    if (progress < 95) return 'testing';
    if (progress < 100) return 'deployment';
    return 'complete';
  }

  /**
   * Generate continuation prompt for resuming after context loss
   */
  async generateContinuationPrompt(state: POMLState): Promise<string> {
    const checkpoint = state.currentCheckpoint;
    const recentCheckpoints = state.checkpoints.slice(-3);

    const prompt = `Generate a continuation prompt for resuming this project after context loss.

Project: ${state.projectName}
Progress: ${state.overallProgress.toFixed(1)}%
Phase: ${checkpoint.phase}

Recent progress:
${recentCheckpoints.map(cp => `- ${cp.timestamp}: ${cp.contextSummary}`).join('\n')}

Completed tasks: ${checkpoint.completedTasks.length}/${state.specKit.tasks.length}
Current task: ${checkpoint.currentTask || 'None'}
Next tasks: ${checkpoint.nextTasks.slice(0, 3).join(', ')}

Issues encountered:
${checkpoint.issuesEncountered.map(i => `- ${i}`).join('\n') || 'None'}

Create a comprehensive continuation prompt that:
1. Summarizes project vision and architecture
2. Lists completed work
3. Explains current state
4. Outlines next steps
5. References any issues to watch for

Format as a clear prompt that can be given to an AI to resume work.

Return ONLY the continuation prompt text.`;

    return await this.aiAdapter.generateText(prompt, 1500);
  }

  /**
   * Log a decision in the checkpoint
   */
  logDecision(checkpoint: POMLCheckpoint, decision: string, rationale: string): void {
    checkpoint.decisionsLog.push({
      timestamp: new Date().toISOString(),
      decision,
      rationale,
    });
  }

  /**
   * Update code metrics in checkpoint
   */
  updateMetrics(
    checkpoint: POMLCheckpoint,
    filesCreated: number,
    linesOfCode: number,
    testsWritten: number,
    coveragePercent?: number
  ): void {
    checkpoint.codeMetrics = {
      filesCreated,
      linesOfCode,
      testsWritten,
      coveragePercent,
    };
  }

  /**
   * Export POML state to file format
   */
  exportPOML(state: POMLState): string {
    let poml = `# POML - Project Orchestration Markup Language\n`;
    poml += `# Generated by DevForge AI Software Factory\n`;
    poml += `# Last Updated: ${new Date().toISOString()}\n\n`;

    // Project Info
    poml += `[project]\n`;
    poml += `name = "${state.projectName}"\n`;
    poml += `version = "${state.specKit.metadata.version}"\n`;
    poml += `created_at = "${state.specKit.metadata.createdAt}"\n`;
    poml += `current_phase = "${state.currentCheckpoint.phase}"\n`;
    poml += `progress = ${state.overallProgress.toFixed(2)}%\n\n`;

    // Constitution
    poml += `[constitution]\n`;
    poml += `vision = "${state.specKit.constitution.vision}"\n`;
    poml += `principles = ${JSON.stringify(state.specKit.constitution.principles)}\n\n`;

    // Progress Tracking
    poml += `[progress]\n`;
    poml += `total_tasks = ${state.specKit.tasks.length}\n`;
    poml += `completed_tasks = ${state.currentCheckpoint.completedTasks.length}\n`;
    poml += `current_task = "${state.currentCheckpoint.currentTask || 'none'}"\n`;
    poml += `next_tasks = ${JSON.stringify(state.currentCheckpoint.nextTasks)}\n\n`;

    // Current Checkpoint
    poml += `[checkpoint]\n`;
    poml += `id = "${state.currentCheckpoint.id}"\n`;
    poml += `timestamp = "${state.currentCheckpoint.timestamp}"\n`;
    poml += `phase = "${state.currentCheckpoint.phase}"\n`;
    poml += `context_summary = "${state.currentCheckpoint.contextSummary}"\n\n`;

    // Code Metrics
    poml += `[metrics]\n`;
    poml += `files_created = ${state.currentCheckpoint.codeMetrics.filesCreated}\n`;
    poml += `lines_of_code = ${state.currentCheckpoint.codeMetrics.linesOfCode}\n`;
    poml += `tests_written = ${state.currentCheckpoint.codeMetrics.testsWritten}\n`;
    if (state.currentCheckpoint.codeMetrics.coveragePercent) {
      poml += `test_coverage = ${state.currentCheckpoint.codeMetrics.coveragePercent}%\n`;
    }
    poml += `\n`;

    // Issues
    if (state.currentCheckpoint.issuesEncountered.length > 0) {
      poml += `[issues]\n`;
      state.currentCheckpoint.issuesEncountered.forEach((issue, i) => {
        poml += `issue_${i + 1} = "${issue}"\n`;
      });
      poml += `\n`;
    }

    // Decisions Log
    if (state.currentCheckpoint.decisionsLog.length > 0) {
      poml += `[decisions]\n`;
      state.currentCheckpoint.decisionsLog.forEach((dec, i) => {
        poml += `decision_${i + 1} = "${dec.decision}"\n`;
        poml += `decision_${i + 1}_rationale = "${dec.rationale}"\n`;
        poml += `decision_${i + 1}_timestamp = "${dec.timestamp}"\n`;
      });
      poml += `\n`;
    }

    // Auto-refresh instructions
    poml += `[auto_refresh]\n`;
    poml += `# This POML file is automatically updated every ${this.checkpointInterval} minutes\n`;
    poml += `# to prevent context loss during long development sessions.\n`;
    poml += `# To resume: Load this file and use the continuation prompt below.\n`;
    poml += `checkpoint_interval_minutes = ${this.checkpointInterval}\n`;
    poml += `last_checkpoint = "${state.currentCheckpoint.timestamp}"\n`;
    poml += `next_checkpoint_due = "${new Date(Date.now() + this.checkpointInterval * 60000).toISOString()}"\n\n`;

    // Checkpoint History
    poml += `[checkpoint_history]\n`;
    poml += `total_checkpoints = ${state.checkpoints.length}\n`;
    state.checkpoints.slice(-10).forEach((cp, i) => {
      poml += `checkpoint_${i + 1}_id = "${cp.id}"\n`;
      poml += `checkpoint_${i + 1}_time = "${cp.timestamp}"\n`;
      poml += `checkpoint_${i + 1}_phase = "${cp.phase}"\n`;
    });
    poml += `\n`;

    // Context Preservation
    poml += `[context_preservation]\n`;
    poml += `# Use this section to resume work after context reset\n`;
    poml += `# The AI can read this to understand where the project stands\n`;
    poml += `state_file = ".devforge/state.json"\n`;
    poml += `spec_kit_file = ".devforge/spec-kit.json"\n`;
    poml += `checkpoints_file = ".devforge/checkpoints.json"\n`;
    poml += `continuation_prompt_file = ".devforge/continuation-prompt.txt"\n\n`;

    return poml;
  }

  /**
   * Estimate project completion time
   */
  private estimateCompletion(specKit: SpecKit): string {
    const totalHours = specKit.tasks.reduce((sum, task) => sum + task.estimatedHours, 0);
    const workingHoursPerDay = 6;
    const estimatedDays = Math.ceil(totalHours / workingHoursPerDay);

    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + estimatedDays);

    return completionDate.toISOString().split('T')[0];
  }

  /**
   * Generate reminder to create checkpoint
   */
  generateCheckpointReminder(state: POMLState): string {
    return `⏰ CHECKPOINT REMINDER: ${this.checkpointInterval} minutes have passed since last checkpoint.

Current State:
- Progress: ${state.overallProgress.toFixed(1)}%
- Phase: ${state.currentCheckpoint.phase}
- Current Task: ${state.currentCheckpoint.currentTask || 'None'}

Action: Create a checkpoint now to preserve context:
1. Call createCheckpoint() with completed task IDs
2. Update POML file
3. Save state to .devforge/state.json

This prevents context loss and allows seamless continuation!`;
  }
}
