/**
 * Constitution Template
 *
 * CRITICAL: The constitution defines immutable project principles.
 * This ensures consistency throughout development.
 */

export const CONSTITUTION_TEMPLATE = `# Project Constitution

**Project:** {{projectName}}
**Type:** {{projectType}}
**Created:** {{createdAt}}

---

## Immutable Principles

These principles MUST be followed throughout the project lifecycle.

### 1. Code Quality

- **Type Safety**: All code must be strongly typed
- **Testing**: Minimum 80% test coverage
- **Documentation**: All public APIs documented
- **Code Review**: All changes reviewed before merge
- **Linting**: Zero linting errors tolerated

### 2. User Interface ({{language}})

- **Language**: All UI text in {{language}}
- **Comments**: Code comments in {{language}}
- **Documentation**: User-facing docs in {{language}}
- **Error Messages**: User-friendly messages in {{language}}

### 3. Architecture

- **Pattern**: {{architecturePattern}}
- **Separation**: Clear separation of concerns
- **Modularity**: Components are independent and reusable
- **Scalability**: Design for growth from day one

### 4. Security

- **Authentication**: {{authMethod}}
- **Input Validation**: All inputs validated and sanitized
- **Dependencies**: Regular security audits
- **Secrets**: Never commit secrets to version control
- **HTTPS**: All production traffic encrypted

### 5. Performance

- **Response Time**: {{performanceTarget}}
- **Bundle Size**: {{bundleSizeTarget}}
- **Optimization**: Code splitting and lazy loading
- **Caching**: Appropriate caching strategies

### 6. Development Workflow

- **Git Flow**: {{gitWorkflow}}
- **Commits**: Atomic commits with clear messages
- **Branches**: Feature branches for all changes
- **CI/CD**: Automated testing and deployment
- **Code Style**: Consistent formatting (Prettier/ESLint)

### 7. Testing Strategy

- **Unit Tests**: All business logic tested
- **Integration Tests**: API/component integration tested
- **E2E Tests**: Critical user flows tested
- **Test First**: Write tests before implementation
- **Coverage**: Maintain minimum {{testCoverage}}% coverage

### 8. Documentation

- **README**: Always up-to-date
- **API Docs**: Auto-generated from code
- **Comments**: Explain "why", not "what"
- **Change Log**: Document all changes
- **Architecture Diagrams**: Keep current

### 9. Dependencies

- **Minimal**: Use only necessary dependencies
- **Vetted**: Review security and maintenance status
- **Updated**: Regular updates for security patches
- **Locked**: Use lock files (package-lock.json)

### 10. Accessibility

- **WCAG**: {{accessibilityLevel}} compliance
- **Screen Readers**: Full support
- **Keyboard Navigation**: Complete keyboard access
- **Color Contrast**: Meet contrast requirements
- **Semantic HTML**: Proper HTML5 semantics

---

## Project-Specific Principles

{{customPrinciples}}

---

## Context Preservation

### Auto-Refresh System

- **Enabled**: Always enabled
- **Frequency**: Before context limits
- **State File**: .devforge/state.json
- **POML**: Auto-updated on changes
- **Continuation**: Prompts generated automatically

### Critical Documents

1. **SPEC.md** - Complete specification
2. **PLAN.md** - Technical implementation plan
3. **TASKS.md** - Task breakdown
4. **PROGRESS.md** - Current progress
5. **PROJECT.poml** - This POML manifest

---

## Enforcement

- **Pre-commit Hooks**: Enforce linting and tests
- **CI Pipeline**: Block merges on failures
- **Code Review**: Required for all changes
- **Quality Gates**: Must pass before deployment

---

## Amendments

This constitution can only be amended through:
1. Team consensus
2. Updated SPEC.md document
3. Git commit with clear rationale

---

**Last Updated:** {{lastUpdated}}
**Version:** {{constitutionVersion}}
`;

export interface ConstitutionContext {
  projectName: string;
  projectType: string;
  createdAt: string;
  language: string;
  architecturePattern: string;
  authMethod: string;
  performanceTarget: string;
  bundleSizeTarget: string;
  gitWorkflow: string;
  testCoverage: string;
  accessibilityLevel: string;
  customPrinciples: string;
  lastUpdated: string;
  constitutionVersion: string;
}

export function renderConstitution(context: Partial<ConstitutionContext>): string {
  let rendered = CONSTITUTION_TEMPLATE;

  const defaults: Partial<ConstitutionContext> = {
    language: 'English',
    architecturePattern: 'MVC',
    authMethod: 'JWT',
    performanceTarget: '<200ms',
    bundleSizeTarget: '<500KB',
    gitWorkflow: 'GitFlow',
    testCoverage: '80',
    accessibilityLevel: 'WCAG 2.1 AA',
    customPrinciples: 'None defined yet.',
    lastUpdated: new Date().toISOString(),
    constitutionVersion: '1.0.0',
  };

  const mergedContext = { ...defaults, ...context };

  Object.entries(mergedContext).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    rendered = rendered.replace(new RegExp(placeholder, 'g'), String(value ?? ''));
  });

  return rendered;
}
