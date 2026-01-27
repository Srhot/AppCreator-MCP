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

IMPORTANT: Return ONLY the JSON object, no markdown, no explanation.`;

    const response = await this.aiAdapter.generateText(prompt, 2500);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to generate constitution');

    return JSON.parse(jsonMatch[0]);
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
4. ${projectType === 'api' ? 'API design (endpoints, methods, requests/responses)' : 'User flows'}

Return ONLY valid JSON. Example structure:
{
  "functionalRequirements": [
    {
      "id": "FR001",
      "title": "User Registration",
      "description": "...",
      "priority": "critical",
      "acceptanceCriteria": ["...", "..."]
    }
  ],
  "nonFunctionalRequirements": [
    {
      "category": "performance",
      "requirement": "...",
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
  "userFlows": [
    {
      "name": "Registration Flow",
      "steps": ["...", "..."]
    }
  ]
}

IMPORTANT: Return ONLY the JSON object, no markdown.`;

    const response = await this.aiAdapter.generateText(prompt, 4000);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to generate specification');

    return JSON.parse(jsonMatch[0]);
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
        "responsibility": "...",
        "dependencies": ["UserService"]
      }
    ]
  },
  "technologyStack": [
    {
      "category": "Backend",
      "technology": "Node.js",
      "version": "20.x",
      "rationale": "..."
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
    "dataProtection": ["...", "..."],
    "vulnerabilityMitigation": ["...", "..."]
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
    "rollbackStrategy": "..."
  }
}

IMPORTANT: Return ONLY JSON, no markdown.`;

    const response = await this.aiAdapter.generateText(prompt, 3500);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to generate technical plan');

    return JSON.parse(jsonMatch[0]);
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
    "description": "...",
    "type": "setup",
    "priority": 1,
    "estimatedHours": 2,
    "dependencies": [],
    "subtasks": ["...", "..."],
    "acceptanceCriteria": ["...", "..."],
    "testCriteria": ["..."]
  }
]

Task types: "setup", "feature", "test", "documentation", "deployment"
Priority: 1 (highest) to 5 (lowest)

IMPORTANT: Return ONLY JSON array, no markdown.`;

    const response = await this.aiAdapter.generateText(prompt, 5000);
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Failed to generate tasks');

    return JSON.parse(jsonMatch[0]);
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
