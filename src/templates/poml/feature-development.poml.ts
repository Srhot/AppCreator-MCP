/**
 * Feature Development POML Template
 *
 * Used for every major feature implementation.
 * Provides a comprehensive workflow from planning to documentation,
 * ensuring production-quality code with proper testing and documentation.
 */

export const FEATURE_DEVELOPMENT_POML = `<poml>
  <import src="./base.poml"/>

  <role>
    You are a Senior Full-Stack Developer specialized in:
    - {{techStack}} development
    - {{language}} language UI/UX
    - Production-quality code
    - Test-Driven Development
  </role>

  <task>
    Implement the feature: {{featureName}}

    Requirements:
    {{requirements}}

    Acceptance Criteria:
    {{acceptanceCriteria}}
  </task>

  <workflow>
    1. **Plan First** (Don't code yet!)
       - Break down into smaller tasks
       - Identify database changes needed
       - List API endpoints to create/modify
       - List frontend components needed

    2. **Database Schema** (if needed)
       - Mongoose models / Prisma schema
       - Validation rules
       - Indexes for performance

    3. **Backend Implementation**
       - API routes
       - Controllers
       - Services
       - Validation middleware
       - Error handling

    4. **Frontend Implementation**
       - React components
       - State management
       - API integration
       - Form validation
       - {{language}} language text

    5. **Testing**
       - Unit tests (backend services)
       - Integration tests (API endpoints)
       - Component tests (React)
       - Achieve 70%+ coverage

    6. **Documentation**
       - API endpoint documentation
       - Component usage examples
       - {{language}} comments
  </workflow>

  <output format="structured">
    <section title="Implementation Plan">
      {{implementationPlan}}
    </section>

    <section title="Code">
      Provide complete, production-ready code:
      {{codeImplementation}}
    </section>

    <section title="Testing Checklist">
      {{testingChecklist}}
    </section>

    <section title="Documentation">
      {{documentation}}
    </section>
  </output>

  <constraints>
    - All code must be TypeScript
    - All UI text in {{language}}
    - Code comments in {{language}}
    - Follow {{architecturePattern}} pattern
    - Minimum 70% test coverage
    - All inputs validated
    - All errors handled gracefully
  </constraints>

  <style verbosity="detailed" tone="professional" language="mixed">
    - Code comments: {{language}}
    - UI text: {{language}}
    - Technical terms: English
  </style>
</poml>`;

/**
 * Context for rendering the feature development POML
 */
export interface FeatureDevelopmentPOMLContext {
  featureName: string;
  techStack: string;
  language: string;
  requirements: string;
  acceptanceCriteria: string;
  implementationPlan: string;
  codeImplementation: string;
  testingChecklist: string;
  documentation: string;
  architecturePattern: string;
}

/**
 * Render the feature development POML template
 */
export function renderFeatureDevelopmentPOML(
  context: Partial<FeatureDevelopmentPOMLContext>
): string {
  let rendered = FEATURE_DEVELOPMENT_POML;

  // Set defaults
  const defaults: Partial<FeatureDevelopmentPOMLContext> = {
    language: 'English',
    architecturePattern: 'MVC',
    requirements: 'No specific requirements provided.',
    acceptanceCriteria: 'Feature works as expected.',
    implementationPlan: 'Plan will be generated during development.',
    codeImplementation: 'Code will be implemented following the plan.',
    testingChecklist: `- [ ] Unit tests written and passing
      - [ ] Integration tests written and passing
      - [ ] Manual testing steps documented
      - [ ] Edge cases covered
      - [ ] Error scenarios tested`,
    documentation: 'Documentation will be created alongside code.',
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
 * Implementation plan structure
 */
export interface ImplementationPlan {
  databaseChanges: DatabaseChange[];
  apiEndpoints: APIEndpoint[];
  frontendComponents: ComponentInfo[];
  dependencies: string[];
  estimatedHours: number;
  breakdownTasks: string[];
}

/**
 * Database change information
 */
export interface DatabaseChange {
  model: string;
  action: 'create' | 'modify' | 'delete';
  fields?: FieldDefinition[];
  indexes?: string[];
  relationships?: string[];
}

/**
 * Field definition
 */
export interface FieldDefinition {
  name: string;
  type: string;
  required: boolean;
  validation?: string;
  default?: string;
}

/**
 * API endpoint information
 */
export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  purpose: string;
  authentication: boolean;
  requestBody?: string;
  responseFormat?: string;
}

/**
 * Component information
 */
export interface ComponentInfo {
  name: string;
  type: 'page' | 'container' | 'presentational' | 'hook' | 'utility';
  purpose: string;
  props?: string[];
  state?: string[];
}

/**
 * Feature Development Manager
 *
 * Manages feature implementation workflow and tracking
 */
export class FeatureDevelopmentManager {
  private features: Map<string, FeatureImplementation> = new Map();

  /**
   * Create a new feature implementation
   */
  createFeature(
    name: string,
    requirements: string[],
    acceptanceCriteria: string[]
  ): FeatureImplementation {
    const feature: FeatureImplementation = {
      name,
      requirements,
      acceptanceCriteria,
      status: 'planning',
      createdAt: new Date().toISOString(),
      tasks: [],
      completedTasks: [],
      plan: null,
      testCoverage: 0,
    };

    this.features.set(name, feature);
    return feature;
  }

  /**
   * Update feature plan
   */
  updatePlan(featureName: string, plan: ImplementationPlan) {
    const feature = this.features.get(featureName);
    if (feature) {
      feature.plan = plan;
      feature.status = 'planned';
    }
  }

  /**
   * Mark task complete
   */
  completeTask(featureName: string, taskId: string) {
    const feature = this.features.get(featureName);
    if (feature) {
      feature.completedTasks.push(taskId);
      if (feature.completedTasks.length === feature.tasks.length) {
        feature.status = 'implemented';
      } else {
        feature.status = 'in-progress';
      }
    }
  }

  /**
   * Update test coverage
   */
  updateTestCoverage(featureName: string, coverage: number) {
    const feature = this.features.get(featureName);
    if (feature) {
      feature.testCoverage = coverage;
      if (coverage >= 70 && feature.status === 'implemented') {
        feature.status = 'tested';
      }
    }
  }

  /**
   * Mark feature as complete
   */
  completeFeature(featureName: string) {
    const feature = this.features.get(featureName);
    if (feature && feature.testCoverage >= 70) {
      feature.status = 'completed';
      feature.completedAt = new Date().toISOString();
    }
  }

  /**
   * Get feature status
   */
  getFeatureStatus(featureName: string): FeatureImplementation | null {
    return this.features.get(featureName) || null;
  }

  /**
   * Get all features
   */
  getAllFeatures(): FeatureImplementation[] {
    return Array.from(this.features.values());
  }

  /**
   * Get features by status
   */
  getFeaturesByStatus(status: FeatureStatus): FeatureImplementation[] {
    return Array.from(this.features.values()).filter((f) => f.status === status);
  }
}

/**
 * Feature implementation tracking
 */
export interface FeatureImplementation {
  name: string;
  requirements: string[];
  acceptanceCriteria: string[];
  status: FeatureStatus;
  createdAt: string;
  completedAt?: string;
  tasks: string[];
  completedTasks: string[];
  plan: ImplementationPlan | null;
  testCoverage: number;
}

/**
 * Feature status type
 */
export type FeatureStatus =
  | 'planning'
  | 'planned'
  | 'in-progress'
  | 'implemented'
  | 'tested'
  | 'completed';

/**
 * Format implementation plan
 */
export function formatImplementationPlan(plan: ImplementationPlan): string {
  let output = '';

  // Database changes
  if (plan.databaseChanges.length > 0) {
    output += '      **Database Schema Changes:**\n';
    plan.databaseChanges.forEach((change) => {
      output += `      - ${change.action.toUpperCase()} model: ${change.model}\n`;
      if (change.fields) {
        change.fields.forEach((field) => {
          const req = field.required ? ' (required)' : '';
          output += `        - ${field.name}: ${field.type}${req}\n`;
        });
      }
    });
    output += '\n';
  }

  // API endpoints
  if (plan.apiEndpoints.length > 0) {
    output += '      **API Endpoints:**\n';
    plan.apiEndpoints.forEach((endpoint) => {
      const auth = endpoint.authentication ? ' [AUTH]' : '';
      output += `      - ${endpoint.method} ${endpoint.path}${auth} - ${endpoint.purpose}\n`;
    });
    output += '\n';
  }

  // Frontend components
  if (plan.frontendComponents.length > 0) {
    output += '      **Frontend Components:**\n';
    plan.frontendComponents.forEach((component) => {
      output += `      - ${component.name} (${component.type}) - ${component.purpose}\n`;
    });
    output += '\n';
  }

  // Dependencies
  if (plan.dependencies.length > 0) {
    output += '      **Dependencies Needed:**\n';
    plan.dependencies.forEach((dep) => {
      output += `      - ${dep}\n`;
    });
    output += '\n';
  }

  // Task breakdown
  if (plan.breakdownTasks.length > 0) {
    output += '      **Task Breakdown:**\n';
    plan.breakdownTasks.forEach((task, index) => {
      output += `      ${index + 1}. ${task}\n`;
    });
    output += '\n';
  }

  // Estimated time
  output += `      **Estimated Time:** ${plan.estimatedHours} hours\n`;

  return output;
}

/**
 * Format testing checklist
 */
export function formatTestingChecklist(
  unitTests: boolean = false,
  integrationTests: boolean = false,
  manualTesting: boolean = false,
  edgeCases: boolean = false,
  errorScenarios: boolean = false
): string {
  const checkbox = (checked: boolean) => (checked ? 'x' : ' ');

  return `      - [${checkbox(unitTests)}] Unit tests written and passing
      - [${checkbox(integrationTests)}] Integration tests written and passing
      - [${checkbox(manualTesting)}] Manual testing steps documented
      - [${checkbox(edgeCases)}] Edge cases covered
      - [${checkbox(errorScenarios)}] Error scenarios tested`;
}

/**
 * Generate feature task breakdown
 */
export function generateTaskBreakdown(
  featureName: string,
  plan: ImplementationPlan
): string[] {
  const tasks: string[] = [];

  // Planning task
  tasks.push(`Plan implementation for ${featureName}`);

  // Database tasks
  plan.databaseChanges.forEach((change) => {
    tasks.push(`${change.action} database model: ${change.model}`);
  });

  // Backend tasks
  plan.apiEndpoints.forEach((endpoint) => {
    tasks.push(`Implement ${endpoint.method} ${endpoint.path} endpoint`);
  });

  // Frontend tasks
  plan.frontendComponents.forEach((component) => {
    tasks.push(`Create ${component.name} component`);
  });

  // Testing tasks
  tasks.push(`Write unit tests for ${featureName}`);
  tasks.push(`Write integration tests for ${featureName}`);

  // Documentation task
  tasks.push(`Document ${featureName} feature`);

  return tasks;
}

/**
 * Create feature requirements template
 */
export function createFeatureRequirements(
  featureName: string,
  userStory: string,
  functionalRequirements: string[],
  nonFunctionalRequirements: string[]
): string {
  let output = `**Feature:** ${featureName}\n\n`;
  output += `**User Story:**\n${userStory}\n\n`;

  if (functionalRequirements.length > 0) {
    output += `**Functional Requirements:**\n`;
    functionalRequirements.forEach((req, index) => {
      output += `${index + 1}. ${req}\n`;
    });
    output += '\n';
  }

  if (nonFunctionalRequirements.length > 0) {
    output += `**Non-Functional Requirements:**\n`;
    nonFunctionalRequirements.forEach((req, index) => {
      output += `${index + 1}. ${req}\n`;
    });
  }

  return output;
}

/**
 * Create acceptance criteria template
 */
export function createAcceptanceCriteria(criteria: Array<{ given: string; when: string; then: string }>): string {
  let output = '';

  criteria.forEach((criterion, index) => {
    output += `**Scenario ${index + 1}:**\n`;
    output += `- Given: ${criterion.given}\n`;
    output += `- When: ${criterion.when}\n`;
    output += `- Then: ${criterion.then}\n\n`;
  });

  return output;
}

/**
 * Workflow step tracker
 */
export class WorkflowStepTracker {
  private steps: Map<string, WorkflowStep> = new Map([
    ['planning', { name: 'Planning', completed: false, order: 1 }],
    ['database', { name: 'Database Schema', completed: false, order: 2 }],
    ['backend', { name: 'Backend Implementation', completed: false, order: 3 }],
    ['frontend', { name: 'Frontend Implementation', completed: false, order: 4 }],
    ['testing', { name: 'Testing', completed: false, order: 5 }],
    ['documentation', { name: 'Documentation', completed: false, order: 6 }],
  ]);

  /**
   * Mark step as complete
   */
  completeStep(stepId: string) {
    const step = this.steps.get(stepId);
    if (step) {
      step.completed = true;
    }
  }

  /**
   * Get current step
   */
  getCurrentStep(): WorkflowStep | null {
    for (const step of Array.from(this.steps.values()).sort((a, b) => a.order - b.order)) {
      if (!step.completed) {
        return step;
      }
    }
    return null; // All steps completed
  }

  /**
   * Get progress percentage
   */
  getProgress(): number {
    const total = this.steps.size;
    const completed = Array.from(this.steps.values()).filter((s) => s.completed).length;
    return Math.round((completed / total) * 100);
  }

  /**
   * Get all steps
   */
  getAllSteps(): WorkflowStep[] {
    return Array.from(this.steps.values()).sort((a, b) => a.order - b.order);
  }

  /**
   * Reset all steps
   */
  reset() {
    this.steps.forEach((step) => {
      step.completed = false;
    });
  }
}

/**
 * Workflow step interface
 */
interface WorkflowStep {
  name: string;
  completed: boolean;
  order: number;
}

/**
 * Generate code template for different layers
 */
export const CodeTemplates = {
  /**
   * Generate TypeScript interface
   */
  interface: (name: string, fields: FieldDefinition[]): string => {
    let code = `export interface ${name} {\n`;
    fields.forEach((field) => {
      const optional = field.required ? '' : '?';
      code += `  ${field.name}${optional}: ${field.type};\n`;
    });
    code += '}\n';
    return code;
  },

  /**
   * Generate API endpoint handler
   */
  apiHandler: (endpoint: APIEndpoint): string => {
    const methodLower = endpoint.method.toLowerCase();
    const handlerName = `${methodLower}${endpoint.path.split('/').pop()}`;

    return `/**
 * ${endpoint.purpose}
 * ${endpoint.method} ${endpoint.path}
 */
export const ${handlerName} = async (req: Request, res: Response) => {
  try {
    // TODO: Implement logic
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};\n`;
  },

  /**
   * Generate React component
   */
  reactComponent: (component: ComponentInfo, language: string): string => {
    const props = component.props || [];
    const propsInterface = props.length > 0 ? `\ninterface ${component.name}Props {\n${props.map((p) => `  ${p}: any;`).join('\n')}\n}\n` : '';

    return `${propsInterface}
/**
 * ${component.purpose}
 * ${language === 'English' ? 'Component' : 'Componente'}
 */
export const ${component.name} = (${props.length > 0 ? `props: ${component.name}Props` : ''}) => {
  // TODO: Implement component
  return (
    <div>
      {/* TODO: Add UI */}
    </div>
  );
};\n`;
  },

  /**
   * Generate test file
   */
  testFile: (name: string, type: 'unit' | 'integration' | 'component'): string => {
    return `import { describe, it, expect } from '@jest/globals';

describe('${name}', () => {
  it('should ${type === 'component' ? 'render successfully' : 'work correctly'}', () => {
    // TODO: Implement test
    expect(true).toBe(true);
  });

  it('should handle edge cases', () => {
    // TODO: Test edge cases
  });

  it('should handle errors gracefully', () => {
    // TODO: Test error scenarios
  });
});\n`;
  },
};
