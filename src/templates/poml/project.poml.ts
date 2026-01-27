/**
 * Project POML Template
 *
 * The MASTER template with auto-refresh configuration.
 * This is the central configuration that orchestrates all other templates
 * and ensures context is never lost through automatic triggers and checkpoints.
 */

export const PROJECT_POML = `<poml>
  <metadata>
    <project>{{projectName}}</project>
    <version>1.0.0</version>
    <tech-stack>{{techStack}}</tech-stack>
    <total-tasks>{{totalTasks}}</total-tasks>
    <ui-language>{{language}}</ui-language>
    <created-at>{{createdAt}}</created-at>
    <status>{{status}}</status>
  </metadata>

  <context>
    <document src="constitution.md" priority="critical">
      Project constitution - immutable principles
    </document>
    <document src="../specification/SPEC.md" priority="high">
      Full project specification
    </document>
    <document src="../planning/PLAN.md" priority="high">
      Technical implementation plan
    </document>
    <document src="../planning/TASKS.md" priority="medium">
      Task breakdown and implementation order
    </document>
  </context>

  <automation>
    <context-refresh>
      <trigger type="task-count" threshold="20">
        🔄 Auto-refresh after every 20 tasks completed
        Command: @prompts/refresh-context.poml
      </trigger>

      <trigger type="feature-complete" threshold="15">
        🔄 Auto-refresh when major feature (15+ tasks) is done
        Command: @prompts/refresh-context.poml
      </trigger>

      <trigger type="manual" command="@prompts/refresh-context.poml">
        🔄 Manual refresh command available anytime
      </trigger>

      <trigger type="session-resume">
        🔄 Auto-refresh when Claude Code is restarted
        - Load .claude/state/session-progress.json
        - Display: "Resumed from Task #X - Phase: Y"
      </trigger>
    </context-refresh>

    <checkpoint-trigger>
      <condition type="phase-complete">
        ✅ CRITICAL CHECKPOINT: When Phase completes
        → Review constitution, spec, and plan compliance
        → Command: @prompts/checkpoint-review.poml
      </condition>

      <condition type="task-milestone" every="20">
        ✅ STANDARD CHECKPOINT: Every 20 tasks
        → Quick context refresh, progress update
        → Command: @prompts/checkpoint-review.poml
      </condition>

      <condition type="feature-milestone" every="15">
        ✅ FEATURE CHECKPOINT: Every 15 tasks (major feature boundary)
        → Full context reload, consistency check
        → Command: @prompts/refresh-context.poml
      </condition>
    </checkpoint-trigger>

    <memory-anchor priority="CRITICAL">
      <rule id="ui-language">
        ALL user-facing text MUST be in {{language}}
      </rule>
      <rule id="typescript-strict">
        TypeScript strict mode - NO 'any' types without justification
      </rule>
      <rule id="test-coverage">
        Minimum 70% test coverage required for all features
      </rule>
      <rule id="audit-logging">
        ALL CRUD operations MUST be logged with:
        - User ID
        - Timestamp
        - Action type
        - Before/after values
      </rule>
      {{customMemoryAnchors}}
    </memory-anchor>
  </automation>

  <conditional-refresh>
    <if condition="tasks_completed % 20 == 0">
      <action>
        Execute @prompts/checkpoint-review.poml
        Update .claude/state/session-progress.json
        Verify memory anchors
      </action>
    </if>

    <if condition="feature_phase_complete">
      <action>
        Execute @prompts/refresh-context.poml
        Generate progress summary
        Verify constitution compliance
      </action>
    </if>

    <if condition="claude_code_restart">
      <action>
        Load .claude/state/session-progress.json
        Resume from last checkpoint
        Display resume message
        Execute @prompts/refresh-context.poml
      </action>
    </if>
  </conditional-refresh>

  <session-tracking>
    <progress-file>.claude/state/session-progress.json</progress-file>
    <completed-tasks-file>.claude/state/completed-tasks.json</completed-tasks-file>
    <checkpoint-history>.claude/state/checkpoint-history.json</checkpoint-history>
  </session-tracking>

  <progress>
    <total-tasks>{{totalTasks}}</total-tasks>
    <completed-tasks>{{completedTasks}}</completed-tasks>
    <current-phase>{{currentPhase}}</current-phase>
    <progress-percentage>{{progressPercentage}}%</progress-percentage>
  </progress>

  <features>
    {{features}}
  </features>

  <next-steps>
    {{nextSteps}}
  </next-steps>

</poml>`;

/**
 * Context for rendering the project POML
 */
export interface ProjectPOMLContext {
  projectName: string;
  techStack: string;
  totalTasks: number;
  language: string;
  createdAt: string;
  status: string;
  completedTasks: number;
  currentPhase: string;
  progressPercentage: number;
  features: string;
  nextSteps: string;
  customMemoryAnchors: string;
}

/**
 * Render the project POML template
 */
export function renderProjectPOML(context: Partial<ProjectPOMLContext>): string {
  let rendered = PROJECT_POML;

  // Set defaults
  const defaults: Partial<ProjectPOMLContext> = {
    createdAt: new Date().toISOString(),
    status: 'active',
    language: 'English',
    completedTasks: 0,
    currentPhase: 'setup',
    progressPercentage: 0,
    features: '',
    nextSteps: '',
    customMemoryAnchors: '',
  };

  const mergedContext = { ...defaults, ...context };

  // Replace all placeholders
  Object.entries(mergedContext).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    rendered = rendered.replace(new RegExp(placeholder, 'g'), String(value ?? ''));
  });

  return rendered;
}

/**
 * Trigger type for auto-refresh
 */
export type TriggerType =
  | 'task-count'
  | 'feature-complete'
  | 'manual'
  | 'session-resume'
  | 'phase-complete';

/**
 * Auto-refresh trigger configuration
 */
export interface RefreshTrigger {
  type: TriggerType;
  threshold?: number;
  command: string;
  description: string;
}

/**
 * Memory anchor rule
 */
export interface MemoryAnchorRule {
  id: string;
  description: string;
  priority: 'critical' | 'high' | 'medium';
}

/**
 * Session state tracking
 */
export interface SessionState {
  projectName: string;
  currentTask: number;
  currentPhase: string;
  completedTasks: number;
  totalTasks: number;
  lastCheckpoint: number;
  lastRefresh: string;
  features: string[];
  memoryAnchors: MemoryAnchorRule[];
}

/**
 * Checkpoint history entry
 */
export interface CheckpointHistoryEntry {
  taskNumber: number;
  timestamp: string;
  type: 'standard' | 'feature' | 'phase' | 'manual';
  passed: boolean;
  codeQuality: number;
  testCoverage: number;
  issues: string[];
}

/**
 * Project POML Manager
 *
 * Manages the master project configuration and automatic triggers
 */
export class ProjectPOMLManager {
  private projectName: string;
  private totalTasks: number;
  private completedTasks: number = 0;
  private sessionState: SessionState;
  private checkpointHistory: CheckpointHistoryEntry[] = [];
  private memoryAnchors: MemoryAnchorRule[] = [];
  private refreshTriggers: RefreshTrigger[] = [];

  constructor(projectName: string, totalTasks: number, language: string = 'English') {
    this.projectName = projectName;
    this.totalTasks = totalTasks;

    // Initialize session state
    this.sessionState = {
      projectName,
      currentTask: 0,
      currentPhase: 'setup',
      completedTasks: 0,
      totalTasks,
      lastCheckpoint: 0,
      lastRefresh: new Date().toISOString(),
      features: [],
      memoryAnchors: [],
    };

    // Setup default refresh triggers
    this.setupDefaultTriggers();

    // Setup default memory anchors
    this.setupDefaultMemoryAnchors(language);
  }

  /**
   * Setup default auto-refresh triggers
   */
  private setupDefaultTriggers() {
    this.refreshTriggers = [
      {
        type: 'task-count',
        threshold: 20,
        command: '@prompts/checkpoint-review.poml',
        description: 'Auto-refresh after every 20 tasks completed',
      },
      {
        type: 'feature-complete',
        threshold: 15,
        command: '@prompts/refresh-context.poml',
        description: 'Auto-refresh when major feature (15+ tasks) is done',
      },
      {
        type: 'manual',
        command: '@prompts/refresh-context.poml',
        description: 'Manual refresh command available anytime',
      },
      {
        type: 'session-resume',
        command: '@prompts/refresh-context.poml',
        description: 'Auto-refresh when Claude Code is restarted',
      },
    ];
  }

  /**
   * Setup default memory anchors
   */
  private setupDefaultMemoryAnchors(language: string) {
    this.memoryAnchors = [
      {
        id: 'ui-language',
        description: `ALL user-facing text MUST be in ${language}`,
        priority: 'critical',
      },
      {
        id: 'typescript-strict',
        description: "TypeScript strict mode - NO 'any' types without justification",
        priority: 'critical',
      },
      {
        id: 'test-coverage',
        description: 'Minimum 70% test coverage required for all features',
        priority: 'critical',
      },
      {
        id: 'audit-logging',
        description:
          'ALL CRUD operations MUST be logged with: User ID, Timestamp, Action type, Before/after values',
        priority: 'critical',
      },
    ];

    this.sessionState.memoryAnchors = this.memoryAnchors;
  }

  /**
   * Add custom memory anchor
   */
  addMemoryAnchor(anchor: MemoryAnchorRule) {
    this.memoryAnchors.push(anchor);
    this.sessionState.memoryAnchors = this.memoryAnchors;
  }

  /**
   * Check if refresh should trigger
   */
  shouldTriggerRefresh(): { shouldTrigger: boolean; trigger?: RefreshTrigger } {
    // Check task count trigger
    if (this.completedTasks % 20 === 0 && this.completedTasks > 0) {
      const trigger = this.refreshTriggers.find((t) => t.type === 'task-count');
      return { shouldTrigger: true, trigger };
    }

    return { shouldTrigger: false };
  }

  /**
   * Check if checkpoint should trigger
   */
  shouldTriggerCheckpoint(): {
    shouldTrigger: boolean;
    type?: 'standard' | 'feature' | 'phase';
  } {
    // Standard checkpoint every 20 tasks
    if (this.completedTasks % 20 === 0 && this.completedTasks > 0) {
      return { shouldTrigger: true, type: 'standard' };
    }

    // Feature checkpoint every 15 tasks
    if (this.completedTasks % 15 === 0 && this.completedTasks > 0) {
      return { shouldTrigger: true, type: 'feature' };
    }

    return { shouldTrigger: false };
  }

  /**
   * Complete a task
   */
  completeTask(taskId: string) {
    this.completedTasks++;
    this.sessionState.completedTasks = this.completedTasks;
    this.sessionState.currentTask = this.completedTasks;

    // Check for triggers
    const refreshCheck = this.shouldTriggerRefresh();
    const checkpointCheck = this.shouldTriggerCheckpoint();

    return {
      taskCompleted: true,
      taskNumber: this.completedTasks,
      shouldRefresh: refreshCheck.shouldTrigger,
      refreshTrigger: refreshCheck.trigger,
      shouldCheckpoint: checkpointCheck.shouldTrigger,
      checkpointType: checkpointCheck.type,
    };
  }

  /**
   * Record checkpoint
   */
  recordCheckpoint(entry: CheckpointHistoryEntry) {
    this.checkpointHistory.push(entry);
    this.sessionState.lastCheckpoint = entry.taskNumber;
  }

  /**
   * Update session state
   */
  updateSessionState(updates: Partial<SessionState>) {
    this.sessionState = { ...this.sessionState, ...updates };
  }

  /**
   * Get current session state
   */
  getSessionState(): SessionState {
    return { ...this.sessionState };
  }

  /**
   * Get checkpoint history
   */
  getCheckpointHistory(): CheckpointHistoryEntry[] {
    return [...this.checkpointHistory];
  }

  /**
   * Save state to JSON
   */
  serializeState(): string {
    return JSON.stringify(
      {
        sessionState: this.sessionState,
        checkpointHistory: this.checkpointHistory,
        memoryAnchors: this.memoryAnchors,
        refreshTriggers: this.refreshTriggers,
      },
      null,
      2
    );
  }

  /**
   * Load state from JSON
   */
  loadState(json: string) {
    try {
      const state = JSON.parse(json);
      this.sessionState = state.sessionState;
      this.checkpointHistory = state.checkpointHistory || [];
      this.memoryAnchors = state.memoryAnchors || [];
      this.refreshTriggers = state.refreshTriggers || [];
      this.completedTasks = this.sessionState.completedTasks;
    } catch (error) {
      console.error('Failed to load state:', error);
    }
  }

  /**
   * Generate resume message for session restart
   */
  generateResumeMessage(): string {
    const progress = Math.round((this.completedTasks / this.totalTasks) * 100);
    const tasksSinceCheckpoint = this.completedTasks - this.sessionState.lastCheckpoint;

    return `
🔄 Session Resumed

**Project:** ${this.projectName}
**Current Task:** #${this.completedTasks}
**Phase:** ${this.sessionState.currentPhase}
**Progress:** ${progress}% (${this.completedTasks}/${this.totalTasks} tasks)
**Last Checkpoint:** Task #${this.sessionState.lastCheckpoint}
**Tasks Since Checkpoint:** ${tasksSinceCheckpoint}

**Memory Anchors Active:**
${this.memoryAnchors.map((anchor) => `- ${anchor.description}`).join('\n')}

Ready to continue! 🚀
    `.trim();
  }

  /**
   * Generate project POML
   */
  generateProjectPOML(context: Partial<ProjectPOMLContext> = {}): string {
    const progressPercentage = Math.round((this.completedTasks / this.totalTasks) * 100);

    const fullContext: Partial<ProjectPOMLContext> = {
      projectName: this.projectName,
      totalTasks: this.totalTasks,
      completedTasks: this.completedTasks,
      currentPhase: this.sessionState.currentPhase,
      progressPercentage,
      customMemoryAnchors: this.formatCustomMemoryAnchors(),
      ...context,
    };

    return renderProjectPOML(fullContext);
  }

  /**
   * Format custom memory anchors for POML
   */
  private formatCustomMemoryAnchors(): string {
    // Filter out default anchors to only show custom ones
    const defaultIds = ['ui-language', 'typescript-strict', 'test-coverage', 'audit-logging'];
    const customAnchors = this.memoryAnchors.filter((a) => !defaultIds.includes(a.id));

    if (customAnchors.length === 0) {
      return '';
    }

    return customAnchors
      .map((anchor) => `      <rule id="${anchor.id}">\n        ${anchor.description}\n      </rule>`)
      .join('\n');
  }
}

/**
 * Format memory anchors for display
 */
export function formatMemoryAnchors(anchors: MemoryAnchorRule[]): string {
  return anchors
    .map((anchor) => {
      const priorityBadge = anchor.priority === 'critical' ? '🔴' : anchor.priority === 'high' ? '🟡' : '🟢';
      return `    ${priorityBadge} [${anchor.priority.toUpperCase()}] ${anchor.description}`;
    })
    .join('\n');
}

/**
 * Format refresh triggers for display
 */
export function formatRefreshTriggers(triggers: RefreshTrigger[]): string {
  return triggers
    .map((trigger) => {
      const threshold = trigger.threshold ? ` (threshold: ${trigger.threshold})` : '';
      return `    🔄 ${trigger.type}${threshold}: ${trigger.description}`;
    })
    .join('\n');
}

/**
 * Create session progress JSON structure
 */
export function createSessionProgressJSON(state: SessionState): string {
  return JSON.stringify(state, null, 2);
}

/**
 * Create checkpoint history JSON structure
 */
export function createCheckpointHistoryJSON(history: CheckpointHistoryEntry[]): string {
  return JSON.stringify(history, null, 2);
}

/**
 * Create completed tasks JSON structure
 */
export function createCompletedTasksJSON(tasks: Array<{ id: string; title: string; completedAt: string }>): string {
  return JSON.stringify(tasks, null, 2);
}

/**
 * Default project structure for state files
 */
export const StateFileStructure = {
  sessionProgress: '.claude/state/session-progress.json',
  completedTasks: '.claude/state/completed-tasks.json',
  checkpointHistory: '.claude/state/checkpoint-history.json',
};

/**
 * Conditional refresh logic
 */
export class ConditionalRefreshManager {
  /**
   * Check if task milestone reached
   */
  static isTaskMilestone(completedTasks: number, frequency: number = 20): boolean {
    return completedTasks % frequency === 0 && completedTasks > 0;
  }

  /**
   * Check if feature phase complete
   */
  static isFeaturePhaseComplete(tasksInFeature: number, threshold: number = 15): boolean {
    return tasksInFeature >= threshold;
  }

  /**
   * Determine action for task completion
   */
  static determineAction(completedTasks: number): {
    action: 'checkpoint' | 'refresh' | 'progress' | 'none';
    command?: string;
  } {
    if (this.isTaskMilestone(completedTasks, 20)) {
      return { action: 'checkpoint', command: '@prompts/checkpoint-review.poml' };
    }

    if (this.isTaskMilestone(completedTasks, 15)) {
      return { action: 'refresh', command: '@prompts/refresh-context.poml' };
    }

    if (this.isTaskMilestone(completedTasks, 10)) {
      return { action: 'progress', command: '@prompts/progress-summary.poml' };
    }

    return { action: 'none' };
  }
}
