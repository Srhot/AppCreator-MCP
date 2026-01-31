/**
 * BDD Test Generator
 *
 * Generates Cucumber/Gherkin tests for human-readable behavior specifications
 * Integrates with Spec-Kit to create comprehensive test coverage
 */

import { AIAdapter } from '../adapters/ai-adapter.interface.js';
import { Specification, Task } from './spec-kit.js';
import { parseJSONWithDefault } from '../utils/json-parser.js';

export interface GherkinScenario {
  name: string;
  given: string[];
  when: string[];
  then: string[];
  tags?: string[];
}

export interface GherkinFeature {
  name: string;
  description: string;
  background?: {
    given: string[];
  };
  scenarios: GherkinScenario[];
  tags: string[];
}

export interface BDDTestSuite {
  features: GherkinFeature[];
  stepDefinitions: {
    [key: string]: {
      pattern: string;
      implementation: string;
    };
  };
  config: {
    framework: 'cucumber' | 'jest-cucumber';
    testRunner: 'jest' | 'mocha';
    reportFormat: string[];
  };
}

export class BDDGenerator {
  private aiAdapter: AIAdapter;

  constructor(aiAdapter: AIAdapter) {
    this.aiAdapter = aiAdapter;
  }

  /**
   * Generate complete BDD test suite from specification
   */
  async generateTestSuite(spec: Specification, projectType: string): Promise<BDDTestSuite> {
    // Generate features for each functional requirement
    const features = await Promise.all(
      spec.functionalRequirements.slice(0, 8).map(req =>
        this.generateFeature(req, projectType)
      )
    );

    // Generate step definitions
    const stepDefinitions = await this.generateStepDefinitions(features);

    return {
      features,
      stepDefinitions,
      config: {
        framework: 'cucumber',
        testRunner: 'jest',
        reportFormat: ['html', 'json', 'junit'],
      },
    };
  }

  /**
   * Generate Gherkin feature from functional requirement
   */
  private async generateFeature(
    requirement: {
      id: string;
      title: string;
      description: string;
      priority: string;
      acceptanceCriteria: string[];
    },
    projectType: string
  ): Promise<GherkinFeature> {
    const prompt = `Generate a Gherkin feature file for this requirement:

ID: ${requirement.id}
Title: ${requirement.title}
Description: ${requirement.description}
Priority: ${requirement.priority}
Acceptance Criteria:
${requirement.acceptanceCriteria.map((ac: string) => `- ${ac}`).join('\n')}

Project Type: ${projectType}

Create a feature with:
1. Feature name and description
2. Background (if needed)
3. 3-5 scenarios covering main flows and edge cases
4. Given/When/Then steps
5. Relevant tags (@smoke, @regression, @${requirement.priority})

Return ONLY valid JSON:
{
  "name": "User Authentication",
  "description": "As a user, I want to...",
  "background": {
    "given": ["the application is running", "the database is initialized"]
  },
  "scenarios": [
    {
      "name": "Successful login",
      "given": ["a user exists with email 'user@example.com'", "the user has a valid password"],
      "when": ["the user enters their email", "the user enters their password", "the user clicks login"],
      "then": ["the user should be redirected to the dashboard", "the user should see a welcome message"],
      "tags": ["@smoke", "@critical"]
    }
  ],
  "tags": ["@authentication", "@${requirement.priority}"]
}

IMPORTANT: Return ONLY JSON, no markdown.`;

    const response = await this.aiAdapter.generateText(prompt, 2500);
    return parseJSONWithDefault<GherkinFeature>(response, this.getDefaultFeature(requirement), `generateFeature-${requirement.id}`);
  }

  /**
   * Get default feature when AI generation fails
   */
  private getDefaultFeature(requirement: { id: string; title: string; description: string; priority: string }): GherkinFeature {
    return {
      name: requirement.title,
      description: requirement.description,
      scenarios: [
        {
          name: `${requirement.title} - Happy Path`,
          given: ['the system is running', 'a user is authenticated'],
          when: ['the user performs the action'],
          then: ['the action is completed successfully'],
          tags: [`@${requirement.priority}`, '@smoke']
        }
      ],
      tags: [`@${requirement.id}`, `@${requirement.priority}`]
    };
  }

  /**
   * Generate step definitions for all scenarios
   */
  private async generateStepDefinitions(
    features: GherkinFeature[]
  ): Promise<BDDTestSuite['stepDefinitions']> {
    // Collect all unique steps
    const allSteps = new Set<string>();
    features.forEach(feature => {
      feature.scenarios.forEach(scenario => {
        scenario.given.forEach(step => allSteps.add(`Given ${step}`));
        scenario.when.forEach(step => allSteps.add(`When ${step}`));
        scenario.then.forEach(step => allSteps.add(`Then ${step}`));
      });
      if (feature.background) {
        feature.background.given.forEach(step => allSteps.add(`Given ${step}`));
      }
    });

    const steps = Array.from(allSteps);
    const prompt = `Generate step definition patterns and implementations for these Gherkin steps:

${steps.slice(0, 30).map((s, i) => `${i + 1}. ${s}`).join('\n')}

For each step, provide:
1. Regex pattern for matching
2. TypeScript implementation (pseudo-code is fine)

Return ONLY valid JSON object:
{
  "step_1": {
    "pattern": "^the application is running$",
    "implementation": "await app.start(); expect(app.isRunning).toBe(true);"
  },
  "step_2": {
    "pattern": "^a user exists with email '(.+)'$",
    "implementation": "const user = await createUser({ email: $1 }); context.user = user;"
  }
}

Use context object to pass data between steps.
Use $1, $2 for regex captures.

IMPORTANT: Return ONLY JSON, no markdown.`;

    const response = await this.aiAdapter.generateText(prompt, 3500);
    return parseJSONWithDefault<BDDTestSuite['stepDefinitions']>(response, this.getDefaultStepDefinitions(steps), 'generateStepDefinitions');
  }

  /**
   * Get default step definitions when AI generation fails
   */
  private getDefaultStepDefinitions(steps: string[]): BDDTestSuite['stepDefinitions'] {
    const definitions: BDDTestSuite['stepDefinitions'] = {};
    steps.slice(0, 20).forEach((step, i) => {
      const key = `step_${i + 1}`;
      const pattern = step.replace(/^(Given|When|Then)\s+/i, '').replace(/['"]/g, '(.+)');
      definitions[key] = {
        pattern: `^${pattern}$`,
        implementation: `// TODO: Implement - ${step}\n  expect(true).toBe(true);`
      };
    });
    return definitions;
  }

  /**
   * Export feature as Gherkin .feature file
   */
  exportFeature(feature: GherkinFeature): string {
    let gherkin = '';

    // Tags
    if (feature.tags.length > 0) {
      gherkin += feature.tags.join(' ') + '\n';
    }

    // Feature header
    gherkin += `Feature: ${feature.name}\n`;
    if (feature.description) {
      gherkin += `  ${feature.description}\n`;
    }
    gherkin += '\n';

    // Background
    if (feature.background) {
      gherkin += '  Background:\n';
      feature.background.given.forEach(step => {
        gherkin += `    Given ${step}\n`;
      });
      gherkin += '\n';
    }

    // Scenarios
    feature.scenarios.forEach(scenario => {
      // Scenario tags
      if (scenario.tags && scenario.tags.length > 0) {
        gherkin += '  ' + scenario.tags.join(' ') + '\n';
      }

      gherkin += `  Scenario: ${scenario.name}\n`;

      // Given
      scenario.given.forEach(step => {
        gherkin += `    Given ${step}\n`;
      });

      // When
      scenario.when.forEach(step => {
        gherkin += `    When ${step}\n`;
      });

      // Then
      scenario.then.forEach(step => {
        gherkin += `    Then ${step}\n`;
      });

      gherkin += '\n';
    });

    return gherkin;
  }

  /**
   * Export step definitions as TypeScript/JavaScript
   */
  exportStepDefinitions(
    stepDefinitions: BDDTestSuite['stepDefinitions'],
    framework: 'cucumber' | 'jest-cucumber' = 'cucumber'
  ): string {
    let code = '';

    if (framework === 'cucumber') {
      code += `import { Given, When, Then } from '@cucumber/cucumber';\n`;
      code += `import { expect } from 'chai';\n\n`;
      code += `// Shared context for passing data between steps\n`;
      code += `interface TestContext {\n`;
      code += `  [key: string]: any;\n`;
      code += `}\n\n`;
      code += `const context: TestContext = {};\n\n`;
    } else {
      code += `import { defineFeature, loadFeature } from 'jest-cucumber';\n`;
      code += `const feature = loadFeature('./features/example.feature');\n\n`;
      code += `defineFeature(feature, test => {\n`;
    }

    Object.entries(stepDefinitions).forEach(([key, def], index) => {
      const stepType = key.includes('given')
        ? 'Given'
        : key.includes('when')
        ? 'When'
        : 'Then';

      if (framework === 'cucumber') {
        code += `${stepType}(/${def.pattern}/, async function(this: TestContext`;

        // Count captures in pattern
        const captures = (def.pattern.match(/\(/g) || []).length;
        for (let i = 1; i <= captures; i++) {
          code += `, arg${i}: string`;
        }

        code += `) {\n`;
        code += `  // ${key}\n`;
        code += `  ${def.implementation}\n`;
        code += `});\n\n`;
      }
    });

    if (framework === 'jest-cucumber') {
      code += `});\n`;
    }

    return code;
  }

  /**
   * Generate test configuration files
   */
  generateTestConfig(framework: 'cucumber' | 'jest-cucumber'): {
    cucumberConfig?: string;
    jestConfig?: string;
    packageJsonScripts: Record<string, string>;
  } {
    if (framework === 'cucumber') {
      return {
        cucumberConfig: `module.exports = {
  default: {
    require: ['tests/step-definitions/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress', 'html:reports/cucumber-report.html', 'json:reports/cucumber-report.json'],
    formatOptions: { snippetInterface: 'async-await' },
    publishQuiet: true,
  },
};`,
        packageJsonScripts: {
          'test:bdd': 'cucumber-js',
          'test:bdd:watch': 'cucumber-js --watch',
          'test:bdd:report': 'cucumber-js --format html:reports/cucumber-report.html',
        },
      };
    } else {
      return {
        jestConfig: `module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.steps.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};`,
        packageJsonScripts: {
          'test:bdd': 'jest --testMatch="**/*.steps.ts"',
          'test:bdd:watch': 'jest --watch --testMatch="**/*.steps.ts"',
          'test:bdd:coverage': 'jest --coverage --testMatch="**/*.steps.ts"',
        },
      };
    }
  }

  /**
   * Generate complete BDD test structure as files
   */
  async generateTestFiles(testSuite: BDDTestSuite): Promise<{
    features: { path: string; content: string }[];
    stepDefinitions: { path: string; content: string }[];
    config: { path: string; content: string }[];
  }> {
    const files = {
      features: [] as { path: string; content: string }[],
      stepDefinitions: [] as { path: string; content: string }[],
      config: [] as { path: string; content: string }[],
    };

    // Export features
    testSuite.features.forEach(feature => {
      const fileName = feature.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      files.features.push({
        path: `tests/features/${fileName}.feature`,
        content: this.exportFeature(feature),
      });
    });

    // Export step definitions
    files.stepDefinitions.push({
      path: 'tests/step-definitions/steps.ts',
      content: this.exportStepDefinitions(testSuite.stepDefinitions, testSuite.config.framework),
    });

    // Export config
    const config = this.generateTestConfig(testSuite.config.framework);
    if (config.cucumberConfig) {
      files.config.push({
        path: 'cucumber.js',
        content: config.cucumberConfig,
      });
    }
    if (config.jestConfig) {
      files.config.push({
        path: 'jest.config.js',
        content: config.jestConfig,
      });
    }

    return files;
  }
}
