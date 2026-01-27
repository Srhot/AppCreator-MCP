/**
 * Auto Workflow Module
 *
 * Fully automated workflow that combines:
 * - NotebookLM integration
 * - Automatic decision matrix completion
 * - Spec-Kit generation
 * - A2UI frontend generation
 *
 * Single command → Complete project
 */

import { AIAdapter } from '../adapters/ai-adapter.interface.js';
import { NotebookLMModule } from './notebooklm-integration.js';
import { DecisionMatrixModule, DecisionMatrix, MatrixAnswer } from './decision-matrix.js';
import { SpecKitModule, SpecKit } from './spec-kit.js';
import { POMLOrchestrator, POMLState } from './poml-orchestrator.js';
import { A2UIGenerator, A2UIDesignPreferences, GeneratedUICode } from './a2ui-generator.js';
import { PostmanGenerator } from './postman-generator.js';
import { BDDGenerator } from './bdd-generator.js';
import { promises as fs } from 'fs';
import { join } from 'path';

export interface AutoWorkflowConfig {
  projectName: string;
  projectType: string;
  notebookName: string;

  // UI preferences (optional, will use smart defaults)
  uiPreferences?: {
    platform?: 'web' | 'mobile' | 'desktop';
    framework?: 'react' | 'vue' | 'angular';
    uiLibrary?: string;
    designStyle?: string;
    colorScheme?: 'light' | 'dark' | 'auto';
    primaryColor?: string;
  };

  // Additional requirements not in notebook
  additionalRequirements?: string[];
}

export interface AutoWorkflowResult {
  projectPath: string;
  specKit: SpecKit;
  pomlState: POMLState;
  enrichmentCoverage: number;
  a2uiGenerated: boolean;
  files: string[];
  summary: {
    phase: string;
    tasksGenerated: number;
    estimatedHours: number;
    notebookContributions: number;
    componentsGenerated: number;
  };
}

export class AutoWorkflowModule {
  private aiAdapter: AIAdapter;
  private notebookLM: NotebookLMModule;
  private decisionMatrix: DecisionMatrixModule;
  private specKit: SpecKitModule;
  private pomlOrchestrator: POMLOrchestrator;
  private a2uiGenerator: A2UIGenerator;
  private postmanGenerator: PostmanGenerator;
  private bddGenerator: BDDGenerator;

  constructor(aiAdapter: AIAdapter) {
    this.aiAdapter = aiAdapter;
    this.notebookLM = new NotebookLMModule(aiAdapter);
    this.decisionMatrix = new DecisionMatrixModule(aiAdapter);
    this.specKit = new SpecKitModule(aiAdapter);
    this.pomlOrchestrator = new POMLOrchestrator(aiAdapter, 15);
    this.a2uiGenerator = new A2UIGenerator(aiAdapter);
    this.postmanGenerator = new PostmanGenerator(aiAdapter);
    this.bddGenerator = new BDDGenerator(aiAdapter);
  }

  /**
   * FULLY AUTOMATED WORKFLOW
   *
   * Single method that does everything:
   * 1. Fetch NotebookLM documentation
   * 2. Generate decision matrix
   * 3. Auto-answer decision matrix using NotebookLM content
   * 4. Generate enriched Spec-Kit
   * 5. Generate A2UI frontend
   * 6. Generate API tests
   * 7. Generate BDD tests
   * 8. Create initial checkpoint
   */
  async executeFullWorkflow(config: AutoWorkflowConfig): Promise<AutoWorkflowResult> {
    console.log(`\n🚀 STARTING FULLY AUTOMATED WORKFLOW`);
    console.log(`   Project: ${config.projectName}`);
    console.log(`   Type: ${config.projectType}`);
    console.log(`   NotebookLM: ${config.notebookName}`);
    console.log(`\n════════════════════════════════════════════════════════\n`);

    const projectPath = `C:\\Users\\serha\\OneDrive\\Desktop\\appcreator-projects\\${config.projectName}`;
    await fs.mkdir(projectPath, { recursive: true });
    await fs.mkdir(join(projectPath, '.devforge'), { recursive: true });
    await fs.mkdir(join(projectPath, 'docs'), { recursive: true });

    const files: string[] = [];

    // PHASE 1: Fetch NotebookLM Documentation
    console.log(`📚 PHASE 1: Fetching NotebookLM Documentation...`);
    const notebookAvailable = await this.notebookLM.checkNotebookLMAvailability();

    let notebookContent = null;
    if (notebookAvailable) {
      try {
        notebookContent = await this.notebookLM.fetchNotebookContent(config.notebookName);
        console.log(`   ✓ Loaded ${notebookContent.metadata.sourceCount} sources from notebook`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`   ⚠️  Could not fetch notebook: ${errorMessage}`);
        console.log(`   → Falling back to standard AI generation`);
      }
    } else {
      console.log(`   ⚠️  NotebookLM not available`);
      console.log(`   → Using standard AI generation`);
    }

    // PHASE 2: Generate Decision Matrix
    console.log(`\n🎯 PHASE 2: Generating Decision Matrix...`);
    const matrix = await this.decisionMatrix.createMatrix(
      config.projectType,
      notebookContent
        ? `Project based on NotebookLM: ${config.notebookName}\n\nSummary: ${notebookContent.summary}`
        : `Project: ${config.projectName}`
    );
    console.log(`   ✓ Generated ${matrix.questions.length} decision matrix questions`);

    // PHASE 3: AUTO-ANSWER Decision Matrix
    console.log(`\n🤖 PHASE 3: Auto-Answering Decision Matrix (AI)...`);
    const answers = await this.autoAnswerDecisionMatrix(
      matrix,
      notebookContent,
      config.additionalRequirements || []
    );
    matrix.answers = answers;
    console.log(`   ✓ Auto-answered all ${answers.length} questions`);

    // PHASE 4: Generate Enriched Spec-Kit
    console.log(`\n📋 PHASE 4: Generating Spec-Kit...`);
    let specKit: SpecKit;
    let enrichmentCoverage = 0;

    if (notebookContent && notebookAvailable) {
      // Use NotebookLM enrichment
      const enrichment = await this.notebookLM.enrichSpecKitWithNotebook(
        config.projectName,
        config.projectType,
        config.notebookName,
        config.additionalRequirements || []
      );
      specKit = enrichment.enrichedSpecKit;
      enrichmentCoverage = enrichment.coverageScore;

      // Save enrichment report
      const enrichmentPath = join(projectPath, 'docs', 'NOTEBOOKLM_ENRICHMENT.md');
      await fs.writeFile(
        enrichmentPath,
        this.generateEnrichmentReport(enrichment),
        'utf-8'
      );
      files.push(enrichmentPath);

      console.log(`   ✓ Spec-Kit enriched with NotebookLM (${enrichmentCoverage.toFixed(1)}% coverage)`);
    } else {
      // Standard generation
      specKit = await this.specKit.generateSpecKit(
        config.projectName,
        config.projectType,
        `Project: ${config.projectName}`,
        matrix
      );
      console.log(`   ✓ Spec-Kit generated (standard mode)`);
    }

    // Save Spec-Kit files
    const constitutionPath = join(projectPath, 'docs', 'CONSTITUTION.md');
    await fs.writeFile(
      constitutionPath,
      this.generateConstitutionMarkdown(specKit.constitution),
      'utf-8'
    );
    files.push(constitutionPath);

    const specPath = join(projectPath, 'docs', 'SPECIFICATION.md');
    await fs.writeFile(
      specPath,
      this.generateSpecificationMarkdown(specKit.specification),
      'utf-8'
    );
    files.push(specPath);

    const planPath = join(projectPath, 'docs', 'TECHNICAL_PLAN.md');
    await fs.writeFile(
      planPath,
      this.generateTechnicalPlanMarkdown(specKit.technicalPlan),
      'utf-8'
    );
    files.push(planPath);

    const tasksPath = join(projectPath, 'docs', 'TASKS.md');
    await fs.writeFile(
      tasksPath,
      this.generateTasksMarkdown(specKit.tasks),
      'utf-8'
    );
    files.push(tasksPath);

    // PHASE 5: Generate A2UI Frontend
    console.log(`\n🎨 PHASE 5: Generating A2UI Frontend...`);
    const uiPreferences = this.getUIPreferences(config.uiPreferences, config.projectType);
    const a2uiResult = await this.a2uiGenerator.generateA2UISpec(
      specKit.specification,
      uiPreferences
    );
    const uiCode = await this.a2uiGenerator.generateImplementationCode(
      a2uiResult,
      uiPreferences
    );

    // Save A2UI files
    await fs.mkdir(join(projectPath, 'frontend'), { recursive: true });
    const a2uiSpecPath = join(projectPath, 'frontend', 'a2ui-spec.json');
    await fs.writeFile(a2uiSpecPath, JSON.stringify(a2uiResult, null, 2), 'utf-8');
    files.push(a2uiSpecPath);

    for (const impl of uiCode.implementations) {
      for (const file of impl.files) {
        const filePath = join(projectPath, 'frontend', file.path);
        const dir = join(projectPath, 'frontend', file.path.split('/').slice(0, -1).join('/'));
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(filePath, file.content, 'utf-8');
        files.push(filePath);
      }
    }

    const stitchPath = join(projectPath, 'docs', 'GOOGLE_STITCH_PROMPT.md');
    const stitchPrompt = this.a2uiGenerator.exportToStitchPrompt(a2uiResult);
    await fs.writeFile(stitchPath, stitchPrompt, 'utf-8');
    files.push(stitchPath);

    console.log(`   ✓ Generated ${a2uiResult.layouts.length} layouts, ${a2uiResult.layouts.reduce((sum: number, l: any) => sum + l.components.length, 0)} components`);

    // PHASE 6: Generate API Tests
    console.log(`\n🧪 PHASE 6: Generating API Tests...`);
    const postmanDir = join(projectPath, 'postman');
    await fs.mkdir(postmanDir, { recursive: true });

    const collection = await this.postmanGenerator.generateCollection(
      config.projectName,
      specKit.specification,
      '{{base_url}}'
    );

    const collectionPath = join(postmanDir, 'collection.json');
    await fs.writeFile(
      collectionPath,
      this.postmanGenerator.exportCollection(collection),
      'utf-8'
    );
    files.push(collectionPath);

    const environments = this.postmanGenerator.generateEnvironments(config.projectName);
    for (const [env, data] of Object.entries(environments)) {
      const envPath = join(postmanDir, `${env}.environment.json`);
      await fs.writeFile(
        envPath,
        this.postmanGenerator.exportEnvironment(data),
        'utf-8'
      );
      files.push(envPath);
    }

    console.log(`   ✓ Generated Postman collection + 3 environments`);

    // PHASE 7: Generate BDD Tests
    console.log(`\n🥒 PHASE 7: Generating BDD Tests...`);
    const testSuite = await this.bddGenerator.generateTestSuite(
      specKit.specification,
      specKit.technicalPlan.architecture.pattern
    );
    const testFiles = await this.bddGenerator.generateTestFiles(testSuite);

    await fs.mkdir(join(projectPath, 'tests', 'features'), { recursive: true });
    for (const feature of testFiles.features) {
      const fullPath = join(projectPath, feature.path);
      await fs.writeFile(fullPath, feature.content, 'utf-8');
      files.push(fullPath);
    }

    console.log(`   ✓ Generated ${testFiles.features.length} BDD feature files`);

    // PHASE 8: Initialize POML & Checkpoint
    console.log(`\n💾 PHASE 8: Initializing POML & Checkpoint System...`);
    const pomlState = this.pomlOrchestrator.initializePOML(specKit);
    const pomlPath = join(projectPath, 'PROJECT.poml');
    await fs.writeFile(pomlPath, this.pomlOrchestrator.exportPOML(pomlState), 'utf-8');
    files.push(pomlPath);

    const statePath = join(projectPath, '.devforge', 'state.json');
    await fs.writeFile(statePath, JSON.stringify(pomlState, null, 2), 'utf-8');

    console.log(`   ✓ POML initialized, checkpoint system active`);

    // Generate Summary
    console.log(`\n════════════════════════════════════════════════════════`);
    console.log(`✅ WORKFLOW COMPLETE!\n`);

    const summary = {
      phase: 'complete',
      tasksGenerated: specKit.tasks.length,
      estimatedHours: specKit.tasks.reduce((sum, t) => sum + t.estimatedHours, 0),
      notebookContributions: notebookContent ? notebookContent.metadata.sourceCount : 0,
      componentsGenerated: a2uiResult.layouts.reduce((sum: number, l: any) => sum + l.components.length, 0),
    };

    return {
      projectPath,
      specKit,
      pomlState,
      enrichmentCoverage,
      a2uiGenerated: true,
      files,
      summary,
    };
  }

  /**
   * Auto-answer decision matrix using NotebookLM + AI
   */
  private async autoAnswerDecisionMatrix(
    matrix: DecisionMatrix,
    notebookContent: any,
    additionalRequirements: string[]
  ): Promise<MatrixAnswer[]> {
    const answers: MatrixAnswer[] = [];

    for (const question of matrix.questions) {
      let answer: string;

      if (notebookContent && question.type === 'choice') {
        // Ask NotebookLM for recommendation
        try {
          const notebookAnswer = await this.notebookLM.queryNotebook(
            notebookContent.notebookName,
            {
              query: `${question.question} Choose from: ${question.options?.join(', ')}`,
            }
          );

          // Extract choice from answer
          answer = this.extractChoiceFromAnswer(
            notebookAnswer.answer,
            question.options || []
          );
        } catch (error) {
          // Fallback to AI
          answer = await this.aiAnswerQuestion(question, additionalRequirements);
        }
      } else {
        // Use AI
        answer = await this.aiAnswerQuestion(question, additionalRequirements);
      }

      answers.push({
        questionId: question.id,
        answer,
      });
    }

    return answers;
  }

  /**
   * AI answers a decision matrix question
   */
  private async aiAnswerQuestion(question: any, context: string[]): Promise<string> {
    const prompt = `Answer this architecture decision question for a software project:

Question: ${question.question}
Category: ${question.category}
${question.options ? `Options: ${question.options.join(', ')}` : ''}

Context: ${context.join(', ')}

Choose the BEST option based on modern best practices and the given context.
${question.options ? `Return ONLY one of these exact options: ${question.options.join(', ')}` : ''}

Answer:`;

    const response = await this.aiAdapter.generateText(prompt, 200);

    // If choice question, extract valid option
    if (question.options) {
      return this.extractChoiceFromAnswer(response, question.options);
    }

    return response.trim();
  }

  /**
   * Extract choice from AI/NotebookLM answer
   */
  private extractChoiceFromAnswer(answer: string, options: string[]): string {
    const lowerAnswer = answer.toLowerCase();

    for (const option of options) {
      if (lowerAnswer.includes(option.toLowerCase())) {
        return option;
      }
    }

    // Default to first option
    return options[0];
  }

  /**
   * Get UI preferences with smart defaults
   */
  private getUIPreferences(
    provided: AutoWorkflowConfig['uiPreferences'],
    projectType: string
  ): A2UIDesignPreferences {
    return {
      platform: (provided?.platform || 'web') as 'web' | 'mobile' | 'desktop',
      framework: (provided?.framework || 'react') as 'react' | 'vue' | 'angular' | 'native',
      uiLibrary: (provided?.uiLibrary || 'material-ui') as 'tailwind' | 'chakra' | 'ant-design' | 'material-ui' | 'custom',
      designStyle: (provided?.designStyle || 'modern') as 'modern' | 'minimal' | 'professional' | 'playful',
      colorScheme: (provided?.colorScheme || 'light') as 'light' | 'dark' | 'auto',
      primaryColor: provided?.primaryColor || 'blue',
      features: ['responsive', 'accessible', 'dark-mode-toggle'],
    };
  }

  // Helper methods for markdown generation
  private generateConstitutionMarkdown(constitution: SpecKit['constitution']): string {
    let md = `# Project Constitution\n\n`;
    md += `## Vision\n\n${constitution.vision}\n\n`;
    md += `## Principles\n\n`;
    constitution.principles.forEach((p, i) => {
      md += `${i + 1}. ${p}\n`;
    });
    md += `\n## Constraints\n\n`;
    constitution.constraints.forEach(c => md += `- ${c}\n`);
    return md;
  }

  private generateSpecificationMarkdown(spec: SpecKit['specification']): string {
    let md = `# Specification\n\n`;
    md += `## Functional Requirements\n\n`;
    spec.functionalRequirements.forEach(req => {
      md += `### ${req.id}: ${req.title}\n\n`;
      md += `**Priority:** ${req.priority}\n\n`;
      md += `${req.description}\n\n`;
      md += `**Acceptance Criteria:**\n`;
      req.acceptanceCriteria.forEach(ac => md += `- ${ac}\n`);
      md += `\n`;
    });
    return md;
  }

  private generateTechnicalPlanMarkdown(plan: SpecKit['technicalPlan']): string {
    let md = `# Technical Plan\n\n`;
    md += `## Architecture\n\n`;
    md += `**Pattern:** ${plan.architecture.pattern}\n\n`;
    md += `**Layers:** ${plan.architecture.layers.join(', ')}\n\n`;
    return md;
  }

  private generateTasksMarkdown(tasks: SpecKit['tasks']): string {
    let md = `# Task Breakdown\n\n`;
    md += `Total tasks: ${tasks.length}\n\n`;
    tasks.forEach((task, i) => {
      md += `## ${task.id}: ${task.title}\n\n`;
      md += `- **Type:** ${task.type}\n`;
      md += `- **Priority:** ${task.priority}\n`;
      md += `- **Estimated:** ${task.estimatedHours}h\n\n`;
    });
    return md;
  }

  private generateEnrichmentReport(enrichment: any): string {
    let md = `# NotebookLM Enrichment Report\n\n`;
    md += `Coverage Score: ${enrichment.coverageScore.toFixed(1)}%\n\n`;
    md += `## Notebook Contributions (${enrichment.notebookContributions.length})\n\n`;
    enrichment.notebookContributions.forEach((contrib: any, i: number) => {
      md += `### ${i + 1}. ${contrib.section}\n\n`;
      md += `${contrib.content}\n\n`;
      md += `**Sources:** ${contrib.citedSources.join(', ')}\n\n`;
    });
    return md;
  }
}
