/**
 * Base POML Template
 *
 * CRITICAL: This template ensures context is NEVER lost during development.
 * It provides the foundation for all project POML manifests.
 */

export const BASE_POML = `<poml>
  <metadata>
    <project>{{projectName}}</project>
    <version>1.0.0</version>
    <tech-stack>{{techStack}}</tech-stack>
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
    <document src="../progress/PROGRESS.md" priority="medium">
      Current implementation progress
    </document>
  </context>

  <constraints>
    <language>{{language}} for all UI text, comments in {{language}}</language>
    <code-style>Follow project style guide and best practices</code-style>
    <testing>All features must have tests before marking complete</testing>
    <documentation>Update docs alongside code changes</documentation>
    <git>Atomic commits with clear messages</git>
  </constraints>

  <auto-refresh>
    <enabled>true</enabled>
    <interval>3600000</interval>
    <state-file>.devforge/state.json</state-file>
    <description>
      Auto-refresh prevents context loss by saving state periodically.
      Use the auto_refresh tool before reaching context limits.
    </description>
  </auto-refresh>

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

  <architecture>
    <type>{{projectType}}</type>
    <pattern>{{architecturePattern}}</pattern>
    <structure>{{folderStructure}}</structure>
  </architecture>

  <dependencies>
    <runtime>{{runtimeDeps}}</runtime>
    <development>{{devDeps}}</development>
  </dependencies>

  <quality-gates>
    <build-passes>Required</build-passes>
    <tests-pass>Required</tests-pass>
    <linting-clean>Required</linting-clean>
    <type-check-passes>Required</type-check-passes>
  </quality-gates>

</poml>`;

export interface POMlTemplateContext {
  projectName: string;
  techStack: string;
  language: string;
  createdAt: string;
  status: string;
  totalTasks: number;
  completedTasks: number;
  currentPhase: string;
  progressPercentage: number;
  features: string;
  nextSteps: string;
  projectType: string;
  architecturePattern: string;
  folderStructure: string;
  runtimeDeps: string;
  devDeps: string;
}

/**
 * Render POML template with context
 */
export function renderBasePOML(context: Partial<POMlTemplateContext>): string {
  let rendered = BASE_POML;

  // Replace all template variables
  Object.entries(context).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    rendered = rendered.replace(new RegExp(placeholder, 'g'), String(value ?? ''));
  });

  return rendered;
}
