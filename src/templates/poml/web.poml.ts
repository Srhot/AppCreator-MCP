/**
 * Web Application POML Template
 *
 * Specialized template for web applications with frontend-specific context
 */

export const WEB_POML = `<poml>
  <metadata>
    <project>{{projectName}}</project>
    <type>web-application</type>
    <version>1.0.0</version>
    <tech-stack>{{techStack}}</tech-stack>
    <framework>{{framework}}</framework>
    <ui-language>{{language}}</ui-language>
    <created-at>{{createdAt}}</created-at>
  </metadata>

  <context>
    <document src="constitution.md" priority="critical">
      Project constitution and principles
    </document>
    <document src="../specification/SPEC.md" priority="high">
      Application specification and requirements
    </document>
    <document src="../planning/ARCHITECTURE.md" priority="high">
      Frontend architecture and component structure
    </document>
    <document src="../planning/UI_DESIGN.md" priority="high">
      UI/UX design guidelines and mockups
    </document>
    <document src="../planning/STATE_MANAGEMENT.md" priority="medium">
      State management strategy
    </document>
    <document src="../planning/ROUTING.md" priority="medium">
      Routing and navigation structure
    </document>
  </context>

  <frontend>
    <framework>{{framework}}</framework>
    <styling>{{stylingApproach}}</styling>
    <state-management>{{stateManagement}}</state-management>
    <routing>{{routing}}</routing>
    <build-tool>{{buildTool}}</build-tool>
  </frontend>

  <components>
{{components}}
  </components>

  <pages-routes>
{{pagesRoutes}}
  </pages-routes>

  <features>
{{features}}
  </features>

  <api-integration>
{{apiEndpoints}}
  </api-integration>

  <styling-system>
    <approach>{{stylingApproach}}</approach>
    <theme>{{themeConfig}}</theme>
    <responsive>true</responsive>
    <accessibility>WCAG 2.1 AA compliance</accessibility>
  </styling-system>

  <performance>
    <bundle-size-limit>{{bundleSizeLimit}}</bundle-size-limit>
    <lazy-loading>enabled</lazy-loading>
    <code-splitting>enabled</code-splitting>
    <image-optimization>enabled</image-optimization>
  </performance>

  <browser-support>
    <modern-browsers>Latest 2 versions</modern-browsers>
    <polyfills>{{polyfills}}</polyfills>
  </browser-support>

  <progress>
    <total-tasks>{{totalTasks}}</total-tasks>
    <completed-tasks>{{completedTasks}}</completed-tasks>
    <current-phase>{{currentPhase}}</current-phase>
  </progress>

  <next-steps>
{{nextSteps}}
  </next-steps>

  <auto-refresh>
    <enabled>true</enabled>
    <state-file>.appcreator/state.json</state-file>
  </auto-refresh>

</poml>`;

export interface WebPOMLContext {
  projectName: string;
  techStack: string;
  framework: string;
  language: string;
  createdAt: string;
  stylingApproach: string;
  stateManagement: string;
  routing: string;
  buildTool: string;
  components: string;
  pagesRoutes: string;
  features: string;
  apiEndpoints: string;
  themeConfig: string;
  bundleSizeLimit: string;
  polyfills: string;
  totalTasks: number;
  completedTasks: number;
  currentPhase: string;
  nextSteps: string;
}

export function renderWebPOML(context: Partial<WebPOMLContext>): string {
  let rendered = WEB_POML;

  Object.entries(context).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    rendered = rendered.replace(new RegExp(placeholder, 'g'), String(value ?? ''));
  });

  return rendered;
}
