/**
 * Template Engine - POML Template Renderer
 *
 * This class renders POML templates with variable substitution,
 * conditionals, and loops.
 *
 * Features:
 * - Variable replacement: {{variableName}}
 * - Conditionals: {{#if variable}}...{{/if}}
 * - Loops: {{#each array}}...{{/each}}
 * - Negation: {{#unless variable}}...{{/unless}}
 */

import {
  BASE_POML,
  WEB_POML,
  API_POML,
  CLI_POML,
  MOBILE_POML,
  REFRESH_CONTEXT_POML,
  CHECKPOINT_REVIEW_POML,
  PROGRESS_SUMMARY_POML,
  FEATURE_DEVELOPMENT_POML,
  PROJECT_POML,
} from '../templates/poml/index.js';

/**
 * Template rendering options
 */
export interface RenderOptions {
  /** Whether to throw on missing variables (default: false) */
  strict?: boolean;
  /** Default value for missing variables (default: '') */
  defaultValue?: string;
  /** Enable verbose logging (default: false) */
  verbose?: boolean;
}

/**
 * Template Engine Class
 *
 * Handles loading and rendering of POML templates with full
 * variable substitution, conditional logic, and iteration support.
 */
export class TemplateEngine {
  private templates: Map<string, string> = new Map();
  private options: RenderOptions;

  constructor(options: RenderOptions = {}) {
    this.options = {
      strict: false,
      defaultValue: '',
      verbose: false,
      ...options,
    };

    this.loadTemplates();
  }

  /**
   * Load all POML templates
   *
   * Imports template strings from src/templates/poml/ and stores
   * them in a Map for fast lookup.
   */
  loadTemplates(): void {
    // Core project type templates
    this.templates.set('base.poml', BASE_POML);
    this.templates.set('web.poml', WEB_POML);
    this.templates.set('api.poml', API_POML);
    this.templates.set('cli.poml', CLI_POML);
    this.templates.set('mobile.poml', MOBILE_POML);

    // Supporting templates
    this.templates.set('refresh-context.poml', REFRESH_CONTEXT_POML);
    this.templates.set('checkpoint-review.poml', CHECKPOINT_REVIEW_POML);
    this.templates.set('progress-summary.poml', PROGRESS_SUMMARY_POML);
    this.templates.set('feature-development.poml', FEATURE_DEVELOPMENT_POML);
    this.templates.set('project.poml', PROJECT_POML);

    if (this.options.verbose) {
      console.log(`Loaded ${this.templates.size} templates`);
    }
  }

  /**
   * Render a template with variables
   *
   * @param templateName - Name of template (e.g., 'refresh-context.poml')
   * @param variables - Object containing variable values
   * @returns Rendered template string
   *
   * @example
   * ```typescript
   * const engine = new TemplateEngine();
   * const result = engine.render('base.poml', {
   *   projectName: 'My Project',
   *   techStack: 'React + TypeScript',
   *   completedTasks: 42
   * });
   * ```
   */
  render(templateName: string, variables: Record<string, any> = {}): string {
    // Get template
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Template not found: ${templateName}`);
    }

    if (this.options.verbose) {
      console.log(`Rendering template: ${templateName}`);
      console.log('Variables:', Object.keys(variables).join(', '));
    }

    // Process template through rendering pipeline
    let result = template;

    // Step 1: Process loops ({{#each array}}...{{/each}})
    result = this.processLoops(result, variables);

    // Step 2: Process conditionals ({{#if var}}...{{/if}})
    result = this.processConditionals(result, variables);

    // Step 3: Process negations ({{#unless var}}...{{/unless}})
    result = this.processNegations(result, variables);

    // Step 4: Replace simple variables ({{varName}})
    result = this.replaceVariables(result, variables);

    return result;
  }

  /**
   * Process {{#each array}}...{{/each}} loops
   */
  private processLoops(template: string, variables: Record<string, any>): string {
    const loopRegex = /{{#each\s+(\w+)}}([\s\S]*?){{\/each}}/g;

    return template.replace(loopRegex, (match, arrayName, loopBody) => {
      const array = variables[arrayName];

      if (!Array.isArray(array)) {
        if (this.options.strict) {
          throw new Error(`Variable '${arrayName}' is not an array`);
        }
        return '';
      }

      // Render loop body for each item
      return array
        .map((item, index) => {
          // Create context for loop iteration
          const loopContext = {
            ...variables,
            this: item,
            '@index': index,
            '@first': index === 0,
            '@last': index === array.length - 1,
            '@length': array.length,
          };

          // Handle both primitive values and objects
          if (typeof item === 'object' && item !== null) {
            Object.assign(loopContext, item);
          }

          // Process nested conditionals and negations in loop body
          let processedBody = loopBody;
          processedBody = this.processConditionals(processedBody, loopContext);
          processedBody = this.processNegations(processedBody, loopContext);
          processedBody = this.replaceVariables(processedBody, loopContext);

          return processedBody;
        })
        .join('');
    });
  }

  /**
   * Process {{#if variable}}...{{/if}} conditionals
   */
  private processConditionals(template: string, variables: Record<string, any>): string {
    const conditionalRegex = /{{#if\s+([@\w.]+)}}([\s\S]*?){{\/if}}/g;

    return template.replace(conditionalRegex, (match, varName, conditionalBody) => {
      const value = this.getNestedValue(variables, varName);

      // Check truthiness
      const isTruthy = this.isTruthy(value);

      if (isTruthy) {
        // Process nested conditionals and loops in the body
        let body = conditionalBody;
        body = this.processLoops(body, variables);
        body = this.processConditionals(body, variables);
        body = this.processNegations(body, variables);
        return body;
      }

      return '';
    });
  }

  /**
   * Process {{#unless variable}}...{{/unless}} negations
   */
  private processNegations(template: string, variables: Record<string, any>): string {
    const negationRegex = /{{#unless\s+([@\w.]+)}}([\s\S]*?){{\/unless}}/g;

    return template.replace(negationRegex, (match, varName, negationBody) => {
      const value = this.getNestedValue(variables, varName);

      // Check falsy
      const isTruthy = this.isTruthy(value);

      if (!isTruthy) {
        // Process nested conditionals and loops in the body
        let body = negationBody;
        body = this.processLoops(body, variables);
        body = this.processConditionals(body, variables);
        body = this.processNegations(body, variables);
        return body;
      }

      return '';
    });
  }

  /**
   * Replace {{variableName}} with actual values
   */
  private replaceVariables(template: string, variables: Record<string, any>): string {
    // Match {{varName}} but not {{#if}}, {{/if}}, {{#each}}, {{/each}}, etc.
    const variableRegex = /{{(?!#|\/)([@\w.]+)}}/g;

    return template.replace(variableRegex, (match, varName) => {
      const value = this.getNestedValue(variables, varName);

      if (value === undefined || value === null) {
        if (this.options.strict) {
          throw new Error(`Missing variable: ${varName}`);
        }
        return this.options.defaultValue || '';
      }

      // Convert to string
      return String(value);
    });
  }

  /**
   * Get nested value from object using dot notation
   *
   * @example
   * getNestedValue({ user: { name: 'John' } }, 'user.name') // 'John'
   */
  private getNestedValue(obj: Record<string, any>, path: string): any {
    // Handle special loop variables
    if (path.startsWith('@')) {
      return obj[path];
    }

    // Handle 'this' keyword for loop items
    if (path === 'this') {
      return obj.this;
    }

    // Split by dot notation
    const keys = path.split('.');
    let value: any = obj;

    for (const key of keys) {
      if (value === null || value === undefined) {
        return undefined;
      }
      value = value[key];
    }

    return value;
  }

  /**
   * Check if a value is truthy
   *
   * Falsy values: false, 0, '', null, undefined, []
   * Truthy values: everything else
   */
  private isTruthy(value: any): boolean {
    if (value === false || value === null || value === undefined) {
      return false;
    }

    if (typeof value === 'string' && value.trim() === '') {
      return false;
    }

    if (typeof value === 'number' && value === 0) {
      return false;
    }

    if (Array.isArray(value) && value.length === 0) {
      return false;
    }

    return true;
  }

  /**
   * Get list of available templates
   */
  getAvailableTemplates(): string[] {
    return Array.from(this.templates.keys());
  }

  /**
   * Check if a template exists
   */
  hasTemplate(templateName: string): boolean {
    return this.templates.has(templateName);
  }

  /**
   * Get raw template string (unrendered)
   */
  getRawTemplate(templateName: string): string | undefined {
    return this.templates.get(templateName);
  }

  /**
   * Register a custom template
   *
   * Allows adding custom templates at runtime.
   */
  registerTemplate(name: string, template: string): void {
    this.templates.set(name, template);

    if (this.options.verbose) {
      console.log(`Registered custom template: ${name}`);
    }
  }

  /**
   * Unregister a template
   */
  unregisterTemplate(name: string): boolean {
    const result = this.templates.delete(name);

    if (this.options.verbose && result) {
      console.log(`Unregistered template: ${name}`);
    }

    return result;
  }

  /**
   * Render multiple templates in sequence
   *
   * Useful for composing multiple POML sections.
   */
  renderMultiple(
    templates: Array<{ name: string; variables: Record<string, any> }>,
    separator: string = '\n\n'
  ): string {
    return templates.map((t) => this.render(t.name, t.variables)).join(separator);
  }

  /**
   * Render with fallback
   *
   * If primary template fails, try fallback template.
   */
  renderWithFallback(
    primaryTemplate: string,
    fallbackTemplate: string,
    variables: Record<string, any>
  ): string {
    try {
      return this.render(primaryTemplate, variables);
    } catch (error) {
      if (this.options.verbose) {
        console.warn(`Primary template failed, using fallback: ${fallbackTemplate}`);
        console.warn('Error:', error);
      }
      return this.render(fallbackTemplate, variables);
    }
  }

  /**
   * Validate template syntax
   *
   * Checks for common syntax errors without rendering.
   */
  validateTemplate(templateName: string): { valid: boolean; errors: string[] } {
    const template = this.templates.get(templateName);
    if (!template) {
      return { valid: false, errors: [`Template not found: ${templateName}`] };
    }

    const errors: string[] = [];

    // Check for unclosed tags
    const ifCount = (template.match(/{{#if/g) || []).length;
    const ifEndCount = (template.match(/{{\/if}}/g) || []).length;
    if (ifCount !== ifEndCount) {
      errors.push(`Unclosed {{#if}} tags: ${ifCount} opening, ${ifEndCount} closing`);
    }

    const eachCount = (template.match(/{{#each/g) || []).length;
    const eachEndCount = (template.match(/{{\/each}}/g) || []).length;
    if (eachCount !== eachEndCount) {
      errors.push(`Unclosed {{#each}} tags: ${eachCount} opening, ${eachEndCount} closing`);
    }

    const unlessCount = (template.match(/{{#unless/g) || []).length;
    const unlessEndCount = (template.match(/{{\/unless}}/g) || []).length;
    if (unlessCount !== unlessEndCount) {
      errors.push(`Unclosed {{#unless}} tags: ${unlessCount} opening, ${unlessEndCount} closing`);
    }

    // Check for malformed tags
    const malformedTags = template.match(/{{[^}]*$/gm);
    if (malformedTags) {
      errors.push(`Malformed tags found: ${malformedTags.length}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get template statistics
   */
  getTemplateStats(templateName: string): {
    size: number;
    variables: string[];
    conditionals: number;
    loops: number;
  } | null {
    const template = this.templates.get(templateName);
    if (!template) {
      return null;
    }

    // Extract unique variables
    const variableRegex = /{{(?!#|\/)([@\w.]+)}}/g;
    const variableMatches = Array.from(template.matchAll(variableRegex));
    const variables = [...new Set(variableMatches.map((m) => m[1]))];

    // Count conditionals and loops
    const conditionals = (template.match(/{{#if/g) || []).length;
    const loops = (template.match(/{{#each/g) || []).length;

    return {
      size: template.length,
      variables,
      conditionals,
      loops,
    };
  }

  /**
   * Clear all templates
   */
  clearTemplates(): void {
    this.templates.clear();

    if (this.options.verbose) {
      console.log('Cleared all templates');
    }
  }

  /**
   * Reload all templates
   */
  reloadTemplates(): void {
    this.clearTemplates();
    this.loadTemplates();

    if (this.options.verbose) {
      console.log('Reloaded all templates');
    }
  }
}

/**
 * Create a default template engine instance
 */
export function createTemplateEngine(options?: RenderOptions): TemplateEngine {
  return new TemplateEngine(options);
}

/**
 * Quick render helper
 *
 * Creates a temporary engine instance and renders the template.
 * Use this for one-off rendering. For multiple renders, create
 * a TemplateEngine instance and reuse it.
 */
export function quickRender(
  templateName: string,
  variables: Record<string, any>,
  options?: RenderOptions
): string {
  const engine = new TemplateEngine(options);
  return engine.render(templateName, variables);
}
