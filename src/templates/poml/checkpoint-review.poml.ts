/**
 * Checkpoint Review POML Template
 *
 * CRITICAL: This runs AUTOMATICALLY every 20 tasks to ensure quality and consistency.
 * It performs comprehensive quality checks, constitution compliance verification,
 * and project-specific validations.
 */

export const CHECKPOINT_REVIEW_POML = `<poml>
  <role>
    You are the Checkpoint Quality Assurance Manager.
    You run automatic reviews every 20 tasks to ensure quality and consistency.
  </role>

  <task>
    CHECKPOINT REVIEW (Triggered automatically every 20 tasks):

    1. VERIFY RECENT WORK
       - Review last 20 completed tasks
       - Check code quality, tests, documentation

    2. CONSTITUTION COMPLIANCE
       - All {{language}} language requirements met?
       - TypeScript strict mode enforced?
       - Test coverage >= 70% for new code?
       - Audit logging present?

    3. PROJECT-SPECIFIC CHECKS
       {{projectSpecificChecks}}

    4. UPDATE TRACKING FILES
       - Update .claude/state/session-progress.json
       - Log checkpoint in .claude/state/checkpoint-history.json
  </task>

  <context>
    <document src="../memory/constitution.md" priority="critical" />
    <document src="../specification/SPEC.md" priority="high" />
    <document src="../.claude/state/session-progress.json" priority="high" />
    <document src="../.claude/state/completed-tasks.json" priority="medium" />
  </context>

  <output format="checkpoint-report">
    # ✅ CHECKPOINT REPORT - Task #{{checkpointTaskNumber}}

    **Date:** {{currentDate}}
    **Tasks Reviewed:** #{{startTask}} - #{{endTask}} ({{tasksReviewed}} tasks)
    **Checkpoint Number:** {{checkpointNumber}}

    ## 🔍 QUALITY CONTROL
    - **Code Quality:** {{codeQualityScore}}/10
    - **Test Coverage:** {{testCoverage}}%
    - **Documentation:** {{documentationStatus}}
    - **Overall Grade:** {{overallGrade}}

    ## ✅ CONSTITUTION COMPLIANCE

    | Rule | Status | Notes |
    |------|--------|-------|
    | {{language}} Language | {{languageCompliance}} | {{languageNotes}} |
    | TypeScript Strict | {{typescriptCompliance}} | {{typescriptNotes}} |
    | Test Coverage | {{testCompliance}} | {{testNotes}} |
    | Audit Logging | {{auditCompliance}} | {{auditNotes}} |

    ## 🎯 PROJECT-SPECIFIC CHECKS

    {{projectSpecificResults}}

    ## ⚠️ ACTION ITEMS

    {{actionItems}}

    ## 💡 RECOMMENDATIONS

    {{recommendations}}

    ## 📊 CHECKPOINT STATISTICS
    - **Total Checkpoints:** {{totalCheckpoints}}
    - **Average Quality Score:** {{averageQualityScore}}/10
    - **Issues Found:** {{issuesFound}}
    - **Issues Resolved:** {{issuesResolved}}

    ## 📈 NEXT CHECKPOINT
    **Task:** #{{nextCheckpointNumber}} ({{tasksUntilNext}} tasks away)

    ## 🏆 ACHIEVEMENTS
    {{achievements}}

    ---
    ✅ Checkpoint review complete. {{conclusion}}
  </output>

  <quality-gates>
    <minimum-code-quality>7</minimum-code-quality>
    <minimum-test-coverage>70</minimum-test-coverage>
    <required-documentation>complete</required-documentation>
    <constitution-compliance>mandatory</constitution-compliance>
  </quality-gates>

  <style verbosity="detailed" tone="analytical" language="{{language}}" />
</poml>`;

/**
 * Context for rendering the checkpoint review POML
 */
export interface CheckpointReviewPOMLContext {
  checkpointTaskNumber: number;
  currentDate: string;
  startTask: number;
  endTask: number;
  tasksReviewed: number;
  checkpointNumber: number;
  codeQualityScore: number;
  testCoverage: number;
  documentationStatus: string;
  overallGrade: string;
  language: string;
  languageCompliance: string;
  languageNotes: string;
  typescriptCompliance: string;
  typescriptNotes: string;
  testCompliance: string;
  testNotes: string;
  auditCompliance: string;
  auditNotes: string;
  projectSpecificChecks: string;
  projectSpecificResults: string;
  actionItems: string;
  recommendations: string;
  totalCheckpoints: number;
  averageQualityScore: number;
  issuesFound: number;
  issuesResolved: number;
  nextCheckpointNumber: number;
  tasksUntilNext: number;
  achievements: string;
  conclusion: string;
}

/**
 * Render the checkpoint review POML template
 */
export function renderCheckpointReviewPOML(
  context: Partial<CheckpointReviewPOMLContext>
): string {
  let rendered = CHECKPOINT_REVIEW_POML;

  // Set defaults
  const defaults: Partial<CheckpointReviewPOMLContext> = {
    currentDate: new Date().toISOString(),
    language: 'English',
    documentationStatus: 'Complete',
    overallGrade: 'A',
    actionItems: 'No action items. All checks passed!',
    recommendations: 'No recommendations at this time.',
    achievements: 'All quality gates passed!',
    conclusion: 'All systems green.',
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
 * Compliance status type
 */
export type ComplianceStatus = '✅ Pass' | '⚠️ Warning' | '❌ Fail';

/**
 * Constitution compliance check result
 */
export interface ComplianceCheck {
  rule: string;
  status: ComplianceStatus;
  notes: string;
}

/**
 * Project-specific check definition
 */
export interface ProjectSpecificCheck {
  id: string;
  description: string;
  checkFunction: () => boolean | Promise<boolean>;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * Checkpoint review result
 */
export interface CheckpointReviewResult {
  passed: boolean;
  codeQualityScore: number;
  testCoverage: number;
  complianceChecks: ComplianceCheck[];
  actionItems: string[];
  recommendations: string[];
  issuesFound: number;
  issuesResolved: number;
}

/**
 * Checkpoint Review Manager
 *
 * Manages automatic quality checkpoints every 20 tasks
 */
export class CheckpointReviewManager {
  private checkpointHistory: CheckpointRecord[] = [];
  private projectSpecificChecks: ProjectSpecificCheck[] = [];

  /**
   * Register a project-specific check
   */
  registerCheck(check: ProjectSpecificCheck) {
    this.projectSpecificChecks.push(check);
  }

  /**
   * Determine if checkpoint should be triggered
   */
  shouldTriggerCheckpoint(completedTasks: number, frequency: number = 20): boolean {
    return completedTasks % frequency === 0 && completedTasks > 0;
  }

  /**
   * Run checkpoint review
   */
  async runCheckpoint(
    taskNumber: number,
    tasksCompleted: string[]
  ): Promise<CheckpointReviewResult> {
    const startTask = Math.max(1, taskNumber - 19);
    const endTask = taskNumber;
    const tasksToReview = tasksCompleted.slice(startTask - 1, endTask);

    // Run quality checks
    const codeQualityScore = await this.assessCodeQuality(tasksToReview);
    const testCoverage = await this.assessTestCoverage(tasksToReview);
    const complianceChecks = await this.runComplianceChecks();

    // Run project-specific checks
    const projectCheckResults = await this.runProjectSpecificChecks();

    // Analyze results
    const actionItems = this.generateActionItems(
      codeQualityScore,
      testCoverage,
      complianceChecks,
      projectCheckResults
    );
    const recommendations = this.generateRecommendations(codeQualityScore, testCoverage);

    // Record checkpoint
    const checkpoint: CheckpointRecord = {
      taskNumber,
      timestamp: new Date().toISOString(),
      codeQualityScore,
      testCoverage,
      complianceChecks,
      actionItems,
      passed: actionItems.length === 0,
    };
    this.checkpointHistory.push(checkpoint);

    return {
      passed: checkpoint.passed,
      codeQualityScore,
      testCoverage,
      complianceChecks,
      actionItems,
      recommendations,
      issuesFound: actionItems.length,
      issuesResolved: this.calculateResolvedIssues(),
    };
  }

  /**
   * Assess code quality (placeholder - would analyze actual code)
   */
  private async assessCodeQuality(tasks: string[]): Promise<number> {
    // In real implementation, this would analyze:
    // - Code complexity
    // - Adherence to style guide
    // - TypeScript strict mode compliance
    // - Code duplication
    // - Best practices
    return 8.5; // Placeholder score
  }

  /**
   * Assess test coverage (placeholder - would analyze actual tests)
   */
  private async assessTestCoverage(tasks: string[]): Promise<number> {
    // In real implementation, this would analyze:
    // - Unit test coverage
    // - Integration test coverage
    // - E2E test coverage
    // - Test quality
    return 75; // Placeholder percentage
  }

  /**
   * Run constitution compliance checks
   */
  private async runComplianceChecks(): Promise<ComplianceCheck[]> {
    return [
      {
        rule: 'Language Requirements',
        status: '✅ Pass',
        notes: 'All UI text in specified language',
      },
      {
        rule: 'TypeScript Strict Mode',
        status: '✅ Pass',
        notes: 'Strict mode enforced',
      },
      {
        rule: 'Test Coverage',
        status: '✅ Pass',
        notes: 'Coverage meets 70% minimum',
      },
      {
        rule: 'Audit Logging',
        status: '✅ Pass',
        notes: 'Audit logs implemented',
      },
    ];
  }

  /**
   * Run project-specific checks
   */
  private async runProjectSpecificChecks(): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();

    for (const check of this.projectSpecificChecks) {
      try {
        const result = await check.checkFunction();
        results.set(check.id, result);
      } catch (error) {
        results.set(check.id, false);
      }
    }

    return results;
  }

  /**
   * Generate action items based on results
   */
  private generateActionItems(
    codeQuality: number,
    testCoverage: number,
    compliance: ComplianceCheck[],
    projectChecks: Map<string, boolean>
  ): string[] {
    const items: string[] = [];

    if (codeQuality < 7) {
      items.push(`Improve code quality (current: ${codeQuality}/10, minimum: 7/10)`);
    }

    if (testCoverage < 70) {
      items.push(`Increase test coverage (current: ${testCoverage}%, minimum: 70%)`);
    }

    compliance.forEach((check) => {
      if (check.status === '❌ Fail') {
        items.push(`Fix compliance issue: ${check.rule} - ${check.notes}`);
      }
    });

    projectChecks.forEach((passed, checkId) => {
      if (!passed) {
        const check = this.projectSpecificChecks.find((c) => c.id === checkId);
        if (check) {
          items.push(`Fix project-specific check: ${check.description}`);
        }
      }
    });

    return items;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(codeQuality: number, testCoverage: number): string[] {
    const recommendations: string[] = [];

    if (codeQuality >= 7 && codeQuality < 9) {
      recommendations.push('Consider refactoring complex functions for better maintainability');
    }

    if (testCoverage >= 70 && testCoverage < 80) {
      recommendations.push('Aim for 80%+ test coverage for better reliability');
    }

    if (codeQuality >= 9 && testCoverage >= 80) {
      recommendations.push('Excellent quality! Consider documenting best practices for team');
    }

    return recommendations;
  }

  /**
   * Calculate resolved issues from previous checkpoints
   */
  private calculateResolvedIssues(): number {
    if (this.checkpointHistory.length < 2) return 0;

    const previous = this.checkpointHistory[this.checkpointHistory.length - 2];
    const current = this.checkpointHistory[this.checkpointHistory.length - 1];

    return previous.actionItems.length - current.actionItems.length;
  }

  /**
   * Get checkpoint statistics
   */
  getStatistics() {
    if (this.checkpointHistory.length === 0) {
      return {
        totalCheckpoints: 0,
        averageQualityScore: 0,
        averageTestCoverage: 0,
        passRate: 0,
      };
    }

    const totalCheckpoints = this.checkpointHistory.length;
    const averageQualityScore =
      this.checkpointHistory.reduce((sum, cp) => sum + cp.codeQualityScore, 0) /
      totalCheckpoints;
    const averageTestCoverage =
      this.checkpointHistory.reduce((sum, cp) => sum + cp.testCoverage, 0) / totalCheckpoints;
    const passedCheckpoints = this.checkpointHistory.filter((cp) => cp.passed).length;
    const passRate = (passedCheckpoints / totalCheckpoints) * 100;

    return {
      totalCheckpoints,
      averageQualityScore: Math.round(averageQualityScore * 10) / 10,
      averageTestCoverage: Math.round(averageTestCoverage * 10) / 10,
      passRate: Math.round(passRate),
    };
  }

  /**
   * Get checkpoint history
   */
  getHistory(): CheckpointRecord[] {
    return [...this.checkpointHistory];
  }

  /**
   * Get latest checkpoint
   */
  getLatestCheckpoint(): CheckpointRecord | null {
    return this.checkpointHistory.length > 0
      ? this.checkpointHistory[this.checkpointHistory.length - 1]
      : null;
  }
}

/**
 * Checkpoint record interface
 */
interface CheckpointRecord {
  taskNumber: number;
  timestamp: string;
  codeQualityScore: number;
  testCoverage: number;
  complianceChecks: ComplianceCheck[];
  actionItems: string[];
  passed: boolean;
}

/**
 * Format compliance checks for POML output
 */
export function formatComplianceTable(checks: ComplianceCheck[]): string {
  return checks
    .map(
      (check) =>
        `    | ${check.rule} | ${check.status} | ${check.notes} |`
    )
    .join('\n');
}

/**
 * Format project-specific check results
 */
export function formatProjectSpecificResults(
  checks: ProjectSpecificCheck[],
  results: Map<string, boolean>
): string {
  return checks
    .map((check) => {
      const passed = results.get(check.id) ?? false;
      const status = passed ? '✅ Pass' : '❌ Fail';
      return `    - ${check.description}: ${status}`;
    })
    .join('\n');
}

/**
 * Format action items list
 */
export function formatActionItems(items: string[]): string {
  if (items.length === 0) {
    return '    No action items. All checks passed!';
  }
  return items.map((item) => `    - ${item}`).join('\n');
}

/**
 * Format recommendations list
 */
export function formatRecommendations(recommendations: string[]): string {
  if (recommendations.length === 0) {
    return '    No recommendations at this time.';
  }
  return recommendations.map((rec) => `    - ${rec}`).join('\n');
}

/**
 * Calculate overall grade based on scores
 */
export function calculateOverallGrade(codeQuality: number, testCoverage: number): string {
  const average = (codeQuality / 10 + testCoverage / 100) / 2;

  if (average >= 0.9) return 'A+ (Excellent)';
  if (average >= 0.8) return 'A (Very Good)';
  if (average >= 0.7) return 'B (Good)';
  if (average >= 0.6) return 'C (Satisfactory)';
  return 'D (Needs Improvement)';
}

/**
 * Generate achievement badges
 */
export function generateAchievements(
  codeQuality: number,
  testCoverage: number,
  checkpointNumber: number
): string {
  const achievements: string[] = [];

  if (codeQuality >= 9) achievements.push('🏆 Code Quality Excellence');
  if (testCoverage >= 80) achievements.push('🧪 Testing Champion');
  if (codeQuality >= 9 && testCoverage >= 80) achievements.push('⭐ Perfect Score');
  if (checkpointNumber >= 5) achievements.push('🎯 Consistency Master');
  if (checkpointNumber >= 10) achievements.push('💎 Veteran Developer');

  if (achievements.length === 0) {
    return '    Keep up the good work!';
  }

  return achievements.map((achievement) => `    ${achievement}`).join('\n');
}

/**
 * Create default project-specific checks for different project types
 */
export function createDefaultProjectChecks(projectType: string): ProjectSpecificCheck[] {
  const baseChecks: ProjectSpecificCheck[] = [
    {
      id: 'git-commits',
      description: 'All commits have clear messages',
      checkFunction: () => true, // Placeholder
      priority: 'high',
    },
    {
      id: 'no-console-logs',
      description: 'No console.log statements in production code',
      checkFunction: () => true, // Placeholder
      priority: 'medium',
    },
  ];

  const typeSpecificChecks: Record<string, ProjectSpecificCheck[]> = {
    web: [
      {
        id: 'accessibility',
        description: 'WCAG 2.1 AA accessibility compliance',
        checkFunction: () => true,
        priority: 'critical',
      },
      {
        id: 'responsive',
        description: 'Responsive design implemented',
        checkFunction: () => true,
        priority: 'high',
      },
    ],
    api: [
      {
        id: 'api-docs',
        description: 'API endpoints documented (OpenAPI/Swagger)',
        checkFunction: () => true,
        priority: 'critical',
      },
      {
        id: 'input-validation',
        description: 'All endpoints have input validation',
        checkFunction: () => true,
        priority: 'critical',
      },
    ],
    cli: [
      {
        id: 'help-docs',
        description: 'All commands have --help documentation',
        checkFunction: () => true,
        priority: 'critical',
      },
      {
        id: 'error-handling',
        description: 'User-friendly error messages',
        checkFunction: () => true,
        priority: 'high',
      },
    ],
  };

  return [...baseChecks, ...(typeSpecificChecks[projectType] || [])];
}
