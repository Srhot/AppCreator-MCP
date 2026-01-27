/**
 * Refresh Context Template - Usage Example
 *
 * This example demonstrates how to use the refresh context template
 * to prevent context loss during development.
 */

import {
  renderRefreshContextPOML,
  calculateRefreshMetrics,
  formatNextTasksList,
  MemoryAnchorManager,
  createDefaultMemoryAnchors,
  type RefreshContextPOMLContext,
} from '../src/templates/poml/index.js';

// Example 1: Basic Refresh at Task 20
function basicRefreshExample() {
  console.log('=== Example 1: Basic Refresh at Task 20 ===\n');

  const metrics = calculateRefreshMetrics({
    currentTaskNumber: 20,
    totalTasks: 100,
    completedTasks: 20,
  });

  const nextTasks = [
    { id: 'TASK-021', title: 'Implement user registration', priority: 'high' },
    { id: 'TASK-022', title: 'Add email validation' },
    { id: 'TASK-023', title: 'Create registration tests', priority: 'high' },
    { id: 'TASK-024', title: 'Add password strength checker' },
    { id: 'TASK-025', title: 'Implement account activation' },
  ];

  const context: Partial<RefreshContextPOMLContext> = {
    projectName: 'AuthSystem',
    currentTaskNumber: 20,
    totalTasks: 100,
    ...metrics,
    currentPhase: 'authentication',
    totalPhases: 5,
    phaseProgress: 40,
    currentFeature: 'User Authentication',
    lastCompletedTask: 'Implement JWT token generation',
    currentTask: 'Implement user registration',
    memoryAnchors: [
      'Project uses Express + TypeScript',
      'JWT tokens expire after 24 hours',
      'All passwords hashed with bcrypt (12 rounds)',
      'Email verification required for activation',
    ],
    nextTasksList: formatNextTasksList(nextTasks),
    warnings: 'No warnings detected.',
    language: 'English',
  };

  const refreshPOML = renderRefreshContextPOML(context);
  console.log(refreshPOML);
  console.log('\n');
}

// Example 2: Using Memory Anchor Manager
function memoryAnchorExample() {
  console.log('=== Example 2: Memory Anchor Manager ===\n');

  const anchorManager = new MemoryAnchorManager();

  // Add critical anchors
  anchorManager.addAnchor('tech-stack', 'React + TypeScript + Vite', 'critical');
  anchorManager.addAnchor('auth', 'JWT with HTTP-only cookies', 'critical');
  anchorManager.addAnchor('testing', 'Minimum 80% test coverage', 'high');
  anchorManager.addAnchor('i18n', 'All UI text supports English and Spanish', 'high');
  anchorManager.addAnchor('styling', 'Tailwind CSS with custom theme', 'medium');

  console.log('Memory Anchors:');
  anchorManager.getAnchorsFormatted().forEach((anchor) => {
    console.log(`  - ${anchor}`);
  });

  console.log('\nInitial Stats:', anchorManager.getStats());

  // Verify some anchors
  anchorManager.verifyAnchor('tech-stack');
  anchorManager.verifyAnchor('auth');
  anchorManager.verifyAnchor('testing');

  console.log('After Verification:', anchorManager.getStats());
  console.log('Unverified:', anchorManager.getUnverifiedAnchors());

  console.log('\n');
}

// Example 3: Default Anchors for Different Project Types
function defaultAnchorsExample() {
  console.log('=== Example 3: Default Anchors by Project Type ===\n');

  const projectTypes = [
    { type: 'web', stack: 'React + TypeScript' },
    { type: 'api', stack: 'Express + PostgreSQL' },
    { type: 'cli', stack: 'Node.js + Commander' },
    { type: 'mobile', stack: 'React Native + Expo' },
  ];

  projectTypes.forEach(({ type, stack }) => {
    console.log(`${type.toUpperCase()} Project (${stack}):`);
    const anchors = createDefaultMemoryAnchors(type, stack);
    anchors.forEach((anchor, index) => {
      console.log(`  ${index + 1}. ${anchor}`);
    });
    console.log('');
  });
}

// Example 4: Refresh at Different Checkpoints
function multipleRefreshesExample() {
  console.log('=== Example 4: Multiple Refreshes ===\n');

  const checkpoints = [20, 40, 60, 80];

  checkpoints.forEach((checkpoint) => {
    const metrics = calculateRefreshMetrics({
      currentTaskNumber: checkpoint,
      totalTasks: 100,
      completedTasks: checkpoint,
    });

    console.log(`Checkpoint ${checkpoint}:`);
    console.log(`  Progress: ${metrics.completionPercentage}%`);
    console.log(`  Last Checkpoint: Task #${metrics.lastCheckpoint}`);
    console.log(`  Next Checkpoint: Task #${metrics.nextCheckpoint}`);
    console.log(`  Tasks Until Next: ${metrics.tasksUntilCheckpoint}`);
    console.log('');
  });
}

// Example 5: Complete Web Application Refresh
function completeWebAppExample() {
  console.log('=== Example 5: Complete Web App Refresh ===\n');

  // Create anchor manager with web-specific anchors
  const anchorManager = new MemoryAnchorManager();
  const defaultAnchors = createDefaultMemoryAnchors('web', 'Next.js + TypeScript');

  defaultAnchors.forEach((anchor, index) => {
    anchorManager.addAnchor(`anchor-${index}`, anchor, index < 4 ? 'critical' : 'high');
  });

  // Add custom project-specific anchors
  anchorManager.addAnchor('design-system', 'Follow Material Design 3 guidelines', 'high');
  anchorManager.addAnchor('api-client', 'Use React Query for data fetching', 'medium');

  // Calculate metrics for task 40
  const metrics = calculateRefreshMetrics({
    currentTaskNumber: 40,
    totalTasks: 150,
    completedTasks: 40,
  });

  const nextTasks = [
    { id: 'TASK-041', title: 'Implement dashboard layout', priority: 'high' },
    { id: 'TASK-042', title: 'Add chart components' },
    { id: 'TASK-043', title: 'Create data visualization', priority: 'high' },
    { id: 'TASK-044', title: 'Add filtering controls' },
    { id: 'TASK-045', title: 'Implement export functionality', priority: 'medium' },
  ];

  const context: Partial<RefreshContextPOMLContext> = {
    projectName: 'E-Commerce Dashboard',
    currentTaskNumber: 40,
    totalTasks: 150,
    ...metrics,
    currentPhase: 'dashboard-implementation',
    totalPhases: 6,
    phaseProgress: 65,
    currentFeature: 'Analytics Dashboard',
    lastCompletedTask: 'Complete user profile section',
    currentTask: 'Implement dashboard layout',
    memoryAnchors: anchorManager.getAnchorsFormatted(),
    nextTasksList: formatNextTasksList(nextTasks),
    warnings: 'WARNING: Chart library bundle size exceeds 200KB. Consider code splitting.',
    language: 'English',
  };

  const refreshPOML = renderRefreshContextPOML(context);
  console.log(refreshPOML.substring(0, 1500) + '...\n[truncated for example]\n');
  console.log('Full POML generated successfully!');
  console.log(`Length: ${refreshPOML.length} characters\n`);
}

// Example 6: API Project with Warnings
function apiProjectWithWarningsExample() {
  console.log('=== Example 6: API Project with Warnings ===\n');

  const metrics = calculateRefreshMetrics({
    currentTaskNumber: 60,
    totalTasks: 120,
    completedTasks: 60,
  });

  const nextTasks = [
    { id: 'TASK-061', title: 'Add rate limiting middleware', priority: 'high' },
    { id: 'TASK-062', title: 'Implement caching layer', priority: 'high' },
    { id: 'TASK-063', title: 'Add database connection pooling' },
    { id: 'TASK-064', title: 'Optimize slow queries' },
    { id: 'TASK-065', title: 'Add API documentation', priority: 'medium' },
  ];

  const context: Partial<RefreshContextPOMLContext> = {
    projectName: 'REST API Backend',
    currentTaskNumber: 60,
    totalTasks: 120,
    ...metrics,
    currentPhase: 'performance-optimization',
    totalPhases: 4,
    phaseProgress: 75,
    currentFeature: 'Performance & Scaling',
    lastCompletedTask: 'Complete user endpoints',
    currentTask: 'Add rate limiting middleware',
    memoryAnchors: createDefaultMemoryAnchors('api', 'Fastify + PostgreSQL'),
    nextTasksList: formatNextTasksList(nextTasks),
    warnings: `WARNINGS DETECTED:
    - Database query on /api/users endpoint averaging 2.5s (target: <200ms)
    - Missing rate limiting on public endpoints
    - Redis cache hit ratio below 60% (target: 80%)
    - Authentication middleware lacks brute-force protection`,
    language: 'English',
  };

  const refreshPOML = renderRefreshContextPOML(context);
  console.log('API Project Refresh Generated with Warnings');
  console.log('Warnings section should alert to performance issues\n');
}

// Run all examples
console.log('\n========================================');
console.log('REFRESH CONTEXT TEMPLATE - EXAMPLES');
console.log('========================================\n');

// basicRefreshExample();
memoryAnchorExample();
defaultAnchorsExample();
multipleRefreshesExample();
completeWebAppExample();
apiProjectWithWarningsExample();

console.log('========================================');
console.log('All examples completed successfully!');
console.log('========================================\n');

export {
  basicRefreshExample,
  memoryAnchorExample,
  defaultAnchorsExample,
  multipleRefreshesExample,
  completeWebAppExample,
  apiProjectWithWarningsExample,
};
