/**
 * Frontend Prompt Generator
 *
 * Generates prompts for no-code/low-code frontend builders:
 * - Google Stitch
 * - Lovable
 * - v0.dev
 * - Bolt.new
 *
 * Creates comprehensive prompts that describe the entire frontend
 * including layouts, components, interactions, and API integrations
 */

import { AIAdapter } from '../adapters/ai-adapter.interface.js';
import { Specification } from './spec-kit.js';
import { parseJSONWithDefault } from '../utils/json-parser.js';

export interface FrontendPromptConfig {
  platform: 'google-stitch' | 'lovable' | 'v0' | 'bolt' | 'generic';
  designStyle: 'modern' | 'minimal' | 'colorful' | 'professional' | 'playful';
  colorScheme: 'light' | 'dark' | 'auto';
  uiFramework?: 'tailwind' | 'mui' | 'chakra' | 'ant-design';
}

export interface FrontendPrompt {
  platform: string;
  mainPrompt: string;
  componentBreakdown: {
    component: string;
    description: string;
    prompt: string;
  }[];
  designSystemPrompt: string;
  apiIntegrationPrompt: string;
  userFlowPrompts: {
    flow: string;
    prompt: string;
  }[];
}

export class FrontendPromptGenerator {
  private aiAdapter: AIAdapter;

  constructor(aiAdapter: AIAdapter) {
    this.aiAdapter = aiAdapter;
  }

  /**
   * Ask user questions about frontend preferences
   */
  async askFrontendQuestions(): Promise<Record<string, string>> {
    // These questions would be presented to user via MCP
    return {
      platform: 'Which platform will you use? (google-stitch/lovable/v0/bolt)',
      designStyle: 'Design style? (modern/minimal/colorful/professional/playful)',
      colorScheme: 'Color scheme? (light/dark/auto)',
      primaryColor: 'Primary color? (e.g., blue, green, purple)',
      features: 'Which UI features do you need? (dark mode, responsive, animations, etc.)',
    };
  }

  /**
   * Generate complete frontend prompt from specification
   */
  async generatePrompt(
    spec: Specification,
    config: FrontendPromptConfig,
    apiEndpoints: any[],
    userAnswers: Record<string, string>
  ): Promise<FrontendPrompt> {
    const mainPrompt = await this.generateMainPrompt(spec, config, userAnswers);
    const componentBreakdown = await this.generateComponentBreakdown(spec, config);
    const designSystemPrompt = await this.generateDesignSystemPrompt(config, userAnswers);
    const apiIntegrationPrompt = await this.generateAPIIntegrationPrompt(apiEndpoints);
    const userFlowPrompts = await this.generateUserFlowPrompts(spec.userFlows, config);

    return {
      platform: config.platform,
      mainPrompt,
      componentBreakdown,
      designSystemPrompt,
      apiIntegrationPrompt,
      userFlowPrompts,
    };
  }

  /**
   * Generate main comprehensive prompt
   */
  private async generateMainPrompt(
    spec: Specification,
    config: FrontendPromptConfig,
    userAnswers: Record<string, string>
  ): Promise<string> {
    const functionalReqs = spec.functionalRequirements
      .map(req => `- ${req.title}: ${req.description}`)
      .join('\n');

    const userFlows = spec.userFlows
      .map(flow => `- ${flow.name}: ${flow.steps.join(' → ')}`)
      .join('\n');

    const prompt = `You are an expert frontend developer. Create a ${config.designStyle} ${config.platform} application with the following specifications:

## Project Overview
Create a complete ${config.designStyle} web application that is ${config.colorScheme} mode compatible.

## Core Features
${functionalReqs}

## User Flows
${userFlows}

## Design Requirements
- Style: ${config.designStyle}
- Color Scheme: ${config.colorScheme}
- Primary Color: ${userAnswers.primaryColor || 'blue'}
- UI Framework: ${config.uiFramework || 'tailwind'}
- Responsive: Yes (mobile, tablet, desktop)
- Accessibility: WCAG 2.1 AA compliant
- Features: ${userAnswers.features || 'dark mode, responsive, smooth animations'}

## Technical Requirements
- Component-based architecture
- State management (as needed)
- API integration ready
- Form validation
- Error handling
- Loading states
- Empty states
- Success/error notifications

## Data Model
${JSON.stringify(spec.dataModel, null, 2)}

## Navigation Structure
Create a clear navigation with these main sections:
${spec.userFlows.map(f => `- ${f.name.replace(' Flow', '')}`).join('\n')}

## API Integration
The app will connect to a REST API. Include:
- API client setup
- Request/response handling
- Loading states
- Error handling
- Token management (if authentication exists)

Generate a complete, production-ready application with all components, pages, and interactions fully implemented.`;

    return prompt;
  }

  /**
   * Generate component-specific prompts
   */
  private async generateComponentBreakdown(
    spec: Specification,
    config: FrontendPromptConfig
  ): Promise<FrontendPrompt['componentBreakdown']> {
    const prompt = `Based on this application specification, identify 8-12 key UI components needed:

Features:
${spec.functionalRequirements.map(r => r.title).join(', ')}

User Flows:
${spec.userFlows.map(f => f.name).join(', ')}

For each component, provide:
1. Component name
2. Brief description
3. Specific prompt for creating it

Return ONLY valid JSON array:
[
  {
    "component": "LoginForm",
    "description": "User authentication form",
    "prompt": "Create a modern login form with email, password fields, remember me checkbox, and forgot password link. Include validation and error messages."
  }
]

IMPORTANT: Return ONLY JSON array, no markdown.`;

    const response = await this.aiAdapter.generateText(prompt, 2000);
    return parseJSONWithDefault(response, this.getDefaultComponentBreakdown(spec), 'generateComponentBreakdown');
  }

  /**
   * Get default component breakdown when AI generation fails
   */
  private getDefaultComponentBreakdown(spec: Specification): { component: string; description: string; prompt: string }[] {
    const components = [];
    for (const req of spec.functionalRequirements.slice(0, 5)) {
      components.push({
        component: req.title.replace(/\s+/g, ''),
        description: req.description,
        prompt: `Create a ${req.title} component that ${req.description}. Include proper styling and user interaction.`
      });
    }
    return components;
  }

  /**
   * Generate design system prompt
   */
  private async generateDesignSystemPrompt(
    config: FrontendPromptConfig,
    userAnswers: Record<string, string>
  ): Promise<string> {
    return `Create a cohesive design system with:

## Colors
- Primary: ${userAnswers.primaryColor || 'blue'}
- Success: green
- Warning: yellow
- Error: red
- Background: ${config.colorScheme === 'dark' ? 'dark gray' : 'white'}
- Text: ${config.colorScheme === 'dark' ? 'light' : 'dark'}

## Typography
- Headings: Bold, modern sans-serif
- Body: Readable, clean font
- Code: Monospace font

## Spacing
- Consistent padding/margin scale: 4px, 8px, 16px, 24px, 32px, 48px
- Card padding: 24px
- Section spacing: 48px

## Components
- Buttons: Rounded corners, clear hover states
- Inputs: Clean borders, focus states
- Cards: Subtle shadows, rounded corners
- Modals: Centered, with backdrop
- Toasts: Top-right corner notifications

## Interactions
- Smooth transitions (200-300ms)
- Hover effects on interactive elements
- Loading skeletons for async content
- Micro-animations for feedback

Style: ${config.designStyle}`;
  }

  /**
   * Generate API integration prompt
   */
  private async generateAPIIntegrationPrompt(apiEndpoints: any[]): Promise<string> {
    const endpointList = apiEndpoints
      .map(e => `- ${e.method} ${e.path}: ${e.description}`)
      .join('\n');

    return `Integrate these API endpoints:

${endpointList}

Implementation requirements:
1. Create an API client service
2. Use fetch or axios for requests
3. Include authentication headers (Bearer token)
4. Handle loading states
5. Handle errors gracefully
6. Show success/error notifications
7. Implement retry logic for failed requests
8. Cache responses where appropriate

Example API call structure:
\`\`\`javascript
const response = await apiClient.get('/users');
if (response.ok) {
  // Handle success
} else {
  // Handle error
}
\`\`\`

Store base URL in environment variable: \`VITE_API_URL\` or \`NEXT_PUBLIC_API_URL\``;
  }

  /**
   * Generate user flow specific prompts
   */
  private async generateUserFlowPrompts(
    userFlows: Specification['userFlows'],
    config: FrontendPromptConfig
  ): Promise<FrontendPrompt['userFlowPrompts']> {
    return Promise.all(
      userFlows.map(async flow => ({
        flow: flow.name,
        prompt: await this.generateFlowPrompt(flow, config),
      }))
    );
  }

  /**
   * Generate prompt for specific user flow
   */
  private async generateFlowPrompt(
    flow: Specification['userFlows'][0],
    config: FrontendPromptConfig
  ): Promise<string> {
    return `Implement the "${flow.name}" user flow:

Steps:
${flow.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

Create a seamless experience that guides the user through these steps with:
- Clear visual indicators of current step
- Easy navigation between steps
- Form validation at each step
- Progress indication
- Ability to go back and edit
- Summary/confirmation before final submission
- Success feedback upon completion

Style: ${config.designStyle}`;
  }

  /**
   * Export prompt as markdown file
   */
  exportPrompt(prompt: FrontendPrompt): string {
    let md = `# Frontend Implementation Prompt\n\n`;
    md += `**Platform:** ${prompt.platform}\n\n`;
    md += `---\n\n`;

    md += `## 🎨 Main Prompt\n\n`;
    md += `Copy and paste this into ${prompt.platform}:\n\n`;
    md += `\`\`\`\n${prompt.mainPrompt}\n\`\`\`\n\n`;

    md += `---\n\n`;
    md += `## 🎯 Design System\n\n`;
    md += `\`\`\`\n${prompt.designSystemPrompt}\n\`\`\`\n\n`;

    md += `---\n\n`;
    md += `## 🔌 API Integration\n\n`;
    md += `\`\`\`\n${prompt.apiIntegrationPrompt}\n\`\`\`\n\n`;

    md += `---\n\n`;
    md += `## 🧩 Component Breakdown\n\n`;
    prompt.componentBreakdown.forEach(comp => {
      md += `### ${comp.component}\n\n`;
      md += `${comp.description}\n\n`;
      md += `**Prompt:**\n\`\`\`\n${comp.prompt}\n\`\`\`\n\n`;
    });

    md += `---\n\n`;
    md += `## 🔄 User Flow Prompts\n\n`;
    prompt.userFlowPrompts.forEach(flow => {
      md += `### ${flow.flow}\n\n`;
      md += `\`\`\`\n${flow.prompt}\n\`\`\`\n\n`;
    });

    md += `---\n\n`;
    md += `## 📝 Usage Instructions\n\n`;
    md += `1. Start with the **Main Prompt** - paste it into ${prompt.platform}\n`;
    md += `2. Review the generated design\n`;
    md += `3. Use **Component Breakdown** prompts to refine specific components\n`;
    md += `4. Use **User Flow Prompts** to implement specific workflows\n`;
    md += `5. Use **API Integration** prompt to connect to backend\n`;
    md += `6. Test thoroughly and iterate\n\n`;

    return md;
  }

  /**
   * Generate platform-specific tips
   */
  getPlatformTips(platform: FrontendPromptConfig['platform']): string {
    const tips = {
      'google-stitch': `**Google Stitch Tips:**
- Be specific about layout and spacing
- Mention "responsive" explicitly
- Describe interactions clearly
- Reference Material Design if desired`,

      'lovable': `**Lovable Tips:**
- Start with overall structure
- Describe each section clearly
- Mention specific UI libraries (shadcn, etc.)
- Be explicit about state management`,

      'v0': `**v0.dev Tips:**
- Use clear, structured prompts
- Mention "Next.js" or "React" explicitly
- Describe component hierarchy
- Reference Tailwind CSS classes if desired`,

      'bolt': `**Bolt.new Tips:**
- Be very specific about functionality
- Mention full-stack features
- Describe database schema if needed
- Include API routes explicitly`,

      'generic': `**General Tips:**
- Be clear and specific
- Break complex features into steps
- Describe desired user experience
- Include edge cases and error states`,
    };

    return tips[platform] || tips.generic;
  }
}
