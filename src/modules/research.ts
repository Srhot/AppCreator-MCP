/**
 * Research Module - Tech Stack Research & Analysis
 *
 * This module uses Claude AI to research technology stacks and
 * applies the DecisionMatrix to score and rank options.
 *
 * Process:
 * 1. Claude researches tech stacks based on project requirements
 * 2. DecisionMatrix scores each option
 * 3. Returns comprehensive analysis with recommendations
 */

import Anthropic from '@anthropic-ai/sdk';
import { DecisionMatrix, type StackOption, type ScoredStack } from '../core/decision-matrix.js';

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
 * Research arguments
 */
export interface ResearchArgs {
  project_description: string;
  requirements: string[];
  constraints: string[];
  project_type?: string;
  team_experience?: string[];
  timeline_months?: number;
  budget_level?: 'low' | 'medium' | 'high';
}

/**
 * Research result
 */
export interface ResearchResult {
  stacks: ScoredStack[];
  recommendation: string;
  comparisonTable: string;
  detailedAnalysis: string;
  researchRationale: string;
}

/**
 * Research Module Class
 *
 * Conducts AI-powered technology stack research and applies
 * quantitative scoring to provide data-driven recommendations.
 */
export class ResearchModule {
  private anthropic: Anthropic;
  private decisionMatrix: DecisionMatrix;
  private model: string = 'claude-sonnet-4-20250514';

  constructor(apiKey: string) {
    this.anthropic = new Anthropic({ apiKey });
    this.decisionMatrix = new DecisionMatrix();
  }

  /**
   * Execute research for a project
   *
   * This is the main entry point called by the MCP server.
   */
  async execute(args: ResearchArgs): Promise<MCPToolResponse> {
    try {
      // Validate inputs
      this.validateArgs(args);

      // Step 1: Research tech stacks using Claude
      const researchPrompt = this.buildResearchPrompt(args);
      const researchResponse = await this.callClaude(researchPrompt);

      // Step 2: Parse Claude's response into stack options
      const stacks = this.parseStackOptions(researchResponse);

      if (stacks.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: '⚠️ No valid tech stack options could be extracted from research. Please try again with more specific requirements.',
            },
          ],
          isError: true,
        };
      }

      // Step 3: Score stacks using DecisionMatrix
      const scoredStacks = this.decisionMatrix.score(stacks, args.requirements, args.constraints);

      // Step 4: Generate comprehensive report
      const report = this.generateReport(scoredStacks, args, researchResponse);

      return {
        content: [
          {
            type: 'text',
            text: report,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Research failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * Validate research arguments
   */
  private validateArgs(args: ResearchArgs): void {
    if (!args.project_description || args.project_description.trim() === '') {
      throw new Error('project_description is required');
    }

    if (!args.requirements || args.requirements.length === 0) {
      throw new Error('requirements array is required and must not be empty');
    }

    if (!args.constraints) {
      args.constraints = [];
    }
  }

  /**
   * Build research prompt for Claude
   */
  private buildResearchPrompt(args: ResearchArgs): string {
    return `You are a senior software architect with 15+ years of experience across multiple technology stacks, frameworks, and architectures.

Your task is to research and recommend the best technology stack options for a new project.

## PROJECT DETAILS

**Description:**
${args.project_description}

**Requirements:**
${args.requirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

**Constraints:**
${args.constraints.length > 0 ? args.constraints.map((con, i) => `${i + 1}. ${con}`).join('\n') : 'None specified'}

${args.project_type ? `**Project Type:** ${args.project_type}\n` : ''}
${args.team_experience && args.team_experience.length > 0 ? `**Team Experience:** ${args.team_experience.join(', ')}\n` : ''}
${args.timeline_months ? `**Timeline:** ${args.timeline_months} months\n` : ''}
${args.budget_level ? `**Budget Level:** ${args.budget_level}\n` : ''}

## YOUR TASK

Research and provide **4-5 distinct technology stack options** that could work for this project.

For EACH stack option, provide:

1. **Name:** Full stack name (e.g., "React + TypeScript + Node.js + PostgreSQL")

2. **Pros:** List 5-7 specific advantages
   - Focus on: scalability, maintainability, ecosystem, development speed, cost
   - Be specific and technical

3. **Cons:** List 3-5 specific disadvantages
   - Be honest about limitations
   - Include learning curve, complexity, or performance issues if applicable

4. **Architecture:** Describe the architectural pattern (e.g., "Microservices with REST API", "Monolithic MVC", "Serverless with BaaS")

5. **Timeline:** Estimated development timeline (e.g., "Fast - 3-4 months for MVP", "Medium - 5-6 months")

6. **Budget:** Cost estimate (e.g., "Low - Free open source", "Medium - ~$200/month hosting", "High - Enterprise licenses required")

## OUTPUT FORMAT

Provide your response in the following exact format:

---STACK-START---
NAME: [Full stack name]
PROS:
- [Advantage 1]
- [Advantage 2]
- [Advantage 3]
- [Advantage 4]
- [Advantage 5]
CONS:
- [Disadvantage 1]
- [Disadvantage 2]
- [Disadvantage 3]
ARCHITECTURE: [Architecture description]
TIMELINE: [Timeline estimate]
BUDGET: [Budget estimate]
---STACK-END---

Repeat this format for each of the 4-5 stack options.

After listing all stacks, provide a brief rationale (2-3 sentences) explaining your research approach and key factors considered.

IMPORTANT:
- Be objective and balanced
- Consider the specific requirements and constraints
- Include diverse options (e.g., different languages, frameworks, architectures)
- Ensure each stack is production-ready and well-supported
- Focus on modern, actively maintained technologies`;
  }

  /**
   * Call Claude API for research
   */
  private async callClaude(prompt: string): Promise<string> {
    const message = await this.anthropic.messages.create({
      model: this.model,
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract text from response
    const textContent = message.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in Claude response');
    }

    return textContent.text;
  }

  /**
   * Parse stack options from Claude's response
   */
  private parseStackOptions(response: string): StackOption[] {
    const stacks: StackOption[] = [];
    const stackRegex = /---STACK-START---\s*NAME:\s*(.+?)\s*PROS:\s*((?:-.+?\n)+)\s*CONS:\s*((?:-.+?\n)+)\s*ARCHITECTURE:\s*(.+?)\s*TIMELINE:\s*(.+?)\s*BUDGET:\s*(.+?)\s*---STACK-END---/gs;

    let match;
    while ((match = stackRegex.exec(response)) !== null) {
      const [, name, prosText, consText, architecture, timeline, budget] = match;

      // Parse pros and cons (lines starting with -)
      const pros = prosText
        .split('\n')
        .filter((line) => line.trim().startsWith('-'))
        .map((line) => line.trim().substring(1).trim())
        .filter((line) => line.length > 0);

      const cons = consText
        .split('\n')
        .filter((line) => line.trim().startsWith('-'))
        .map((line) => line.trim().substring(1).trim())
        .filter((line) => line.length > 0);

      // Only add if we have valid data
      if (name && pros.length > 0 && cons.length > 0) {
        stacks.push({
          name: name.trim(),
          pros,
          cons,
          architecture: architecture.trim(),
          timeline: timeline.trim(),
          budget: budget.trim(),
        });
      }
    }

    return stacks;
  }

  /**
   * Generate comprehensive research report
   */
  private generateReport(
    scoredStacks: ScoredStack[],
    args: ResearchArgs,
    rawResearch: string
  ): string {
    // Extract research rationale if present
    const rationaleMatch = rawResearch.match(/---STACK-END---\s*(.+?)$/s);
    const rationale = rationaleMatch ? rationaleMatch[1].trim() : 'Research completed based on project requirements.';

    const winner = scoredStacks[0];
    const runnerUp = scoredStacks.length > 1 ? scoredStacks[1] : null;

    const report = `# 🔍 Tech Stack Research Report

## Project Overview

**Description:** ${args.project_description}

**Requirements:**
${args.requirements.map((req) => `- ${req}`).join('\n')}

**Constraints:**
${args.constraints.length > 0 ? args.constraints.map((con) => `- ${con}`).join('\n') : '- None specified'}

---

## 🏆 Recommended Stack: ${winner.name}

**Overall Score:** ${winner.score}/100
**Ranking:** #${winner.ranking}
${winner.recommendation}

### Score Breakdown

| Criterion | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Scalability | ${winner.breakdown.scalability}/100 | 20% | ${(winner.breakdown.scalability * 0.2).toFixed(1)} |
| Maintainability | ${winner.breakdown.maintainability}/100 | 20% | ${(winner.breakdown.maintainability * 0.2).toFixed(1)} |
| Learning Curve | ${winner.breakdown.learning_curve}/100 | 15% | ${(winner.breakdown.learning_curve * 0.15).toFixed(1)} |
| Ecosystem | ${winner.breakdown.ecosystem}/100 | 15% | ${(winner.breakdown.ecosystem * 0.15).toFixed(1)} |
| Cost | ${winner.breakdown.cost}/100 | 10% | ${(winner.breakdown.cost * 0.1).toFixed(1)} |
| Team Fit | ${winner.breakdown.team_fit}/100 | 10% | ${(winner.breakdown.team_fit * 0.1).toFixed(1)} |
| Timeline Fit | ${winner.breakdown.timeline_fit}/100 | 10% | ${(winner.breakdown.timeline_fit * 0.1).toFixed(1)} |

### Architecture
${winner.architecture}

### Timeline
${winner.timeline}

### Budget
${winner.budget}

### Pros
${winner.pros.map((pro) => `✅ ${pro}`).join('\n')}

### Cons
${winner.cons.map((con) => `⚠️ ${con}`).join('\n')}

${runnerUp ? `---

## 🥈 Alternative: ${runnerUp.name}

**Score:** ${runnerUp.score}/100
${runnerUp.recommendation}

Consider this option if:
- Primary recommendation has blockers
- Team has specific expertise with this stack
- Budget or timeline constraints change

` : ''}---

## 📊 All Options Compared

${this.decisionMatrix.generateComparisonTable(scoredStacks)}

---

## 📋 Detailed Analysis

${scoredStacks.map((stack, index) => {
      const header = `### ${index + 1}. ${stack.name} (Score: ${stack.score}/100)`;
      const breakdown = `
**Architecture:** ${stack.architecture}
**Timeline:** ${stack.timeline}
**Budget:** ${stack.budget}

**Strengths:**
${stack.pros.slice(0, 3).map((pro) => `- ${pro}`).join('\n')}

**Weaknesses:**
${stack.cons.slice(0, 2).map((con) => `- ${con}`).join('\n')}
`;
      return header + '\n' + breakdown;
    }).join('\n')}

---

## 🎯 Research Methodology

${rationale}

**Scoring Criteria:**
- **Scalability (20%):** Ability to handle growth and traffic
- **Maintainability (20%):** Code quality and long-term maintenance
- **Learning Curve (15%):** Ease of adoption for team
- **Ecosystem (15%):** Library and community support
- **Cost (10%):** Infrastructure and licensing expenses
- **Team Fit (10%):** Alignment with team expertise
- **Timeline Fit (10%):** Development speed and time to market

---

## 💡 Next Steps

1. **Review** the recommended stack (${winner.name})
2. **Validate** against team expertise and constraints
3. **Prototype** a small proof of concept
4. **Confirm** architecture decisions with stakeholders
5. **Proceed** with project setup using the chosen stack

---

*Report generated by AppCreator Research Module*
*Powered by Claude ${this.model} + DecisionMatrix*
`;

    return report;
  }

  /**
   * Get current model
   */
  getModel(): string {
    return this.model;
  }

  /**
   * Set model (for testing or using different Claude versions)
   */
  setModel(model: string): void {
    this.model = model;
  }

  /**
   * Get decision matrix instance (for custom weight adjustment)
   */
  getDecisionMatrix(): DecisionMatrix {
    return this.decisionMatrix;
  }

  /**
   * Quick research helper
   *
   * Simplified interface for basic research without custom context.
   */
  async quickResearch(
    projectDescription: string,
    requirements: string[],
    constraints: string[] = []
  ): Promise<ResearchResult> {
    const response = await this.execute({
      project_description: projectDescription,
      requirements,
      constraints,
    });

    if (response.isError) {
      throw new Error(response.content[0].text);
    }

    // Parse the response to extract structured data
    const reportText = response.content[0].text;

    // Extract recommended stack name
    const stackMatch = reportText.match(/## 🏆 Recommended Stack: (.+)/);
    const recommendedStack = stackMatch ? stackMatch[1] : 'Unknown';

    return {
      stacks: [], // Would need to re-parse from report
      recommendation: recommendedStack,
      comparisonTable: '', // Extracted from report
      detailedAnalysis: reportText,
      researchRationale: '',
    };
  }
}

/**
 * Create a research module instance
 */
export function createResearchModule(apiKey: string): ResearchModule {
  return new ResearchModule(apiKey);
}
