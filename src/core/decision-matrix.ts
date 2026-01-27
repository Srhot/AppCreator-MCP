/**
 * Decision Matrix - Tech Stack Scoring System
 *
 * This class evaluates and scores technology stack options based on
 * multiple weighted criteria to help make informed architectural decisions.
 *
 * Criteria:
 * - Scalability (20%): How well does it scale?
 * - Maintainability (20%): How easy is it to maintain?
 * - Learning Curve (15%): How easy is it to learn?
 * - Ecosystem (15%): Library/tool availability
 * - Cost (10%): Infrastructure and licensing costs
 * - Team Fit (10%): Does it match team expertise?
 * - Timeline Fit (10%): Can we deliver on time?
 */

/**
 * Stack option interface
 */
export interface StackOption {
  name: string;
  pros: string[];
  cons: string[];
  architecture: string;
  timeline: string;
  budget: string;
}

/**
 * Score breakdown by criteria
 */
export interface ScoreBreakdown {
  scalability: number;
  maintainability: number;
  learning_curve: number;
  ecosystem: number;
  cost: number;
  team_fit: number;
  timeline_fit: number;
}

/**
 * Scored stack with calculated score
 */
export interface ScoredStack extends StackOption {
  score: number; // 0-100
  breakdown: ScoreBreakdown;
  ranking?: number;
  recommendation?: string;
}

/**
 * Criteria weights interface
 */
export interface CriteriaWeights {
  scalability: number;
  maintainability: number;
  learning_curve: number;
  ecosystem: number;
  cost: number;
  team_fit: number;
  timeline_fit: number;
}

/**
 * Scoring context
 */
export interface ScoringContext {
  requirements: string[];
  constraints: string[];
  teamExperience: string[];
  projectType: string;
  timelineMonths: number;
  budgetLevel: 'low' | 'medium' | 'high';
}

/**
 * Decision Matrix Class
 *
 * Evaluates technology stacks using a weighted scoring system.
 */
export class DecisionMatrix {
  private weights: CriteriaWeights = {
    scalability: 0.2,
    maintainability: 0.2,
    learning_curve: 0.15,
    ecosystem: 0.15,
    cost: 0.1,
    team_fit: 0.1,
    timeline_fit: 0.1,
  };

  /**
   * Constructor with optional custom weights
   */
  constructor(customWeights?: Partial<CriteriaWeights>) {
    if (customWeights) {
      this.weights = { ...this.weights, ...customWeights };
      this.normalizeWeights();
    }
  }

  /**
   * Score multiple stack options
   *
   * @param stacks - Array of stack options to evaluate
   * @param requirements - Project requirements
   * @param constraints - Project constraints
   * @returns Sorted array of scored stacks (highest first)
   */
  score(
    stacks: StackOption[],
    requirements: string[] = [],
    constraints: string[] = []
  ): ScoredStack[] {
    // Create scoring context
    const context: ScoringContext = {
      requirements,
      constraints,
      teamExperience: [],
      projectType: 'web',
      timelineMonths: 6,
      budgetLevel: 'medium',
    };

    // Score each stack
    const scoredStacks: ScoredStack[] = stacks.map((stack) => {
      const breakdown = this.calculateBreakdown(stack, context);
      const score = this.calculateWeightedScore(breakdown);

      return {
        ...stack,
        score,
        breakdown,
      };
    });

    // Sort by score (highest first)
    scoredStacks.sort((a, b) => b.score - a.score);

    // Add rankings and recommendations
    scoredStacks.forEach((stack, index) => {
      stack.ranking = index + 1;
      stack.recommendation = this.generateRecommendation(stack, index, scoredStacks.length);
    });

    return scoredStacks;
  }

  /**
   * Score with detailed context
   */
  scoreWithContext(stacks: StackOption[], context: ScoringContext): ScoredStack[] {
    const scoredStacks: ScoredStack[] = stacks.map((stack) => {
      const breakdown = this.calculateBreakdown(stack, context);
      const score = this.calculateWeightedScore(breakdown);

      return {
        ...stack,
        score,
        breakdown,
      };
    });

    scoredStacks.sort((a, b) => b.score - a.score);

    scoredStacks.forEach((stack, index) => {
      stack.ranking = index + 1;
      stack.recommendation = this.generateRecommendation(stack, index, scoredStacks.length);
    });

    return scoredStacks;
  }

  /**
   * Calculate score breakdown for a stack
   */
  private calculateBreakdown(stack: StackOption, context: ScoringContext): ScoreBreakdown {
    return {
      scalability: this.scoreScalability(stack, context),
      maintainability: this.scoreMaintainability(stack, context),
      learning_curve: this.scoreLearningCurve(stack, context),
      ecosystem: this.scoreEcosystem(stack, context),
      cost: this.scoreCost(stack, context),
      team_fit: this.scoreTeamFit(stack, context),
      timeline_fit: this.scoreTimelineFit(stack, context),
    };
  }

  /**
   * Calculate weighted total score
   */
  private calculateWeightedScore(breakdown: ScoreBreakdown): number {
    let totalScore = 0;

    totalScore += breakdown.scalability * this.weights.scalability;
    totalScore += breakdown.maintainability * this.weights.maintainability;
    totalScore += breakdown.learning_curve * this.weights.learning_curve;
    totalScore += breakdown.ecosystem * this.weights.ecosystem;
    totalScore += breakdown.cost * this.weights.cost;
    totalScore += breakdown.team_fit * this.weights.team_fit;
    totalScore += breakdown.timeline_fit * this.weights.timeline_fit;

    // Round to 1 decimal place
    return Math.round(totalScore * 10) / 10;
  }

  /**
   * Score scalability (0-100)
   */
  private scoreScalability(stack: StackOption, context: ScoringContext): number {
    let score = 50; // Base score

    // Check architecture type
    if (stack.architecture.toLowerCase().includes('microservices')) {
      score += 20;
    } else if (stack.architecture.toLowerCase().includes('serverless')) {
      score += 25;
    } else if (stack.architecture.toLowerCase().includes('monolith')) {
      score -= 10;
    }

    // Check for scalability mentions in pros
    const scalabilityKeywords = ['scalable', 'scale', 'distributed', 'cloud-native', 'horizontal'];
    const prosText = stack.pros.join(' ').toLowerCase();

    scalabilityKeywords.forEach((keyword) => {
      if (prosText.includes(keyword)) {
        score += 5;
      }
    });

    // Check for scalability issues in cons
    const consText = stack.cons.join(' ').toLowerCase();
    if (consText.includes('scale') || consText.includes('performance')) {
      score -= 15;
    }

    // Check requirements
    const requiresHighScale = context.requirements.some((req) =>
      req.toLowerCase().includes('scale') ||
      req.toLowerCase().includes('performance') ||
      req.toLowerCase().includes('high traffic')
    );

    if (requiresHighScale && score < 60) {
      score -= 10; // Penalty if requirements need scaling but stack is weak
    }

    return this.clampScore(score);
  }

  /**
   * Score maintainability (0-100)
   */
  private scoreMaintainability(stack: StackOption, context: ScoringContext): number {
    let score = 50;

    // Check for maintainability indicators in pros
    const maintainabilityKeywords = [
      'maintainable',
      'clean',
      'organized',
      'structured',
      'modular',
      'tested',
      'typescript',
      'type-safe',
    ];

    const prosText = stack.pros.join(' ').toLowerCase();
    maintainabilityKeywords.forEach((keyword) => {
      if (prosText.includes(keyword)) {
        score += 5;
      }
    });

    // Check for maintainability issues in cons
    const maintainabilityIssues = ['complex', 'boilerplate', 'verbose', 'confusing', 'messy'];
    const consText = stack.cons.join(' ').toLowerCase();

    maintainabilityIssues.forEach((issue) => {
      if (consText.includes(issue)) {
        score -= 5;
      }
    });

    // Architecture bonus
    if (stack.architecture.toLowerCase().includes('mvc')) {
      score += 10;
    }
    if (stack.architecture.toLowerCase().includes('clean')) {
      score += 15;
    }

    return this.clampScore(score);
  }

  /**
   * Score learning curve (0-100)
   * Higher score = easier to learn
   */
  private scoreLearningCurve(stack: StackOption, context: ScoringContext): number {
    let score = 50;

    // Easy to learn indicators
    const easyKeywords = ['easy', 'simple', 'beginner-friendly', 'intuitive', 'minimal'];
    const prosText = stack.pros.join(' ').toLowerCase();

    easyKeywords.forEach((keyword) => {
      if (prosText.includes(keyword)) {
        score += 8;
      }
    });

    // Hard to learn indicators
    const hardKeywords = ['steep learning curve', 'complex', 'difficult', 'advanced', 'complicated'];
    const consText = stack.cons.join(' ').toLowerCase();

    hardKeywords.forEach((keyword) => {
      if (consText.includes(keyword)) {
        score -= 10;
      }
    });

    // Timeline consideration
    if (context.timelineMonths < 3 && score < 60) {
      score -= 15; // Penalty for hard-to-learn stacks on tight timelines
    }

    return this.clampScore(score);
  }

  /**
   * Score ecosystem (0-100)
   */
  private scoreEcosystem(stack: StackOption, context: ScoringContext): number {
    let score = 50;

    // Ecosystem indicators
    const ecosystemKeywords = [
      'large ecosystem',
      'rich ecosystem',
      'many libraries',
      'plugins',
      'community',
      'popular',
      'widely adopted',
      'enterprise',
    ];

    const prosText = stack.pros.join(' ').toLowerCase();
    ecosystemKeywords.forEach((keyword) => {
      if (prosText.includes(keyword)) {
        score += 6;
      }
    });

    // Ecosystem issues
    const ecosystemIssues = ['small ecosystem', 'few libraries', 'niche', 'immature', 'new'];
    const consText = stack.cons.join(' ').toLowerCase();

    ecosystemIssues.forEach((issue) => {
      if (consText.includes(issue)) {
        score -= 8;
      }
    });

    // Check specific tech names for known ecosystems
    const stackName = stack.name.toLowerCase();
    if (
      stackName.includes('react') ||
      stackName.includes('node') ||
      stackName.includes('django') ||
      stackName.includes('rails')
    ) {
      score += 15; // Bonus for well-established ecosystems
    }

    return this.clampScore(score);
  }

  /**
   * Score cost (0-100)
   * Higher score = lower cost
   */
  private scoreCost(stack: StackOption, context: ScoringContext): number {
    let score = 50;

    // Budget level mapping
    const budgetScore: Record<string, number> = {
      low: 20,
      medium: 50,
      high: 80,
    };

    // Parse budget from stack
    const budget = stack.budget.toLowerCase();

    if (budget.includes('free') || budget.includes('low') || budget.includes('minimal')) {
      score = 85;
    } else if (budget.includes('medium') || budget.includes('moderate')) {
      score = 60;
    } else if (budget.includes('high') || budget.includes('expensive')) {
      score = 30;
    }

    // Cost-related keywords in cons
    const consText = stack.cons.join(' ').toLowerCase();
    if (consText.includes('expensive') || consText.includes('costly') || consText.includes('paid')) {
      score -= 15;
    }

    // Cost-related keywords in pros
    const prosText = stack.pros.join(' ').toLowerCase();
    if (prosText.includes('free') || prosText.includes('open source') || prosText.includes('low cost')) {
      score += 15;
    }

    // Adjust based on project budget
    if (context.budgetLevel === 'low' && score < 70) {
      score -= 10; // Penalty for expensive stacks on low budget
    }

    return this.clampScore(score);
  }

  /**
   * Score team fit (0-100)
   */
  private scoreTeamFit(stack: StackOption, context: ScoringContext): number {
    let score = 50;

    // Check if team has experience with this stack
    const stackName = stack.name.toLowerCase();
    const hasExperience = context.teamExperience.some((exp) => stackName.includes(exp.toLowerCase()));

    if (hasExperience) {
      score += 30;
    }

    // Check for transfer of knowledge
    const prosText = stack.pros.join(' ').toLowerCase();
    if (prosText.includes('similar to') || prosText.includes('familiar')) {
      score += 15;
    }

    // Check for team fit issues
    const consText = stack.cons.join(' ').toLowerCase();
    if (consText.includes('requires experts') || consText.includes('specialized knowledge')) {
      score -= 15;
    }

    return this.clampScore(score);
  }

  /**
   * Score timeline fit (0-100)
   */
  private scoreTimelineFit(stack: StackOption, context: ScoringContext): number {
    let score = 50;

    // Parse timeline from stack
    const timeline = stack.timeline.toLowerCase();

    if (timeline.includes('fast') || timeline.includes('quick') || timeline.includes('rapid')) {
      score = 80;
    } else if (timeline.includes('medium') || timeline.includes('moderate')) {
      score = 60;
    } else if (timeline.includes('slow') || timeline.includes('long')) {
      score = 35;
    }

    // Match with project timeline
    if (context.timelineMonths < 3) {
      // Tight timeline
      if (timeline.includes('fast')) {
        score += 15;
      } else if (timeline.includes('slow')) {
        score -= 20;
      }
    }

    // Quick development indicators in pros
    const prosText = stack.pros.join(' ').toLowerCase();
    if (prosText.includes('quick') || prosText.includes('fast development') || prosText.includes('productive')) {
      score += 10;
    }

    // Slow development indicators in cons
    const consText = stack.cons.join(' ').toLowerCase();
    if (consText.includes('slow') || consText.includes('time-consuming') || consText.includes('boilerplate')) {
      score -= 10;
    }

    return this.clampScore(score);
  }

  /**
   * Clamp score to 0-100 range
   */
  private clampScore(score: number): number {
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generate recommendation text based on ranking
   */
  private generateRecommendation(stack: ScoredStack, index: number, total: number): string {
    if (index === 0) {
      if (stack.score >= 80) {
        return '🏆 Highly Recommended - Excellent fit for your requirements';
      } else if (stack.score >= 70) {
        return '✅ Recommended - Good fit with minor trade-offs';
      } else {
        return '⚠️ Best of available options - Consider carefully';
      }
    } else if (index === 1) {
      return '🥈 Strong Alternative - Consider if primary choice has blockers';
    } else if (index === total - 1) {
      if (stack.score < 50) {
        return '❌ Not Recommended - Significant drawbacks for this project';
      } else {
        return '⚠️ Viable but not optimal - Use only if other options unavailable';
      }
    } else {
      return '📋 Viable Option - Reasonable choice with some trade-offs';
    }
  }

  /**
   * Normalize weights to ensure they sum to 1.0
   */
  private normalizeWeights(): void {
    const sum =
      this.weights.scalability +
      this.weights.maintainability +
      this.weights.learning_curve +
      this.weights.ecosystem +
      this.weights.cost +
      this.weights.team_fit +
      this.weights.timeline_fit;

    if (sum !== 1.0) {
      // Normalize each weight
      this.weights.scalability /= sum;
      this.weights.maintainability /= sum;
      this.weights.learning_curve /= sum;
      this.weights.ecosystem /= sum;
      this.weights.cost /= sum;
      this.weights.team_fit /= sum;
      this.weights.timeline_fit /= sum;
    }
  }

  /**
   * Get current weights
   */
  getWeights(): CriteriaWeights {
    return { ...this.weights };
  }

  /**
   * Update weights
   */
  updateWeights(newWeights: Partial<CriteriaWeights>): void {
    this.weights = { ...this.weights, ...newWeights };
    this.normalizeWeights();
  }

  /**
   * Generate comparison table
   */
  generateComparisonTable(scoredStacks: ScoredStack[]): string {
    const header = `
| Rank | Stack | Score | Scalability | Maintainability | Learning | Ecosystem | Cost | Team | Timeline |
|------|-------|-------|-------------|-----------------|----------|-----------|------|------|----------|`;

    const rows = scoredStacks.map((stack) => {
      const b = stack.breakdown;
      return `| ${stack.ranking} | ${stack.name} | ${stack.score} | ${b.scalability} | ${b.maintainability} | ${b.learning_curve} | ${b.ecosystem} | ${b.cost} | ${b.team_fit} | ${b.timeline_fit} |`;
    });

    return header + '\n' + rows.join('\n');
  }

  /**
   * Generate detailed report for a stack
   */
  generateDetailedReport(stack: ScoredStack): string {
    const report = `
# ${stack.name} - Detailed Analysis

**Overall Score:** ${stack.score}/100
**Ranking:** #${stack.ranking}
**Recommendation:** ${stack.recommendation}

## Score Breakdown

- **Scalability:** ${stack.breakdown.scalability}/100 (Weight: ${this.weights.scalability * 100}%)
- **Maintainability:** ${stack.breakdown.maintainability}/100 (Weight: ${this.weights.maintainability * 100}%)
- **Learning Curve:** ${stack.breakdown.learning_curve}/100 (Weight: ${this.weights.learning_curve * 100}%)
- **Ecosystem:** ${stack.breakdown.ecosystem}/100 (Weight: ${this.weights.ecosystem * 100}%)
- **Cost:** ${stack.breakdown.cost}/100 (Weight: ${this.weights.cost * 100}%)
- **Team Fit:** ${stack.breakdown.team_fit}/100 (Weight: ${this.weights.team_fit * 100}%)
- **Timeline Fit:** ${stack.breakdown.timeline_fit}/100 (Weight: ${this.weights.timeline_fit * 100}%)

## Architecture
${stack.architecture}

## Timeline
${stack.timeline}

## Budget
${stack.budget}

## Pros
${stack.pros.map((pro) => `- ${pro}`).join('\n')}

## Cons
${stack.cons.map((con) => `- ${con}`).join('\n')}
    `.trim();

    return report;
  }

  /**
   * Compare two stacks side-by-side
   */
  compareStacks(stack1: ScoredStack, stack2: ScoredStack): string {
    return `
# Stack Comparison: ${stack1.name} vs ${stack2.name}

| Criteria | ${stack1.name} | ${stack2.name} | Winner |
|----------|${'-'.repeat(stack1.name.length + 2)}|${'-'.repeat(stack2.name.length + 2)}|--------|
| Overall Score | ${stack1.score} | ${stack2.score} | ${stack1.score > stack2.score ? stack1.name : stack2.name} |
| Scalability | ${stack1.breakdown.scalability} | ${stack2.breakdown.scalability} | ${stack1.breakdown.scalability > stack2.breakdown.scalability ? stack1.name : stack2.name} |
| Maintainability | ${stack1.breakdown.maintainability} | ${stack2.breakdown.maintainability} | ${stack1.breakdown.maintainability > stack2.breakdown.maintainability ? stack1.name : stack2.name} |
| Learning Curve | ${stack1.breakdown.learning_curve} | ${stack2.breakdown.learning_curve} | ${stack1.breakdown.learning_curve > stack2.breakdown.learning_curve ? stack1.name : stack2.name} |
| Ecosystem | ${stack1.breakdown.ecosystem} | ${stack2.breakdown.ecosystem} | ${stack1.breakdown.ecosystem > stack2.breakdown.ecosystem ? stack1.name : stack2.name} |
| Cost | ${stack1.breakdown.cost} | ${stack2.breakdown.cost} | ${stack1.breakdown.cost > stack2.breakdown.cost ? stack1.name : stack2.name} |
| Team Fit | ${stack1.breakdown.team_fit} | ${stack2.breakdown.team_fit} | ${stack1.breakdown.team_fit > stack2.breakdown.team_fit ? stack1.name : stack2.name} |
| Timeline Fit | ${stack1.breakdown.timeline_fit} | ${stack2.breakdown.timeline_fit} | ${stack1.breakdown.timeline_fit > stack2.breakdown.timeline_fit ? stack1.name : stack2.name} |

**Recommendation:** ${stack1.score > stack2.score ? `Choose ${stack1.name}` : `Choose ${stack2.name}`}
    `.trim();
  }
}

/**
 * Create a decision matrix with default weights
 */
export function createDecisionMatrix(customWeights?: Partial<CriteriaWeights>): DecisionMatrix {
  return new DecisionMatrix(customWeights);
}

/**
 * Quick score helper
 *
 * Score stacks with minimal configuration.
 */
export function quickScore(
  stacks: StackOption[],
  requirements: string[] = [],
  constraints: string[] = []
): ScoredStack[] {
  const matrix = new DecisionMatrix();
  return matrix.score(stacks, requirements, constraints);
}
