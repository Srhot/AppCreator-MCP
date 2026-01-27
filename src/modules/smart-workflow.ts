/**
 * Smart Workflow Module
 *
 * Intelligent, user-friendly workflow that:
 * 1. Accepts user requirements
 * 2. Automatically determines project scale
 * 3. Generates AI recommendations with rationale
 * 4. Presents summary + single approval point
 * 5. Creates complete project
 *
 * Features:
 * - Graceful fallback (NotebookLM not required)
 * - Automatic scale detection
 * - Reasoned recommendations
 * - Single approval flow (Q1-C)
 */

import { AIAdapter } from '../adapters/ai-adapter.interface.js';
import { NotebookLMModule } from './notebooklm-integration.js';
import { SpecKitModule, SpecKit } from './spec-kit.js';
import { POMLOrchestrator, POMLState } from './poml-orchestrator.js';
import { A2UIGenerator, A2UIDesignPreferences, GeneratedUICode } from './a2ui-generator.js';
import { PostmanGenerator } from './postman-generator.js';
import { BDDGenerator } from './bdd-generator.js';
import { promises as fs } from 'fs';
import { join } from 'path';

export interface SmartProjectRequirements {
  projectName: string;
  projectType: 'web' | 'api' | 'cli' | 'desktop' | 'mobile' | 'library';
  description: string;
  features: string[];

  // Optional: Capacity indicators for scale detection
  expectedUsers?: number;
  dataVolume?: string; // e.g., "10K records", "1M users"
  branches?: number; // multi-branch apps

  // Optional: NotebookLM source
  notebookName?: string;
}

export interface TechRecommendation {
  category: 'database' | 'architecture' | 'authentication' | 'frontend' | 'deployment' | 'testing';
  recommendation: string;
  rationale: string[];
  alternatives: {
    option: string;
    pros: string[];
    cons: string[];
  }[];
}

export interface ProjectScale {
  size: 'small' | 'medium' | 'large' | 'enterprise';
  indicators: string[];
  reasoning: string;
}

export interface SmartRecommendations {
  scale: ProjectScale;
  recommendations: TechRecommendation[];
  estimatedComplexity: 'low' | 'medium' | 'high' | 'very-high';
  estimatedDuration: string;
}

export interface SmartWorkflowResult {
  projectPath: string;
  specKit: SpecKit;
  pomlState: POMLState;
  a2uiCode: GeneratedUICode;
  recommendations: SmartRecommendations;
  files: string[];
  notebookUsed: boolean;
  coverage?: number;
}

export class SmartWorkflowModule {
  private aiAdapter: AIAdapter;
  private notebookLM: NotebookLMModule;
  private specKit: SpecKitModule;
  private pomlOrchestrator: POMLOrchestrator;
  private a2uiGenerator: A2UIGenerator;
  private postmanGenerator: PostmanGenerator;
  private bddGenerator: BDDGenerator;

  constructor(aiAdapter: AIAdapter) {
    this.aiAdapter = aiAdapter;
    this.notebookLM = new NotebookLMModule(aiAdapter);
    this.specKit = new SpecKitModule(aiAdapter);
    this.pomlOrchestrator = new POMLOrchestrator(aiAdapter, 15);
    this.a2uiGenerator = new A2UIGenerator(aiAdapter);
    this.postmanGenerator = new PostmanGenerator(aiAdapter);
    this.bddGenerator = new BDDGenerator(aiAdapter);
  }

  /**
   * STEP 1: Analyze requirements and generate smart recommendations
   *
   * This is where the magic happens:
   * - Automatic scale detection
   * - Reasoned recommendations
   * - User gets summary to approve
   */
  async analyzeAndRecommend(
    requirements: SmartProjectRequirements
  ): Promise<SmartRecommendations> {
    console.log(`\n🧠 SMART ANALYSIS: ${requirements.projectName}`);
    console.log(`════════════════════════════════════════════════════════\n`);

    // STEP 1.1: Check NotebookLM availability
    let notebookContext = '';
    let notebookAvailable = false;

    if (requirements.notebookName) {
      console.log(`📚 Checking NotebookLM: ${requirements.notebookName}...`);
      notebookAvailable = await this.notebookLM.checkNotebookLMAvailability();

      if (notebookAvailable) {
        try {
          const notebook = await this.notebookLM.fetchNotebookContent(requirements.notebookName);
          notebookContext = `NotebookLM Context:\n${notebook.summary}\nKey Topics: ${notebook.keyTopics.join(', ')}`;
          console.log(`   ✓ NotebookLM loaded (${notebook.metadata.sourceCount} sources)`);
        } catch (error) {
          console.log(`   ⚠️  Could not load NotebookLM, using standard mode`);
        }
      } else {
        console.log(`   ℹ️  NotebookLM not configured, using standard AI mode`);
      }
    }

    // STEP 1.2: Automatic Scale Detection
    console.log(`\n📊 Detecting project scale...`);
    const scale = await this.detectProjectScale(requirements, notebookContext);
    console.log(`   → Scale: ${scale.size.toUpperCase()}`);
    console.log(`   → Reasoning: ${scale.reasoning}`);

    // STEP 1.3: Generate Smart Recommendations
    console.log(`\n💡 Generating technology recommendations...`);
    const recommendations = await this.generateRecommendations(
      requirements,
      scale,
      notebookContext
    );

    console.log(`   ✓ Generated ${recommendations.length} recommendations`);

    // STEP 1.4: Estimate complexity and duration
    const estimatedComplexity = this.estimateComplexity(scale, recommendations);
    const estimatedDuration = this.estimateDuration(estimatedComplexity, scale);

    console.log(`\n📈 Project Estimates:`);
    console.log(`   • Complexity: ${estimatedComplexity}`);
    console.log(`   • Duration: ${estimatedDuration}`);

    return {
      scale,
      recommendations,
      estimatedComplexity,
      estimatedDuration,
    };
  }

  /**
   * STEP 2: Execute full workflow after user approval
   */
  async executeWithRecommendations(
    requirements: SmartProjectRequirements,
    recommendations: SmartRecommendations
  ): Promise<SmartWorkflowResult> {
    console.log(`\n🚀 EXECUTING FULL WORKFLOW`);
    console.log(`════════════════════════════════════════════════════════\n`);

    const projectPath = `C:\\Users\\serha\\OneDrive\\Desktop\\appcreator-projects\\${requirements.projectName}`;
    await fs.mkdir(projectPath, { recursive: true });
    await fs.mkdir(join(projectPath, '.devforge'), { recursive: true });
    await fs.mkdir(join(projectPath, 'docs'), { recursive: true });

    const files: string[] = [];
    let notebookUsed = false;
    let coverage = 0;

    // Phase 1: Generate Spec-Kit (with or without NotebookLM)
    console.log(`📋 Phase 1: Generating Spec-Kit...`);
    let specKit: SpecKit;

    if (requirements.notebookName) {
      const notebookAvailable = await this.notebookLM.checkNotebookLMAvailability();
      if (notebookAvailable) {
        try {
          const enrichment = await this.notebookLM.enrichSpecKitWithNotebook(
            requirements.projectName,
            requirements.projectType,
            requirements.notebookName,
            requirements.features
          );
          specKit = enrichment.enrichedSpecKit;
          coverage = enrichment.coverageScore;
          notebookUsed = true;
          console.log(`   ✓ Spec-Kit enriched with NotebookLM (${coverage.toFixed(1)}% coverage)`);
        } catch (error) {
          console.log(`   ⚠️  NotebookLM failed, using standard generation`);
          specKit = await this.generateStandardSpecKit(requirements, recommendations);
        }
      } else {
        specKit = await this.generateStandardSpecKit(requirements, recommendations);
      }
    } else {
      specKit = await this.generateStandardSpecKit(requirements, recommendations);
    }

    // Save Spec-Kit files
    files.push(...await this.saveSpecKitFiles(specKit, projectPath));

    // Phase 2: Generate A2UI Frontend
    console.log(`\n🎨 Phase 2: Generating A2UI Frontend...`);
    const uiPreferences = this.extractUIPreferences(recommendations);
    const a2uiSpec = await this.a2uiGenerator.generateA2UISpec(
      specKit.specification,
      uiPreferences
    );
    const a2uiCode = await this.a2uiGenerator.generateImplementationCode(
      a2uiSpec,
      uiPreferences
    );

    files.push(...await this.saveA2UIFiles(a2uiSpec, a2uiCode, projectPath));
    console.log(`   ✓ Generated ${a2uiSpec.layouts.length} layouts, ${a2uiSpec.layouts.reduce((s: number, l: any) => s + l.components.length, 0)} components`);

    // Phase 3: Generate API Tests
    console.log(`\n🧪 Phase 3: Generating API Tests...`);
    files.push(...await this.generateAPITests(specKit, projectPath));

    // Phase 4: Generate BDD Tests
    console.log(`\n🥒 Phase 4: Generating BDD Tests...`);
    files.push(...await this.generateBDDTests(specKit, projectPath));

    // Phase 5: Initialize POML
    console.log(`\n💾 Phase 5: Initializing POML & Checkpoint...`);
    const pomlState = this.pomlOrchestrator.initializePOML(specKit);
    const pomlPath = join(projectPath, 'PROJECT.poml');
    await fs.writeFile(pomlPath, this.pomlOrchestrator.exportPOML(pomlState), 'utf-8');
    files.push(pomlPath);

    console.log(`\n════════════════════════════════════════════════════════`);
    console.log(`✅ PROJECT COMPLETE!`);
    console.log(`   📁 Location: ${projectPath}`);
    console.log(`   📄 Files: ${files.length} generated`);
    console.log(`════════════════════════════════════════════════════════\n`);

    return {
      projectPath,
      specKit,
      pomlState,
      a2uiCode,
      recommendations,
      files,
      notebookUsed,
      coverage: notebookUsed ? coverage : undefined,
    };
  }

  /**
   * AUTO-DETECT PROJECT SCALE (Q3: Automatic)
   */
  private async detectProjectScale(
    requirements: SmartProjectRequirements,
    notebookContext: string
  ): Promise<ProjectScale> {
    const indicators: string[] = [];
    let score = 0;

    // Analyze capacity indicators
    if (requirements.expectedUsers) {
      if (requirements.expectedUsers > 10000) {
        score += 3;
        indicators.push(`${requirements.expectedUsers}+ users → Large scale`);
      } else if (requirements.expectedUsers > 1000) {
        score += 2;
        indicators.push(`${requirements.expectedUsers} users → Medium scale`);
      } else {
        score += 1;
        indicators.push(`${requirements.expectedUsers} users → Small scale`);
      }
    }

    if (requirements.branches && requirements.branches > 1) {
      score += 2;
      indicators.push(`Multi-branch (${requirements.branches}) → Distributed system`);
    }

    if (requirements.dataVolume) {
      const volume = requirements.dataVolume.toLowerCase();
      if (volume.includes('million') || volume.includes('m ')) {
        score += 3;
        indicators.push(`High data volume → Enterprise`);
      } else if (volume.includes('thousand') || volume.includes('k')) {
        score += 1;
        indicators.push(`Moderate data volume → Medium`);
      }
    }

    // Analyze features complexity
    const complexFeatures = ['authentication', 'payment', 'real-time', 'ml', 'ai', 'analytics'];
    const hasComplexFeatures = requirements.features.some(f =>
      complexFeatures.some(cf => f.toLowerCase().includes(cf))
    );
    if (hasComplexFeatures) {
      score += 1;
      indicators.push('Complex features detected');
    }

    // Use AI for semantic analysis
    const prompt = `Analyze this project and determine its scale:

Project: ${requirements.projectName}
Type: ${requirements.projectType}
Description: ${requirements.description}
Features: ${requirements.features.join(', ')}
${notebookContext}

Based on:
- User count, data volume, complexity
- Industry standards

Return ONLY ONE WORD: small, medium, large, or enterprise`;

    const aiScale = await this.aiAdapter.generateText(prompt, 50);
    const detectedScale = aiScale.toLowerCase().trim();

    // Combine score and AI analysis
    let finalScale: ProjectScale['size'];
    if (score >= 6 || detectedScale === 'enterprise') {
      finalScale = 'enterprise';
    } else if (score >= 4 || detectedScale === 'large') {
      finalScale = 'large';
    } else if (score >= 2 || detectedScale === 'medium') {
      finalScale = 'medium';
    } else {
      finalScale = 'small';
    }

    return {
      size: finalScale,
      indicators,
      reasoning: `Score: ${score}/9, AI: ${detectedScale}, Result: ${finalScale}`,
    };
  }

  /**
   * GENERATE SMART RECOMMENDATIONS (Q1-C: Summary + Rationale)
   */
  private async generateRecommendations(
    requirements: SmartProjectRequirements,
    scale: ProjectScale,
    notebookContext: string
  ): Promise<TechRecommendation[]> {
    const recommendations: TechRecommendation[] = [];

    // Database recommendation
    const dbRec = await this.recommendDatabase(requirements, scale, notebookContext);
    recommendations.push(dbRec);

    // Architecture recommendation
    const archRec = await this.recommendArchitecture(requirements, scale, notebookContext);
    recommendations.push(archRec);

    // Authentication recommendation
    const authRec = await this.recommendAuthentication(requirements, scale, notebookContext);
    recommendations.push(authRec);

    // Frontend recommendation
    const frontendRec = await this.recommendFrontend(requirements, scale, notebookContext);
    recommendations.push(frontendRec);

    return recommendations;
  }

  private async recommendDatabase(
    requirements: SmartProjectRequirements,
    scale: ProjectScale,
    context: string
  ): Promise<TechRecommendation> {
    // Logic-based recommendation
    let primary = 'PostgreSQL';
    let rationale = [
      'ACID compliance for data integrity',
      'Complex queries support',
      'Industry standard for reliability',
    ];
    let alternatives = [
      {
        option: 'MongoDB',
        pros: ['Flexible schema', 'Fast development', 'Good for unstructured data'],
        cons: ['Weaker ACID guarantees', 'Complex aggregations harder'],
      },
      {
        option: 'MySQL',
        pros: ['Simple setup', 'Good community', 'Familiar'],
        cons: ['Less feature-rich than PostgreSQL', 'Slower for complex queries'],
      },
    ];

    // Adjust for scale
    if (scale.size === 'enterprise' || scale.size === 'large') {
      rationale.push('Horizontal scaling with partitioning');
      rationale.push('Advanced indexing for large datasets');
    }

    // Check if specific requirements suggest NoSQL
    const needsFlexibleSchema = requirements.features.some(f =>
      f.toLowerCase().includes('dynamic') || f.toLowerCase().includes('flexible')
    );
    if (needsFlexibleSchema) {
      primary = 'MongoDB';
      rationale = [
        'Flexible schema for dynamic data',
        'Fast development iterations',
        'Good for document-oriented data',
      ];
      alternatives = [
        {
          option: 'PostgreSQL',
          pros: ['ACID compliance', 'Complex queries', 'JSON support'],
          cons: ['Less flexible schema', 'Migrations required'],
        },
      ];
    }

    return {
      category: 'database',
      recommendation: primary,
      rationale,
      alternatives,
    };
  }

  private async recommendArchitecture(
    requirements: SmartProjectRequirements,
    scale: ProjectScale,
    context: string
  ): Promise<TechRecommendation> {
    let primary: string;
    let rationale: string[];
    let alternatives: TechRecommendation['alternatives'];

    if (scale.size === 'enterprise' || requirements.branches && requirements.branches > 3) {
      primary = 'Microservices';
      rationale = [
        'Independent scaling per service',
        'Team autonomy (multi-branch)',
        'Fault isolation (one service fails, others continue)',
        'Technology flexibility',
      ];
      alternatives = [
        {
          option: 'Modular Monolith',
          pros: ['Simpler deployment', 'Easier development', 'Lower operational cost'],
          cons: ['Harder to scale independently', 'Less team autonomy'],
        },
      ];
    } else if (scale.size === 'large') {
      primary = 'Modular Monolith';
      rationale = [
        'Clean module boundaries',
        'Easier to maintain than microservices',
        'Can evolve to microservices later',
        'Good balance of complexity vs scalability',
      ];
      alternatives = [
        {
          option: 'Microservices',
          pros: ['Better scalability', 'Service independence'],
          cons: ['Higher operational complexity', 'More infrastructure'],
        },
        {
          option: 'Monolithic',
          pros: ['Simplest', 'Fastest development'],
          cons: ['Harder to scale', 'Tighter coupling'],
        },
      ];
    } else {
      primary = 'Monolithic (Layered)';
      rationale = [
        'Simple deployment',
        'Faster development',
        'Lower operational cost',
        'Suitable for small-medium scale',
      ];
      alternatives = [
        {
          option: 'Modular Monolith',
          pros: ['Better organization', 'Future-proof'],
          cons: ['Slightly more complex'],
        },
      ];
    }

    return {
      category: 'architecture',
      recommendation: primary,
      rationale,
      alternatives,
    };
  }

  private async recommendAuthentication(
    requirements: SmartProjectRequirements,
    scale: ProjectScale,
    context: string
  ): Promise<TechRecommendation> {
    const hasHealthcare = requirements.description.toLowerCase().includes('health') ||
      requirements.description.toLowerCase().includes('patient');
    const hasFinance = requirements.description.toLowerCase().includes('payment') ||
      requirements.description.toLowerCase().includes('financial');

    let primary: string;
    let rationale: string[];

    if (hasHealthcare || hasFinance) {
      primary = 'OAuth2 + MFA';
      rationale = [
        'Multi-factor authentication for security',
        'Compliance requirements (HIPAA/KVKK/PCI)',
        'Audit logging',
        'Industry standard',
      ];
    } else {
      primary = 'JWT + Role-Based Access';
      rationale = [
        'Stateless (scalable)',
        'Simple implementation',
        'Role-based permissions',
        'Good for most applications',
      ];
    }

    return {
      category: 'authentication',
      recommendation: primary,
      rationale,
      alternatives: [
        {
          option: 'Session-based',
          pros: ['Simple', 'Server-side control'],
          cons: ['Not stateless', 'Harder to scale'],
        },
      ],
    };
  }

  private async recommendFrontend(
    requirements: SmartProjectRequirements,
    scale: ProjectScale,
    context: string
  ): Promise<TechRecommendation> {
    return {
      category: 'frontend',
      recommendation: 'React + Material-UI',
      rationale: [
        'Large component library',
        'Enterprise-ready',
        'Great developer experience',
        'Widely adopted',
      ],
      alternatives: [
        {
          option: 'Vue + Vuetify',
          pros: ['Easier learning curve', 'Good documentation'],
          cons: ['Smaller ecosystem'],
        },
        {
          option: 'Angular + Angular Material',
          pros: ['Full framework', 'TypeScript native'],
          cons: ['Steeper learning curve'],
        },
      ],
    };
  }

  // Helper methods
  private async generateStandardSpecKit(
    requirements: SmartProjectRequirements,
    recommendations: SmartRecommendations
  ): Promise<SpecKit> {
    return await this.specKit.generateSpecKit(
      requirements.projectName,
      requirements.projectType,
      requirements.description,
      undefined
    );
  }

  private async saveSpecKitFiles(specKit: SpecKit, projectPath: string): Promise<string[]> {
    const files: string[] = [];

    const constitutionPath = join(projectPath, 'docs', 'CONSTITUTION.md');
    await fs.writeFile(constitutionPath, this.generateConstitutionMD(specKit.constitution), 'utf-8');
    files.push(constitutionPath);

    const specPath = join(projectPath, 'docs', 'SPECIFICATION.md');
    await fs.writeFile(specPath, this.generateSpecificationMD(specKit.specification), 'utf-8');
    files.push(specPath);

    const planPath = join(projectPath, 'docs', 'TECHNICAL_PLAN.md');
    await fs.writeFile(planPath, this.generateTechnicalPlanMD(specKit.technicalPlan), 'utf-8');
    files.push(planPath);

    const tasksPath = join(projectPath, 'docs', 'TASKS.md');
    await fs.writeFile(tasksPath, this.generateTasksMD(specKit.tasks), 'utf-8');
    files.push(tasksPath);

    return files;
  }

  private async saveA2UIFiles(
    a2uiSpec: any,
    a2uiCode: GeneratedUICode,
    projectPath: string
  ): Promise<string[]> {
    const files: string[] = [];
    await fs.mkdir(join(projectPath, 'frontend'), { recursive: true });

    const specPath = join(projectPath, 'frontend', 'a2ui-spec.json');
    await fs.writeFile(specPath, JSON.stringify(a2uiSpec, null, 2), 'utf-8');
    files.push(specPath);

    for (const impl of a2uiCode.implementations) {
      for (const file of impl.files) {
        const filePath = join(projectPath, 'frontend', file.path);
        const dir = join(projectPath, 'frontend', file.path.split('/').slice(0, -1).join('/'));
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(filePath, file.content, 'utf-8');
        files.push(filePath);
      }
    }

    return files;
  }

  private async generateAPITests(specKit: SpecKit, projectPath: string): Promise<string[]> {
    const files: string[] = [];
    const postmanDir = join(projectPath, 'postman');
    await fs.mkdir(postmanDir, { recursive: true });

    const collection = await this.postmanGenerator.generateCollection(
      specKit.constitution.projectName,
      specKit.specification,
      '{{base_url}}'
    );

    const collectionPath = join(postmanDir, 'collection.json');
    await fs.writeFile(collectionPath, this.postmanGenerator.exportCollection(collection), 'utf-8');
    files.push(collectionPath);

    return files;
  }

  private async generateBDDTests(specKit: SpecKit, projectPath: string): Promise<string[]> {
    const files: string[] = [];
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

    return files;
  }

  private extractUIPreferences(recommendations: SmartRecommendations): A2UIDesignPreferences {
    const frontendRec = recommendations.recommendations.find(r => r.category === 'frontend');
    const framework = frontendRec?.recommendation.toLowerCase().includes('vue') ? 'vue' :
      frontendRec?.recommendation.toLowerCase().includes('angular') ? 'angular' : 'react';

    return {
      platform: 'web',
      framework: framework as any,
      uiLibrary: 'material-ui',
      designStyle: 'modern',
      colorScheme: 'light',
      primaryColor: 'blue',
      features: ['responsive', 'accessible'],
    };
  }

  private estimateComplexity(
    scale: ProjectScale,
    recommendations: TechRecommendation[]
  ): SmartRecommendations['estimatedComplexity'] {
    if (scale.size === 'enterprise') return 'very-high';
    if (scale.size === 'large') return 'high';
    if (scale.size === 'medium') return 'medium';
    return 'low';
  }

  private estimateDuration(
    complexity: SmartRecommendations['estimatedComplexity'],
    scale: ProjectScale
  ): string {
    const durations = {
      'low': '2-4 weeks',
      'medium': '1-2 months',
      'high': '3-6 months',
      'very-high': '6-12 months',
    };
    return durations[complexity];
  }

  // Markdown generators
  private generateConstitutionMD(constitution: SpecKit['constitution']): string {
    return `# Project Constitution\n\n## Vision\n\n${constitution.vision}\n\n## Principles\n\n${constitution.principles.map((p, i) => `${i + 1}. ${p}`).join('\n')}`;
  }

  private generateSpecificationMD(spec: SpecKit['specification']): string {
    return `# Specification\n\n## Functional Requirements\n\n${spec.functionalRequirements.map(r => `### ${r.id}: ${r.title}\n${r.description}`).join('\n\n')}`;
  }

  private generateTechnicalPlanMD(plan: SpecKit['technicalPlan']): string {
    return `# Technical Plan\n\n## Architecture\n\n**Pattern:** ${plan.architecture.pattern}`;
  }

  private generateTasksMD(tasks: SpecKit['tasks']): string {
    return `# Task Breakdown\n\n${tasks.map(t => `## ${t.id}: ${t.title}`).join('\n\n')}`;
  }
}
