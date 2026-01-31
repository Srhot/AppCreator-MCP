/**
 * Decision Matrix Module
 *
 * Asks user questions before project generation to gather requirements
 * and make informed decisions about architecture, stack, and approach.
 */

import { AIAdapter } from '../adapters/ai-adapter.interface.js';
import { parseJSONWithDefault } from '../utils/json-parser.js';

export interface MatrixQuestion {
  id: string;
  question: string;
  type: 'choice' | 'text' | 'multiple';
  options?: string[];
  category: 'architecture' | 'technology' | 'feature' | 'deployment' | 'quality';
}

export interface MatrixAnswer {
  questionId: string;
  answer: string | string[];
}

export interface DecisionMatrix {
  projectType: string;
  questions: MatrixQuestion[];
  answers: MatrixAnswer[];
  recommendations: string[];
}

export class DecisionMatrixModule {
  private aiAdapter: AIAdapter;

  constructor(aiAdapter: AIAdapter) {
    this.aiAdapter = aiAdapter;
  }

  /**
   * Generate decision matrix questions based on project type and description
   */
  async generateQuestions(
    projectType: string,
    description: string
  ): Promise<MatrixQuestion[]> {
    const prompt = `You are a software architecture expert. Generate a decision matrix with 5-8 critical questions for a ${projectType} project.

Project Description: ${description}

Generate questions in these categories:
1. Architecture (e.g., monolith vs microservices, layers, patterns)
2. Technology (e.g., database choice, frameworks, libraries)
3. Features (e.g., authentication method, API design, caching)
4. Deployment (e.g., cloud provider, containerization, CI/CD)
5. Quality (e.g., testing strategy, monitoring, logging)

For each question, provide:
- Clear question text
- Type: "choice" or "text"
- Options (if choice type)
- Category

Return ONLY valid JSON array of questions with this structure:
[
  {
    "id": "arch_01",
    "question": "What architecture pattern do you prefer?",
    "type": "choice",
    "options": ["Monolithic", "Microservices", "Serverless"],
    "category": "architecture"
  }
]

IMPORTANT: Return ONLY the JSON array, no markdown, no explanation.`;

    const response = await this.aiAdapter.generateText(prompt, 2000);
    return parseJSONWithDefault<MatrixQuestion[]>(response, this.getDefaultQuestions(projectType), 'generateQuestions');
  }

  /**
   * Get default questions when AI generation fails
   */
  private getDefaultQuestions(projectType: string): MatrixQuestion[] {
    return [
      { id: 'arch_01', question: 'What overall architecture pattern should we adopt?', type: 'choice', options: ['Monolithic', 'Microservices', 'Serverless', 'Hybrid'], category: 'architecture' },
      { id: 'tech_01', question: 'Which database solution should we use?', type: 'choice', options: ['PostgreSQL', 'MongoDB', 'MySQL', 'Firebase'], category: 'technology' },
      { id: 'tech_02', question: 'What frontend framework should we use?', type: 'choice', options: ['React', 'Vue', 'Angular', 'Native'], category: 'technology' },
      { id: 'feat_01', question: 'How should users authenticate?', type: 'choice', options: ['Email/Password', 'Social Login', 'OAuth2', 'All options'], category: 'feature' },
      { id: 'deploy_01', question: 'Which cloud provider should we use?', type: 'choice', options: ['AWS', 'Google Cloud', 'Azure', 'Self-hosted'], category: 'deployment' },
      { id: 'quality_01', question: 'What testing strategy should we implement?', type: 'choice', options: ['Unit tests only', 'Unit + Integration', 'Full coverage with E2E', 'TDD approach'], category: 'quality' }
    ];
  }

  /**
   * Analyze answers and generate recommendations
   */
  async analyzeAnswers(
    questions: MatrixQuestion[],
    answers: MatrixAnswer[]
  ): Promise<string[]> {
    const qaText = questions.map(q => {
      const answer = answers.find(a => a.questionId === q.id);
      return `Q: ${q.question}\nA: ${JSON.stringify(answer?.answer || 'Not answered')}`;
    }).join('\n\n');

    const prompt = `You are a software architecture advisor. Based on the following Q&A, provide 5-7 specific technical recommendations for the project.

${qaText}

Provide recommendations about:
- Specific technologies/frameworks to use
- Architecture patterns to implement
- Best practices to follow
- Potential challenges to address
- Testing strategies
- Deployment considerations

Return recommendations as a JSON array of strings:
["Recommendation 1", "Recommendation 2", ...]

IMPORTANT: Return ONLY the JSON array, no markdown, no explanation.`;

    const response = await this.aiAdapter.generateText(prompt, 1500);
    return parseJSONWithDefault<string[]>(response, this.getDefaultRecommendations(), 'analyzeAnswers');
  }

  /**
   * Get default recommendations when AI generation fails
   */
  private getDefaultRecommendations(): string[] {
    return [
      'Use TypeScript for type safety',
      'Implement comprehensive error handling',
      'Set up CI/CD pipeline early',
      'Write unit tests with 80%+ coverage',
      'Use environment variables for configuration',
      'Implement logging and monitoring',
      'Follow security best practices'
    ];
  }

  /**
   * Create complete decision matrix
   */
  async createMatrix(
    projectType: string,
    description: string
  ): Promise<DecisionMatrix> {
    const questions = await this.generateQuestions(projectType, description);

    return {
      projectType,
      questions,
      answers: [],
      recommendations: [],
    };
  }

  /**
   * Complete matrix with answers and generate recommendations
   */
  async completeMatrix(
    matrix: DecisionMatrix,
    answers: MatrixAnswer[]
  ): Promise<DecisionMatrix> {
    matrix.answers = answers;
    matrix.recommendations = await this.analyzeAnswers(matrix.questions, answers);
    return matrix;
  }

  /**
   * Generate user-friendly matrix summary
   */
  generateSummary(matrix: DecisionMatrix): string {
    let summary = `# Decision Matrix - ${matrix.projectType}\n\n`;
    summary += `## Questions & Answers\n\n`;

    matrix.questions.forEach(q => {
      const answer = matrix.answers.find(a => a.questionId === q.id);
      summary += `### ${q.category.toUpperCase()}: ${q.question}\n`;
      summary += `**Answer:** ${JSON.stringify(answer?.answer || 'Not answered')}\n\n`;
    });

    if (matrix.recommendations.length > 0) {
      summary += `## Recommendations\n\n`;
      matrix.recommendations.forEach((rec, i) => {
        summary += `${i + 1}. ${rec}\n`;
      });
    }

    return summary;
  }
}
