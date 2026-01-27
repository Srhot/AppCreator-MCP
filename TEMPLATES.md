# DevForge POML Templates Documentation

## Overview

DevForge includes a comprehensive POML template system that ensures **context is NEVER lost** during development. These templates provide structured project manifests with all necessary context preservation mechanisms.

## Template Files

### Core Templates

#### 1. `base.poml.ts` - Base POML Template
**Purpose**: Foundation for all project POML manifests

**Sections**:
- `<metadata>` - Project basic information
- `<context>` - Critical documents and references
- `<constraints>` - Development constraints and rules
- `<auto-refresh>` - Context loss prevention configuration
- `<progress>` - Progress tracking
- `<features>` - Feature list
- `<next-steps>` - Next actions
- `<architecture>` - Architecture details
- `<dependencies>` - Runtime and dev dependencies
- `<quality-gates>` - Build and test requirements

**Usage**:
```typescript
import { renderBasePOML, type POMlTemplateContext } from './templates/poml';

const context: Partial<POMlTemplateContext> = {
  projectName: 'my-project',
  techStack: 'Node.js + TypeScript',
  language: 'English',
  status: 'active',
  totalTasks: 25,
  completedTasks: 10,
  currentPhase: 'development',
  progressPercentage: 40,
  features: '<feature id="1">User Authentication</feature>',
  nextSteps: '<step id="1">Implement login</step>',
  projectType: 'web',
  architecturePattern: 'MVC',
  folderStructure: 'src/, tests/, docs/',
  runtimeDeps: 'express, react',
  devDeps: 'typescript, jest'
};

const poml = renderBasePOML(context);
```

---

#### 2. `web.poml.ts` - Web Application Template
**Purpose**: Specialized template for web applications

**Additional Sections**:
- `<frontend>` - Frontend framework details
- `<components>` - Component list
- `<pages-routes>` - Page and route definitions
- `<api-integration>` - API endpoint integration
- `<styling-system>` - Styling approach and theme
- `<performance>` - Performance targets
- `<browser-support>` - Browser compatibility

**Web-Specific Context**:
```typescript
import { renderWebPOML, type WebPOMLContext } from './templates/poml';

const context: Partial<WebPOMLContext> = {
  projectName: 'my-web-app',
  framework: 'React',
  stylingApproach: 'Tailwind CSS',
  stateManagement: 'Redux',
  routing: 'React Router',
  buildTool: 'Vite',
  components: '<component>Header</component>\n<component>Footer</component>',
  pagesRoutes: '<route path="/">Home</route>',
  bundleSizeLimit: '500KB',
  polyfills: 'core-js'
};

const poml = renderWebPOML(context);
```

---

#### 3. `api.poml.ts` - API Server Template
**Purpose**: Specialized template for API/backend services

**Additional Sections**:
- `<api>` - API configuration
- `<endpoints>` - Endpoint definitions
- `<database>` - Database configuration
- `<models>` - Data models
- `<middleware>` - Middleware stack
- `<authentication>` - Auth strategy
- `<validation>` - Input validation
- `<error-handling>` - Error handling approach
- `<security>` - Security measures
- `<testing>` - API testing strategy
- `<documentation>` - API documentation format

**API-Specific Context**:
```typescript
import { renderAPIPOML, type APIPOMLContext } from './templates/poml';

const context: Partial<APIPOMLContext> = {
  projectName: 'my-api',
  framework: 'Express',
  apiType: 'REST',
  baseUrl: '/api/v1',
  authMethod: 'JWT',
  databaseType: 'PostgreSQL',
  orm: 'Prisma',
  tokenType: 'Bearer',
  validationLibrary: 'Zod',
  loggingLevel: 'info',
  apiDocsFormat: 'OpenAPI/Swagger'
};

const poml = renderAPIPOML(context);
```

---

#### 4. `cli.poml.ts` - CLI Tool Template
**Purpose**: Specialized template for command-line tools

**Additional Sections**:
- `<cli>` - CLI configuration
- `<commands>` - Command definitions
- `<arguments>` - Arguments specification
- `<options>` - Options/flags
- `<user-experience>` - UX features (colors, spinners)
- `<configuration>` - Config file management
- `<output>` - Output formats
- `<error-handling>` - CLI-specific error handling
- `<installation>` - Installation methods

**CLI-Specific Context**:
```typescript
import { renderCLIPOML, type CLIPOMLContext } from './templates/poml';

const context: Partial<CLIPOMLContext> = {
  projectName: 'my-cli',
  cliName: 'mycli',
  binaryName: 'mycli',
  framework: 'Commander.js',
  interactive: 'true',
  commands: '<command name="init">Initialize project</command>',
  promptLibrary: 'inquirer',
  configFile: '.myclirc',
  outputFormats: 'JSON, Table, Plain',
  manPages: 'true'
};

const poml = renderCLIPOML(context);
```

---

#### 5. `mobile.poml.ts` - Mobile Application Template
**Purpose**: Specialized template for mobile applications

**Additional Sections**:
- `<platforms>` - iOS/Android support
- `<screens>` - Screen definitions
- `<navigation>` - Navigation pattern
- `<state-management>` - State management approach
- `<ui-components>` - UI component library
- `<native-features>` - Native feature integration
- `<api-integration>` - Backend integration
- `<performance>` - Mobile performance targets
- `<offline-support>` - Offline functionality
- `<testing>` - Mobile testing strategy
- `<deployment>` - App store deployment
- `<analytics>` - Analytics and crash reporting
- `<accessibility>` - Accessibility compliance

**Mobile-Specific Context**:
```typescript
import { renderMobilePOML, type MobilePOMLContext } from './templates/poml';

const context: Partial<MobilePOMLContext> = {
  projectName: 'my-mobile-app',
  framework: 'React Native',
  iosSupport: 'true',
  androidSupport: 'true',
  navigationPattern: 'Stack + Tab',
  navigationLibrary: 'React Navigation',
  stateManagement: 'Redux Toolkit',
  camera: 'enabled',
  pushNotifications: 'enabled',
  offlineEnabled: 'true',
  cachingStrategy: 'Network-first'
};

const poml = renderMobilePOML(context);
```

---

### Supporting Templates

#### 6. `constitution.template.ts` - Project Constitution
**Purpose**: Defines immutable project principles

**Sections**:
- Immutable Principles
  1. Code Quality
  2. User Interface
  3. Architecture
  4. Security
  5. Performance
  6. Development Workflow
  7. Testing Strategy
  8. Documentation
  9. Dependencies
  10. Accessibility
- Project-Specific Principles
- Context Preservation
- Enforcement
- Amendments

**Usage**:
```typescript
import { renderConstitution, type ConstitutionContext } from './templates/poml';

const context: Partial<ConstitutionContext> = {
  projectName: 'my-project',
  projectType: 'web',
  createdAt: new Date().toISOString(),
  language: 'English',
  architecturePattern: 'MVC',
  authMethod: 'JWT',
  performanceTarget: '<200ms',
  bundleSizeTarget: '<500KB',
  gitWorkflow: 'GitFlow',
  testCoverage: '80',
  accessibilityLevel: 'WCAG 2.1 AA',
  customPrinciples: 'Follow Material Design guidelines'
};

const constitution = renderConstitution(context);
```

---

#### 7. `refresh.template.ts` - Auto-Refresh Continuation
**Purpose**: Generates continuation prompts to prevent context loss

**CRITICAL**: This is the most important template for context preservation!

**Sections**:
- Quick Resume - Immediate context overview
- What You Were Working On - Last active phase
- Project Overview - Complete project summary
- Current State - Files, progress, pending items
- Context Documents - Critical reference files
- How to Continue - Next action options
- Progress Breakdown - Detailed task status
- Project-Specific Context - Type-specific details
- Quick Commands - Ready-to-use commands
- State Integrity - Verification checksums

**Usage**:
```typescript
import { renderRefreshContinuation, type RefreshContinuationContext } from './templates/poml';

const context: Partial<RefreshContinuationContext> = {
  projectName: 'my-project',
  projectType: 'web',
  techStack: 'React + TypeScript',
  currentPhase: 'feature-implementation',
  completedTasks: 15,
  totalTasks: 40,
  progressPercentage: 37.5,
  status: 'active',
  nextSteps: '1. Complete authentication\n2. Add dashboard',
  filesCreated: 'src/components/Login.tsx, src/api/auth.ts',
  recommendedAction: 'Continue implementing authentication flow'
};

const continuation = renderRefreshContinuation(context);
```

---

## Template Utilities

The `index.ts` file provides utility functions for formatting POML content:

### `TemplateUtils.formatFeatures()`
```typescript
const features = ['User Auth', 'Dashboard', 'Reports'];
const formatted = TemplateUtils.formatFeatures(features);
// Output:
//   <feature id="1">User Auth</feature>
//   <feature id="2">Dashboard</feature>
//   <feature id="3">Reports</feature>
```

### `TemplateUtils.formatNextSteps()`
```typescript
const steps = ['Install deps', 'Configure DB', 'Run tests'];
const formatted = TemplateUtils.formatNextSteps(steps);
// Output:
//   <step id="1">Install deps</step>
//   <step id="2">Configure DB</step>
//   <step id="3">Run tests</step>
```

### `TemplateUtils.formatEndpoints()`
```typescript
const endpoints = [
  { method: 'POST', path: '/api/login', description: 'User login' },
  { method: 'GET', path: '/api/users', description: 'List users' }
];
const formatted = TemplateUtils.formatEndpoints(endpoints);
```

### `TemplateUtils.formatComponents()`
```typescript
const components = ['Header', 'Footer', 'Sidebar'];
const formatted = TemplateUtils.formatComponents(components);
```

### `TemplateUtils.formatScreens()`
```typescript
const screens = [
  { name: 'Home', description: 'Main screen' },
  { name: 'Profile', description: 'User profile' }
];
const formatted = TemplateUtils.formatScreens(screens);
```

### `TemplateUtils.formatCommands()`
```typescript
const commands = [
  { name: 'init', description: 'Initialize project' },
  { name: 'build', description: 'Build project' }
];
const formatted = TemplateUtils.formatCommands(commands);
```

---

## Template Selector

Use `getPOMLRenderer()` to automatically select the appropriate template:

```typescript
import { getPOMLRenderer } from './templates/poml';

const projectType = 'web';
const renderer = getPOMLRenderer(projectType);

if (renderer) {
  const poml = renderer({
    projectName: 'my-app',
    techStack: 'React + TypeScript',
    // ... other context
  });
}
```

**Supported Project Types**:
- `'web'` → `renderWebPOML`
- `'api'` → `renderAPIPOML`
- `'cli'` → `renderCLIPOML`
- `'mobile'` → `renderMobilePOML`
- `'desktop'` → `renderMobilePOML`
- `'library'` (default) → `renderBasePOML`

---

## Context Loss Prevention Strategy

### How Templates Prevent Context Loss:

1. **Structured Context**
   - All templates include `<context>` section
   - References to critical documents (constitution, spec, plan)
   - Priority levels for documents

2. **Auto-Refresh Configuration**
   - Every template includes `<auto-refresh>` section
   - State file location specified
   - Refresh interval configured

3. **Progress Tracking**
   - Current phase always tracked
   - Completed vs. total tasks
   - Progress percentage calculated

4. **Next Steps**
   - Immediate actions clearly listed
   - Prevents "what to do next" confusion
   - Maintains development momentum

5. **Continuation Prompts**
   - Refresh template generates detailed continuation
   - Complete state snapshot included
   - Ready-to-resume instructions provided

### Best Practices:

1. **Use Auto-Refresh Regularly**
   - Call before context window fills
   - Every 30-60 minutes during active development
   - Before switching major tasks

2. **Update POML After Changes**
   - Regenerate after adding features
   - Keep progress current
   - Update next steps

3. **Reference Constitution**
   - Create constitution.md in every project
   - Follow principles consistently
   - Update only when necessary

4. **Maintain Context Documents**
   - Keep SPEC.md, PLAN.md, TASKS.md current
   - Reference in POML
   - Use as single source of truth

---

## File Structure

```
src/templates/poml/
├── base.poml.ts              # Base POML template
├── web.poml.ts               # Web app template
├── api.poml.ts               # API server template
├── cli.poml.ts               # CLI tool template
├── mobile.poml.ts            # Mobile app template
├── constitution.template.ts   # Constitution template
├── refresh.template.ts        # Auto-refresh continuation
└── index.ts                  # Exports and utilities
```

**Compiled Output** (`build/templates/poml/`):
- All `.ts` files compile to `.js`
- Type definitions (`.d.ts`) generated
- Source maps (`.js.map`) for debugging

---

## Integration with DevForge Server

The main server (`src/index.ts`) will integrate these templates:

```typescript
import { getPOMLRenderer, TemplateUtils } from './templates/poml/index.js';
import { renderConstitution } from './templates/poml/constitution.template.js';
import { renderRefreshContinuation } from './templates/poml/refresh.template.js';

// In createProject()
const renderer = getPOMLRenderer(projectType);
const poml = renderer({
  projectName,
  techStack,
  features: TemplateUtils.formatFeatures(featureList),
  nextSteps: TemplateUtils.formatNextSteps(nextStepsList),
  // ... other context
});

// In autoRefresh()
const continuation = renderRefreshContinuation({
  projectName,
  currentPhase,
  completedTasks,
  totalTasks,
  // ... other context
});
```

---

## Summary

**8 Template Files Created**:
1. ✅ base.poml.ts - Base template
2. ✅ web.poml.ts - Web application
3. ✅ api.poml.ts - API server
4. ✅ cli.poml.ts - CLI tool
5. ✅ mobile.poml.ts - Mobile application
6. ✅ constitution.template.ts - Project constitution
7. ✅ refresh.template.ts - Auto-refresh continuation
8. ✅ index.ts - Exports and utilities

**Key Features**:
- ✅ Comprehensive context preservation
- ✅ Type-safe template rendering
- ✅ Utility functions for formatting
- ✅ Automatic template selection
- ✅ Project-type specific templates
- ✅ Constitution for immutable principles
- ✅ Auto-refresh continuation prompts

**Status**: ✅ All templates compiled successfully

---

**Last Updated**: 2025-11-17
**Version**: 1.0.0
