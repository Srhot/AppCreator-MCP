/**
 * Spec-Kit Module
 *
 * Complete specification system for project generation:
 * 1. Constitution - Project rules and principles
 * 2. Specification - Detailed technical specification
 * 3. Technical Plan - Architecture and implementation plan
 * 4. Task Breakdown - Granular tasks with dependencies
 */

import { AIAdapter } from '../adapters/ai-adapter.interface.js';
import { DecisionMatrix } from './decision-matrix.js';
import { parseJSONWithDefault } from '../utils/json-parser.js';

export interface Constitution {
  projectName: string;
  vision: string;
  principles: string[];
  constraints: string[];
  qualityStandards: {
    code: string[];
    testing: string[];
    documentation: string[];
    performance: string[];
  };
  governanceRules: string[];
}

export interface Specification {
  functionalRequirements: {
    id: string;
    title: string;
    description: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    acceptanceCriteria: string[];
  }[];
  nonFunctionalRequirements: {
    category: 'performance' | 'security' | 'scalability' | 'usability' | 'reliability';
    requirement: string;
    metric: string;
    target: string;
  }[];
  dataModel: {
    entities: {
      name: string;
      fields: { name: string; type: string; required: boolean }[];
      relationships: { entity: string; type: string }[];
    }[];
  };
  apiDesign?: {
    endpoints: {
      method: string;
      path: string;
      description: string;
      requestBody?: string;
      response: string;
    }[];
  };
  userFlows: {
    name: string;
    steps: string[];
  }[];
}

export interface TechnicalPlan {
  architecture: {
    pattern: string;
    layers: string[];
    components: {
      name: string;
      responsibility: string;
      dependencies: string[];
    }[];
  };
  technologyStack: {
    category: string;
    technology: string;
    version?: string;
    rationale: string;
  }[];
  infrastructure: {
    hosting: string;
    database: string;
    caching?: string;
    messaging?: string;
    monitoring: string;
  };
  securityPlan: {
    authentication: string;
    authorization: string;
    dataProtection: string[];
    vulnerabilityMitigation: string[];
  };
  testingStrategy: {
    unit: string;
    integration: string;
    e2e: string;
    bdd: boolean;
    coverage: number;
  };
  deploymentPlan: {
    cicd: string;
    environments: string[];
    rollbackStrategy: string;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'setup' | 'feature' | 'test' | 'documentation' | 'deployment';
  priority: number;
  estimatedHours: number;
  dependencies: string[];
  subtasks?: string[];
  acceptanceCriteria: string[];
  testCriteria?: string[];
}

export interface SpecKit {
  constitution: Constitution;
  specification: Specification;
  technicalPlan: TechnicalPlan;
  tasks: Task[];
  metadata: {
    createdAt: string;
    version: string;
    decisionMatrix?: DecisionMatrix;
  };
}

export class SpecKitModule {
  private aiAdapter: AIAdapter;

  constructor(aiAdapter: AIAdapter) {
    this.aiAdapter = aiAdapter;
  }

  /**
   * Generate complete Spec-Kit from project description and decision matrix
   */
  async generateSpecKit(
    projectName: string,
    projectType: string,
    description: string,
    matrix?: DecisionMatrix
  ): Promise<SpecKit> {
    // Generate each component in parallel for speed
    const [constitution, specification, technicalPlan] = await Promise.all([
      this.generateConstitution(projectName, description, matrix),
      this.generateSpecification(projectName, projectType, description, matrix),
      this.generateTechnicalPlan(projectType, description, matrix),
    ]);

    // Generate tasks based on specification and technical plan
    const tasks = await this.generateTasks(specification, technicalPlan);

    return {
      constitution,
      specification,
      technicalPlan,
      tasks,
      metadata: {
        createdAt: new Date().toISOString(),
        version: '1.0.0',
        decisionMatrix: matrix,
      },
    };
  }

  /**
   * Generate Constitution (Project rules and principles)
   */
  private async generateConstitution(
    projectName: string,
    description: string,
    matrix?: DecisionMatrix
  ): Promise<Constitution> {
    const matrixContext = matrix
      ? `\n\nDecision Matrix Context:\n${JSON.stringify(matrix.recommendations, null, 2)}`
      : '';

    const prompt = `Generate a project constitution for: ${projectName}

Description: ${description}${matrixContext}

Create a constitution with:
1. Vision statement (one clear sentence)
2. Core principles (5-7 principles)
3. Constraints (technical, business, or resource constraints)
4. Quality standards for code, testing, documentation, performance
5. Governance rules

Return ONLY valid JSON with this exact structure:
{
  "projectName": "${projectName}",
  "vision": "...",
  "principles": ["...", "..."],
  "constraints": ["...", "..."],
  "qualityStandards": {
    "code": ["...", "..."],
    "testing": ["...", "..."],
    "documentation": ["...", "..."],
    "performance": ["...", "..."]
  },
  "governanceRules": ["...", "..."]
}

CRITICAL: Return ONLY valid JSON. No markdown, no explanation. Ensure all brackets and commas are correct.`;

    const response = await this.aiAdapter.generateText(prompt, 2500);

    const defaultConstitution: Constitution = {
      projectName,
      vision: `Build a high-quality ${projectName} application`,
      principles: [
        'User-first design',
        'Clean and maintainable code',
        'Security by default',
        'Performance optimization',
        'Comprehensive testing'
      ],
      constraints: [
        'Must be production-ready',
        'Must follow best practices'
      ],
      qualityStandards: {
        code: ['TypeScript strict mode', 'ESLint compliance'],
        testing: ['80% code coverage', 'Unit and integration tests'],
        documentation: ['API documentation', 'README'],
        performance: ['Sub-200ms API response', 'Optimized queries']
      },
      governanceRules: ['Code review required', 'CI/CD pipeline']
    };

    return parseJSONWithDefault<Constitution>(response, defaultConstitution, 'generateConstitution');
  }

  /**
   * Generate Specification (Detailed requirements)
   */
  private async generateSpecification(
    projectName: string,
    projectType: string,
    description: string,
    matrix?: DecisionMatrix
  ): Promise<Specification> {
    const matrixContext = matrix
      ? `\n\nDecision Matrix Recommendations:\n${matrix.recommendations.join('\n')}`
      : '';

    const prompt = `Generate detailed specification for ${projectType} project: ${projectName}

Description: ${description}${matrixContext}

Create specification with:
1. Functional requirements (8-12 requirements with acceptance criteria)
2. Non-functional requirements (performance, security, scalability, etc.)
3. Data model (entities, fields, relationships)
4. API design (backend endpoints for the app - method, path, description, response)
5. User flows

Return ONLY valid JSON. Example structure:
{
  "functionalRequirements": [
    {
      "id": "FR001",
      "title": "User Registration",
      "description": "Users can register with email and password",
      "priority": "critical",
      "acceptanceCriteria": ["Email validation works", "Password is hashed"]
    }
  ],
  "nonFunctionalRequirements": [
    {
      "category": "performance",
      "requirement": "API response time",
      "metric": "response time",
      "target": "< 200ms"
    }
  ],
  "dataModel": {
    "entities": [
      {
        "name": "User",
        "fields": [{"name": "id", "type": "string", "required": true}],
        "relationships": [{"entity": "Profile", "type": "one-to-one"}]
      }
    ]
  },
  "apiDesign": {
    "endpoints": [
      {
        "method": "POST",
        "path": "/api/auth/register",
        "description": "Register new user",
        "response": "{ user: User, token: string }"
      },
      {
        "method": "POST",
        "path": "/api/auth/login",
        "description": "Login user",
        "response": "{ user: User, token: string }"
      }
    ]
  },
  "userFlows": [
    {
      "name": "Registration Flow",
      "steps": ["Open app", "Click register", "Enter details", "Submit"]
    }
  ]
}

CRITICAL: Return ONLY valid JSON. No markdown, no explanation. Ensure all brackets and commas are correct.`;

    const response = await this.aiAdapter.generateText(prompt, 5000);

    const defaultSpec: Specification = {
      functionalRequirements: [{
        id: 'FR001',
        title: 'Core Feature',
        description: description,
        priority: 'critical',
        acceptanceCriteria: ['Feature works as expected']
      }],
      nonFunctionalRequirements: [{
        category: 'performance',
        requirement: 'Fast response',
        metric: 'response time',
        target: '< 500ms'
      }],
      dataModel: {
        entities: [{
          name: 'User',
          fields: [{ name: 'id', type: 'string', required: true }],
          relationships: []
        }]
      },
      apiDesign: {
        endpoints: [
          { method: 'POST', path: '/api/auth/login', description: 'User login', response: '{ token: string }' },
          { method: 'POST', path: '/api/auth/register', description: 'User registration', response: '{ user: User }' },
          { method: 'GET', path: '/api/users/me', description: 'Get current user', response: '{ user: User }' },
          { method: 'GET', path: '/api/health', description: 'Health check', response: '{ status: ok }' }
        ]
      },
      userFlows: [{
        name: 'Main Flow',
        steps: ['Open app', 'Login', 'Use features']
      }]
    };

    const spec = parseJSONWithDefault<Specification>(response, defaultSpec, 'generateSpecification');

    // Ensure apiDesign exists with at least basic endpoints
    if (!spec.apiDesign || !spec.apiDesign.endpoints || spec.apiDesign.endpoints.length === 0) {
      console.error('No API endpoints in parsed response, adding default endpoints');
      spec.apiDesign = defaultSpec.apiDesign;
    }

    return spec;
  }

  /**
   * Generate Technical Plan (Architecture and implementation)
   */
  private async generateTechnicalPlan(
    projectType: string,
    description: string,
    matrix?: DecisionMatrix
  ): Promise<TechnicalPlan> {
    const matrixContext = matrix
      ? `\n\nTech Recommendations:\n${matrix.recommendations.join('\n')}`
      : '';

    const prompt = `Generate technical plan for ${projectType} project.

Description: ${description}${matrixContext}

Create plan with:
1. Architecture (pattern, layers, components)
2. Technology stack with rationale
3. Infrastructure (hosting, database, caching, monitoring)
4. Security plan (auth, authorization, data protection)
5. Testing strategy (unit, integration, e2e, BDD, coverage target)
6. Deployment plan (CI/CD, environments, rollback)

Return ONLY valid JSON with this structure:
{
  "architecture": {
    "pattern": "MVC",
    "layers": ["presentation", "business", "data"],
    "components": [
      {
        "name": "UserController",
        "responsibility": "Handle user requests",
        "dependencies": ["UserService"]
      }
    ]
  },
  "technologyStack": [
    {
      "category": "Backend",
      "technology": "Node.js",
      "version": "20.x",
      "rationale": "Modern JavaScript runtime"
    }
  ],
  "infrastructure": {
    "hosting": "AWS EC2",
    "database": "PostgreSQL",
    "monitoring": "CloudWatch"
  },
  "securityPlan": {
    "authentication": "JWT",
    "authorization": "RBAC",
    "dataProtection": ["Encryption at rest", "TLS"],
    "vulnerabilityMitigation": ["Input validation", "Rate limiting"]
  },
  "testingStrategy": {
    "unit": "Jest",
    "integration": "Supertest",
    "e2e": "Playwright",
    "bdd": true,
    "coverage": 80
  },
  "deploymentPlan": {
    "cicd": "GitHub Actions",
    "environments": ["dev", "staging", "prod"],
    "rollbackStrategy": "Blue-green deployment"
  }
}

CRITICAL: Return ONLY valid JSON. No markdown, no explanation.`;

    const response = await this.aiAdapter.generateText(prompt, 3500);

    const defaultPlan: TechnicalPlan = {
      architecture: {
        pattern: 'MVC',
        layers: ['presentation', 'business', 'data'],
        components: [
          { name: 'Controller', responsibility: 'Handle requests', dependencies: ['Service'] },
          { name: 'Service', responsibility: 'Business logic', dependencies: ['Repository'] },
          { name: 'Repository', responsibility: 'Data access', dependencies: [] }
        ]
      },
      technologyStack: [
        { category: 'Backend', technology: 'Node.js', version: '20.x', rationale: 'Modern runtime' },
        { category: 'Database', technology: 'PostgreSQL', version: '15', rationale: 'Reliable RDBMS' },
        { category: 'Frontend', technology: 'React', version: '18', rationale: 'Popular UI library' }
      ],
      infrastructure: {
        hosting: 'Cloud Platform',
        database: 'PostgreSQL',
        monitoring: 'Application monitoring'
      },
      securityPlan: {
        authentication: 'JWT',
        authorization: 'RBAC',
        dataProtection: ['Encryption', 'TLS'],
        vulnerabilityMitigation: ['Input validation', 'Rate limiting']
      },
      testingStrategy: {
        unit: 'Jest',
        integration: 'Supertest',
        e2e: 'Playwright',
        bdd: true,
        coverage: 80
      },
      deploymentPlan: {
        cicd: 'GitHub Actions',
        environments: ['dev', 'staging', 'prod'],
        rollbackStrategy: 'Automated rollback'
      }
    };

    return parseJSONWithDefault<TechnicalPlan>(response, defaultPlan, 'generateTechnicalPlan');
  }

  /**
   * Generate granular tasks from specification and technical plan
   */
  private async generateTasks(
    spec: Specification,
    plan: TechnicalPlan
  ): Promise<Task[]> {
    const prompt = `Generate granular development tasks based on:

Functional Requirements: ${spec.functionalRequirements.length} features
Technical Plan: ${plan.architecture.pattern} architecture, ${plan.technologyStack.length} technologies

Create 15-25 tasks covering:
- Project setup (dependencies, config)
- Architecture implementation (layers, components)
- Feature development (from functional requirements)
- Testing (unit, integration, BDD)
- Documentation
- Deployment setup

Return ONLY valid JSON array:
[
  {
    "id": "T001",
    "title": "Setup project structure",
    "description": "Initialize project with required folders and files",
    "type": "setup",
    "priority": 1,
    "estimatedHours": 2,
    "dependencies": [],
    "subtasks": ["Create folders", "Add config files"],
    "acceptanceCriteria": ["Project runs", "Tests pass"],
    "testCriteria": ["npm test passes"]
  }
]

Task types: "setup", "feature", "test", "documentation", "deployment"
Priority: 1 (highest) to 5 (lowest)

CRITICAL: Return ONLY valid JSON array. No markdown, no explanation.`;

    const response = await this.aiAdapter.generateText(prompt, 5000);

    const defaultTasks: Task[] = [
      { id: 'T001', title: 'Project Setup', description: 'Initialize project', type: 'setup', priority: 1, estimatedHours: 4, dependencies: [], acceptanceCriteria: ['Project created'] },
      { id: 'T002', title: 'Database Setup', description: 'Configure database', type: 'setup', priority: 1, estimatedHours: 3, dependencies: ['T001'], acceptanceCriteria: ['DB connected'] },
      { id: 'T003', title: 'Authentication', description: 'Implement auth', type: 'feature', priority: 2, estimatedHours: 8, dependencies: ['T002'], acceptanceCriteria: ['Login works'] },
      { id: 'T004', title: 'Core Features', description: 'Build main features', type: 'feature', priority: 2, estimatedHours: 16, dependencies: ['T003'], acceptanceCriteria: ['Features work'] },
      { id: 'T005', title: 'Testing', description: 'Write tests', type: 'test', priority: 3, estimatedHours: 8, dependencies: ['T004'], acceptanceCriteria: ['Tests pass'] },
      { id: 'T006', title: 'Documentation', description: 'Create docs', type: 'documentation', priority: 4, estimatedHours: 4, dependencies: ['T004'], acceptanceCriteria: ['Docs complete'] },
      { id: 'T007', title: 'Deployment', description: 'Deploy app', type: 'deployment', priority: 5, estimatedHours: 4, dependencies: ['T005'], acceptanceCriteria: ['App deployed'] }
    ];

    return parseJSONWithDefault<Task[]>(response, defaultTasks, 'generateTasks');
  }

  /**
   * Export Spec-Kit as markdown documentation
   */
  exportAsMarkdown(specKit: SpecKit): string {
    let md = `# Spec-Kit: ${specKit.constitution.projectName}\n\n`;
    md += `**Version:** ${specKit.metadata.version}\n`;
    md += `**Created:** ${specKit.metadata.createdAt}\n\n`;
    md += `---\n\n`;

    // Constitution
    md += `## 📜 Constitution\n\n`;
    md += `### Vision\n${specKit.constitution.vision}\n\n`;
    md += `### Principles\n`;
    specKit.constitution.principles.forEach((p, i) => {
      md += `${i + 1}. ${p}\n`;
    });
    md += `\n### Constraints\n`;
    specKit.constitution.constraints.forEach(c => md += `- ${c}\n`);
    md += `\n`;

    // Specification
    md += `## 📋 Specification\n\n`;
    md += `### Functional Requirements\n`;
    specKit.specification.functionalRequirements.forEach(req => {
      md += `\n#### ${req.id}: ${req.title} [${req.priority}]\n`;
      md += `${req.description}\n\n`;
      md += `**Acceptance Criteria:**\n`;
      req.acceptanceCriteria.forEach(ac => md += `- ${ac}\n`);
    });

    // Technical Plan
    md += `\n## 🏗️ Technical Plan\n\n`;
    md += `### Architecture\n`;
    md += `**Pattern:** ${specKit.technicalPlan.architecture.pattern}\n\n`;
    md += `**Layers:** ${specKit.technicalPlan.architecture.layers.join(', ')}\n\n`;

    md += `### Technology Stack\n`;
    specKit.technicalPlan.technologyStack.forEach(tech => {
      md += `- **${tech.category}:** ${tech.technology}`;
      if (tech.version) md += ` (${tech.version})`;
      md += ` - ${tech.rationale}\n`;
    });

    // Tasks
    md += `\n## ✅ Tasks (${specKit.tasks.length} total)\n\n`;
    const tasksByType = specKit.tasks.reduce((acc, task) => {
      if (!acc[task.type]) acc[task.type] = [];
      acc[task.type].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

    Object.entries(tasksByType).forEach(([type, tasks]) => {
      md += `\n### ${type.toUpperCase()} (${tasks.length})\n`;
      tasks.forEach(task => {
        md += `- [ ] **${task.id}:** ${task.title} (${task.estimatedHours}h)\n`;
      });
    });

    return md;
  }
}
