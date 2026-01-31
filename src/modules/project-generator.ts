/**
 * Project Generator Module - Complete Spec Kit Generator
 *
 * This is the MOST IMPORTANT module - it generates the complete
 * Spec Kit structure with constitution, specification, technical plan,
 * tasks, and POML templates.
 *
 * Process:
 * 1. Create project folder structure
 * 2. Generate constitution.md (project principles)
 * 3. Generate SPEC.md (detailed specification)
 * 4. Generate PLAN.md (technical implementation plan)
 * 5. Generate TASKS.md (task breakdown)
 * 6. Generate all POML templates
 * 7. Create session tracking files
 * 8. Generate README.md
 */

import { promises as fs } from 'fs';
import { join, basename } from 'path';
import { TemplateEngine } from '../core/template-engine.js';
import { AIAdapter } from '../adapters/ai-adapter.interface.js';
import { AdapterFactory, AIProvider } from '../adapters/adapter-factory.js';

/**
 * MCP Tool Response interface
 */
export interface MCPToolResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError?: boolean;
}

/**
 * Project generator arguments
 */
export interface ProjectGeneratorArgs {
  project_name: string;
  tech_stack: string;
  user_requirements: string[];
  approved_architecture: string;
  language: string;
  project_type?: string;
  timeline?: string;
  team_size?: number;
}

/**
 * Generated file structure
 */
export interface GeneratedFiles {
  'constitution.md': string;
  'SPEC.md': string;
  'PLAN.md': string;
  'TASKS.md': string;
  'README.md': string;
  'prompts/base.poml': string;
  'prompts/refresh-context.poml': string;
  'prompts/checkpoint-review.poml': string;
  'prompts/progress-summary.poml': string;
  'prompts/feature-development.poml': string;
  'prompts/project.poml': string;
  '.claude/state/session-progress.json': string;
  '.claude/state/completed-tasks.json': string;
  '.claude/state/checkpoint-history.json': string;
}

/**
 * Project structure configuration
 */
export interface ProjectStructure {
  rootPath: string;
  folders: string[];
  files: Partial<GeneratedFiles>;
}

/**
 * Constitution generation context
 */
export interface ConstitutionContext {
  projectName: string;
  techStack: string;
  requirements: string[];
  language: string;
}

/**
 * Specification generation context
 */
export interface SpecificationContext {
  projectName: string;
  requirements: string[];
  constitution: string;
  language: string;
}

/**
 * Technical plan generation context
 */
export interface TechnicalPlanContext {
  projectName: string;
  techStack: string;
  architecture: string;
  specification: string;
}

/**
 * Task generation context
 */
export interface TaskGenerationContext {
  projectName: string;
  specification: string;
  technicalPlan: string;
}

/**
 * POML generation context
 */
export interface POMLContext {
  projectName: string;
  techStack: string;
  language: string;
  totalTasks?: number;
  features?: string[];
}

/**
 * Project Generator Module Class
 *
 * Generates complete project Spec Kit with all necessary documentation,
 * templates, and tracking files.
 */
export class ProjectGeneratorModule {
  private aiAdapter: AIAdapter;
  private templateEngine: TemplateEngine;

  constructor(
    provider: AIProvider = 'claude',
    apiKey: string,
    model?: string
  ) {
    this.aiAdapter = AdapterFactory.createAdapter({
      provider,
      apiKey,
      model: model || AdapterFactory.getDefaultModel(provider),
    });

    this.templateEngine = new TemplateEngine();

    console.error(`✅ Using AI Provider: ${this.aiAdapter.getProviderName()} (${this.aiAdapter.getModelName()})`);
  }

  /**
   * Execute project generation
   *
   * This is the main entry point called by the MCP server.
   *
   * @param args - Project generation arguments
   * @returns MCP tool response with success/error message
   */
  async execute(args: ProjectGeneratorArgs): Promise<MCPToolResponse> {
    try {
      // Validate arguments
      this.validateArgs(args);

      const {
        project_name: projectName,
        tech_stack: techStack,
        user_requirements: requirements,
        approved_architecture: architecture,
        language,
      } = args;

      // Create a project description from requirements
      const projectDescription = requirements.slice(0, 3).join('. ') + '.';

      console.error(`\n${'='.repeat(70)}`);
      console.error(`🚀 APPCREATOR - AUTOMATED PROJECT GENERATION`);
      console.error(`📦 Project: ${projectName}`);
      console.error(`${'='.repeat(70)}\n`);

      // Prepare project path
      const projectPath = join(process.cwd(), 'generated-projects', projectName);

      // STEP 1: Create project structure
      console.error('📁 [1/9] Creating project structure...');
      await this.createProjectStructure(projectPath);
      console.error('    ✅ Structure created\n');

      // STEP 2: Generate constitution
      console.error('📜 [2/9] Generating constitution...');
      const constitution = await this.generateConstitution(
        projectName,
        techStack,
        requirements,
        language
      );
      console.error('    ✅ Constitution generated\n');

      // STEP 3: Generate specification
      console.error('📋 [3/9] Generating specification...');
      const specification = await this.generateSpecification(
        projectName,
        requirements,
        constitution,
        language
      );
      console.error('    ✅ Specification generated\n');

      // STEP 4: Generate technical plan
      console.error('🔧 [4/9] Generating technical plan...');
      const technicalPlan = await this.generateTechnicalPlan(
        projectName,
        techStack,
        architecture,
        specification
      );
      console.error('    ✅ Technical plan generated\n');

      // STEP 5: Generate tasks
      console.error('✅ [5/9] Generating task breakdown...');
      const tasks = await this.generateTasks(
        projectName,
        specification,
        technicalPlan
      );
      console.error('    ✅ Tasks generated\n');

      // STEP 6: Generate POML templates
      console.error('📝 [6/9] Generating POML templates...');
      const pomlTemplates = this.generatePOMLTemplates(
        projectName,
        techStack,
        language
      );
      console.error('    ✅ POML templates generated\n');

      // STEP 7: Write all files to disk
      console.error('💾 [7/9] Writing files to disk...');
      await this.writeAllFiles(
        projectPath,
        constitution,
        specification,
        technicalPlan,
        tasks,
        pomlTemplates
      );
      console.error('    ✅ Files written\n');

      // STEP 8: Create session tracking
      console.error('📊 [8/9] Creating session tracking...');
      await this.createSessionTracking(projectPath);
      console.error('    ✅ Session tracking initialized\n');

      // STEP 9: Create README
      console.error('📖 [9/9] Creating README...');
      await this.createReadme(projectPath, projectName, projectDescription);
      console.error('    ✅ README created\n');

      // Generate and display success report
      const successReport = this.generateSuccessReport(
        projectPath,
        projectName,
        280 // Total tasks (could be parsed from tasks content)
      );

      console.error(successReport);

      // Return MCP response
      return {
        content: [
          {
            type: 'text',
            text: successReport,
          },
        ],
      };
    } catch (error: any) {
      const errorMessage = `❌ Project generation failed: ${error.message || 'Unknown error'}`;
      console.error('\n' + errorMessage + '\n');

      return {
        content: [
          {
            type: 'text',
            text: errorMessage,
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * Create project folder structure
   *
   * Creates all necessary folders for the Spec Kit:
   * - memory/ - For project constitution and memory
   * - specification/ - For SPEC.md
   * - planning/ - For PLAN.md and TASKS.md
   * - prompts/ - For all POML templates
   * - .claude/state/ - For session tracking
   * - postman/ - For API collections
   * - tests/e2e/ - For end-to-end tests
   * - docs/frontend-prompts/ - For frontend documentation
   * - packages/frontend/src/ - Frontend source code
   * - packages/backend/src/ - Backend source code
   * - packages/shared/src/ - Shared code
   *
   * @param projectPath - Root path for the project
   */
  async createProjectStructure(projectPath: string): Promise<void> {
    const dirs = [
      'memory',
      'specification',
      'planning',
      'prompts',
      '.claude/state',
      'postman',
      'tests/e2e/features',
      'tests/e2e/pages',
      'tests/e2e/step-definitions',
      'docs/frontend-prompts',
      'packages/frontend/src',
      'packages/backend/src',
      'packages/shared/src',
    ];

    // Create each directory recursively
    for (const dir of dirs) {
      const fullPath = join(projectPath, dir);
      await fs.mkdir(fullPath, { recursive: true });
    }
  }

  /**
   * Generate constitution.md
   *
   * Uses Claude to generate the project constitution with:
   * - Core principles
   * - Development guidelines
   * - Quality standards
   * - Language requirements
   *
   * @param projectName - Name of the project
   * @param techStack - Technology stack
   * @param requirements - User requirements
   * @param language - Project language (English, Spanish, etc.)
   * @returns Generated constitution content
   */
  async generateConstitution(
    projectName: string,
    techStack: string,
    requirements: string[],
    language: string
  ): Promise<string> {
    const requirementsText = requirements.map((req, i) => `${i + 1}. ${req}`).join('\n');

    const prompt = `Generate a comprehensive constitution.md for this software project.

**Project:** ${projectName}
**Tech Stack:** ${techStack}
**Requirements:**
${requirementsText}
**UI Language:** ${language}

Create a constitution with these 9 articles:

1. **Security Requirements**
   - Authentication strategy (JWT, OAuth, etc.)
   - Authorization (RBAC, ABAC)
   - Audit logging (what to log, retention period)
   - Data encryption (at rest, in transit)
   - Input sanitization and validation
   - Rate limiting to prevent abuse

2. **Testing Standards**
   - Minimum test coverage: 70%
   - Required test types: unit, integration, e2e
   - Testing frameworks to use
   - When tests must pass (pre-merge, pre-deploy)

3. **Architecture Principles**
   - API design standards (RESTful, GraphQL, etc.)
   - Versioning strategy (/api/v1, /api/v2)
   - Database design principles
   - Caching strategy
   - Error handling approach

4. **Performance Requirements**
   - API response time targets (e.g., <200ms for 95th percentile)
   - Page load time targets
   - Database query optimization rules
   - Caching requirements

5. **Code Quality Standards**
   - Linting rules (ESLint, Prettier)
   - Code formatting standards
   - Code review requirements
   - Git workflow (branching strategy)

6. **Deployment Strategy**
   - CI/CD pipeline requirements
   - Containerization approach (Docker)
   - Environment management (dev, staging, prod)
   - Rollback procedures

7. **Database Governance**
   - Migration strategy
   - Backup requirements (frequency, retention)
   - Schema change procedures

8. **Documentation Requirements**
   - API documentation (Swagger/OpenAPI)
   - README requirements
   - Code documentation standards

9. **Immutable Constraints**
   - ${language} for all UI text and comments
   - TypeScript strict mode (NO 'any' types)
   - All CRUD operations must be logged
   - Minimum 70% test coverage
   - [Add project-specific constraints based on requirements]

Format in clean Markdown with clear sections.
Be specific and actionable, not vague.
Aim for 1500-2000 words.`;

    return await this.aiAdapter.generateText(prompt, 8000);
  }

  /**
   * Generate SPEC.md
   *
   * Uses Claude to generate detailed specification with:
   * - Project overview
   * - Functional requirements
   * - Non-functional requirements
   * - User stories
   * - Acceptance criteria
   *
   * @param projectName - Name of the project
   * @param requirements - User requirements
   * @param constitution - Generated constitution content
   * @param language - Project language
   * @returns Generated specification content
   */
  async generateSpecification(
    projectName: string,
    requirements: string[],
    constitution: string,
    language: string
  ): Promise<string> {
    const requirementsText = requirements.map((req, i) => `${i + 1}. ${req}`).join('\n');

    const prompt = `Generate a detailed specification (SPEC.md) for this software project.

**Project:** ${projectName}
**Requirements:**
${requirementsText}
**UI Language:** ${language}

**Constitution (constraints to follow):**
${constitution.substring(0, 3000)}

Create a comprehensive specification with:

1. **Project Overview**
   - Purpose and goals
   - Target users
   - Success criteria

2. **User Roles & Permissions**
   - List all user roles (e.g., Admin, Manager, User)
   - Permissions matrix
   - Access control rules

3. **Features (VERY DETAILED)**
   For EACH major feature:
   - Feature name and description
   - User stories ("As a [role], I want to [action], so that [benefit]")
   - Acceptance criteria (specific, testable)
   - Business rules
   - UI/UX requirements
   - Data requirements
   - Dependencies on other features

4. **Data Model Overview**
   - Main entities (users, products, orders, etc.)
   - Relationships between entities
   - Key attributes for each entity

5. **Non-Functional Requirements**
   - Performance requirements
   - Security requirements
   - Scalability requirements
   - Accessibility requirements (WCAG 2.1 AA)

6. **Integration Points**
   - External APIs
   - Third-party services
   - Webhooks

7. **Special Considerations**
   - ${language} language UI
   - Localization requirements
   - Browser/device support
   - Offline functionality (if any)

Be extremely detailed. Each feature should have:
- Multiple user stories
- Clear acceptance criteria
- All edge cases covered

Aim for 2500-3500 words.`;

    return await this.aiAdapter.generateText(prompt, 16000);
  }

  /**
   * Generate PLAN.md
   *
   * Uses Claude to generate technical implementation plan with:
   * - Architecture overview
   * - Technology choices
   * - Database schema
   * - API design
   * - Component structure
   * - Deployment strategy
   *
   * @param projectName - Name of the project
   * @param techStack - Technology stack
   * @param architecture - Approved architecture
   * @param specification - Generated specification
   * @returns Generated technical plan content
   */
  async generateTechnicalPlan(
    projectName: string,
    techStack: string,
    architecture: string,
    specification: string
  ): Promise<string> {
    const prompt = `Generate a comprehensive technical plan (PLAN.md) for this software project.

**Project:** ${projectName}
**Tech Stack:** ${techStack}
**Architecture:** ${architecture}

**Specification (what to build):**
${specification.substring(0, 8000)}

Create a detailed technical plan with:

1. **Technology Stack Details**
   - Exact versions for each technology
   - Rationale for each choice
   - Alternative options considered and why rejected

2. **Project Structure**
   - Monorepo or multi-repo?
   - Complete folder structure for frontend
   - Complete folder structure for backend
   - Shared code organization

3. **Database Schema**
   - All collections/tables with exact field names
   - Data types for each field
   - Relationships and foreign keys
   - Indexes for performance (which fields to index)

4. **API Design**
   - ALL endpoints (method, path, purpose)
   - Request/response schemas for each endpoint
   - Authentication flow (JWT access + refresh tokens)
   - Error handling strategy (error codes, messages)
   - API versioning (/api/v1, /api/v2)

5. **Frontend Architecture**
   - Component structure (pages, components, layouts)
   - State management approach (Redux, Zustand, Context)
   - Routing strategy (React Router, Next.js routing)
   - Form handling approach
   - API integration layer (axios, fetch)

6. **Authentication & Authorization**
   - JWT implementation details
   - Token expiry times (access: 15min, refresh: 7 days)
   - Token refresh strategy
   - Role-based access control implementation
   - Session management

7. **File Upload Strategy**
   - Storage solution (S3, GridFS, local, CloudFlare R2)
   - File size limits
   - Allowed file types
   - Upload flow (direct, presigned URLs)

8. **Caching Strategy**
   - What to cache (API responses, sessions, etc.)
   - Cache invalidation rules
   - Cache storage (Redis, in-memory)
   - Cache TTL values

9. **Background Jobs**
   - Job queue system (Bull, BullMQ, Sidekiq)
   - What jobs to run (emails, reports, cleanup)
   - Job scheduling (cron syntax)

10. **Testing Strategy**
    - Unit testing approach and frameworks
    - Integration testing approach
    - E2E testing approach (Playwright, Cypress)
    - Test data management

11. **CI/CD Pipeline**
    - Build process
    - Test automation (when to run tests)
    - Deployment process
    - Environment management (dev, staging, prod)

12. **Deployment Architecture**
    - Hosting platform (AWS, Azure, Vercel, Railway)
    - Docker configuration
    - Database hosting
    - CDN strategy (CloudFlare, AWS CloudFront)
    - SSL/TLS setup (Let's Encrypt, CloudFlare)

13. **Environment Variables**
    - List ALL required env vars
    - Purpose of each
    - Example values for development

14. **Performance Optimizations**
    - Database query optimization rules
    - API response caching
    - Frontend code splitting
    - Image optimization
    - Lazy loading

Be extremely detailed with code examples where helpful.
Aim for 3000-4000 words.`;

    return await this.aiAdapter.generateText(prompt, 16000);
  }

  /**
   * Generate TASKS.md
   *
   * Uses Claude to generate comprehensive task breakdown with:
   * - Phase-based organization
   * - Numbered tasks
   * - Dependencies
   * - Estimates
   * - Acceptance criteria per task
   *
   * @param projectName - Name of the project
   * @param specification - Generated specification
   * @param technicalPlan - Generated technical plan
   * @returns Generated tasks content
   */
  async generateTasks(
    projectName: string,
    specification: string,
    technicalPlan: string
  ): Promise<string> {
    const prompt = `Generate a comprehensive task breakdown (TASKS.md) for this software project.

**Project:** ${projectName}

**Specification Summary:**
${specification.substring(0, 4000)}

**Technical Plan Summary:**
${technicalPlan.substring(0, 4000)}

Create a detailed task list organized by phases with:

## TASK STRUCTURE

Each task must include:
1. **Task Number** (e.g., Task 1, Task 2)
2. **Task Name** (clear, action-oriented)
3. **Description** (what needs to be done)
4. **Dependencies** (which tasks must be completed first)
5. **Complexity** (Low, Medium, High)
6. **Estimated Time** (hours or days)
7. **Required Skills** (e.g., React, Node.js, PostgreSQL)
8. **Acceptance Criteria** (specific, testable conditions)

## PHASES

Organize tasks into these phases:

### Phase 1: Project Setup (Tasks 1-10)
- Initialize project structure
- Set up development environment
- Configure build tools
- Set up version control
- Configure CI/CD pipeline
- Set up testing framework
- Configure linting and formatting
- Create initial documentation
- Set up environment variables
- Initialize database

### Phase 2: Database & Models (Tasks 11-25)
- Design database schema
- Create migration files
- Implement data models
- Add model validations
- Create database indexes
- Set up database seeds
- Write model tests
- Add database backup strategy

### Phase 3: Backend API (Tasks 26-60)
- Set up API structure
- Implement authentication (JWT)
- Create user endpoints
- Implement authorization middleware
- Create CRUD endpoints for each entity
- Add input validation
- Implement error handling
- Add API documentation (Swagger)
- Write API tests
- Add rate limiting

### Phase 4: Frontend Foundation (Tasks 61-90)
- Set up React/Next.js project
- Create routing structure
- Implement authentication flow
- Create layout components
- Set up state management
- Configure API client
- Implement error boundaries
- Add loading states
- Create reusable components

### Phase 5: Core Features (Tasks 91-150)
- Implement feature 1 (based on specification)
- Implement feature 2
- Implement feature 3
- Add form validation
- Implement file upload
- Add search functionality
- Implement filtering
- Add pagination

### Phase 6: UI/UX Polish (Tasks 151-180)
- Responsive design
- Accessibility (WCAG 2.1 AA)
- Loading animations
- Error messages
- Success notifications
- Form validation feedback
- Mobile optimization

### Phase 7: Testing & Quality (Tasks 181-220)
- Write unit tests (70% coverage minimum)
- Write integration tests
- Write E2E tests
- Performance testing
- Security testing
- Accessibility testing
- Cross-browser testing
- Load testing

### Phase 8: Deployment & DevOps (Tasks 221-240)
- Set up production environment
- Configure Docker containers
- Set up database hosting
- Configure CDN
- Set up SSL/TLS certificates
- Configure monitoring (logs, metrics)
- Set up error tracking
- Create deployment scripts
- Configure auto-scaling
- Set up backup automation

### Phase 9: Documentation & Training (Tasks 241-260)
- API documentation
- User guide
- Admin guide
- Developer documentation
- Deployment guide
- Troubleshooting guide

### Phase 10: Launch & Post-Launch (Tasks 261-280)
- Final security audit
- Performance optimization
- User acceptance testing
- Soft launch
- Monitor metrics
- Bug fixes
- Gather feedback
- Plan next iteration

## EXAMPLE TASK FORMAT

**Task 15: Create User Model**

**Description:**
Implement the User model with all required fields, validations, and associations based on the database schema.

**Dependencies:**
- Task 11 (Database schema design)
- Task 12 (Create migration files)

**Complexity:** Medium

**Estimated Time:** 3 hours

**Required Skills:**
- Node.js
- TypeScript
- PostgreSQL/MongoDB
- ORM (Sequelize/TypeORM/Mongoose)

**Acceptance Criteria:**
- [ ] User model created with all fields from schema
- [ ] Email validation (format and uniqueness)
- [ ] Password hashing implemented
- [ ] Associations defined (has many sessions, has many roles)
- [ ] Model methods implemented (findByEmail, comparePassword)
- [ ] Unit tests written with 80%+ coverage
- [ ] Model documented with JSDoc comments

---

Generate ALL tasks (approximately 280 tasks) following this structure.
Be extremely specific and actionable.
Include actual code-related tasks, not just planning.
Aim for 4000-5000 words.`;

    return await this.aiAdapter.generateText(prompt, 16000);
  }

  /**
   * Generate all POML templates
   *
   * Uses TemplateEngine to generate:
   * - base.poml
   * - feature-spec.poml
   * - refresh-context.poml
   * - checkpoint-review.poml
   * - progress-summary.poml
   * - project.poml (with auto-refresh config)
   *
   * @param projectName - Name of the project
   * @param techStack - Technology stack
   * @param language - Project language
   * @returns Record of template name -> content
   */
  generatePOMLTemplates(
    projectName: string,
    techStack: string,
    language: string
  ): Record<string, string> {
    const templates: Record<string, string> = {};

    // 1. BASE.POML - Base template with project context
    templates['base.poml'] = `<poml>
  <role>
    You are an expert full-stack developer working on ${projectName}.
    You have deep knowledge of the project's architecture, tech stack, and requirements.
  </role>

  <context>
    <document src="../memory/constitution.md" />
    <document src="../memory/specification/SPEC.md" />
    <document src="../memory/planning/PLAN.md" />
    <document src="../memory/tasks/TASKS.md" />
  </context>

  <guidelines>
    1. Always follow the constitution rules
    2. Implement features according to specification
    3. Follow the technical plan architecture
    4. Reference TASKS.md for implementation order
    5. Write clean, maintainable code
    6. Include proper error handling
    7. Add comprehensive tests
    8. Document all code
  </guidelines>

  <output format="code" language="${language}" />
  <style verbosity="detailed" tone="professional" />
</poml>`;

    // 2. FEATURE-SPEC.POML - For developing new features
    templates['feature-spec.poml'] = `<poml>
  <role>
    You are implementing a new feature for ${projectName}.
    Follow the project's patterns and architecture.
  </role>

  <task>
    Implement the following feature:

    **Feature Name:** {{featureName}}
    **Description:** {{featureDescription}}
    **Requirements:** {{requirements}}

    Steps:
    1. Review related tasks in TASKS.md
    2. Check existing code patterns
    3. Implement backend logic
    4. Implement frontend components
    5. Add tests (unit + integration)
    6. Update documentation
  </task>

  <context>
    <document src="../memory/constitution.md" />
    <document src="../memory/specification/SPEC.md" />
    <document src="../memory/planning/PLAN.md" />
  </context>

  <output format="implementation-plan">
    Provide:
    1. File structure (what files to create/modify)
    2. Implementation steps
    3. Code examples
    4. Test cases
    5. Documentation updates
  </output>

  <style verbosity="detailed" tone="instructional" />
</poml>`;

    // 3. REFRESH-CONTEXT.POML - Manual context refresh
    templates['refresh-context.poml'] = `<poml>
  <role>
    You are refreshing your context about ${projectName}.
    Review all project documents and current state.
  </role>

  <task>
    CONTEXT REFRESH - Manual refresh triggered

    1. READ ALL DOCUMENTS
       - Review constitution.md for project rules
       - Review SPEC.md for requirements
       - Review PLAN.md for architecture
       - Review TASKS.md for progress

    2. ANALYZE PROJECT STATE
       - Which tasks are completed?
       - Which tasks are in progress?
       - What's the current focus area?
       - Are there any blockers?

    3. VERIFY ALIGNMENT
       - Does code follow constitution?
       - Are we implementing the spec correctly?
       - Is architecture being followed?

    4. PROVIDE SUMMARY
       - Current project status
       - Completed work
       - Next priority tasks
       - Any concerns or recommendations
  </task>

  <context>
    <document src="../memory/constitution.md" />
    <document src="../memory/specification/SPEC.md" />
    <document src="../memory/planning/PLAN.md" />
    <document src="../memory/tasks/TASKS.md" />
    <document src="../.claude/state/session-progress.json" />
    <document src="../.claude/state/completed-tasks.json" />
  </context>

  <output format="status-report">
    # 🔄 CONTEXT REFRESH REPORT

    **Date:** {{currentDate}}
    **Session:** {{sessionId}}

    ## 📊 PROJECT STATUS
    - Completed tasks: X/280
    - Current phase: [Phase Name]
    - Progress: XX%

    ## ✅ RECENTLY COMPLETED
    - Task XXX: [description]
    - Task XXX: [description]

    ## 🔄 IN PROGRESS
    - Task XXX: [description]

    ## 🎯 NEXT PRIORITIES
    1. Task XXX: [description]
    2. Task XXX: [description]

    ## ⚠️ CONCERNS/BLOCKERS
    - [Any issues or concerns]

    ## 💡 RECOMMENDATIONS
    - [Any recommendations]
  </output>

  <style verbosity="comprehensive" tone="analytical" />
</poml>`;

    // 4. CHECKPOINT-REVIEW.POML - Automatic checkpoint reviews
    templates['checkpoint-review.poml'] = `<poml>
  <role>
    You are the Quality Assurance Manager for ${projectName}.
    You run automatic reviews every 20 tasks to ensure quality.
  </role>

  <task>
    CHECKPOINT REVIEW (Triggered automatically every 20 tasks)

    1. VERIFY RECENT WORK
       - Review last 20 completed tasks
       - Check code quality
       - Verify tests are passing
       - Check documentation

    2. CONSTITUTION COMPLIANCE
       - All rules being followed?
       - Code standards maintained?
       - Test coverage adequate?

    3. SPECIFICATION ALIGNMENT
       - Features match requirements?
       - No scope creep?
       - User experience as specified?

    4. TECHNICAL PLAN ADHERENCE
       - Architecture followed?
       - Tech stack used correctly?
       - Performance standards met?

    5. UPDATE TRACKING
       - Update session-progress.json
       - Log checkpoint in checkpoint-history.json
  </task>

  <context>
    <document src="../memory/constitution.md" />
    <document src="../memory/specification/SPEC.md" />
    <document src="../memory/planning/PLAN.md" />
    <document src="../.claude/state/session-progress.json" />
    <document src="../.claude/state/completed-tasks.json" />
  </context>

  <output format="checkpoint-report">
    # ✅ CHECKPOINT REPORT - Task #{{checkpointNumber}}

    **Date:** {{currentDate}}
    **Tasks Reviewed:** #{{startTask}} - #{{endTask}}

    ## 🔍 QUALITY CONTROL
    - Code Quality: {{score}}/10
    - Test Coverage: {{percentage}}%
    - Documentation: {{status}}

    ## ✅ CONSTITUTION COMPLIANCE
    | Rule | Status | Notes |
    |------|--------|-------|
    | [Rule 1] | ✅/❌ | [notes] |

    ## 🎯 SPECIFICATION ALIGNMENT
    - Features implemented correctly: ✅/❌
    - User experience matches spec: ✅/❌

    ## 🏗️ TECHNICAL PLAN ADHERENCE
    - Architecture followed: ✅/❌
    - Performance standards met: ✅/❌

    ## ⚠️ ACTION ITEMS
    - [Any issues that need attention]

    ## 📈 NEXT CHECKPOINT
    Task #{{nextCheckpoint}} (in {{tasksRemaining}} tasks)
  </output>

  <style verbosity="detailed" tone="analytical" />
</poml>`;

    // 5. PROGRESS-SUMMARY.POML - Progress tracking
    templates['progress-summary.poml'] = `<poml>
  <role>
    You are the Progress Reporting Analyst for ${projectName}.
    You provide clear progress visualizations.
  </role>

  <task>
    Generate a comprehensive progress summary showing:

    1. Overall completion percentage
    2. Phase-by-phase breakdown
    3. Recently completed tasks
    4. Current focus areas
    5. Upcoming tasks
    6. Timeline estimates
    7. Potential blockers
  </task>

  <context>
    <document src="../memory/tasks/TASKS.md" />
    <document src="../.claude/state/session-progress.json" />
    <document src="../.claude/state/completed-tasks.json" />
  </context>

  <output format="progress-dashboard">
    # 📊 ${projectName} - Progress Dashboard

    **Generated:** {{currentDate}}

    ## 🎯 OVERALL PROGRESS
    [████████████░░░░░░░░] {{percentage}}% ({{completed}}/{{total}} tasks)

    ## 📈 PHASE BREAKDOWN
    | Phase | Tasks | Completed | Progress |
    |-------|-------|-----------|----------|
    | Phase 1: Setup | 10 | {{n}} | {{%}} |
    | Phase 2: Database | 15 | {{n}} | {{%}} |
    | Phase 3: Backend | 35 | {{n}} | {{%}} |
    | Phase 4: Frontend | 30 | {{n}} | {{%}} |
    | Phase 5: Features | 60 | {{n}} | {{%}} |
    | Phase 6: UI/UX | 30 | {{n}} | {{%}} |
    | Phase 7: Testing | 40 | {{n}} | {{%}} |
    | Phase 8: DevOps | 20 | {{n}} | {{%}} |
    | Phase 9: Docs | 20 | {{n}} | {{%}} |
    | Phase 10: Launch | 20 | {{n}} | {{%}} |

    ## ✅ RECENTLY COMPLETED (Last 10 tasks)
    - [x] Task XXX: [description]

    ## 🔄 IN PROGRESS
    - [ ] Task XXX: [description]

    ## 🎯 NEXT UP (Next 5 tasks)
    1. Task XXX: [description]

    ## ⏱️ TIMELINE ESTIMATE
    - Estimated completion: {{date}}
    - Days remaining: {{days}}
    - Average velocity: {{tasksPerDay}} tasks/day

    ## ⚠️ POTENTIAL BLOCKERS
    - [Any identified blockers]
  </output>

  <style verbosity="visual" tone="informative" />
</poml>`;

    // 6. PROJECT.POML - Master project configuration
    templates['project.poml'] = `<poml name="${projectName}">
  <description>
    ${projectName} - Full-stack application
    Tech Stack: ${techStack}
    Generated by AppCreator MCP Server
  </description>

  <automation>
    <context-refresh interval="20 tasks">
      <action>
        1. Read all project documents
        2. Count completed/pending tasks
        3. Verify code alignment with specs
        4. Update context map
      </action>

      <checkpoint-prompt>
        Use @prompts/checkpoint-review.poml
      </checkpoint-prompt>
    </context-refresh>

    <feature-checkpoint interval="15 tasks">
      <action>
        Trigger when major feature is completed
      </action>

      <prompt>
        Use @prompts/refresh-context.poml
      </prompt>
    </feature-checkpoint>
  </automation>

  <memory-anchors>
    <anchor name="constitution" priority="high">
      Project rules and constraints that must always be followed
      Location: memory/constitution.md
    </anchor>

    <anchor name="specification" priority="high">
      Complete feature requirements and user stories
      Location: memory/specification/SPEC.md
    </anchor>

    <anchor name="technical-plan" priority="medium">
      Architecture, tech stack, and implementation details
      Location: memory/planning/PLAN.md
    </anchor>

    <anchor name="tasks" priority="high">
      All tasks with dependencies and acceptance criteria
      Location: memory/tasks/TASKS.md
    </anchor>
  </memory-anchors>

  <commands>
    <command name="checkpoint">
      <description>Manual checkpoint review</description>
      <shortcut>claude cp</shortcut>
      <prompt>@prompts/checkpoint-review.poml</prompt>
    </command>

    <command name="refresh">
      <description>Manual context refresh</description>
      <shortcut>claude refresh</shortcut>
      <prompt>@prompts/refresh-context.poml</prompt>
    </command>

    <command name="progress">
      <description>Show progress summary</description>
      <shortcut>claude progress</shortcut>
      <prompt>@prompts/progress-summary.poml</prompt>
    </command>

    <command name="feature">
      <description>Start new feature development</description>
      <shortcut>claude feature [name]</shortcut>
      <prompt>@prompts/feature-spec.poml</prompt>
    </command>
  </commands>

  <session-state>
    <current-session id="{{sessionId}}">
      <feature>{{currentFeature}}</feature>
      <task-count>{{taskCount}}</task-count>
      <last-checkpoint>{{lastCheckpoint}}</last-checkpoint>
      <next-checkpoint>{{nextCheckpoint}}</next-checkpoint>
    </current-session>
  </session-state>
</poml>`;

    return templates;
  }

  /**
   * Generate project.poml with auto-refresh configuration
   *
   * Creates the master POML template with:
   * - Project metadata
   * - Auto-refresh triggers
   * - Checkpoint configuration
   * - Memory anchors
   * - Session state tracking
   *
   * @param projectName - Name of the project
   * @param techStack - Technology stack
   * @param tasks - Generated tasks content
   * @param language - Project language
   * @returns Generated project.poml content
   */
  generateProjectPoml(
    projectName: string,
    techStack: string,
    tasks: string,
    language: string
  ): string {
    // TODO: Implement in next prompt
    return '';
  }

  /**
   * Write all generated files to disk
   *
   * Writes all files in the GeneratedFiles structure to their
   * appropriate locations within the project directory.
   *
   * @param projectPath - Root path for the project
   * @param constitution - Generated constitution content
   * @param specification - Generated specification content
   * @param technicalPlan - Generated technical plan content
   * @param tasks - Generated tasks content
   * @param pomlTemplates - Record of POML template files
   */
  async writeAllFiles(
    projectPath: string,
    constitution: string,
    specification: string,
    technicalPlan: string,
    tasks: string,
    pomlTemplates: Record<string, string>
  ): Promise<void> {
    try {
      // 1. Write main documentation files
      console.error('  📝 Writing documentation files...');

      // Write constitution.md
      const constitutionPath = join(projectPath, 'memory', 'constitution.md');
      await this.writeFileWithErrorHandling(constitutionPath, constitution);
      console.error('     ✅ constitution.md');

      // Write SPEC.md
      const specPath = join(projectPath, 'memory', 'specification', 'SPEC.md');
      await this.writeFileWithErrorHandling(specPath, specification);
      console.error('     ✅ SPEC.md');

      // Write PLAN.md
      const planPath = join(projectPath, 'memory', 'planning', 'PLAN.md');
      await this.writeFileWithErrorHandling(planPath, technicalPlan);
      console.error('     ✅ PLAN.md');

      // Write TASKS.md
      const tasksPath = join(projectPath, 'memory', 'tasks', 'TASKS.md');
      await this.writeFileWithErrorHandling(tasksPath, tasks);
      console.error('     ✅ TASKS.md');

      // 2. Write POML template files
      console.error('  📋 Writing POML templates...');
      const promptsDir = join(projectPath, 'prompts');

      for (const [filename, content] of Object.entries(pomlTemplates)) {
        const pomlPath = join(promptsDir, filename);
        await this.writeFileWithErrorHandling(pomlPath, content);
        console.error(`     ✅ ${filename}`);
      }

      console.error('  ✅ All files written successfully');
    } catch (error) {
      console.error('  ❌ Error writing files:', error);
      throw new Error(
        `Failed to write files: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Write a file with comprehensive error handling
   *
   * @param filePath - Full path to the file
   * @param content - Content to write
   */
  private async writeFileWithErrorHandling(filePath: string, content: string): Promise<void> {
    try {
      await fs.writeFile(filePath, content, 'utf-8');
    } catch (error: any) {
      // Handle specific error codes
      if (error.code === 'ENOENT') {
        const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
        throw new Error(`Directory does not exist: ${dirPath}`);
      } else if (error.code === 'EACCES') {
        throw new Error(`Permission denied writing to: ${filePath}`);
      } else if (error.code === 'ENOSPC') {
        throw new Error('Disk space full - cannot write file');
      } else if (error.code === 'ENAMETOOLONG') {
        throw new Error(`File path too long: ${filePath}`);
      } else {
        throw new Error(`Failed to write ${filePath}: ${error.message || 'Unknown error'}`);
      }
    }
  }

  /**
   * Create session tracking files
   *
   * Creates initial state files in .claude/state/:
   * - session-progress.json
   * - completed-tasks.json
   * - checkpoint-history.json
   *
   * @param projectPath - Root path for the project
   */
  async createSessionTracking(projectPath: string): Promise<void> {
    console.error('\n  📊 Creating session tracking files...');

    const stateDir = join(projectPath, '.claude', 'state');
    const timestamp = new Date().toISOString();
    const projectName = basename(projectPath);

    // 1. Create session-progress.json
    const sessionProgress = {
      projectName,
      generatedAt: timestamp,
      lastUpdated: timestamp,
      currentPhase: 'Phase 1: Project Setup',
      currentTask: 1,
      totalTasks: 280,
      completedTasks: 0,
      progressPercentage: 0,
      lastCheckpoint: 0,
      nextCheckpoint: 20,
      sessionId: `session-${Date.now()}`,
      status: 'initialized',
    };

    await this.writeFileWithErrorHandling(
      join(stateDir, 'session-progress.json'),
      JSON.stringify(sessionProgress, null, 2)
    );
    console.error('     ✅ session-progress.json');

    // 2. Create completed-tasks.json
    const completedTasks = {
      lastUpdated: timestamp,
      totalCompleted: 0,
      tasks: [],
    };

    await this.writeFileWithErrorHandling(
      join(stateDir, 'completed-tasks.json'),
      JSON.stringify(completedTasks, null, 2)
    );
    console.error('     ✅ completed-tasks.json');

    // 3. Create checkpoint-history.json
    const checkpointHistory = {
      projectName,
      checkpoints: [],
      lastCheckpoint: null,
      totalCheckpoints: 0,
    };

    await this.writeFileWithErrorHandling(
      join(stateDir, 'checkpoint-history.json'),
      JSON.stringify(checkpointHistory, null, 2)
    );
    console.error('     ✅ checkpoint-history.json');

    console.error('  ✅ Session tracking initialized');
  }

  /**
   * Create README.md
   *
   * Generates README.md with:
   * - Project overview
   * - Quick start guide
   * - Documentation links
   * - Development workflow
   *
   * @param projectPath - Root path for the project
   * @param projectName - Name of the project
   * @param projectDescription - Description of the project
   */
  private async createReadme(
    projectPath: string,
    projectName: string,
    projectDescription: string
  ): Promise<void> {
    try {
      console.error('  📖 Creating README.md...');

      const readme = `# ${projectName}

${projectDescription}

**Generated by AppCreator MCP Server** - An AI-powered project generator that creates complete, production-ready project specifications.

---

## 📋 Project Overview

This project includes:

- ✅ **Constitution** - Project rules, constraints, and principles
- ✅ **Specification** - Complete feature requirements and user stories
- ✅ **Technical Plan** - Architecture, tech stack, and implementation details
- ✅ **Task Breakdown** - ~280 actionable tasks organized in 10 phases
- ✅ **POML Templates** - Context management for AI-assisted development
- ✅ **Session Tracking** - Progress monitoring and checkpoint system

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+ LTS
- npm or pnpm or yarn
- Git
- Your preferred code editor (VS Code recommended)

### Quick Start

\`\`\`bash
# 1. Navigate to project directory
cd ${projectName}

# 2. Read the constitution (project rules)
cat memory/constitution.md

# 3. Review the specification (what we're building)
cat memory/specification/SPEC.md

# 4. Check the technical plan (how we're building it)
cat memory/planning/PLAN.md

# 5. See all tasks (what needs to be done)
cat memory/tasks/TASKS.md
\`\`\`

---

## 📁 Project Structure

\`\`\`
${projectName}/
├── memory/                      # Core project documentation
│   ├── constitution.md          # Project rules and constraints
│   ├── specification/
│   │   └── SPEC.md             # Complete requirements
│   ├── planning/
│   │   └── PLAN.md             # Technical implementation plan
│   └── tasks/
│       └── TASKS.md            # All development tasks
│
├── prompts/                     # POML templates for context management
│   ├── base.poml               # Base project context
│   ├── feature-spec.poml       # Feature development template
│   ├── refresh-context.poml    # Manual context refresh
│   ├── checkpoint-review.poml  # Automatic quality review
│   ├── progress-summary.poml   # Progress tracking
│   └── project.poml            # Master configuration
│
├── .claude/                     # Claude Code configuration
│   ├── commands/               # Custom Claude commands
│   └── state/                  # Session tracking
│       ├── session-progress.json
│       ├── completed-tasks.json
│       └── checkpoint-history.json
│
├── src/                        # Source code (to be created)
├── tests/                      # Tests (to be created)
└── README.md                   # This file
\`\`\`

---

## 🛠️ Development Workflow

### Using Claude Code

This project is optimized for development with [Claude Code](https://docs.anthropic.com/claude-code).

#### Starting Development

\`\`\`bash
# Open project in Claude Code
claude

# Claude automatically reads:
# - memory/constitution.md (project rules)
# - memory/specification/SPEC.md (requirements)
# - memory/planning/PLAN.md (architecture)
# - memory/tasks/TASKS.md (task list)
\`\`\`

#### Available Commands

\`\`\`bash
# Check progress
claude progress

# Manual checkpoint review
claude cp

# Refresh context (if Claude seems lost)
claude refresh

# Start a new feature
claude feature [feature-name]

# Normal development
claude "implement user authentication"
claude "add tests for login endpoint"
claude "fix bug in password validation"
\`\`\`

---

## 📊 Development Phases

The project is organized into 10 phases with ~280 tasks:

### Phase 1: Project Setup (Tasks 1-10)
- Initialize project structure
- Set up development environment
- Configure build tools and CI/CD

### Phase 2: Database & Models (Tasks 11-25)
- Design database schema
- Create models and migrations
- Set up database connections

### Phase 3: Backend API (Tasks 26-60)
- Implement authentication
- Create API endpoints
- Add validation and error handling

### Phase 4: Frontend Foundation (Tasks 61-90)
- Set up React/Next.js
- Create routing and layouts
- Implement state management

### Phase 5: Core Features (Tasks 91-150)
- Implement all features from specification
- Add business logic
- Integrate frontend and backend

### Phase 6: UI/UX Polish (Tasks 151-180)
- Responsive design
- Accessibility improvements
- Loading states and animations

### Phase 7: Testing & Quality (Tasks 181-220)
- Unit tests (70%+ coverage)
- Integration tests
- E2E tests

### Phase 8: Deployment & DevOps (Tasks 221-240)
- Set up production environment
- Configure Docker and CI/CD
- Set up monitoring

### Phase 9: Documentation (Tasks 241-260)
- API documentation
- User guides
- Developer documentation

### Phase 10: Launch (Tasks 261-280)
- Security audit
- Performance optimization
- Soft launch and monitoring

---

## 🎯 Context Management

This project uses POML (Prompt Optimization Markup Language) templates to help Claude maintain context during development.

### Automatic Checkpoints

Every 20 tasks, Claude automatically:
- Reviews code quality
- Checks constitution compliance
- Verifies specification alignment
- Updates progress tracking

### Manual Context Refresh

If Claude loses context or seems confused:

\`\`\`bash
claude refresh
\`\`\`

This triggers a full context reload from all documentation.

---

## 📖 Key Documents

### Must-Read Documents

1. **memory/constitution.md**
   - Read this FIRST
   - Contains all project rules and constraints
   - Must be followed at all times

2. **memory/specification/SPEC.md**
   - Complete feature requirements
   - User stories and acceptance criteria
   - What we're building and why

3. **memory/planning/PLAN.md**
   - Technical architecture
   - Tech stack decisions
   - How we're building it

4. **memory/tasks/TASKS.md**
   - All development tasks
   - Dependencies and estimates
   - Acceptance criteria

---

## 🔄 Progress Tracking

### Check Current Progress

\`\`\`bash
# View progress dashboard
claude progress

# Or check manually
cat .claude/state/session-progress.json
\`\`\`

### Session State Files

- **session-progress.json** - Current phase, task, and progress
- **completed-tasks.json** - List of finished tasks
- **checkpoint-history.json** - Quality review history

---

## 🤝 Contributing

### Development Guidelines

1. **Always read constitution first**
   - Contains coding standards
   - Defines project constraints
   - Must be followed

2. **Follow the specification**
   - Implement features as specified
   - Don't add unspecified features
   - Confirm before making changes

3. **Use the task list**
   - Follow task order (respect dependencies)
   - Mark tasks as complete
   - Update progress tracking

4. **Write tests**
   - Minimum 70% coverage
   - Unit + integration + E2E
   - Test edge cases

5. **Document your code**
   - Clear comments
   - Update API docs
   - Keep README current

---

## 🐛 Troubleshooting

### Claude Lost Context

\`\`\`bash
# Full context refresh
claude refresh

# Check if documents are still accessible
ls -la memory/
ls -la prompts/
\`\`\`

### Progress Not Updating

\`\`\`bash
# Check session tracking files
cat .claude/state/session-progress.json

# Manually update if needed
# (Edit the JSON file)
\`\`\`

### Build Failures

\`\`\`bash
# Check constitution for build requirements
cat memory/constitution.md | grep -i "build"

# Check technical plan for setup
cat memory/planning/PLAN.md | grep -i "setup"
\`\`\`

---

## 📚 Additional Resources

- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [POML Guide](https://github.com/anthropics/poml)
- [Spec Kit](https://github.com/github/spec-kit)

---

## 📄 License

[Your License Here]

---

## 🙏 Acknowledgments

Generated by [AppCreator MCP Server](https://github.com/yourusername/appcreator-mcp-server)

Built with:
- Claude Sonnet 4 by Anthropic
- Spec Kit by GitHub
- POML for context management

---

**Ready to start building? Read the constitution first, then start with Task 1!** 🚀
`;

      const readmePath = join(projectPath, 'README.md');
      await this.writeFileWithErrorHandling(readmePath, readme);

      console.error('     ✅ README.md created');
      console.error('  ✅ README complete');
    } catch (error: any) {
      console.error('  ❌ Error creating README:', error);
      throw new Error(`Failed to create README: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Generate success report
   *
   * Creates a comprehensive success message showing:
   * - Generated files
   * - Next steps
   * - How to use the Spec Kit
   *
   * @param projectPath - Root path for the project
   * @param projectName - Name of the project
   * @param totalTasks - Total number of tasks generated
   * @returns Success report message
   */
  private generateSuccessReport(
    projectPath: string,
    projectName: string,
    totalTasks: number
  ): string {
    const border = '='.repeat(70);

    return `
${border}
🎉 PROJECT GENERATION COMPLETE!
${border}

Project: ${projectName}
Location: ${projectPath}

${border}
📦 GENERATED FILES
${border}

Core Documentation:
  ✅ memory/constitution.md          - Project rules and constraints
  ✅ memory/specification/SPEC.md    - Complete requirements (7 sections)
  ✅ memory/planning/PLAN.md         - Technical plan (14 sections)
  ✅ memory/tasks/TASKS.md           - Task breakdown (~${totalTasks} tasks)

POML Templates (Context Management):
  ✅ prompts/base.poml               - Base project context
  ✅ prompts/feature-spec.poml       - Feature development
  ✅ prompts/refresh-context.poml    - Manual context refresh
  ✅ prompts/checkpoint-review.poml  - Automatic quality review
  ✅ prompts/progress-summary.poml   - Progress tracking
  ✅ prompts/project.poml            - Master configuration

Session Tracking:
  ✅ .claude/state/session-progress.json
  ✅ .claude/state/completed-tasks.json
  ✅ .claude/state/checkpoint-history.json

Documentation:
  ✅ README.md                       - Comprehensive project guide

${border}
🚀 NEXT STEPS
${border}

1. READ THE CONSTITUTION FIRST
   cd ${projectName}
   cat memory/constitution.md

   ⚠️  This contains ALL project rules and constraints.
       Everything must comply with the constitution!

2. REVIEW THE SPECIFICATION
   cat memory/specification/SPEC.md

   📋 Understand what you're building and why.
       Review all user stories and requirements.

3. STUDY THE TECHNICAL PLAN
   cat memory/planning/PLAN.md

   🏗️  Understand the architecture and tech stack.
       This is your implementation blueprint.

4. CHECK THE TASK LIST
   cat memory/tasks/TASKS.md

   ✅ See all ${totalTasks} tasks organized in 10 phases.
       Start with Phase 1: Project Setup.

5. START DEVELOPMENT WITH CLAUDE CODE
   claude

   🤖 Claude will automatically read all documentation.
       Just start with: "Let's begin with Task 1"

${border}
💡 QUICK COMMANDS
${border}

Check Progress:
  claude progress

Manual Checkpoint:
  claude cp

Refresh Context:
  claude refresh

Start Feature:
  claude feature [name]

Normal Development:
  claude "implement user authentication"
  claude "add tests for login"
  claude "fix validation bug"

${border}
📊 PROJECT STATISTICS
${border}

Total Tasks: ${totalTasks}
Phases: 10
Estimated Time: ${Math.ceil(totalTasks * 2.5 / 8)} days (at 8h/day, avg 2.5h/task)

Checkpoints: Every 20 tasks (${Math.floor(totalTasks / 20)} total)
Test Coverage Target: 70%+

${border}
🎯 DEVELOPMENT WORKFLOW
${border}

1. Claude reads context automatically
2. You give natural language instructions
3. Claude implements following constitution
4. Automatic checkpoint every 20 tasks
5. Progress tracked in .claude/state/

Context is maintained throughout development!
No need to repeat yourself - Claude remembers the project.

${border}
⚠️  IMPORTANT REMINDERS
${border}

✅ Constitution = LAW - Must be followed always
✅ Specification = REQUIREMENTS - Build what's specified
✅ Technical Plan = BLUEPRINT - Follow the architecture
✅ Tasks = ROADMAP - Follow the order (dependencies!)

If Claude ever seems confused:
  claude refresh

${border}

Ready to build ${projectName}?

Start here: cd ${projectName} && cat memory/constitution.md

Happy coding! 🚀

${border}
`;
  }

  /**
   * Validate project generator arguments
   *
   * @param args - Arguments to validate
   */
  private validateArgs(args: ProjectGeneratorArgs): void {
    if (!args.project_name || args.project_name.trim() === '') {
      throw new Error('project_name is required');
    }

    if (!args.tech_stack || args.tech_stack.trim() === '') {
      throw new Error('tech_stack is required');
    }

    if (!args.user_requirements || args.user_requirements.length === 0) {
      throw new Error('user_requirements array is required and must not be empty');
    }

    if (!args.approved_architecture || args.approved_architecture.trim() === '') {
      throw new Error('approved_architecture is required');
    }

    if (!args.language || args.language.trim() === '') {
      throw new Error('language is required');
    }
  }

  /**
   * Get current model
   */
  getModel(): string {
    return this.aiAdapter.getModelName();
  }

  /**
   * Get AI provider name
   */
  getProvider(): string {
    return this.aiAdapter.getProviderName();
  }

  /**
   * Get template engine instance
   */
  getTemplateEngine(): TemplateEngine {
    return this.templateEngine;
  }
}

/**
 * Create a project generator module instance
 */
export function createProjectGenerator(
  provider: AIProvider = 'claude',
  apiKey: string,
  model?: string
): ProjectGeneratorModule {
  return new ProjectGeneratorModule(provider, apiKey, model);
}
