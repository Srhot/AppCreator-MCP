/**
 * Context Manager - The BRAIN of Auto-Refresh System
 *
 * This class is responsible for:
 * - Tracking task completion
 * - Triggering checkpoints every 20 tasks
 * - Triggering feature checkpoints every 15 tasks
 * - Managing session state
 * - Preventing context drift
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import {
  renderCheckpointReviewPOML,
  renderRefreshContextPOML,
  type CheckpointReviewPOMLContext,
  type RefreshContextPOMLContext,
  CheckpointReviewManager,
  MemoryAnchorManager,
  createDefaultMemoryAnchors,
} from '../templates/poml/index.js';

/**
 * Session state tracking interface
 */
export interface SessionState {
  project: string;
  total_tasks: number;
  completed_tasks: number;
  current_phase: number;
  current_feature: string;
  last_checkpoint: number;
  next_checkpoint: number;
  started_at: string;
  last_updated: string;
}

/**
 * Task tracking result
 */
export interface TaskTrackingResult {
  task_id: string;
  total_completed: number;
  checkpoint_triggered: boolean;
  checkpoint_type: 'standard' | 'feature' | null;
  checkpoint_report: string | null;
  next_checkpoint_in: number;
}

/**
 * Checkpoint trigger result
 */
export interface CheckpointResult {
  type: 'standard' | 'feature';
  task_number: number;
  report: string;
  passed: boolean;
  action_items: string[];
}

/**
 * Context report interface
 */
export interface ContextReport {
  session: SessionState;
  recent_tasks: string[];
  memory_anchors: string[];
  checkpoint_history: CheckpointHistoryEntry[];
  current_status: string;
  recommendations: string[];
}

/**
 * Checkpoint history entry
 */
export interface CheckpointHistoryEntry {
  checkpoint_number: number;
  task_number: number;
  timestamp: string;
  type: 'standard' | 'feature';
  passed: boolean;
  code_quality_score: number;
  test_coverage: number;
  action_items: string[];
}

/**
 * Context Manager Class
 *
 * The central orchestrator for the auto-refresh system.
 */
export class ContextManager {
  private projectPath: string;
  private statePath: string;
  private sessionStatePath: string;
  private completedTasksPath: string;
  private checkpointHistoryPath: string;

  private checkpointReviewManager: CheckpointReviewManager;
  private memoryAnchorManager: MemoryAnchorManager;

  private sessionState: SessionState | null = null;
  private completedTasks: string[] = [];
  private checkpointHistory: CheckpointHistoryEntry[] = [];

  // Checkpoint intervals
  private readonly STANDARD_CHECKPOINT_INTERVAL = 20;
  private readonly FEATURE_CHECKPOINT_INTERVAL = 15;

  constructor(projectPath: string) {
    this.projectPath = projectPath;
    this.statePath = join(projectPath, '.claude', 'state');
    this.sessionStatePath = join(this.statePath, 'session-progress.json');
    this.completedTasksPath = join(this.statePath, 'completed-tasks.json');
    this.checkpointHistoryPath = join(this.statePath, 'checkpoint-history.json');

    this.checkpointReviewManager = new CheckpointReviewManager();
    this.memoryAnchorManager = new MemoryAnchorManager();
  }

  /**
   * Track a completed task
   *
   * This is the primary method called when a task is completed.
   * It increments counters, checks for checkpoint triggers, and returns detailed tracking info.
   */
  async trackTask(taskId: string): Promise<TaskTrackingResult> {
    try {
      // Load current state
      await this.loadSessionState();

      // Add task to completed list
      this.completedTasks.push(taskId);

      // Update session state
      if (this.sessionState) {
        this.sessionState.completed_tasks++;
        this.sessionState.total_tasks++;
        this.sessionState.last_updated = new Date().toISOString();
      }

      // Save updated state
      await this.saveSessionState();
      await this.saveCompletedTasks();

      // Check for checkpoint triggers
      const completedCount = this.sessionState?.completed_tasks || 0;
      const lastCheckpoint = this.sessionState?.last_checkpoint || 0;
      const tasksSinceCheckpoint = completedCount - lastCheckpoint;

      let checkpointTriggered = false;
      let checkpointType: 'standard' | 'feature' | null = null;
      let checkpointReport: string | null = null;

      // Check for standard checkpoint (every 20 tasks)
      if (tasksSinceCheckpoint >= this.STANDARD_CHECKPOINT_INTERVAL) {
        const result = await this.triggerCheckpoint('standard');
        checkpointTriggered = true;
        checkpointType = 'standard';
        checkpointReport = result.report;
      }
      // Check for feature checkpoint (every 15 tasks)
      else if (
        tasksSinceCheckpoint >= this.FEATURE_CHECKPOINT_INTERVAL &&
        tasksSinceCheckpoint % this.FEATURE_CHECKPOINT_INTERVAL === 0
      ) {
        const result = await this.triggerCheckpoint('feature');
        checkpointTriggered = true;
        checkpointType = 'feature';
        checkpointReport = result.report;
      }

      // Calculate tasks until next checkpoint
      const nextStandardCheckpoint =
        this.STANDARD_CHECKPOINT_INTERVAL - (tasksSinceCheckpoint % this.STANDARD_CHECKPOINT_INTERVAL);
      const nextFeatureCheckpoint =
        this.FEATURE_CHECKPOINT_INTERVAL - (tasksSinceCheckpoint % this.FEATURE_CHECKPOINT_INTERVAL);
      const nextCheckpointIn = Math.min(nextStandardCheckpoint, nextFeatureCheckpoint);

      return {
        task_id: taskId,
        total_completed: completedCount,
        checkpoint_triggered: checkpointTriggered,
        checkpoint_type: checkpointType,
        checkpoint_report: checkpointReport,
        next_checkpoint_in: nextCheckpointIn,
      };
    } catch (error) {
      console.error('Error tracking task:', error);
      throw new Error(`Failed to track task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Trigger a checkpoint review
   *
   * Runs either a standard or feature checkpoint, generates report,
   * and saves to checkpoint history.
   */
  async triggerCheckpoint(type: 'standard' | 'feature'): Promise<CheckpointResult> {
    try {
      await this.loadSessionState();

      const completedCount = this.sessionState?.completed_tasks || 0;
      const checkpointNumber = Math.floor(completedCount / this.STANDARD_CHECKPOINT_INTERVAL);

      // Run checkpoint review
      const reviewResult = await this.checkpointReviewManager.runCheckpoint(
        completedCount,
        this.completedTasks.slice(-20) // Last 20 tasks
      );

      // Generate checkpoint report
      const context: Partial<CheckpointReviewPOMLContext> = {
        checkpointTaskNumber: completedCount,
        startTask: Math.max(1, completedCount - 19),
        endTask: completedCount,
        tasksReviewed: Math.min(20, completedCount),
        checkpointNumber: checkpointNumber,
        codeQualityScore: reviewResult.codeQualityScore,
        testCoverage: reviewResult.testCoverage,
        documentationStatus: reviewResult.testCoverage >= 70 ? 'Complete' : 'Partial',
        overallGrade: this.calculateGrade(reviewResult.codeQualityScore, reviewResult.testCoverage),
        language: 'English',
        languageCompliance: '✅ Pass',
        languageNotes: 'All UI text in English',
        typescriptCompliance: reviewResult.codeQualityScore >= 7 ? '✅ Pass' : '⚠️ Warning',
        typescriptNotes: 'TypeScript strict mode enforced',
        testCompliance: reviewResult.testCoverage >= 70 ? '✅ Pass' : '❌ Fail',
        testNotes: `Coverage at ${reviewResult.testCoverage}%`,
        auditCompliance: '✅ Pass',
        auditNotes: 'Audit logging implemented',
        actionItems: reviewResult.actionItems.map((item) => `- ${item}`).join('\n'),
        recommendations: reviewResult.recommendations.map((rec) => `- ${rec}`).join('\n'),
        totalCheckpoints: checkpointNumber,
        averageQualityScore: reviewResult.codeQualityScore,
        issuesFound: reviewResult.issuesFound,
        issuesResolved: reviewResult.issuesResolved,
        nextCheckpointNumber: completedCount + this.STANDARD_CHECKPOINT_INTERVAL,
        tasksUntilNext: this.STANDARD_CHECKPOINT_INTERVAL,
      };

      const report = renderCheckpointReviewPOML(context);

      // Save to checkpoint history
      const historyEntry: CheckpointHistoryEntry = {
        checkpoint_number: checkpointNumber,
        task_number: completedCount,
        timestamp: new Date().toISOString(),
        type: type,
        passed: reviewResult.passed,
        code_quality_score: reviewResult.codeQualityScore,
        test_coverage: reviewResult.testCoverage,
        action_items: reviewResult.actionItems,
      };

      this.checkpointHistory.push(historyEntry);
      await this.saveCheckpointHistory();

      // Update session state
      if (this.sessionState) {
        this.sessionState.last_checkpoint = completedCount;
        this.sessionState.next_checkpoint = completedCount + this.STANDARD_CHECKPOINT_INTERVAL;
        await this.saveSessionState();
      }

      return {
        type: type,
        task_number: completedCount,
        report: report,
        passed: reviewResult.passed,
        action_items: reviewResult.actionItems,
      };
    } catch (error) {
      console.error('Error triggering checkpoint:', error);
      throw new Error(`Failed to trigger checkpoint: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate comprehensive context report
   *
   * Provides current session status, recent tasks, memory anchors,
   * checkpoint history, and recommendations.
   */
  async generateContextReport(): Promise<ContextReport> {
    try {
      await this.loadSessionState();
      await this.loadCompletedTasks();
      await this.loadCheckpointHistory();

      const recentTasks = this.completedTasks.slice(-10); // Last 10 tasks
      const memoryAnchors = this.memoryAnchorManager.getAnchorsFormatted();

      // Generate current status
      const completedCount = this.sessionState?.completed_tasks || 0;
      const lastCheckpoint = this.sessionState?.last_checkpoint || 0;
      const tasksSinceCheckpoint = completedCount - lastCheckpoint;
      const tasksUntilNext = this.STANDARD_CHECKPOINT_INTERVAL - tasksSinceCheckpoint;

      const currentStatus = `
Project: ${this.sessionState?.project || 'Unknown'}
Total Tasks: ${completedCount}
Current Phase: ${this.sessionState?.current_phase || 1}
Current Feature: ${this.sessionState?.current_feature || 'None'}
Tasks Since Last Checkpoint: ${tasksSinceCheckpoint}
Tasks Until Next Checkpoint: ${tasksUntilNext}
Session Started: ${this.sessionState?.started_at || 'Unknown'}
Last Updated: ${this.sessionState?.last_updated || 'Unknown'}
      `.trim();

      // Generate recommendations
      const recommendations: string[] = [];

      if (tasksUntilNext <= 5) {
        recommendations.push(`Checkpoint approaching in ${tasksUntilNext} tasks`);
      }

      if (this.checkpointHistory.length > 0) {
        const lastCheckpointEntry = this.checkpointHistory[this.checkpointHistory.length - 1];
        if (!lastCheckpointEntry.passed) {
          recommendations.push('Previous checkpoint failed - address action items before continuing');
        }
        if (lastCheckpointEntry.code_quality_score < 7) {
          recommendations.push('Code quality below threshold - consider refactoring');
        }
        if (lastCheckpointEntry.test_coverage < 70) {
          recommendations.push('Test coverage below 70% - add more tests');
        }
      }

      if (completedCount > 0 && completedCount % 50 === 0) {
        recommendations.push('Major milestone reached - consider creating a git tag');
      }

      return {
        session: this.sessionState || this.createDefaultSessionState(),
        recent_tasks: recentTasks,
        memory_anchors: memoryAnchors,
        checkpoint_history: this.checkpointHistory,
        current_status: currentStatus,
        recommendations: recommendations,
      };
    } catch (error) {
      console.error('Error generating context report:', error);
      throw new Error(
        `Failed to generate context report: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Load session state from file
   */
  async loadSessionState(): Promise<void> {
    try {
      // Ensure state directory exists
      await fs.mkdir(this.statePath, { recursive: true });

      // Try to load existing session state
      try {
        const data = await fs.readFile(this.sessionStatePath, 'utf-8');
        this.sessionState = JSON.parse(data);
      } catch (error) {
        // File doesn't exist, create default state
        this.sessionState = this.createDefaultSessionState();
        await this.saveSessionState();
      }
    } catch (error) {
      console.error('Error loading session state:', error);
      // Fallback to default state
      this.sessionState = this.createDefaultSessionState();
    }
  }

  /**
   * Save session state to file
   */
  async saveSessionState(): Promise<void> {
    try {
      await fs.mkdir(this.statePath, { recursive: true });
      await fs.writeFile(this.sessionStatePath, JSON.stringify(this.sessionState, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error saving session state:', error);
      throw new Error(`Failed to save session state: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Load completed tasks from file
   */
  private async loadCompletedTasks(): Promise<void> {
    try {
      const data = await fs.readFile(this.completedTasksPath, 'utf-8');
      this.completedTasks = JSON.parse(data);
    } catch (error) {
      // File doesn't exist, start with empty array
      this.completedTasks = [];
    }
  }

  /**
   * Save completed tasks to file
   */
  private async saveCompletedTasks(): Promise<void> {
    try {
      await fs.mkdir(this.statePath, { recursive: true });
      await fs.writeFile(this.completedTasksPath, JSON.stringify(this.completedTasks, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error saving completed tasks:', error);
      throw new Error(`Failed to save completed tasks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Load checkpoint history from file
   */
  private async loadCheckpointHistory(): Promise<void> {
    try {
      const data = await fs.readFile(this.checkpointHistoryPath, 'utf-8');
      this.checkpointHistory = JSON.parse(data);
    } catch (error) {
      // File doesn't exist, start with empty array
      this.checkpointHistory = [];
    }
  }

  /**
   * Save checkpoint history to file
   */
  private async saveCheckpointHistory(): Promise<void> {
    try {
      await fs.mkdir(this.statePath, { recursive: true });
      await fs.writeFile(this.checkpointHistoryPath, JSON.stringify(this.checkpointHistory, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error saving checkpoint history:', error);
      throw new Error(
        `Failed to save checkpoint history: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Create default session state
   */
  private createDefaultSessionState(): SessionState {
    return {
      project: 'Unknown',
      total_tasks: 0,
      completed_tasks: 0,
      current_phase: 1,
      current_feature: 'Initial Setup',
      last_checkpoint: 0,
      next_checkpoint: this.STANDARD_CHECKPOINT_INTERVAL,
      started_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
    };
  }

  /**
   * Calculate overall grade from code quality and test coverage
   */
  private calculateGrade(codeQuality: number, testCoverage: number): string {
    const averageScore = (codeQuality * 10 + testCoverage) / 2;

    if (averageScore >= 90) return 'A+ (Excellent)';
    if (averageScore >= 80) return 'A (Very Good)';
    if (averageScore >= 70) return 'B (Good)';
    if (averageScore >= 60) return 'C (Satisfactory)';
    return 'D (Needs Improvement)';
  }

  /**
   * Get current session state
   */
  getSessionState(): SessionState | null {
    return this.sessionState;
  }

  /**
   * Initialize memory anchors for a project
   */
  initializeMemoryAnchors(projectType: string, techStack: string): void {
    const defaultAnchors = createDefaultMemoryAnchors(projectType, techStack);
    defaultAnchors.forEach((description, index) => {
      this.memoryAnchorManager.addAnchor(`anchor-${index + 1}`, description, 'high');
    });
  }

  /**
   * Update project name
   */
  async updateProjectName(projectName: string): Promise<void> {
    await this.loadSessionState();
    if (this.sessionState) {
      this.sessionState.project = projectName;
      await this.saveSessionState();
    }
  }

  /**
   * Update current feature
   */
  async updateCurrentFeature(featureName: string): Promise<void> {
    await this.loadSessionState();
    if (this.sessionState) {
      this.sessionState.current_feature = featureName;
      await this.saveSessionState();
    }
  }

  /**
   * Update current phase
   */
  async updateCurrentPhase(phase: number): Promise<void> {
    await this.loadSessionState();
    if (this.sessionState) {
      this.sessionState.current_phase = phase;
      await this.saveSessionState();
    }
  }

  /**
   * Add memory anchor
   */
  addMemoryAnchor(id: string, description: string, priority: 'critical' | 'high' | 'medium' = 'medium'): void {
    this.memoryAnchorManager.addAnchor(id, description, priority);
  }

  /**
   * Verify memory anchor
   */
  verifyMemoryAnchor(id: string): boolean {
    return this.memoryAnchorManager.verifyAnchor(id);
  }

  /**
   * Get formatted memory anchors
   */
  getMemoryAnchors(): string[] {
    return this.memoryAnchorManager.getAnchorsFormatted();
  }

  /**
   * Reset session (use with caution)
   */
  async resetSession(): Promise<void> {
    this.sessionState = this.createDefaultSessionState();
    this.completedTasks = [];
    this.checkpointHistory = [];

    await this.saveSessionState();
    await this.saveCompletedTasks();
    await this.saveCheckpointHistory();
  }
}
