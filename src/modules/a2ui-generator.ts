/**
 * A2UI Generator Module
 *
 * Integrates Google's A2UI (Agent-to-User Interface) standard for
 * generating dynamic, AI-driven user interfaces.
 *
 * A2UI Features:
 * - Declarative JSON format for UI intent
 * - Security-first (no arbitrary code execution)
 * - Framework-agnostic (React, Vue, native)
 * - Incremental updates (streaming UI)
 *
 * References:
 * - https://github.com/google/A2UI
 * - https://developers.googleblog.com/introducing-a2ui-an-open-project-for-agent-driven-interfaces/
 */

import { AIAdapter } from '../adapters/ai-adapter.interface.js';
import { Specification } from './spec-kit.js';

/**
 * A2UI Component Definition
 */
export interface A2UIComponent {
  id: string;
  type: string; // Component type from catalog (e.g., "Button", "Form", "DataTable")
  props: Record<string, any>; // Component properties
  children?: string[]; // IDs of child components
  metadata?: {
    purpose: string;
    accessibilityLabel?: string;
    testId?: string;
  };
}

/**
 * A2UI Layout Definition
 */
export interface A2UILayout {
  id: string;
  components: A2UIComponent[];
  metadata: {
    title: string;
    description: string;
    route?: string;
    permissions?: string[];
  };
}

/**
 * Complete A2UI Specification
 */
export interface A2UISpec {
  version: string; // A2UI version (e.g., "0.8")
  application: {
    name: string;
    description: string;
    theme: {
      primaryColor: string;
      secondaryColor: string;
      colorScheme: 'light' | 'dark' | 'auto';
      typography: {
        fontFamily: string;
        scale: string;
      };
    };
  };
  componentCatalog: {
    id: string;
    components: string[]; // Available component types
  };
  layouts: A2UILayout[];
  routes: {
    path: string;
    layoutId: string;
    title: string;
    requiresAuth?: boolean;
  }[];
  dataBindings: {
    componentId: string;
    apiEndpoint: string;
    dataMapping: Record<string, string>;
  }[];
}

/**
 * Design preferences for A2UI generation
 */
export interface A2UIDesignPreferences {
  platform: 'web' | 'mobile' | 'desktop';
  framework: 'react' | 'vue' | 'angular' | 'native';
  uiLibrary: 'material-ui' | 'tailwind' | 'chakra' | 'ant-design' | 'custom';
  designStyle: 'modern' | 'minimal' | 'professional' | 'playful';
  colorScheme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  features: string[]; // e.g., ["dark-mode-toggle", "responsive", "animations"]
}

/**
 * Generated UI Code Output
 */
export interface GeneratedUICode {
  a2uiSpec: A2UISpec;
  implementations: {
    framework: string;
    files: {
      path: string;
      content: string;
      language: string;
    }[];
  }[];
  assets: {
    type: 'icon' | 'image' | 'font' | 'style';
    path: string;
    url?: string;
  }[];
  documentation: {
    setup: string;
    components: string;
    deployment: string;
  };
}

export class A2UIGenerator {
  private aiAdapter: AIAdapter;

  constructor(aiAdapter: AIAdapter) {
    this.aiAdapter = aiAdapter;
  }

  /**
   * Generate complete A2UI specification from project specification
   */
  async generateA2UISpec(
    specification: Specification,
    preferences: A2UIDesignPreferences
  ): Promise<A2UISpec> {
    console.log(`\n🎨 Generating A2UI specification...`);
    console.log(`   Platform: ${preferences.platform}`);
    console.log(`   Framework: ${preferences.framework}`);
    console.log(`   UI Library: ${preferences.uiLibrary}`);

    // Step 1: Analyze functional requirements and generate layouts
    const layouts = await this.generateLayouts(
      specification.functionalRequirements,
      specification.userFlows,
      preferences
    );

    // Step 2: Generate routes based on user flows
    const routes = this.generateRoutes(specification.userFlows, layouts);

    // Step 3: Generate data bindings for API integration
    const dataBindings = this.generateDataBindings(
      specification.apiDesign?.endpoints || [],
      layouts
    );

    // Step 4: Create component catalog based on UI library
    const componentCatalog = this.createComponentCatalog(preferences.uiLibrary);

    // Step 5: Assemble complete A2UI spec
    const a2uiSpec: A2UISpec = {
      version: '0.8',
      application: {
        name: specification.functionalRequirements[0]?.title || 'Application',
        description: specification.functionalRequirements[0]?.description || '',
        theme: {
          primaryColor: preferences.primaryColor,
          secondaryColor: this.deriveSecondaryColor(preferences.primaryColor),
          colorScheme: preferences.colorScheme,
          typography: {
            fontFamily: this.selectFontFamily(preferences.designStyle),
            scale: 'responsive',
          },
        },
      },
      componentCatalog,
      layouts,
      routes,
      dataBindings,
    };

    console.log(`✅ A2UI spec generated:`);
    console.log(`   - Layouts: ${layouts.length}`);
    console.log(`   - Routes: ${routes.length}`);
    console.log(`   - Data bindings: ${dataBindings.length}`);

    return a2uiSpec;
  }

  /**
   * Generate UI layouts from functional requirements
   */
  private async generateLayouts(
    functionalRequirements: Specification['functionalRequirements'],
    userFlows: Specification['userFlows'],
    preferences: A2UIDesignPreferences
  ): Promise<A2UILayout[]> {
    const layouts: A2UILayout[] = [];

    // Generate layout for each major functional requirement
    for (const req of functionalRequirements.slice(0, 10)) {
      // Limit to first 10
      const prompt = `Generate an A2UI layout for this feature:

Title: ${req.title}
Description: ${req.description}
Priority: ${req.priority}

Platform: ${preferences.platform}
Design Style: ${preferences.designStyle}
UI Library: ${preferences.uiLibrary}

Create a JSON layout with components. Use component types like:
- Form, Input, Button, Select, Checkbox
- DataTable, List, Card, Grid
- Header, Footer, Sidebar, Navigation
- Modal, Drawer, Tabs, Accordion

Return JSON in this format:
{
  "id": "layout-${req.id}",
  "components": [
    {
      "id": "comp-1",
      "type": "Form",
      "props": { "title": "...", "onSubmit": "..." },
      "children": ["comp-2", "comp-3"]
    }
  ],
  "metadata": {
    "title": "${req.title}",
    "description": "...",
    "route": "/..."
  }
}

Return ONLY valid JSON, no markdown.`;

      try {
        const response = await this.aiAdapter.generateText(prompt, 1500);
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const layout = JSON.parse(jsonMatch[0]);
          layouts.push(layout);
        }
      } catch (error) {
        console.log(`⚠️  Failed to generate layout for: ${req.title}`);
      }
    }

    return layouts;
  }

  /**
   * Generate routes from user flows
   */
  private generateRoutes(
    userFlows: Specification['userFlows'],
    layouts: A2UILayout[]
  ): A2UISpec['routes'] {
    const routes: A2UISpec['routes'] = [];

    // Create route for each layout
    for (const layout of layouts) {
      routes.push({
        path: layout.metadata.route || `/${layout.id}`,
        layoutId: layout.id,
        title: layout.metadata.title,
        requiresAuth: layout.metadata.permissions !== undefined,
      });
    }

    return routes;
  }

  /**
   * Generate data bindings for API integration
   */
  private generateDataBindings(
    apiEndpoints: any[],
    layouts: A2UILayout[]
  ): A2UISpec['dataBindings'] {
    const bindings: A2UISpec['dataBindings'] = [];

    for (const layout of layouts) {
      // Find data-driven components (tables, lists, forms)
      const dataComponents = layout.components.filter(comp =>
        ['DataTable', 'List', 'Form', 'Grid'].includes(comp.type)
      );

      for (const component of dataComponents) {
        // Try to match component to API endpoint
        const matchingEndpoint = apiEndpoints.find(ep =>
          layout.metadata.title.toLowerCase().includes(ep.path.split('/')[1])
        );

        if (matchingEndpoint) {
          bindings.push({
            componentId: component.id,
            apiEndpoint: matchingEndpoint.path,
            dataMapping: {
              // Auto-generate field mappings
              response: 'data',
              loading: 'isLoading',
              error: 'error',
            },
          });
        }
      }
    }

    return bindings;
  }

  /**
   * Create component catalog based on UI library
   */
  private createComponentCatalog(
    uiLibrary: string
  ): A2UISpec['componentCatalog'] {
    const commonComponents = [
      // Layout
      'Container',
      'Box',
      'Stack',
      'Grid',
      'Flex',
      // Navigation
      'Header',
      'Footer',
      'Sidebar',
      'Navigation',
      'Breadcrumb',
      // Forms
      'Form',
      'Input',
      'Textarea',
      'Select',
      'Checkbox',
      'Radio',
      'Switch',
      'Button',
      // Data Display
      'DataTable',
      'List',
      'Card',
      'Badge',
      'Avatar',
      'Divider',
      // Feedback
      'Alert',
      'Toast',
      'Modal',
      'Drawer',
      'Spinner',
      // Other
      'Tabs',
      'Accordion',
      'Tooltip',
      'Dropdown',
    ];

    return {
      id: `catalog-${uiLibrary}`,
      components: commonComponents,
    };
  }

  /**
   * Generate actual implementation code for A2UI spec
   */
  async generateImplementationCode(
    a2uiSpec: A2UISpec,
    preferences: A2UIDesignPreferences
  ): Promise<GeneratedUICode> {
    console.log(`\n💻 Generating ${preferences.framework} implementation code...`);

    const implementations = await this.generateFrameworkCode(a2uiSpec, preferences);
    const assets = this.generateAssets(a2uiSpec);
    const documentation = await this.generateDocumentation(a2uiSpec, preferences);

    return {
      a2uiSpec,
      implementations,
      assets,
      documentation,
    };
  }

  /**
   * Generate framework-specific code (React, Vue, etc.)
   */
  private async generateFrameworkCode(
    a2uiSpec: A2UISpec,
    preferences: A2UIDesignPreferences
  ): Promise<GeneratedUICode['implementations']> {
    const implementations: GeneratedUICode['implementations'] = [];

    // Generate code for selected framework
    const files: { path: string; content: string; language: string }[] = [];

    // Generate main App file
    const appCode = await this.generateAppFile(a2uiSpec, preferences);
    files.push({
      path: `src/App.${preferences.framework === 'react' ? 'tsx' : 'vue'}`,
      content: appCode,
      language: 'typescript',
    });

    // Generate component files
    for (const layout of a2uiSpec.layouts) {
      const componentCode = await this.generateComponentFile(layout, preferences);
      files.push({
        path: `src/components/${layout.id}.${preferences.framework === 'react' ? 'tsx' : 'vue'}`,
        content: componentCode,
        language: 'typescript',
      });
    }

    // Generate API client
    const apiClientCode = this.generateAPIClient(a2uiSpec.dataBindings);
    files.push({
      path: 'src/api/client.ts',
      content: apiClientCode,
      language: 'typescript',
    });

    implementations.push({
      framework: preferences.framework,
      files,
    });

    return implementations;
  }

  /**
   * Generate main App file
   */
  private async generateAppFile(
    a2uiSpec: A2UISpec,
    preferences: A2UIDesignPreferences
  ): Promise<string> {
    const prompt = `Generate a ${preferences.framework} App component that sets up routing for this application:

Application Name: ${a2uiSpec.application.name}
Theme: ${JSON.stringify(a2uiSpec.application.theme)}
Routes: ${JSON.stringify(a2uiSpec.routes)}

Use ${preferences.uiLibrary} for UI components.
Include:
- Theme provider setup
- Router configuration
- Layout structure

Return ONLY the code, no markdown, no explanation.`;

    return await this.aiAdapter.generateText(prompt, 2000);
  }

  /**
   * Generate component file for layout
   */
  private async generateComponentFile(
    layout: A2UILayout,
    preferences: A2UIDesignPreferences
  ): Promise<string> {
    const prompt = `Generate a ${preferences.framework} component for this layout:

${JSON.stringify(layout, null, 2)}

Use ${preferences.uiLibrary} UI library.
Include:
- TypeScript types
- Proper component structure
- Props handling
- Event handlers

Return ONLY the code, no markdown.`;

    return await this.aiAdapter.generateText(prompt, 2000);
  }

  /**
   * Generate API client code
   */
  private generateAPIClient(dataBindings: A2UISpec['dataBindings']): string {
    const endpoints = dataBindings.map(b => b.apiEndpoint);

    return `// API Client
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API methods
${endpoints
  .map(
    endpoint => `
export const fetch${endpoint.replace(/\//g, '')} = async () => {
  const response = await apiClient.get('${endpoint}');
  return response.data;
};
`
  )
  .join('\n')}

export default apiClient;
`;
  }

  /**
   * Generate assets (icons, styles, etc.)
   */
  private generateAssets(a2uiSpec: A2UISpec): GeneratedUICode['assets'] {
    // In real implementation, this would generate or fetch assets
    return [
      {
        type: 'style',
        path: 'src/styles/theme.css',
      },
    ];
  }

  /**
   * Generate documentation
   */
  private async generateDocumentation(
    a2uiSpec: A2UISpec,
    preferences: A2UIDesignPreferences
  ): Promise<GeneratedUICode['documentation']> {
    const setup = `# Setup

Install dependencies:
\`\`\`bash
npm install ${preferences.framework === 'react' ? 'react react-dom' : 'vue'}
npm install ${preferences.uiLibrary === 'material-ui' ? '@mui/material' : preferences.uiLibrary}
\`\`\`

Start dev server:
\`\`\`bash
npm run dev
\`\`\`
`;

    const components = `# Components

${a2uiSpec.layouts.map(l => `- **${l.metadata.title}**: ${l.metadata.description}`).join('\n')}
`;

    const deployment = `# Deployment

Build for production:
\`\`\`bash
npm run build
\`\`\`
`;

    return {
      setup,
      components,
      deployment,
    };
  }

  /**
   * Export A2UI spec to Google Stitch-compatible prompt
   */
  exportToStitchPrompt(a2uiSpec: A2UISpec): string {
    return `# ${a2uiSpec.application.name}

${a2uiSpec.application.description}

## Design System

Theme: ${a2uiSpec.application.theme.colorScheme}
Primary Color: ${a2uiSpec.application.theme.primaryColor}
Font: ${a2uiSpec.application.theme.typography.fontFamily}

## Pages

${a2uiSpec.routes.map(r => `- **${r.title}** (${r.path})`).join('\n')}

## Components

${a2uiSpec.layouts
  .map(
    l => `
### ${l.metadata.title}
${l.metadata.description}

Components:
${l.components.map(c => `- ${c.type}: ${JSON.stringify(c.props)}`).join('\n')}
`
  )
  .join('\n')}

## API Integration

${a2uiSpec.dataBindings.map(b => `- ${b.componentId} → ${b.apiEndpoint}`).join('\n')}
`;
  }

  /**
   * Helper: Derive secondary color from primary
   */
  private deriveSecondaryColor(primaryColor: string): string {
    // Simple color derivation logic
    const colorMap: Record<string, string> = {
      blue: '#1976d2',
      green: '#2e7d32',
      red: '#d32f2f',
      purple: '#7b1fa2',
      orange: '#f57c00',
    };

    return colorMap[primaryColor.toLowerCase()] || '#424242';
  }

  /**
   * Helper: Select font family based on design style
   */
  private selectFontFamily(designStyle: string): string {
    const fontMap: Record<string, string> = {
      modern: 'Inter, system-ui, sans-serif',
      minimal: 'Helvetica Neue, Arial, sans-serif',
      professional: 'Georgia, serif',
      playful: 'Comic Sans MS, cursive',
    };

    return fontMap[designStyle] || 'Inter, system-ui, sans-serif';
  }
}
