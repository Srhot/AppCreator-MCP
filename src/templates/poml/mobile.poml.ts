/**
 * Mobile Application POML Template
 *
 * Specialized template for mobile applications
 */

export const MOBILE_POML = `<poml>
  <metadata>
    <project>{{projectName}}</project>
    <type>mobile-application</type>
    <version>1.0.0</version>
    <tech-stack>{{techStack}}</tech-stack>
    <framework>{{framework}}</framework>
    <created-at>{{createdAt}}</created-at>
  </metadata>

  <context>
    <document src="constitution.md" priority="critical">
      Mobile app principles and guidelines
    </document>
    <document src="../specification/APP_SPEC.md" priority="high">
      Application specification
    </document>
    <document src="../planning/UI_UX.md" priority="high">
      Mobile UI/UX design guidelines
    </document>
    <document src="../planning/NAVIGATION.md" priority="high">
      Navigation structure and flow
    </document>
    <document src="../planning/STATE_MANAGEMENT.md" priority="medium">
      State management approach
    </document>
    <document src="../planning/OFFLINE_SUPPORT.md" priority="medium">
      Offline functionality strategy
    </document>
  </context>

  <platforms>
    <ios>{{iosSupport}}</ios>
    <android>{{androidSupport}}</android>
    <framework>{{framework}}</framework>
  </platforms>

  <screens>
{{screens}}
  </screens>

  <navigation>
    <pattern>{{navigationPattern}}</pattern>
    <library>{{navigationLibrary}}</library>
  </navigation>

  <features>
{{features}}
  </features>

  <state-management>
    <approach>{{stateManagement}}</approach>
    <persistence>{{statePersistence}}</persistence>
    <offline-sync>{{offlineSync}}</offline-sync>
  </state-management>

  <ui-components>
{{uiComponents}}
  </ui-components>

  <native-features>
    <camera>{{camera}}</camera>
    <location>{{location}}</location>
    <push-notifications>{{pushNotifications}}</push-notifications>
    <biometric-auth>{{biometricAuth}}</biometric-auth>
    <file-system>{{fileSystem}}</file-system>
    <contacts>{{contacts}}</contacts>
  </native-features>

  <api-integration>
{{apiIntegration}}
  </api-integration>

  <performance>
    <startup-time-target>{{startupTime}}</startup-time-target>
    <fps-target>60</fps-target>
    <memory-management>optimized</memory-management>
    <bundle-size>{{bundleSize}}</bundle-size>
  </performance>

  <offline-support>
    <enabled>{{offlineEnabled}}</enabled>
    <caching-strategy>{{cachingStrategy}}</caching-strategy>
    <sync-strategy>{{syncStrategy}}</sync-strategy>
  </offline-support>

  <testing>
    <unit-tests>enabled</unit-tests>
    <component-tests>enabled</component-tests>
    <e2e-tests>{{e2eFramework}}</e2e-tests>
    <device-testing>required</device-testing>
  </testing>

  <deployment>
    <ios-app-store>{{iosDeployment}}</ios-app-store>
    <google-play>{{androidDeployment}}</google-play>
    <code-push>{{codePush}}</code-push>
  </deployment>

  <analytics>
    <tracking>{{analyticsProvider}}</tracking>
    <crash-reporting>{{crashReporting}}</crash-reporting>
  </analytics>

  <accessibility>
    <screen-reader>supported</screen-reader>
    <dynamic-type>supported</dynamic-type>
    <color-contrast>WCAG AA</color-contrast>
  </accessibility>

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

export interface MobilePOMLContext {
  projectName: string;
  techStack: string;
  framework: string;
  createdAt: string;
  iosSupport: string;
  androidSupport: string;
  screens: string;
  navigationPattern: string;
  navigationLibrary: string;
  features: string;
  stateManagement: string;
  statePersistence: string;
  offlineSync: string;
  uiComponents: string;
  camera: string;
  location: string;
  pushNotifications: string;
  biometricAuth: string;
  fileSystem: string;
  contacts: string;
  apiIntegration: string;
  startupTime: string;
  bundleSize: string;
  offlineEnabled: string;
  cachingStrategy: string;
  syncStrategy: string;
  e2eFramework: string;
  iosDeployment: string;
  androidDeployment: string;
  codePush: string;
  analyticsProvider: string;
  crashReporting: string;
  totalTasks: number;
  completedTasks: number;
  currentPhase: string;
  nextSteps: string;
}

export function renderMobilePOML(context: Partial<MobilePOMLContext>): string {
  let rendered = MOBILE_POML;

  Object.entries(context).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    rendered = rendered.replace(new RegExp(placeholder, 'g'), String(value ?? ''));
  });

  return rendered;
}
