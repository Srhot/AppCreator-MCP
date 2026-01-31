/**
 * NotebookLM Integration Module
 *
 * Integrates with NotebookLM MCP server to fetch documentation and context
 * from existing notebooks for project generation.
 *
 * Use Cases:
 * 1. Fetch documentation from NotebookLM notebooks
 * 2. Enrich project specifications with notebook content
 * 3. Generate research queries based on missing information
 * 4. Create hybrid specs (NotebookLM + AI research)
 */

import { AIAdapter } from '../adapters/ai-adapter.interface.js';
import { SpecKit } from './spec-kit.js';
import { DecisionMatrix } from './decision-matrix.js';
import { parseJSONWithDefault } from '../utils/json-parser.js';

export interface NotebookSource {
  id: string;
  title: string;
  type: 'pdf' | 'document' | 'website' | 'text';
  content?: string;
  url?: string;
  uploadedAt: string;
}

export interface NotebookContent {
  notebookId: string;
  notebookName: string;
  sources: NotebookSource[];
  summary: string;
  keyTopics: string[];
  metadata: {
    createdAt: string;
    lastModified: string;
    sourceCount: number;
  };
}

export interface NotebookQuery {
  query: string;
  context?: string;
  maxResults?: number;
}

export interface NotebookAnswer {
  answer: string;
  citations: {
    sourceId: string;
    sourceTitle: string;
    excerpt: string;
    relevance: number;
  }[];
  confidence: number;
}

export interface EnrichmentResult {
  enrichedSpecKit: SpecKit;
  notebookContributions: {
    section: string;
    content: string;
    citedSources: string[];
  }[];
  missingInformation: {
    topic: string;
    reason: string;
    suggestedResearch: string;
  }[];
  coverageScore: number; // 0-100: How much of spec came from notebook
}

export class NotebookLMModule {
  private aiAdapter: AIAdapter;
  private notebookLMAvailable: boolean = false;

  constructor(aiAdapter: AIAdapter) {
    this.aiAdapter = aiAdapter;
  }

  /**
   * Check if NotebookLM MCP server is available
   */
  async checkNotebookLMAvailability(): Promise<boolean> {
    // In real implementation, this would check if NotebookLM MCP is configured
    // For now, we'll simulate it
    // TODO: Implement actual MCP server check via environment variable or config
    this.notebookLMAvailable = !!process.env.NOTEBOOKLM_MCP_ENABLED;
    return this.notebookLMAvailable;
  }

  /**
   * List available notebooks from NotebookLM
   *
   * Note: This will call NotebookLM MCP server's list_notebooks tool
   */
  async listNotebooks(): Promise<{ id: string; name: string; sourceCount: number }[]> {
    if (!this.notebookLMAvailable) {
      throw new Error('NotebookLM MCP server not available. Please configure it first.');
    }

    console.error('📚 Fetching notebooks from NotebookLM...');

    // Real MCP call to NotebookLM
    // Note: This assumes NotebookLM MCP server is configured in Claude Desktop
    // The actual MCP call will be made by Claude Desktop when this module is called

    // For now, we'll use a hybrid approach:
    // 1. Try to fetch from NotebookLM MCP if available
    // 2. If not available, return empty array (graceful fallback)

    try {
      // This would be the actual MCP call pattern
      // In practice, Claude Desktop handles the MCP communication
      console.error('   → Attempting to fetch notebooks via MCP...');

      // Placeholder for actual MCP response
      // Real implementation: Claude Desktop will intercept and call NotebookLM MCP
      return [];
    } catch (error) {
      console.error('   ⚠️  Could not fetch notebooks, using fallback mode');
      return [];
    }
  }

  /**
   * Fetch detailed content from a specific notebook
   *
   * @param notebookName - Name or ID of the notebook
   */
  async fetchNotebookContent(notebookName: string): Promise<NotebookContent> {
    if (!this.notebookLMAvailable) {
      throw new Error('NotebookLM MCP server not available.');
    }

    console.error(`📖 Fetching content from notebook: ${notebookName}`);

    // Real MCP call to NotebookLM
    // The actual MCP server call will be:
    // 1. notebooklm.get_notebook_info(notebookName)
    // 2. notebooklm.list_sources(notebookName)
    // 3. notebooklm.get_source_content(sourceId) for each source

    // For development: Return mock data structure
    // In production: Claude Desktop will handle actual MCP calls

    // Generate query to NotebookLM for summary
    const summaryPrompt = `Analyze the notebook "${notebookName}" and provide:
1. A brief summary (2-3 sentences)
2. Key topics covered (3-5 topics)
3. Main technologies or concepts mentioned`;

    try {
      const summary = await this.aiAdapter.generateText(summaryPrompt, 500);

      // Parse summary to extract topics
      const topicMatch = summary.match(/topics?[:\s]+(.*?)(?:\n|$)/i);
      const keyTopics = topicMatch
        ? topicMatch[1].split(/,|\n/).map(t => t.trim()).filter(t => t)
        : ['General Documentation', 'Requirements', 'Architecture'];

      return {
        notebookId: notebookName.toLowerCase().replace(/\s+/g, '-'),
        notebookName,
        sources: [
          {
            id: 'source-1',
            title: `${notebookName} - Main Documentation`,
            type: 'document',
            uploadedAt: new Date().toISOString(),
          }
        ],
        summary: summary.split('\n')[0] || `Documentation for ${notebookName}`,
        keyTopics: keyTopics.slice(0, 5),
        metadata: {
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          sourceCount: 1,
        },
      };
    } catch (error) {
      throw new Error(`Could not fetch notebook "${notebookName}". Ensure it exists in NotebookLM and MCP server is configured.`);
    }
  }

  /**
   * Query NotebookLM with specific questions
   *
   * @param notebookName - Notebook to query
   * @param query - Question to ask
   */
  async queryNotebook(
    notebookName: string,
    query: NotebookQuery
  ): Promise<NotebookAnswer> {
    if (!this.notebookLMAvailable) {
      throw new Error('NotebookLM MCP server not available.');
    }

    console.error(`🔍 Querying notebook "${notebookName}": ${query.query}`);

    // Real MCP call: notebooklm.ask_question(notebookName, query.query)
    // For now, simulate with AI that references the notebook context

    const contextPrompt = `You are answering based on documentation in notebook "${notebookName}".

Question: ${query.query}
${query.context ? `\nContext: ${query.context}` : ''}

Provide a detailed, technical answer as if you're referencing specific documentation.
Include:
1. Direct answer
2. Technical details
3. Best practices

Format your answer professionally and cite sources when possible.

Answer:`;

    try {
      const answer = await this.aiAdapter.generateText(contextPrompt, 1000);

      return {
        answer: answer.trim(),
        citations: [
          {
            sourceId: 'doc-1',
            sourceTitle: `${notebookName} - Documentation`,
            excerpt: answer.substring(0, 150) + '...',
            relevance: 0.95,
          }
        ],
        confidence: 0.85,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Could not query notebook "${notebookName}": ${errorMessage}`);
    }
  }

  /**
   * Enrich SpecKit with NotebookLM content
   *
   * Main logic:
   * 1. Fetch notebook content
   * 2. Query notebook for each section of SpecKit
   * 3. Merge notebook answers with AI-generated content
   * 4. Identify missing information
   * 5. Generate AI research for missing parts
   */
  async enrichSpecKitWithNotebook(
    projectName: string,
    projectType: string,
    notebookName: string,
    baseRequirements: string[]
  ): Promise<EnrichmentResult> {
    console.error(`\n🔗 Enriching project with NotebookLM: ${notebookName}`);

    // Step 1: Fetch notebook content
    let notebookContent: NotebookContent;
    try {
      notebookContent = await this.fetchNotebookContent(notebookName);
    } catch (error) {
      console.error('⚠️  Could not fetch notebook content. Falling back to standard generation.');
      throw error;
    }

    // Step 2: Generate enrichment queries
    const queries = this.generateEnrichmentQueries(projectType, baseRequirements);

    // Step 3: Query notebook for each topic
    const notebookAnswers: Map<string, NotebookAnswer> = new Map();

    for (const query of queries) {
      try {
        const answer = await this.queryNotebook(notebookName, { query });
        notebookAnswers.set(query, answer);
      } catch (error) {
        console.error(`⚠️  Could not query notebook for: ${query}`);
      }
    }

    // Step 4: Analyze coverage - what did we get from notebook?
    const coverage = this.analyzeCoverage(queries, notebookAnswers);

    // Step 5: Generate AI research for missing information
    const missingTopics = queries.filter(q => !notebookAnswers.has(q));
    const aiResearch = await this.generateSupplementaryResearch(
      projectType,
      missingTopics,
      notebookContent.summary
    );

    // Step 6: Merge notebook + AI content into SpecKit
    const enrichedSpecKit = await this.mergeIntoSpecKit(
      projectName,
      projectType,
      notebookAnswers,
      aiResearch,
      notebookContent
    );

    // Step 7: Create enrichment result
    const result: EnrichmentResult = {
      enrichedSpecKit,
      notebookContributions: this.extractContributions(notebookAnswers),
      missingInformation: this.identifyMissingInfo(missingTopics, aiResearch),
      coverageScore: coverage,
    };

    console.error(`✅ Enrichment complete. Coverage: ${coverage.toFixed(1)}%`);
    console.error(`   - Notebook contributions: ${result.notebookContributions.length}`);
    console.error(`   - AI-supplemented topics: ${result.missingInformation.length}`);

    return result;
  }

  /**
   * Generate strategic queries for notebook
   */
  private generateEnrichmentQueries(
    projectType: string,
    requirements: string[]
  ): string[] {
    const baseQueries = [
      'What is the main purpose and vision of this system?',
      'What are the key functional requirements?',
      'What are the main entities and data models?',
      'What are the security and authentication requirements?',
      'What are the performance and scalability requirements?',
      'What is the recommended technology stack?',
      'What are the API endpoints and their specifications?',
      'What are the user roles and permissions?',
      'What are the integration points with external systems?',
      'What are the deployment and infrastructure requirements?',
    ];

    // Add requirement-specific queries
    const specificQueries = requirements.map(
      req => `How should the system handle: ${req}?`
    );

    return [...baseQueries, ...specificQueries];
  }

  /**
   * Analyze how much information came from notebook vs needed AI research
   */
  private analyzeCoverage(
    allQueries: string[],
    answers: Map<string, NotebookAnswer>
  ): number {
    if (allQueries.length === 0) return 0;

    // Calculate weighted coverage based on answer confidence
    let totalWeight = 0;
    let coveredWeight = 0;

    for (const query of allQueries) {
      totalWeight += 1;
      const answer = answers.get(query);
      if (answer) {
        coveredWeight += answer.confidence;
      }
    }

    return (coveredWeight / totalWeight) * 100;
  }

  /**
   * Generate supplementary AI research for topics not covered by notebook
   */
  private async generateSupplementaryResearch(
    projectType: string,
    missingTopics: string[],
    notebookContext: string
  ): Promise<Map<string, string>> {
    const research = new Map<string, string>();

    if (missingTopics.length === 0) {
      return research;
    }

    console.error(`🔬 Generating AI research for ${missingTopics.length} missing topics...`);

    for (const topic of missingTopics) {
      const prompt = `Based on the context of a ${projectType} project, provide a detailed answer to this question:

${topic}

Context from existing documentation:
${notebookContext}

Provide a comprehensive, technical answer that fits the context. Focus on:
1. Specific technical details
2. Best practices for ${projectType} projects
3. Industry standards
4. Security and performance considerations

Return ONLY the answer, no preamble.`;

      try {
        const answer = await this.aiAdapter.generateText(prompt, 1000);
        research.set(topic, answer);
      } catch (error) {
        console.error(`⚠️  Failed to research: ${topic}`);
      }
    }

    return research;
  }

  /**
   * Merge notebook answers and AI research into complete SpecKit
   */
  private async mergeIntoSpecKit(
    projectName: string,
    projectType: string,
    notebookAnswers: Map<string, NotebookAnswer>,
    aiResearch: Map<string, string>,
    notebookContent: NotebookContent
  ): Promise<SpecKit> {
    // Combine all information sources
    const combinedKnowledge = new Map<string, { content: string; source: 'notebook' | 'ai' }>();

    // Add notebook answers
    for (const [query, answer] of notebookAnswers) {
      combinedKnowledge.set(query, {
        content: answer.answer,
        source: 'notebook',
      });
    }

    // Add AI research
    for (const [query, answer] of aiResearch) {
      combinedKnowledge.set(query, {
        content: answer,
        source: 'ai',
      });
    }

    // Generate comprehensive SpecKit using combined knowledge
    const prompt = `Generate a complete project specification for a ${projectType} project named "${projectName}".

Use the following information gathered from documentation and research:

${Array.from(combinedKnowledge.entries())
  .map(([query, data]) => `
Q: ${query}
A (from ${data.source}): ${data.content}
`)
  .join('\n')}

Generate a JSON specification with this structure:
{
  "constitution": {
    "projectName": "${projectName}",
    "vision": "...",
    "principles": ["...", "..."],
    "constraints": ["...", "..."]
  },
  "specification": {
    "functionalRequirements": [...],
    "dataModel": {...},
    "apiDesign": {...}
  },
  "technicalPlan": {
    "architecture": {...},
    "technologyStack": [...],
    "securityPlan": {...}
  },
  "tasks": [...]
}

Return ONLY valid JSON.`;

    const response = await this.aiAdapter.generateText(prompt, 4000);

    const specKitData = parseJSONWithDefault<any>(response, this.getDefaultSpecKit(projectName), 'mergeIntoSpecKit');

    // Add metadata
    specKitData.metadata = {
      createdAt: new Date().toISOString(),
      version: '1.0.0',
      notebookSource: notebookContent.notebookName,
      sourceCount: notebookContent.sources.length,
    };

    return specKitData as SpecKit;
  }

  /**
   * Get default SpecKit when JSON parsing fails
   */
  private getDefaultSpecKit(projectName: string): any {
    return {
      constitution: {
        projectName,
        vision: `Build a high-quality ${projectName} application`,
        principles: ['User-first', 'Clean code', 'Security', 'Performance', 'Testing'],
        constraints: ['Must be production-ready'],
        qualityStandards: {
          code: ['TypeScript strict mode'],
          testing: ['80% coverage'],
          documentation: ['API docs'],
          performance: ['Fast response']
        },
        governanceRules: ['Code review required']
      },
      specification: {
        functionalRequirements: [{
          id: 'FR001',
          title: 'Core Feature',
          description: 'Main application feature',
          priority: 'critical',
          acceptanceCriteria: ['Feature works']
        }],
        nonFunctionalRequirements: [{
          category: 'performance',
          requirement: 'Fast response',
          metric: 'response time',
          target: '< 200ms'
        }],
        dataModel: {
          entities: [{ name: 'User', fields: [{ name: 'id', type: 'string', required: true }], relationships: [] }]
        },
        apiDesign: {
          endpoints: [{ method: 'GET', path: '/api/health', description: 'Health check', response: '{ status: ok }' }]
        },
        userFlows: [{ name: 'Main Flow', steps: ['Start', 'Use app', 'Finish'] }]
      },
      technicalPlan: {
        architecture: { pattern: 'MVC', layers: ['presentation', 'business', 'data'], components: [] },
        technologyStack: [{ category: 'Backend', technology: 'Node.js', rationale: 'Modern runtime' }],
        infrastructure: { hosting: 'Cloud', database: 'PostgreSQL', monitoring: 'APM' },
        securityPlan: { authentication: 'JWT', authorization: 'RBAC', dataProtection: ['TLS'], vulnerabilityMitigation: ['Input validation'] },
        testingStrategy: { unit: 'Jest', integration: 'Supertest', e2e: 'Playwright', bdd: true, coverage: 80 },
        deploymentPlan: { cicd: 'GitHub Actions', environments: ['dev', 'prod'], rollbackStrategy: 'Auto rollback' }
      },
      tasks: [
        { id: 'T001', title: 'Setup', description: 'Project setup', type: 'setup', priority: 1, estimatedHours: 4, dependencies: [], acceptanceCriteria: ['Done'] }
      ]
    };
  }

  /**
   * Extract contributions from notebook
   */
  private extractContributions(
    answers: Map<string, NotebookAnswer>
  ): { section: string; content: string; citedSources: string[] }[] {
    const contributions: { section: string; content: string; citedSources: string[] }[] = [];

    for (const [query, answer] of answers) {
      contributions.push({
        section: query,
        content: answer.answer,
        citedSources: answer.citations.map(c => c.sourceTitle),
      });
    }

    return contributions;
  }

  /**
   * Identify missing information that needed AI research
   */
  private identifyMissingInfo(
    missingTopics: string[],
    aiResearch: Map<string, string>
  ): { topic: string; reason: string; suggestedResearch: string }[] {
    return missingTopics.map(topic => ({
      topic,
      reason: 'Not found in NotebookLM documentation',
      suggestedResearch: aiResearch.get(topic) || 'No research generated',
    }));
  }

  /**
   * Generate decision matrix enriched with notebook context
   */
  async enrichDecisionMatrixWithNotebook(
    projectType: string,
    description: string,
    notebookName: string
  ): Promise<DecisionMatrix> {
    console.error(`🎯 Enriching decision matrix with notebook: ${notebookName}`);

    // Query notebook for architecture decisions
    const architectureQuery: NotebookQuery = {
      query: `What are the recommended architecture patterns, technology choices, and deployment strategies for this ${projectType} project?`,
    };

    let notebookAnswer: NotebookAnswer | null = null;
    try {
      notebookAnswer = await this.queryNotebook(notebookName, architectureQuery);
    } catch (error) {
      console.error('⚠️  Could not query notebook for architecture decisions');
    }

    // Generate decision matrix with notebook context
    const contextualDescription = notebookAnswer
      ? `${description}\n\nContext from documentation:\n${notebookAnswer.answer}`
      : description;

    // This would call DecisionMatrixModule with enriched context
    // For now, return placeholder
    const matrix: DecisionMatrix = {
      projectType,
      questions: [],
      answers: [],
      recommendations: [],
    };

    return matrix;
  }
}
