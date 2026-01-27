/**
 * Refresh Context POML Template
 *
 * CRITICAL: This template reloads context every 20 tasks to prevent context loss.
 * It ensures continuity by reloading core documents and verifying memory anchors.
 */

export const REFRESH_CONTEXT_POML = `<poml>
  <role>
    You are the Context Refresh Manager for {{projectName}}.
    Your job is to reload critical project knowledge and ensure continuity.
  </role>

  <task>
    CONTEXT REFRESH PROCEDURE:

    1. RELOAD CORE DOCUMENTS
       - Read memory/constitution.md
       - Read specification/SPEC.md
       - Read planning/PLAN.md
       - Read planning/TASKS.md

    2. CHECK SESSION STATE
       - Load .claude/state/session-progress.json
       - Identify: Last completed task, current phase, active feature

    3. VERIFY MEMORY ANCHORS (CRITICAL - Never forget these!)
       {{memoryAnchors}}

    4. GENERATE STATUS REPORT
       - Total tasks completed
       - Current phase ({{currentPhase}}/{{totalPhases}})
       - Current feature
       - Next 5 tasks in queue
       - Any blockers or warnings
  </task>

  <context>
    <document src="../memory/constitution.md" priority="critical" />
    <document src="../specification/SPEC.md" priority="critical" />
    <document src="../planning/PLAN.md" priority="high" />
    <document src="../planning/TASKS.md" priority="high" />
    <document src="../.claude/state/session-progress.json" priority="critical" />
  </context>

  <output format="status-report">
    # 🔄 {{projectName}} - CONTEXT REFRESH REPORT

    **Date:** {{currentDate}}
    **Session ID:** {{sessionId}}
    **Refresh Trigger:** Task #{{currentTaskNumber}} (Auto-refresh every 20 tasks)

    ## 📊 PROGRESS STATUS
    - **Total Tasks:** {{totalTasks}}
    - **Completed:** {{completedTasks}} ({{completionPercentage}}%)
    - **Remaining:** {{remainingTasks}}
    - **Tasks Since Last Refresh:** {{tasksSinceRefresh}}

    ## 🎯 CURRENT POSITION
    - **Active Phase:** {{currentPhase}} / {{totalPhases}}
    - **Phase Progress:** {{phaseProgress}}%
    - **Active Feature:** {{currentFeature}}
    - **Last Completed Task:** {{lastCompletedTask}}
    - **Current Task:** {{currentTask}}

    ## ✅ MEMORY ANCHOR VERIFICATION
    {{memoryAnchorsVerification}}

    ## 📋 NEXT 5 TASKS
    {{nextTasksList}}

    ## ⚠️ WARNINGS / BLOCKERS
    {{warnings}}

    ## 🎉 CHECKPOINT INFO
    - **Last Checkpoint:** Task #{{lastCheckpoint}}
    - **Next Checkpoint:** Task #{{nextCheckpoint}} ({{tasksUntilCheckpoint}} tasks away)
    - **Checkpoint Frequency:** Every 20 tasks

    ## 📚 DOCUMENTS RELOADED
    - [x] constitution.md - Project principles verified
    - [x] SPEC.md - Requirements confirmed
    - [x] PLAN.md - Implementation strategy loaded
    - [x] TASKS.md - Task breakdown reviewed
    - [x] session-progress.json - State synchronized

    ✅ Context refresh complete. Ready to continue from task #{{nextTaskNumber}}!
  </output>

  <refresh-config>
    <frequency>20</frequency>
    <trigger>task-count</trigger>
    <auto-save-state>true</auto-save-state>
    <verify-memory-anchors>true</verify-memory-anchors>
  </refresh-config>

  <style verbosity="detailed" tone="professional" language="{{language}}" />
</poml>`;

/**
 * Context for rendering the refresh context POML
 */
export interface RefreshContextPOMLContext {
  projectName: string;
  currentDate: string;
  sessionId: string;
  currentTaskNumber: number;
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
  remainingTasks: number;
  tasksSinceRefresh: number;
  currentPhase: string;
  totalPhases: number;
  phaseProgress: number;
  currentFeature: string;
  lastCompletedTask: string;
  currentTask: string;
  memoryAnchors: string[];
  memoryAnchorsVerification: string;
  nextTasksList: string;
  warnings: string;
  lastCheckpoint: number;
  nextCheckpoint: number;
  tasksUntilCheckpoint: number;
  nextTaskNumber: number;
  language: string;
}

/**
 * Render the refresh context POML template
 */
export function renderRefreshContextPOML(context: Partial<RefreshContextPOMLContext>): string {
  let rendered = REFRESH_CONTEXT_POML;

  // Set defaults
  const defaults: Partial<RefreshContextPOMLContext> = {
    currentDate: new Date().toISOString(),
    sessionId: generateRefreshSessionId(),
    tasksSinceRefresh: 20,
    language: 'English',
    warnings: 'No warnings or blockers detected.',
  };

  const mergedContext = { ...defaults, ...context };

  // Special handling for memory anchors
  if (mergedContext.memoryAnchors && Array.isArray(mergedContext.memoryAnchors)) {
    mergedContext.memoryAnchorsVerification = formatMemoryAnchors(mergedContext.memoryAnchors);
    (mergedContext as any).memoryAnchors = mergedContext.memoryAnchors
      .map((anchor) => `       ✓ ${anchor}`)
      .join('\n');
  }

  // Replace all placeholders
  Object.entries(mergedContext).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    rendered = rendered.replace(new RegExp(placeholder, 'g'), String(value ?? ''));
  });

  return rendered;
}

/**
 * Format memory anchors for verification section
 */
function formatMemoryAnchors(anchors: string[]): string {
  return anchors.map((anchor) => `    - [x] ${anchor}`).join('\n');
}

/**
 * Generate a unique session ID for refresh tracking
 */
function generateRefreshSessionId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `refresh-${timestamp}-${random}`;
}

/**
 * Helper to format next tasks list
 */
export function formatNextTasksList(
  tasks: Array<{ id: string; title: string; priority?: string }>
): string {
  return tasks
    .map((task, index) => {
      const priority = task.priority ? ` [${task.priority}]` : '';
      return `    ${index + 1}. ${task.id}: ${task.title}${priority}`;
    })
    .join('\n');
}

/**
 * Helper to calculate refresh metrics
 */
export interface RefreshMetrics {
  currentTaskNumber: number;
  totalTasks: number;
  completedTasks: number;
  refreshFrequency?: number;
}

export function calculateRefreshMetrics(metrics: RefreshMetrics) {
  const frequency = metrics.refreshFrequency || 20;
  const completedTasks = metrics.completedTasks;
  const totalTasks = metrics.totalTasks;
  const remainingTasks = totalTasks - completedTasks;
  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);
  const tasksSinceRefresh = completedTasks % frequency;
  const lastCheckpoint = Math.floor(completedTasks / frequency) * frequency;
  const nextCheckpoint = lastCheckpoint + frequency;
  const tasksUntilCheckpoint = nextCheckpoint - completedTasks;

  return {
    completedTasks,
    remainingTasks,
    completionPercentage,
    tasksSinceRefresh: tasksSinceRefresh === 0 ? frequency : tasksSinceRefresh,
    lastCheckpoint,
    nextCheckpoint,
    tasksUntilCheckpoint,
    nextTaskNumber: completedTasks + 1,
  };
}

/**
 * Memory Anchor Manager
 *
 * Memory anchors are critical facts that must NEVER be forgotten during development.
 */
export class MemoryAnchorManager {
  private anchors: Map<string, MemoryAnchor> = new Map();

  /**
   * Add a memory anchor
   */
  addAnchor(id: string, description: string, priority: 'critical' | 'high' | 'medium' = 'high') {
    this.anchors.set(id, {
      id,
      description,
      priority,
      created: new Date().toISOString(),
      verified: false,
    });
  }

  /**
   * Verify a memory anchor
   */
  verifyAnchor(id: string): boolean {
    const anchor = this.anchors.get(id);
    if (anchor) {
      anchor.verified = true;
      anchor.lastVerified = new Date().toISOString();
      return true;
    }
    return false;
  }

  /**
   * Get all anchors as formatted list
   */
  getAnchorsFormatted(): string[] {
    return Array.from(this.anchors.values())
      .sort((a, b) => {
        // Sort by priority: critical > high > medium
        const priorityOrder = { critical: 0, high: 1, medium: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
      .map((anchor) => `${anchor.description} [${anchor.priority.toUpperCase()}]`);
  }

  /**
   * Get unverified anchors
   */
  getUnverifiedAnchors(): MemoryAnchor[] {
    return Array.from(this.anchors.values()).filter((anchor) => !anchor.verified);
  }

  /**
   * Reset verification status (call before each refresh)
   */
  resetVerification() {
    this.anchors.forEach((anchor) => {
      anchor.verified = false;
    });
  }

  /**
   * Get anchor statistics
   */
  getStats() {
    const total = this.anchors.size;
    const verified = Array.from(this.anchors.values()).filter((a) => a.verified).length;
    const critical = Array.from(this.anchors.values()).filter((a) => a.priority === 'critical')
      .length;

    return {
      total,
      verified,
      unverified: total - verified,
      critical,
      verificationRate: total > 0 ? Math.round((verified / total) * 100) : 0,
    };
  }
}

/**
 * Memory Anchor interface
 */
interface MemoryAnchor {
  id: string;
  description: string;
  priority: 'critical' | 'high' | 'medium';
  created: string;
  verified: boolean;
  lastVerified?: string;
}

/**
 * Create default memory anchors for a project
 */
export function createDefaultMemoryAnchors(projectType: string, techStack: string): string[] {
  const baseAnchors = [
    'Project follows constitution.md principles at all times',
    'All code must be type-safe and pass strict TypeScript checks',
    'Tests must be written before marking tasks complete',
    'Auto-refresh must be used every 20 tasks to prevent context loss',
  ];

  const typeSpecificAnchors: Record<string, string[]> = {
    web: [
      `Frontend framework: ${techStack}`,
      'All UI text must be in the specified language',
      'Components must be modular and reusable',
      'Accessibility (WCAG 2.1 AA) is required',
    ],
    api: [
      `API framework: ${techStack}`,
      'All endpoints must have input validation',
      'Authentication and authorization are mandatory',
      'API documentation must be auto-generated',
    ],
    cli: [
      `CLI framework: ${techStack}`,
      'All commands must have --help documentation',
      'Error messages must be user-friendly',
      'Configuration file support is required',
    ],
    mobile: [
      `Mobile framework: ${techStack}`,
      'Both iOS and Android must be supported',
      'Offline functionality is required',
      'Native features must follow platform guidelines',
    ],
  };

  return [...baseAnchors, ...(typeSpecificAnchors[projectType] || [])];
}
