#!/usr/bin/env node

/**
 * AppCreator MCP Server - Complete AI Software Factory
 *
 * Complete workflow:
 * 1. Requirements → Decision Matrix → User Approval
 * 2. Generate Spec-Kit (Constitution, Spec, Plan, Tasks, POML)
 * 3. Backend Development + API Testing (Postman/Newman)
 * 4. Frontend Generation (A2UI + Google Stitch/Lovable)
 * 5. BDD Testing (Cucumber/Gherkin)
 * 6. Context Preservation (Checkpoints every 20-25 tasks)
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { AdapterFactory, AIProvider } from './adapters/adapter-factory.js';
import { MasterOrchestrator } from './modules/master-orchestrator.js';
import { WorkflowState } from './modules/master-orchestrator.js';
import { A2UIDesignPreferences } from './modules/a2ui-generator.js';
import { AutoWorkflowModule, AutoWorkflowConfig } from './modules/auto-workflow.js';
import { SmartWorkflowModule, SmartProjectRequirements, SmartRecommendations } from './modules/smart-workflow.js';

// AI Provider Configuration
const aiProvider = (process.env.AI_PROVIDER || 'claude') as AIProvider;
const aiApiKey = process.env.AI_API_KEY || process.env.ANTHROPIC_API_KEY || '';
const aiModel = process.env.AI_MODEL;

if (!aiApiKey) {
  console.error('❌ Error: AI_API_KEY or ANTHROPIC_API_KEY not provided');
  process.exit(1);
}

// Create AI Adapter
const aiAdapter = AdapterFactory.createAdapter({
  provider: aiProvider,
  apiKey: aiApiKey,
  model: aiModel,
});

// Create Master Orchestrator
const masterOrchestrator = new MasterOrchestrator(aiAdapter);

// Create Smart Workflow Module (NEW!)
const smartWorkflow = new SmartWorkflowModule(aiAdapter);

console.log(`🤖 AppCreator MCP Server - Complete AI Software Factory`);
console.log(`📡 AI Provider: ${aiProvider}`);
console.log(`🎯 Model: ${aiModel || AdapterFactory.getDefaultModel(aiProvider)}`);
console.log(`✨ Features: Decision Matrix, Spec-Kit, POML, API Testing, BDD, Context Preservation`);

// AppCreator Server - Complete Workflow Manager
class AppCreatorServer {
  private server: Server;
  private workflowStates: Map<string, WorkflowState> = new Map();
  private projectAnalyses: Map<string, { requirements: SmartProjectRequirements; recommendations: SmartRecommendations }> = new Map();

  constructor() {
    this.server = new Server(
      {
        name: "appcreator-mcp-server",
        version: "2.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.getTools(),
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "start_project":
            return await this.startProject(args);
          case "approve_architecture":
            return await this.approveArchitecture(args);
          case "generate_api_tests":
            return await this.generateAPITests(args);
          case "ask_frontend_questions":
            return await this.askFrontendQuestions(args);
          case "generate_frontend_prompt":
            return await this.generateFrontendPrompt(args);
          case "generate_bdd_tests":
            return await this.generateBDDTests(args);
          case "create_checkpoint":
            return await this.createCheckpoint(args);
          case "get_workflow_status":
            return await this.getWorkflowStatus(args);
          case "complete_task":
            return await this.completeTask(args);
          case "start_project_with_notebook":
            return await this.startProjectWithNotebook(args);
          case "approve_architecture_with_notebook":
            return await this.approveArchitectureWithNotebook(args);
          case "generate_a2ui_frontend":
            return await this.generateA2UIFrontend(args);
          case "analyze_project_requirements":
            return await this.analyzeProjectRequirements(args);
          case "create_project_from_analysis":
            return await this.createProjectFromAnalysis(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    });
  }

  private getTools(): Tool[] {
    return [
      {
        name: "start_project",
        description: "PHASE 1: Start new project - gathers requirements and generates decision matrix with architecture options. User must review and answer questions before proceeding.",
        inputSchema: {
          type: "object",
          properties: {
            project_name: {
              type: "string",
              description: "Project name (e.g., 'task-manager-app')",
            },
            project_type: {
              type: "string",
              description: "Project type",
              enum: ["web", "api", "cli", "desktop", "mobile", "library"],
            },
            description: {
              type: "string",
              description: "Detailed project description explaining what the app should do",
            },
            requirements: {
              type: "array",
              items: { type: "string" },
              description: "List of user requirements/features",
            },
          },
          required: ["project_name", "project_type", "description", "requirements"],
        },
      },
      {
        name: "approve_architecture",
        description: "PHASE 2: After user answers decision matrix questions and approves architecture choice. Generates complete Spec-Kit (Constitution, Specification, Technical Plan, Tasks) and POML files with context preservation system.",
        inputSchema: {
          type: "object",
          properties: {
            project_name: {
              type: "string",
              description: "Name of the project",
            },
            decision_matrix_answers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  questionId: { type: "string" },
                  answer: { type: "string" },
                },
              },
              description: "User's answers to decision matrix questions",
            },
          },
          required: ["project_name", "decision_matrix_answers"],
        },
      },
      {
        name: "generate_api_tests",
        description: "PHASE 3: Generate Postman collection and environments for API testing. Creates collection.json, dev/staging/prod environments, and Newman CLI test commands. User can test APIs manually in Postman or automatically with Newman CLI.",
        inputSchema: {
          type: "object",
          properties: {
            project_name: {
              type: "string",
              description: "Name of the project",
            },
          },
          required: ["project_name"],
        },
      },
      {
        name: "ask_frontend_questions",
        description: "PHASE 4a: Ask user questions about frontend preferences before generating prompt. Asks about platform (Google Stitch/Lovable/v0/Bolt), design style, colors, features needed.",
        inputSchema: {
          type: "object",
          properties: {
            project_name: {
              type: "string",
              description: "Name of the project",
            },
          },
          required: ["project_name"],
        },
      },
      {
        name: "generate_frontend_prompt",
        description: "PHASE 4b: Generate comprehensive frontend prompt for no-code platforms (Google Stitch, Lovable, v0.dev, Bolt.new). Creates detailed prompt with component breakdown, design system, API integration, and user flows. User can copy this prompt to their chosen platform.",
        inputSchema: {
          type: "object",
          properties: {
            project_name: {
              type: "string",
              description: "Name of the project",
            },
            frontend_answers: {
              type: "object",
              description: "User's answers to frontend questions (platform, designStyle, colorScheme, primaryColor, features, uiFramework)",
            },
          },
          required: ["project_name", "frontend_answers"],
        },
      },
      {
        name: "generate_bdd_tests",
        description: "PHASE 5: Generate BDD/Cucumber/Gherkin tests for human-readable behavior specifications. Creates feature files, step definitions, and test configuration. Tests can be run with npm run test:bdd.",
        inputSchema: {
          type: "object",
          properties: {
            project_name: {
              type: "string",
              description: "Name of the project",
            },
          },
          required: ["project_name"],
        },
      },
      {
        name: "create_checkpoint",
        description: "CONTEXT PRESERVATION: Create checkpoint to prevent context loss. Call this every 20-25 completed tasks or when switching between major phases. Saves state to POML, generates continuation prompt for resuming after context loss.",
        inputSchema: {
          type: "object",
          properties: {
            project_name: {
              type: "string",
              description: "Name of the project",
            },
            completed_task_ids: {
              type: "array",
              items: { type: "string" },
              description: "IDs of tasks completed since last checkpoint (e.g., ['T001', 'T002', 'T003'])",
            },
            current_task_id: {
              type: "string",
              description: "ID of current task being worked on (or null if none)",
            },
            issues_encountered: {
              type: "array",
              items: { type: "string" },
              description: "Any issues encountered since last checkpoint",
              default: [],
            },
          },
          required: ["project_name", "completed_task_ids"],
        },
      },
      {
        name: "get_workflow_status",
        description: "Get complete workflow status including current phase, progress, completed tasks, next steps, and whether checkpoint is needed.",
        inputSchema: {
          type: "object",
          properties: {
            project_name: {
              type: "string",
              description: "Name of the project",
            },
          },
          required: ["project_name"],
        },
      },
      {
        name: "complete_task",
        description: "Mark a task as complete and automatically create checkpoint if 20-25 tasks have been completed since last checkpoint. Updates progress tracking.",
        inputSchema: {
          type: "object",
          properties: {
            project_name: {
              type: "string",
              description: "Name of the project",
            },
            task_id: {
              type: "string",
              description: "ID of completed task (e.g., 'T001')",
            },
          },
          required: ["project_name", "task_id"],
        },
      },
      {
        name: "start_project_with_notebook",
        description: "PHASE 1 (NotebookLM): Start new project using NotebookLM documentation as source. Alternative to start_project when you have pre-existing documentation. Fetches documentation from NotebookLM and generates decision matrix enriched with notebook content.",
        inputSchema: {
          type: "object",
          properties: {
            project_name: {
              type: "string",
              description: "Project name (e.g., 'real-estate-management')",
            },
            project_type: {
              type: "string",
              description: "Project type",
              enum: ["web", "api", "cli", "desktop", "mobile", "library"],
            },
            notebook_name: {
              type: "string",
              description: "Name of NotebookLM notebook to use as documentation source",
            },
            additional_requirements: {
              type: "array",
              items: { type: "string" },
              description: "Optional additional requirements not in notebook",
              default: [],
            },
          },
          required: ["project_name", "project_type", "notebook_name"],
        },
      },
      {
        name: "approve_architecture_with_notebook",
        description: "PHASE 2 (NotebookLM): After user answers decision matrix, generate Spec-Kit enriched with NotebookLM documentation. Combines notebook content with AI research for complete specifications.",
        inputSchema: {
          type: "object",
          properties: {
            project_name: {
              type: "string",
              description: "Name of the project",
            },
            notebook_name: {
              type: "string",
              description: "Name of NotebookLM notebook used",
            },
            decision_matrix_answers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  questionId: { type: "string" },
                  answer: { type: "string" },
                },
              },
              description: "User's answers to decision matrix questions",
            },
            additional_requirements: {
              type: "array",
              items: { type: "string" },
              description: "Additional requirements",
              default: [],
            },
          },
          required: ["project_name", "notebook_name", "decision_matrix_answers"],
        },
      },
      {
        name: "generate_a2ui_frontend",
        description: "PHASE 4 (A2UI): Generate AI-powered frontend using Google's A2UI standard. Creates declarative UI spec, implementation code (React/Vue/etc.), and Google Stitch-compatible prompt. More advanced than traditional frontend_prompt.",
        inputSchema: {
          type: "object",
          properties: {
            project_name: {
              type: "string",
              description: "Name of the project",
            },
            platform: {
              type: "string",
              enum: ["web", "mobile", "desktop"],
              description: "Target platform",
            },
            framework: {
              type: "string",
              enum: ["react", "vue", "angular", "native"],
              description: "Frontend framework",
            },
            ui_library: {
              type: "string",
              enum: ["material-ui", "tailwind", "chakra", "ant-design", "custom"],
              description: "UI component library",
            },
            design_style: {
              type: "string",
              enum: ["modern", "minimal", "professional", "playful"],
              description: "Design aesthetic",
            },
            color_scheme: {
              type: "string",
              enum: ["light", "dark", "auto"],
              description: "Color scheme preference",
            },
            primary_color: {
              type: "string",
              description: "Primary brand color (e.g., 'blue', 'green', '#3B82F6')",
            },
            features: {
              type: "array",
              items: { type: "string" },
              description: "UI features (e.g., 'dark-mode-toggle', 'responsive', 'animations')",
              default: ["responsive", "accessible"],
            },
          },
          required: ["project_name", "platform", "framework", "ui_library", "design_style", "color_scheme", "primary_color"],
        },
      },
      {
        name: "analyze_project_requirements",
        description: "SMART WORKFLOW STEP 1: Analyze project requirements and get AI-driven recommendations. Automatically detects project scale, checks NotebookLM availability (graceful fallback), and generates technical recommendations (database, architecture, auth, frontend) with detailed rationale. User receives a comprehensive summary for single approval. NO technical decisions required from user - AI recommends optimal choices based on project needs.",
        inputSchema: {
          type: "object",
          properties: {
            project_name: {
              type: "string",
              description: "Project name (e.g., 'real-estate-tracker')",
            },
            project_type: {
              type: "string",
              enum: ["web", "api", "cli", "desktop", "mobile", "library"],
              description: "Project type",
            },
            description: {
              type: "string",
              description: "Detailed project description explaining what the app should do",
            },
            features: {
              type: "array",
              items: { type: "string" },
              description: "List of required features",
            },
            notebook_name: {
              type: "string",
              description: "Optional: NotebookLM notebook name for documentation-based generation. If not available or not provided, system gracefully falls back to standard AI generation.",
            },
            expected_users: {
              type: "number",
              description: "Optional: Expected number of concurrent users (helps with scale detection). If not provided, AI will infer from description.",
            },
            data_volume: {
              type: "string",
              enum: ["small", "medium", "large", "massive"],
              description: "Optional: Expected data volume. If not provided, AI will infer from description.",
            },
            branches: {
              type: "array",
              items: { type: "string" },
              description: "Optional: Geographic branches/locations (helps determine if distributed architecture needed)",
              default: [],
            },
          },
          required: ["project_name", "project_type", "description", "features"],
        },
      },
      {
        name: "create_project_from_analysis",
        description: "SMART WORKFLOW STEP 2: Execute project creation after user approves AI recommendations. Generates complete Spec-Kit with recommended architecture, implements all phases (backend, API tests, A2UI frontend, BDD tests), and preserves context. Call this after analyze_project_requirements and user approval.",
        inputSchema: {
          type: "object",
          properties: {
            project_name: {
              type: "string",
              description: "Name of the project (must match the one from analyze_project_requirements)",
            },
            approved: {
              type: "boolean",
              description: "User approval confirmation (true to proceed, false to cancel)",
            },
          },
          required: ["project_name", "approved"],
        },
      },
    ];
  }

  /**
   * PHASE 1: Start project with decision matrix
   */
  private async startProject(args: any) {
    const { project_name, project_type, description, requirements } = args;

    console.log(`\n🚀 PHASE 1: Starting project "${project_name}"`);

    const result = await masterOrchestrator.startProject(
      project_name,
      project_type,
      description,
      requirements
    );

    // Initialize workflow state
    const workflowState: WorkflowState = {
      projectName: project_name,
      currentPhase: 'decision_matrix',
      completedPhases: ['requirements'],
      requirements,
      decisionMatrix: result.decisionMatrix,
      postmanGenerated: false,
      frontendPromptGenerated: false,
      bddTestsGenerated: false,
      tasksCompleted: 0,
      lastCheckpointTask: 0,
      issues: [],
      a2uiGenerated: false,
    };

    this.workflowStates.set(project_name, workflowState);

    return {
      content: [
        {
          type: "text",
          text: `✅ PHASE 1 COMPLETE: Decision Matrix Generated

Project: ${project_name}
Type: ${project_type}

📋 Decision Matrix Questions (${result.decisionMatrix.questions.length} questions):

${result.decisionMatrix.questions.map((q: any, i: number) =>
  `${i + 1}. [${q.category.toUpperCase()}] ${q.question}
   Type: ${q.type}
   ${q.options ? `Options: ${q.options.join(', ')}` : ''}
`).join('\n')}

🎯 NEXT STEP:
Please review these questions and provide your answers. Then call the "approve_architecture" tool with your answers to proceed to Spec-Kit generation.

Example:
{
  "project_name": "${project_name}",
  "decision_matrix_answers": [
    { "questionId": "arch_01", "answer": "Microservices" },
    { "questionId": "tech_01", "answer": "PostgreSQL" },
    ...
  ]
}`,
        },
      ],
    };
  }

  /**
   * PHASE 2: Generate Spec-Kit after architecture approval
   */
  private async approveArchitecture(args: any) {
    const { project_name, decision_matrix_answers } = args;
    const state = this.workflowStates.get(project_name);

    if (!state || !state.decisionMatrix) {
      throw new Error(`Project not started. Call start_project first.`);
    }

    console.log(`\n📚 PHASE 2: Generating Spec-Kit for "${project_name}"`);

    // Complete decision matrix with answers
    const completedMatrix = {
      ...state.decisionMatrix,
      answers: decision_matrix_answers,
    };

    // Generate Spec-Kit
    const projectPath = `C:\\Users\\serha\\OneDrive\\Desktop\\appcreator-projects\\${project_name}`;
    const result = await masterOrchestrator.generateSpecKit(
      project_name,
      state.decisionMatrix.projectType,
      state.requirements.join('\n'),
      completedMatrix,
      projectPath
    );

    // Update workflow state
    state.specKit = result.specKit;
    state.pomlState = result.pomlState;
    state.currentPhase = 'backend_dev';
    state.completedPhases.push('decision_matrix', 'spec_kit');

    return {
      content: [
        {
          type: "text",
          text: `✅ PHASE 2 COMPLETE: Spec-Kit Generated

📁 Project Location: ${projectPath}

📄 Generated Files:
${result.files.map(f => `  ✓ ${f}`).join('\n')}

📊 Project Breakdown:
  • Tasks: ${result.specKit.tasks.length} tasks planned
  • Estimated: ${result.specKit.tasks.reduce((sum: number, t: any) => sum + t.estimatedHours, 0)} hours
  • Features: ${result.specKit.specification.functionalRequirements.length} functional requirements

📋 Task Categories:
${Object.entries(
  result.specKit.tasks.reduce((acc: any, task: any) => {
    acc[task.type] = (acc[task.type] || 0) + 1;
    return acc;
  }, {})
).map(([type, count]) => `  • ${type}: ${count} tasks`).join('\n')}

💾 Context Preservation:
  • POML file created: PROJECT.poml
  • State saved: .devforge/state.json
  • Checkpoint system active (every 20-25 tasks)

🎯 NEXT STEPS:
1. Review the generated Spec-Kit in ${projectPath}/docs/
2. Begin backend development
3. Call "generate_api_tests" when APIs are ready for testing
4. Use "complete_task" to mark tasks done (auto-checkpoint every 20-25 tasks)
5. Use "create_checkpoint" manually anytime to save progress`,
        },
      ],
    };
  }

  /**
   * PHASE 3: Generate API tests
   */
  private async generateAPITests(args: any) {
    const { project_name } = args;
    const state = this.workflowStates.get(project_name);

    if (!state || !state.specKit) {
      throw new Error(`Spec-Kit not generated. Call approve_architecture first.`);
    }

    console.log(`\n🧪 PHASE 3: Generating API Tests for "${project_name}"`);

    const projectPath = `C:\\Users\\serha\\OneDrive\\Desktop\\appcreator-projects\\${project_name}`;
    const result = await masterOrchestrator.generateAPITests(
      state.specKit,
      projectPath
    );

    state.postmanGenerated = true;
    state.currentPhase = 'api_testing';
    state.completedPhases.push('backend_dev');

    return {
      content: [
        {
          type: "text",
          text: `✅ PHASE 3 COMPLETE: API Tests Generated

📁 Postman Collection:
  ✓ ${result.collectionPath}

🌍 Environments:
${result.environmentPaths.map(p => `  ✓ ${p}`).join('\n')}

📖 Testing Guide:
  ✓ ${projectPath}\\docs\\API_TESTING_GUIDE.md

🧪 Newman Commands:
  • Run all tests:
    ${result.newmanCommands.runAll}

  • Run with HTML report:
    ${result.newmanCommands.runWithReporter}

  • Run for CI/CD:
    ${result.newmanCommands.cicd}

🎯 NEXT STEPS:
1. Import ${result.collectionPath} to Postman
2. Select environment (dev/staging/prod)
3. Run tests manually OR use Newman CLI
4. Report any failures - I'll fix them!
5. When APIs are tested and working, call "ask_frontend_questions" to start frontend`,
        },
      ],
    };
  }

  /**
   * PHASE 4a: Ask frontend questions
   */
  private async askFrontendQuestions(args: any) {
    const { project_name } = args;
    const state = this.workflowStates.get(project_name);

    if (!state) {
      throw new Error(`Project not found`);
    }

    const questions = `📝 Frontend Preferences Questions:

Please answer these questions to generate your frontend prompt:

1. **Platform**: Which no-code/low-code platform will you use?
   Options: google-stitch, lovable, v0, bolt, generic

2. **Design Style**: What design style do you prefer?
   Options: modern, minimal, colorful, professional, playful

3. **Color Scheme**: Light or dark mode?
   Options: light, dark, auto

4. **Primary Color**: What should be the main color?
   Examples: blue, green, purple, red, orange

5. **UI Framework** (optional): Which UI library to use?
   Options: tailwind, mui, chakra, ant-design

6. **Features**: What UI features do you need?
   Examples: dark mode toggle, responsive design, animations, accessibility

After answering, call "generate_frontend_prompt" with your answers in this format:
{
  "project_name": "${project_name}",
  "frontend_answers": {
    "platform": "lovable",
    "designStyle": "modern",
    "colorScheme": "dark",
    "primaryColor": "blue",
    "uiFramework": "tailwind",
    "features": "dark mode, responsive, smooth animations"
  }
}`;

    return {
      content: [{ type: "text", text: questions }],
    };
  }

  /**
   * PHASE 4b: Generate frontend prompt
   */
  private async generateFrontendPrompt(args: any) {
    const { project_name, frontend_answers } = args;
    const state = this.workflowStates.get(project_name);

    if (!state || !state.specKit) {
      throw new Error(`Spec-Kit not generated`);
    }

    console.log(`\n🎨 PHASE 4: Generating Frontend Prompt for "${project_name}"`);

    const projectPath = `C:\\Users\\serha\\OneDrive\\Desktop\\appcreator-projects\\${project_name}`;
    const result = await masterOrchestrator.generateFrontendPrompt(
      state.specKit,
      frontend_answers,
      projectPath
    );

    state.frontendPromptGenerated = true;
    state.currentPhase = 'frontend_prompt';
    state.completedPhases.push('api_testing');

    return {
      content: [
        {
          type: "text",
          text: `✅ PHASE 4 COMPLETE: Frontend Prompt Generated

📄 Prompt File: ${result.promptPath}

🎨 Prompt Details:
  • Platform: ${frontend_answers.platform}
  • Design Style: ${frontend_answers.designStyle}
  • Components: ${result.prompt.componentBreakdown.length} components identified
  • User Flows: ${result.prompt.userFlowPrompts.length} flows defined

📋 Generated Sections:
  ✓ Main comprehensive prompt
  ✓ Component breakdown (${result.prompt.componentBreakdown.length} components)
  ✓ Design system specifications
  ✓ API integration instructions
  ✓ User flow implementations

🎯 NEXT STEPS:
1. Open ${result.promptPath}
2. Copy the "Main Prompt" section
3. Paste into ${frontend_answers.platform}
4. Review generated design
5. Use component/flow prompts to refine specific parts
6. When frontend is ready, call "generate_bdd_tests" for final testing`,
        },
      ],
    };
  }

  /**
   * PHASE 5: Generate BDD tests
   */
  private async generateBDDTests(args: any) {
    const { project_name } = args;
    const state = this.workflowStates.get(project_name);

    if (!state || !state.specKit) {
      throw new Error(`Spec-Kit not generated`);
    }

    console.log(`\n🥒 PHASE 5: Generating BDD Tests for "${project_name}"`);

    const projectPath = `C:\\Users\\serha\\OneDrive\\Desktop\\appcreator-projects\\${project_name}`;
    const result = await masterOrchestrator.generateBDDTests(
      state.specKit,
      projectPath
    );

    state.bddTestsGenerated = true;
    state.currentPhase = 'bdd_testing';
    state.completedPhases.push('frontend_integration');

    return {
      content: [
        {
          type: "text",
          text: `✅ PHASE 5 COMPLETE: BDD Tests Generated

🥒 Feature Files (${result.featurePaths.length}):
${result.featurePaths.map(p => `  ✓ ${p}`).join('\n')}

📝 Step Definitions:
  ✓ ${result.stepDefinitionsPath}

⚙️ Configuration:
${result.configPaths.map(p => `  ✓ ${p}`).join('\n')}

🧪 Running Tests:
  • Run all BDD tests:
    npm run test:bdd

  • Run with watch mode:
    npm run test:bdd:watch

  • Generate coverage report:
    npm run test:bdd:coverage

🎯 NEXT STEPS:
1. Run: npm install (install test dependencies)
2. Run: npm run test:bdd
3. Fix any failing tests
4. Create final checkpoint with: create_checkpoint
5. Deploy your application! 🚀

🎉 PROJECT COMPLETE!`,
        },
      ],
    };
  }

  /**
   * Create checkpoint for context preservation
   */
  private async createCheckpoint(args: any) {
    const { project_name, completed_task_ids, current_task_id = null, issues_encountered = [] } = args;
    const state = this.workflowStates.get(project_name);

    if (!state || !state.pomlState) {
      throw new Error(`Project not found or Spec-Kit not generated`);
    }

    console.log(`\n💾 Creating Checkpoint for "${project_name}"`);

    const projectPath = `C:\\Users\\serha\\OneDrive\\Desktop\\appcreator-projects\\${project_name}`;
    const result = await masterOrchestrator.createCheckpoint(
      state.pomlState,
      completed_task_ids,
      current_task_id,
      issues_encountered,
      projectPath
    );

    state.tasksCompleted += completed_task_ids.length;
    state.lastCheckpointTask = state.tasksCompleted;

    return {
      content: [
        {
          type: "text",
          text: `✅ Checkpoint Created: ${result.checkpoint.id}

📊 Progress:
  • Tasks completed: ${state.tasksCompleted}/${state.specKit?.tasks.length || 0}
  • Progress: ${state.pomlState.overallProgress.toFixed(1)}%
  • Phase: ${result.checkpoint.phase}

💾 Saved Files:
  ✓ PROJECT.poml (updated)
  ✓ .devforge/state.json
  ✓ .devforge/continuation-prompt.txt

🔄 Context Preservation:
  • Checkpoint ID: ${result.checkpoint.id}
  • Timestamp: ${result.checkpoint.timestamp}
  • Next checkpoint due in: ~20-25 tasks

📝 Continuation Prompt:
${result.continuationPrompt.substring(0, 500)}...

(Full prompt saved to .devforge/continuation-prompt.txt)

✅ Safe to continue or lose context - all progress preserved!`,
        },
      ],
    };
  }

  /**
   * Get workflow status
   */
  private async getWorkflowStatus(args: any) {
    const { project_name } = args;
    const state = this.workflowStates.get(project_name);

    if (!state) {
      throw new Error(`Project '${project_name}' not found`);
    }

    const checkpointNeeded = state.tasksCompleted - state.lastCheckpointTask >= 20;

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              project: project_name,
              currentPhase: state.currentPhase,
              completedPhases: state.completedPhases,
              tasksCompleted: state.tasksCompleted,
              totalTasks: state.specKit?.tasks.length || 0,
              progress: state.pomlState?.overallProgress || 0,
              checkpointNeeded,
              postmanGenerated: state.postmanGenerated,
              frontendPromptGenerated: state.frontendPromptGenerated,
              bddTestsGenerated: state.bddTestsGenerated,
              issues: state.issues,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  /**
   * Complete a task (auto-checkpoint if needed)
   */
  private async completeTask(args: any) {
    const { project_name, task_id } = args;
    const state = this.workflowStates.get(project_name);

    if (!state || !state.pomlState) {
      throw new Error(`Project not found`);
    }

    state.tasksCompleted++;
    const tasksSinceCheckpoint = state.tasksCompleted - state.lastCheckpointTask;

    let checkpointCreated = false;
    let checkpointInfo = null;

    // Auto-checkpoint if 20+ tasks completed
    if (tasksSinceCheckpoint >= 20) {
      console.log(`\n⚠️  Auto-checkpoint triggered (${tasksSinceCheckpoint} tasks since last checkpoint)`);

      const projectPath = `C:\\Users\\serha\\OneDrive\\Desktop\\appcreator-projects\\${project_name}`;
      const result = await masterOrchestrator.createCheckpoint(
        state.pomlState,
        [task_id],
        null,
        [],
        projectPath
      );

      state.lastCheckpointTask = state.tasksCompleted;
      checkpointCreated = true;
      checkpointInfo = result.checkpoint;
    }

    return {
      content: [
        {
          type: "text",
          text: `✅ Task Completed: ${task_id}

📊 Progress:
  • Total completed: ${state.tasksCompleted}/${state.specKit?.tasks.length || 0}
  • Tasks since last checkpoint: ${checkpointCreated ? 0 : tasksSinceCheckpoint}

${checkpointCreated ? `
💾 AUTO-CHECKPOINT CREATED: ${checkpointInfo.id}
  • Phase: ${checkpointInfo.phase}
  • Timestamp: ${checkpointInfo.timestamp}
  • All progress saved!
` : `
${tasksSinceCheckpoint >= 15 ? '⚠️  Checkpoint recommended soon (20 tasks trigger auto-checkpoint)' : '✅ Continue working'}
`}`,
        },
      ],
    };
  }

  /**
   * NEW: Start project with NotebookLM documentation
   */
  private async startProjectWithNotebook(args: any) {
    const { project_name, project_type, notebook_name, additional_requirements = [] } = args;

    console.log(`\n📚 PHASE 1 (NotebookLM): Starting project "${project_name}"`);
    console.log(`   Using NotebookLM: ${notebook_name}`);

    const result = await masterOrchestrator.startProjectWithNotebook(
      project_name,
      project_type,
      notebook_name,
      additional_requirements
    );

    // Initialize workflow state
    const workflowState: WorkflowState = {
      projectName: project_name,
      currentPhase: 'decision_matrix',
      completedPhases: ['requirements'],
      requirements: additional_requirements,
      decisionMatrix: result.decisionMatrix,
      postmanGenerated: false,
      frontendPromptGenerated: false,
      bddTestsGenerated: false,
      tasksCompleted: 0,
      lastCheckpointTask: 0,
      issues: [],
      notebookLMSource: notebook_name,
      a2uiGenerated: false,
    };

    this.workflowStates.set(project_name, workflowState);

    return {
      content: [
        {
          type: "text",
          text: `✅ PHASE 1 COMPLETE: Decision Matrix Generated (NotebookLM-Enhanced)

Project: ${project_name}
Type: ${project_type}
NotebookLM Source: ${notebook_name}

📚 Notebook Information:
  • Sources: ${result.notebookContent.sourceCount}
  • Key Topics: ${result.notebookContent.keyTopics.join(', ')}

📋 Decision Matrix Questions (${result.decisionMatrix.questions.length} questions):

${result.decisionMatrix.questions.map((q: any, i: number) =>
  `${i + 1}. [${q.category.toUpperCase()}] ${q.question}
   Type: ${q.type}
   ${q.options ? `Options: ${q.options.join(', ')}` : ''}
`).join('\n')}

🎯 NEXT STEP:
Call "approve_architecture_with_notebook" with your answers to generate enriched Spec-Kit.

Example:
{
  "project_name": "${project_name}",
  "notebook_name": "${notebook_name}",
  "decision_matrix_answers": [
    { "questionId": "arch_01", "answer": "..." },
    ...
  ]
}`,
        },
      ],
    };
  }

  /**
   * NEW: Approve architecture with NotebookLM enrichment
   */
  private async approveArchitectureWithNotebook(args: any) {
    const { project_name, notebook_name, decision_matrix_answers, additional_requirements = [] } = args;
    const state = this.workflowStates.get(project_name);

    if (!state || !state.decisionMatrix) {
      throw new Error(`Project not started. Call start_project_with_notebook first.`);
    }

    console.log(`\n📚 PHASE 2 (NotebookLM): Generating enriched Spec-Kit for "${project_name}"`);

    // Complete decision matrix
    const completedMatrix = {
      ...state.decisionMatrix,
      answers: decision_matrix_answers,
    };

    // Generate enriched Spec-Kit
    const projectPath = `C:\\Users\\serha\\OneDrive\\Desktop\\appcreator-projects\\${project_name}`;
    const result = await masterOrchestrator.generateSpecKitWithNotebook(
      project_name,
      state.decisionMatrix.projectType,
      notebook_name,
      completedMatrix,
      projectPath,
      additional_requirements
    );

    // Update workflow state
    state.specKit = result.specKit;
    state.pomlState = result.pomlState;
    state.notebookEnrichment = result.enrichment;
    state.currentPhase = 'backend_dev';
    state.completedPhases.push('decision_matrix', 'spec_kit');

    return {
      content: [
        {
          type: "text",
          text: `✅ PHASE 2 COMPLETE: NotebookLM-Enriched Spec-Kit Generated

📁 Project Location: ${projectPath}

📄 Generated Files:
${result.files.map(f => `  ✓ ${f}`).join('\n')}

📚 NotebookLM Enrichment:
  • Coverage Score: ${result.enrichment.coverageScore.toFixed(1)}%
  • Notebook Contributions: ${result.enrichment.notebookContributions.length}
  • AI-Supplemented Topics: ${result.enrichment.missingInformation.length}

📊 Project Breakdown:
  • Tasks: ${result.specKit.tasks.length} tasks planned
  • Estimated: ${result.specKit.tasks.reduce((sum: number, t: any) => sum + t.estimatedHours, 0)} hours
  • Features: ${result.specKit.specification.functionalRequirements.length} functional requirements

💾 Context Preservation:
  • POML file created: PROJECT.poml
  • State saved: .devforge/state.json
  • Enrichment report: docs/NOTEBOOKLM_ENRICHMENT.md

🎯 NEXT STEPS:
1. Review enriched Spec-Kit in ${projectPath}/docs/
2. Begin backend development
3. Call "generate_api_tests" when ready
4. Use "generate_a2ui_frontend" for AI-powered frontend (NEW!)`,
        },
      ],
    };
  }

  /**
   * NEW: Generate A2UI-powered frontend
   */
  private async generateA2UIFrontend(args: any) {
    const { project_name, platform, framework, ui_library, design_style, color_scheme, primary_color, features = [] } = args;
    const state = this.workflowStates.get(project_name);

    if (!state || !state.specKit) {
      throw new Error(`Spec-Kit not generated. Call approve_architecture first.`);
    }

    console.log(`\n🎨 PHASE 4 (A2UI): Generating AI-powered frontend for "${project_name}"`);

    const designPreferences: A2UIDesignPreferences = {
      platform,
      framework,
      uiLibrary: ui_library,
      designStyle: design_style,
      colorScheme: color_scheme,
      primaryColor: primary_color,
      features,
    };

    const projectPath = `C:\\Users\\serha\\OneDrive\\Desktop\\appcreator-projects\\${project_name}`;
    const result = await masterOrchestrator.generateA2UIFrontend(
      state.specKit,
      designPreferences,
      projectPath
    );

    state.a2uiGenerated = true;
    state.a2uiCode = result.uiCode;
    state.currentPhase = 'frontend_integration';
    state.completedPhases.push('frontend_prompt');

    return {
      content: [
        {
          type: "text",
          text: `✅ PHASE 4 COMPLETE: A2UI-Powered Frontend Generated

🎨 Frontend Stack:
  • Platform: ${platform}
  • Framework: ${framework}
  • UI Library: ${ui_library}
  • Design Style: ${design_style}

📄 Generated Files (${result.files.length}):
${result.files.slice(0, 10).map(f => `  ✓ ${f.replace(projectPath, '')}`).join('\n')}
${result.files.length > 10 ? `  ... and ${result.files.length - 10} more files` : ''}

📊 A2UI Specification:
  • Layouts: ${result.a2uiSpec.layouts.length}
  • Components: ${result.a2uiSpec.layouts.reduce((sum: number, l: any) => sum + l.components.length, 0)}
  • Routes: ${result.a2uiSpec.routes.length}
  • API Bindings: ${result.a2uiSpec.dataBindings.length}

📁 Key Files:
  • A2UI Spec: frontend/a2ui-spec.json
  • Implementation: frontend/src/
  • Stitch Prompt: docs/GOOGLE_STITCH_PROMPT.md
  • Guide: docs/FRONTEND_GUIDE.md

🎯 USAGE OPTIONS:

1. **Direct Development** (Recommended):
   \`\`\`bash
   cd ${projectPath}/frontend
   npm install
   npm run dev
   \`\`\`

2. **Google Stitch** (Alternative):
   • Copy prompt from: docs/GOOGLE_STITCH_PROMPT.md
   • Paste into Google Stitch
   • Refine with A2UI visual editor

3. **Hybrid Approach**:
   • Use generated code as base
   • Enhance with Google A2UI tools
   • Iterate with AI assistance

🚀 NEXT STEPS:
1. Review A2UI spec: frontend/a2ui-spec.json
2. Test frontend: npm run dev
3. Generate BDD tests: call "generate_bdd_tests"
4. Deploy! 🎉`,
        },
      ],
    };
  }

  /**
   * SMART WORKFLOW STEP 1: Analyze requirements and get AI recommendations
   */
  private async analyzeProjectRequirements(args: any) {
    const {
      project_name,
      project_type,
      description,
      features,
      notebook_name,
      expected_users,
      data_volume,
      branches = [],
    } = args;

    console.log(`\n🤖 SMART WORKFLOW: Analyzing project "${project_name}"`);

    const requirements: SmartProjectRequirements = {
      projectName: project_name,
      projectType: project_type,
      description,
      features,
      notebookName: notebook_name,
      expectedUsers: expected_users,
      dataVolume: data_volume,
      branches: branches.length > 0 ? branches.length : undefined,
    };

    // Call smart workflow to analyze and recommend
    const recommendations = await smartWorkflow.analyzeAndRecommend(requirements);

    // Store for later use
    this.projectAnalyses.set(project_name, { requirements, recommendations });

    // Helper to find recommendation by category
    const findRec = (category: string) =>
      recommendations.recommendations.find(r => r.category === category);

    // Format recommendations for user approval
    const formatRecommendation = (rec: any) => {
      if (!rec) return 'Not specified';
      return `
${rec.recommendation}

📊 RATIONALE:
${rec.rationale.map((r: string, i: number) => `  ${i + 1}. ${r}`).join('\n')}

🔄 ALTERNATIVES:
${rec.alternatives.map((alt: any) => `  • ${alt.option}
     Pros: ${alt.pros.join(', ')}
     Cons: ${alt.cons.join(', ')}`).join('\n')}
`;
    };

    const dbRec = findRec('database');
    const archRec = findRec('architecture');
    const authRec = findRec('authentication');
    const frontendRec = findRec('frontend');

    return {
      content: [
        {
          type: "text",
          text: `✅ PROJECT ANALYSIS COMPLETE

📋 PROJECT DETAILS:
  • Name: ${project_name}
  • Type: ${project_type}
  • Scale: ${recommendations.scale.size.toUpperCase()}
  • NotebookLM: ${notebook_name ? `Requested: "${notebook_name}"` : '✗ Not requested (using AI generation)'}

🎯 AI RECOMMENDATIONS:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗄️  DATABASE RECOMMENDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formatRecommendation(dbRec)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏗️  ARCHITECTURE RECOMMENDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formatRecommendation(archRec)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 AUTHENTICATION RECOMMENDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formatRecommendation(authRec)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 FRONTEND RECOMMENDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formatRecommendation(frontendRec)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 SUMMARY:
  • Database: ${dbRec?.recommendation.split('\n')[0] || 'Not specified'}
  • Architecture: ${archRec?.recommendation.split('\n')[0] || 'Not specified'}
  • Auth: ${authRec?.recommendation.split('\n')[0] || 'Not specified'}
  • Frontend: ${frontendRec?.recommendation.split('\n')[0] || 'Not specified'}
  • Complexity: ${recommendations.estimatedComplexity}
  • Duration: ${recommendations.estimatedDuration}

🎯 NEXT STEP:
Review these AI-driven recommendations. If you approve, call:

{
  "project_name": "${project_name}",
  "approved": true
}

using the "create_project_from_analysis" tool to generate the complete project with these recommendations.

💡 NOTE: These are AI recommendations optimized for your project's scale (${recommendations.scale.size}) and requirements. You can request modifications if needed.`,
        },
      ],
    };
  }

  /**
   * SMART WORKFLOW STEP 2: Execute after user approval
   */
  private async createProjectFromAnalysis(args: any) {
    const { project_name, approved } = args;

    if (!approved) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Project creation cancelled. Recommendations not approved.

To modify recommendations, please call "analyze_project_requirements" again with adjusted parameters.`,
          },
        ],
      };
    }

    const analysis = this.projectAnalyses.get(project_name);

    if (!analysis) {
      throw new Error(
        `No analysis found for project "${project_name}". Please call "analyze_project_requirements" first.`
      );
    }

    console.log(`\n🚀 SMART WORKFLOW: Creating project "${project_name}" with AI recommendations`);

    // Execute smart workflow
    const result = await smartWorkflow.executeWithRecommendations(
      analysis.requirements,
      analysis.recommendations
    );

    // Initialize workflow state (for compatibility with existing tools)
    const workflowState: WorkflowState = {
      projectName: project_name,
      currentPhase: 'complete',
      completedPhases: [
        'requirements',
        'decision_matrix',
        'spec_kit',
        'backend_dev',
        'api_testing',
        'frontend_prompt',
        'bdd_testing',
      ],
      requirements: analysis.requirements.features,
      specKit: result.specKit,
      pomlState: result.pomlState,
      postmanGenerated: true,
      frontendPromptGenerated: true,
      bddTestsGenerated: true,
      a2uiGenerated: true,
      tasksCompleted: 0,
      lastCheckpointTask: 0,
      issues: [],
      notebookLMSource: analysis.requirements.notebookName,
    };

    this.workflowStates.set(project_name, workflowState);

    const projectPath = result.projectPath;

    // Get recommendations for display
    const findRec = (category: string) =>
      analysis.recommendations.recommendations.find(r => r.category === category);

    const dbRec = findRec('database');
    const archRec = findRec('architecture');
    const authRec = findRec('authentication');
    const frontendRec = findRec('frontend');

    return {
      content: [
        {
          type: "text",
          text: `✅ PROJECT CREATED SUCCESSFULLY! 🎉

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 PROJECT LOCATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${projectPath}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 IMPLEMENTED RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✓ Database: ${dbRec?.recommendation.split('\n')[0] || 'Standard setup'}
  ✓ Architecture: ${archRec?.recommendation.split('\n')[0] || 'Standard setup'}
  ✓ Authentication: ${authRec?.recommendation.split('\n')[0] || 'Standard setup'}
  ✓ Frontend: ${frontendRec?.recommendation.split('\n')[0] || 'Standard setup'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 GENERATED ARTIFACTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${result.files.map(f => `  ✓ ${f.replace(projectPath + '\\', '')}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 PROJECT STATS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • Scale: ${analysis.recommendations.scale.size.toUpperCase()}
  • Complexity: ${analysis.recommendations.estimatedComplexity}
  • Duration: ${analysis.recommendations.estimatedDuration}
  • Tasks: ${result.specKit.tasks.length} planned
  • Estimated Hours: ${result.specKit.tasks.reduce((sum: number, t: any) => sum + t.estimatedHours, 0)}
  • Features: ${result.specKit.specification.functionalRequirements.length}
${result.notebookUsed ? `  • NotebookLM Coverage: ${result.coverage?.toFixed(1)}%` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗂️  KEY FILES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 DOCUMENTATION:
  • Constitution: docs/CONSTITUTION.md
  • Specification: docs/SPECIFICATION.md
  • Technical Plan: docs/TECHNICAL_PLAN.md
  • Tasks: docs/TASKS.md

🧪 TESTING:
  • Postman Collection: tests/postman/${project_name}.collection.json
  • BDD Features: tests/features/*.feature
  • API Testing Guide: docs/API_TESTING_GUIDE.md

🎨 FRONTEND:
  • A2UI Spec: frontend/a2ui-spec.json
  • Implementation: frontend/src/
  • Stitch Prompt: docs/GOOGLE_STITCH_PROMPT.md

💾 CONTEXT PRESERVATION:
  • POML: PROJECT.poml
  • State: .devforge/state.json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 QUICK START
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣  BACKEND:
   cd ${projectPath}
   npm install
   npm run dev

2️⃣  FRONTEND:
   cd ${projectPath}\\frontend
   npm install
   npm run dev

3️⃣  API TESTING:
   # Import tests/postman/${project_name}.collection.json to Postman
   # OR run with Newman:
   npm run test:api

4️⃣  BDD TESTING:
   npm run test:bdd

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. Review generated specifications in docs/
  2. Start backend development
  3. Test APIs with Postman or Newman
  4. Run frontend and customize design
  5. Use "complete_task" to track progress
  6. Use "create_checkpoint" every 20-25 tasks

🎉 Your project is ready for development!`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("AppCreator MCP Server running on stdio");
    console.error("Ready for complete project workflow! 🚀");
  }
}

// Start the server
const server = new AppCreatorServer();
server.run().catch(console.error);
