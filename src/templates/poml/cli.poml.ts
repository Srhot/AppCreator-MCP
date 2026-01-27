/**
 * CLI Tool POML Template
 *
 * Specialized template for command-line interface tools
 */

export const CLI_POML = `<poml>
  <metadata>
    <project>{{projectName}}</project>
    <type>cli-tool</type>
    <version>1.0.0</version>
    <tech-stack>{{techStack}}</tech-stack>
    <created-at>{{createdAt}}</created-at>
  </metadata>

  <context>
    <document src="constitution.md" priority="critical">
      CLI tool principles and guidelines
    </document>
    <document src="../specification/COMMANDS.md" priority="high">
      Command specifications and usage
    </document>
    <document src="../planning/CLI_DESIGN.md" priority="high">
      CLI design and user experience
    </document>
    <document src="../planning/ARCHITECTURE.md" priority="medium">
      Tool architecture and structure
    </document>
  </context>

  <cli>
    <name>{{cliName}}</name>
    <binary>{{binaryName}}</binary>
    <framework>{{framework}}</framework>
    <interactive>{{interactive}}</interactive>
  </cli>

  <commands>
{{commands}}
  </commands>

  <arguments>
{{arguments}}
  </arguments>

  <options>
{{options}}
  </options>

  <features>
{{features}}
  </features>

  <user-experience>
    <colors>enabled</colors>
    <spinner>enabled</spinner>
    <progress-bar>enabled</progress-bar>
    <prompts>{{promptLibrary}}</prompts>
    <help-system>comprehensive</help-system>
  </user-experience>

  <configuration>
    <config-file>{{configFile}}</config-file>
    <global-config>~/.{{cliName}}/config</global-config>
    <environment-variables>supported</environment-variables>
  </configuration>

  <output>
    <formats>{{outputFormats}}</formats>
    <verbosity-levels>quiet, normal, verbose, debug</verbosity-levels>
    <machine-readable>JSON output supported</machine-readable>
  </output>

  <error-handling>
    <exit-codes>standardized</exit-codes>
    <error-messages>user-friendly</error-messages>
    <stack-traces>debug mode only</stack-traces>
  </error-handling>

  <installation>
    <npm-global>supported</npm-global>
    <binary-distribution>{{binaryDist}}</binary-distribution>
    <auto-update>{{autoUpdate}}</auto-update>
  </installation>

  <testing>
    <unit-tests>enabled</unit-tests>
    <integration-tests>enabled</integration-tests>
    <cli-tests>enabled</cli-tests>
  </testing>

  <documentation>
    <man-pages>{{manPages}}</man-pages>
    <help-text>comprehensive</help-text>
    <examples>extensive</examples>
  </documentation>

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
    <state-file>.devforge/state.json</state-file>
  </auto-refresh>

</poml>`;

export interface CLIPOMLContext {
  projectName: string;
  techStack: string;
  createdAt: string;
  cliName: string;
  binaryName: string;
  framework: string;
  interactive: string;
  commands: string;
  arguments: string;
  options: string;
  features: string;
  promptLibrary: string;
  configFile: string;
  outputFormats: string;
  binaryDist: string;
  autoUpdate: string;
  manPages: string;
  totalTasks: number;
  completedTasks: number;
  currentPhase: string;
  nextSteps: string;
}

export function renderCLIPOML(context: Partial<CLIPOMLContext>): string {
  let rendered = CLI_POML;

  Object.entries(context).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    rendered = rendered.replace(new RegExp(placeholder, 'g'), String(value ?? ''));
  });

  return rendered;
}
