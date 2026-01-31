/**
 * API Server POML Template
 *
 * Specialized template for API/backend services
 */

export const API_POML = `<poml>
  <metadata>
    <project>{{projectName}}</project>
    <type>api-server</type>
    <version>1.0.0</version>
    <tech-stack>{{techStack}}</tech-stack>
    <framework>{{framework}}</framework>
    <created-at>{{createdAt}}</created-at>
  </metadata>

  <context>
    <document src="constitution.md" priority="critical">
      API constitution and principles
    </document>
    <document src="../specification/API_SPEC.md" priority="high">
      Complete API specification
    </document>
    <document src="../specification/ENDPOINTS.md" priority="high">
      Endpoint definitions and contracts
    </document>
    <document src="../planning/DATABASE_SCHEMA.md" priority="high">
      Database schema and relationships
    </document>
    <document src="../planning/ARCHITECTURE.md" priority="high">
      Backend architecture pattern
    </document>
    <document src="../security/SECURITY.md" priority="critical">
      Security guidelines and auth strategy
    </document>
  </context>

  <api>
    <framework>{{framework}}</framework>
    <type>{{apiType}}</type>
    <version>v1</version>
    <base-url>{{baseUrl}}</base-url>
    <authentication>{{authMethod}}</authentication>
  </api>

  <endpoints>
{{endpoints}}
  </endpoints>

  <database>
    <type>{{databaseType}}</type>
    <orm>{{orm}}</orm>
    <migrations>enabled</migrations>
    <seeding>enabled</seeding>
  </database>

  <models>
{{models}}
  </models>

  <middleware>
{{middleware}}
  </middleware>

  <authentication>
    <method>{{authMethod}}</method>
    <token-type>{{tokenType}}</token-type>
    <session-management>{{sessionManagement}}</session-management>
    <password-hashing>{{passwordHashing}}</password-hashing>
  </authentication>

  <validation>
    <input-validation>enabled</input-validation>
    <schema-validation>{{validationLibrary}}</schema-validation>
    <sanitization>enabled</sanitization>
  </validation>

  <error-handling>
    <global-handler>enabled</global-handler>
    <error-codes>standardized</error-codes>
    <logging>{{loggingLevel}}</logging>
  </error-handling>

  <security>
    <cors>configured</cors>
    <rate-limiting>enabled</rate-limiting>
    <helmet>enabled</helmet>
    <sql-injection-prevention>enabled</sql-injection-prevention>
    <xss-prevention>enabled</xss-prevention>
  </security>

  <testing>
    <unit-tests>{{unitTestFramework}}</unit-tests>
    <integration-tests>enabled</integration-tests>
    <api-tests>enabled</api-tests>
    <coverage-target>80%</coverage-target>
  </testing>

  <documentation>
    <api-docs>{{apiDocsFormat}}</api-docs>
    <interactive-docs>enabled</interactive-docs>
  </documentation>

  <features>
{{features}}
  </features>

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

export interface APIPOMLContext {
  projectName: string;
  techStack: string;
  framework: string;
  createdAt: string;
  apiType: string;
  baseUrl: string;
  authMethod: string;
  endpoints: string;
  databaseType: string;
  orm: string;
  models: string;
  middleware: string;
  tokenType: string;
  sessionManagement: string;
  passwordHashing: string;
  validationLibrary: string;
  loggingLevel: string;
  unitTestFramework: string;
  apiDocsFormat: string;
  features: string;
  totalTasks: number;
  completedTasks: number;
  currentPhase: string;
  nextSteps: string;
}

export function renderAPIPOML(context: Partial<APIPOMLContext>): string {
  let rendered = API_POML;

  Object.entries(context).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    rendered = rendered.replace(new RegExp(placeholder, 'g'), String(value ?? ''));
  });

  return rendered;
}
