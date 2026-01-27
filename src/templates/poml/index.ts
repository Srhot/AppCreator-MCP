/**
 * POML Templates Index
 *
 * Central export point for all POML templates
 */

import { renderBasePOML } from './base.poml.js';
import { renderWebPOML } from './web.poml.js';
import { renderAPIPOML } from './api.poml.js';
import { renderCLIPOML } from './cli.poml.js';
import { renderMobilePOML } from './mobile.poml.js';

export { BASE_POML, renderBasePOML, type POMlTemplateContext } from './base.poml.js';
export { WEB_POML, renderWebPOML, type WebPOMLContext } from './web.poml.js';
export { API_POML, renderAPIPOML, type APIPOMLContext } from './api.poml.js';
export { CLI_POML, renderCLIPOML, type CLIPOMLContext } from './cli.poml.js';
export { MOBILE_POML, renderMobilePOML, type MobilePOMLContext } from './mobile.poml.js';
export {
  REFRESH_CONTEXT_POML,
  renderRefreshContextPOML,
  type RefreshContextPOMLContext,
  formatNextTasksList,
  calculateRefreshMetrics,
  MemoryAnchorManager,
  createDefaultMemoryAnchors,
} from './refresh-context.poml.js';
export {
  CHECKPOINT_REVIEW_POML,
  renderCheckpointReviewPOML,
  type CheckpointReviewPOMLContext,
  type ComplianceStatus,
  type ComplianceCheck,
  type ProjectSpecificCheck,
  type CheckpointReviewResult,
  CheckpointReviewManager,
  formatComplianceTable,
  formatProjectSpecificResults,
  formatActionItems,
  formatRecommendations,
  calculateOverallGrade,
  generateAchievements,
  createDefaultProjectChecks,
} from './checkpoint-review.poml.js';
export {
  PROGRESS_SUMMARY_POML,
  renderProgressSummaryPOML,
  type ProgressSummaryPOMLContext,
  type PhaseProgress,
  type TaskInfo,
  type Milestone,
  type Achievement,
  generateProgressBar,
  formatPhaseBreakdown,
  formatUpcomingMilestones,
  formatRecentAchievements,
  calculateEstimatedCompletion,
  generateMotivationalMessage,
  ProgressSummaryManager,
  createDefaultPhases,
  createDefaultMilestones,
} from './progress-summary.poml.js';
export {
  FEATURE_DEVELOPMENT_POML,
  renderFeatureDevelopmentPOML,
  type FeatureDevelopmentPOMLContext,
  type ImplementationPlan,
  type DatabaseChange,
  type FieldDefinition,
  type APIEndpoint,
  type ComponentInfo,
  type FeatureImplementation,
  type FeatureStatus,
  FeatureDevelopmentManager,
  formatImplementationPlan,
  formatTestingChecklist,
  generateTaskBreakdown,
  createFeatureRequirements,
  createAcceptanceCriteria,
  WorkflowStepTracker,
  CodeTemplates,
} from './feature-development.poml.js';
export {
  PROJECT_POML,
  renderProjectPOML,
  type ProjectPOMLContext,
  type TriggerType,
  type RefreshTrigger,
  type MemoryAnchorRule,
  type SessionState,
  type CheckpointHistoryEntry,
  ProjectPOMLManager,
  formatMemoryAnchors,
  formatRefreshTriggers,
  createSessionProgressJSON,
  createCheckpointHistoryJSON,
  createCompletedTasksJSON,
  StateFileStructure,
  ConditionalRefreshManager,
} from './project.poml.js';

/**
 * Get appropriate POML template renderer based on project type
 */
export function getPOMLRenderer(projectType: string): ((context: any) => string) | null {
  switch (projectType.toLowerCase()) {
    case 'web':
      return renderWebPOML;
    case 'api':
      return renderAPIPOML;
    case 'cli':
      return renderCLIPOML;
    case 'mobile':
    case 'desktop':
      return renderMobilePOML;
    case 'library':
    default:
      return renderBasePOML;
  }
}

/**
 * Template utilities
 */
export const TemplateUtils = {
  /**
   * Format features list for POML
   */
  formatFeatures(features: string[]): string {
    return features
      .map((feature, index) => `    <feature id="${index + 1}">${feature}</feature>`)
      .join('\n');
  },

  /**
   * Format next steps for POML
   */
  formatNextSteps(steps: string[]): string {
    return steps
      .map((step, index) => `    <step id="${index + 1}">${step}</step>`)
      .join('\n');
  },

  /**
   * Format endpoints for API POML
   */
  formatEndpoints(endpoints: Array<{ method: string; path: string; description: string }>): string {
    return endpoints
      .map(
        (ep) =>
          `    <endpoint method="${ep.method}" path="${ep.path}">${ep.description}</endpoint>`
      )
      .join('\n');
  },

  /**
   * Format components for Web POML
   */
  formatComponents(components: string[]): string {
    return components
      .map((component) => `    <component>${component}</component>`)
      .join('\n');
  },

  /**
   * Format screens for Mobile POML
   */
  formatScreens(screens: Array<{ name: string; description: string }>): string {
    return screens
      .map((screen) => `    <screen name="${screen.name}">${screen.description}</screen>`)
      .join('\n');
  },

  /**
   * Format commands for CLI POML
   */
  formatCommands(commands: Array<{ name: string; description: string }>): string {
    return commands
      .map((cmd) => `    <command name="${cmd.name}">${cmd.description}</command>`)
      .join('\n');
  },
};
