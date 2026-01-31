# Refresh Context Template - CRITICAL Documentation

## Overview

The **Refresh Context Template** is the **MOST CRITICAL** component of AppCreator's context preservation system. It automatically reloads project context every 20 tasks to prevent context loss and ensure development continuity.

## Why This Is Critical

### The Context Loss Problem

During long development sessions:
- AI context windows have limits
- Critical project knowledge can be forgotten
- Development principles may drift
- Implementation details get lost
- Progress tracking becomes unreliable

### The Solution

The Refresh Context Template solves this by:
1. **Triggering automatically** every 20 tasks
2. **Reloading core documents** (constitution, spec, plan, tasks)
3. **Verifying memory anchors** (critical facts that must never be forgotten)
4. **Generating status reports** showing exact current position
5. **Providing continuation context** to resume seamlessly

---

## Template Structure

### File Location
`src/templates/poml/refresh-context.poml.ts`

### Main Components

#### 1. Role Definition
```xml
<role>
  You are the Context Refresh Manager for {{projectName}}.
  Your job is to reload critical project knowledge and ensure continuity.
</role>
```

Establishes the AI's role during refresh operations.

#### 2. Refresh Procedure
```xml
<task>
  CONTEXT REFRESH PROCEDURE:

  1. RELOAD CORE DOCUMENTS
     - Read memory/constitution.md
     - Read specification/SPEC.md
     - Read planning/PLAN.md
     - Read planning/TASKS.md

  2. CHECK SESSION STATE
     - Load .claude/state/session-progress.json
     - Identify: Last completed task, current phase, active feature

  3. VERIFY MEMORY ANCHORS (CRITICAL - Never forget these!)
     {{memoryAnchors}}

  4. GENERATE STATUS REPORT
     - Total tasks completed
     - Current phase
     - Next 5 tasks in queue
     - Any blockers or warnings
</task>
```

Four-step process executed on every refresh.

#### 3. Context Documents
```xml
<context>
  <document src="../memory/constitution.md" priority="critical" />
  <document src="../specification/SPEC.md" priority="critical" />
  <document src="../planning/PLAN.md" priority="high" />
  <document src="../planning/TASKS.md" priority="high" />
  <document src="../.claude/state/session-progress.json" priority="critical" />
</context>
```

Specifies which documents to reload with priority levels.

#### 4. Status Report Output
Generates a comprehensive status report including:
- Progress status (completed/remaining tasks)
- Current position (phase, feature, task)
- Memory anchor verification
- Next 5 tasks
- Warnings/blockers
- Checkpoint information

#### 5. Refresh Configuration
```xml
<refresh-config>
  <frequency>20</frequency>
  <trigger>task-count</trigger>
  <auto-save-state>true</auto-save-state>
  <verify-memory-anchors>true</verify-memory-anchors>
</refresh-config>
```

---

## Usage

### Basic Usage

```typescript
import { renderRefreshContextPOML, type RefreshContextPOMLContext } from './templates/poml';

const context: Partial<RefreshContextPOMLContext> = {
  projectName: 'my-web-app',
  currentTaskNumber: 40,
  totalTasks: 100,
  completedTasks: 40,
  completionPercentage: 40,
  remainingTasks: 60,
  tasksSinceRefresh: 20,
  currentPhase: 'implementation',
  totalPhases: 5,
  phaseProgress: 50,
  currentFeature: 'User Authentication',
  lastCompletedTask: 'Implement password hashing',
  currentTask: 'Create login endpoint',
  memoryAnchors: [
    'Project uses React + TypeScript',
    'All endpoints must have JWT authentication',
    'Tests required before task completion',
    'Auto-refresh every 20 tasks'
  ],
  nextTasksList: formatNextTasksList([
    { id: 'TASK-041', title: 'Create login endpoint' },
    { id: 'TASK-042', title: 'Add input validation' },
    { id: 'TASK-043', title: 'Write login tests' },
    { id: 'TASK-044', title: 'Implement logout endpoint' },
    { id: 'TASK-045', title: 'Add session management' }
  ]),
  warnings: 'No warnings or blockers detected.',
  lastCheckpoint: 40,
  nextCheckpoint: 60,
  tasksUntilCheckpoint: 20,
  nextTaskNumber: 41,
  language: 'English'
};

const refreshPOML = renderRefreshContextPOML(context);
```

### Using Helper Functions

#### Calculate Refresh Metrics

```typescript
import { calculateRefreshMetrics } from './templates/poml';

const metrics = calculateRefreshMetrics({
  currentTaskNumber: 40,
  totalTasks: 100,
  completedTasks: 40,
  refreshFrequency: 20 // optional, defaults to 20
});

// Returns:
// {
//   completedTasks: 40,
//   remainingTasks: 60,
//   completionPercentage: 40,
//   tasksSinceRefresh: 20,
//   lastCheckpoint: 40,
//   nextCheckpoint: 60,
//   tasksUntilCheckpoint: 20,
//   nextTaskNumber: 41
// }
```

#### Format Next Tasks List

```typescript
import { formatNextTasksList } from './templates/poml';

const tasks = [
  { id: 'TASK-041', title: 'Create login endpoint', priority: 'high' },
  { id: 'TASK-042', title: 'Add validation', priority: 'medium' },
  { id: 'TASK-043', title: 'Write tests' }
];

const formatted = formatNextTasksList(tasks);
// Output:
//     1. TASK-041: Create login endpoint [high]
//     2. TASK-042: Add validation [medium]
//     3. TASK-043: Write tests
```

---

## Memory Anchor System

### What Are Memory Anchors?

**Memory anchors** are critical facts that must **NEVER** be forgotten during development. They act as permanent reminders of key project decisions, constraints, and principles.

### Memory Anchor Manager

```typescript
import { MemoryAnchorManager } from './templates/poml';

const anchorManager = new MemoryAnchorManager();

// Add critical anchors
anchorManager.addAnchor(
  'tech-stack',
  'Project uses React + TypeScript + Vite',
  'critical'
);

anchorManager.addAnchor(
  'auth-method',
  'All API endpoints require JWT authentication',
  'critical'
);

anchorManager.addAnchor(
  'testing',
  'Minimum 80% test coverage required',
  'high'
);

anchorManager.addAnchor(
  'language',
  'All UI text must be in Spanish',
  'high'
);

// Get formatted list for POML
const anchors = anchorManager.getAnchorsFormatted();
// [
//   'Project uses React + TypeScript + Vite [CRITICAL]',
//   'All API endpoints require JWT authentication [CRITICAL]',
//   'Minimum 80% test coverage required [HIGH]',
//   'All UI text must be in Spanish [HIGH]'
// ]

// Verify anchors during refresh
anchorManager.verifyAnchor('tech-stack');
anchorManager.verifyAnchor('auth-method');

// Get statistics
const stats = anchorManager.getStats();
// {
//   total: 4,
//   verified: 2,
//   unverified: 2,
//   critical: 2,
//   verificationRate: 50
// }

// Reset verification (before next refresh)
anchorManager.resetVerification();
```

### Creating Default Memory Anchors

```typescript
import { createDefaultMemoryAnchors } from './templates/poml';

// For a web project
const webAnchors = createDefaultMemoryAnchors('web', 'React + TypeScript');
// Returns:
// [
//   'Project follows constitution.md principles at all times',
//   'All code must be type-safe and pass strict TypeScript checks',
//   'Tests must be written before marking tasks complete',
//   'Auto-refresh must be used every 20 tasks to prevent context loss',
//   'Frontend framework: React + TypeScript',
//   'All UI text must be in the specified language',
//   'Components must be modular and reusable',
//   'Accessibility (WCAG 2.1 AA) is required'
// ]

// For an API project
const apiAnchors = createDefaultMemoryAnchors('api', 'Express + TypeScript');
// Returns API-specific anchors including:
//   'All endpoints must have input validation',
//   'Authentication and authorization are mandatory',
//   etc.
```

---

## Refresh Workflow

### Automatic Refresh Cycle

```
Task 1-19  → Development continues normally
Task 20    → TRIGGER: Auto-refresh
           → Reload documents
           → Verify memory anchors
           → Generate status report
           → Continue development

Task 21-39 → Development continues
Task 40    → TRIGGER: Auto-refresh
           → Repeat process
```

### What Happens During Refresh

1. **Document Reloading**
   - `constitution.md` - Project principles
   - `SPEC.md` - Requirements and specifications
   - `PLAN.md` - Implementation strategy
   - `TASKS.md` - Task breakdown
   - `session-progress.json` - Current state

2. **Memory Anchor Verification**
   - Check each critical fact
   - Mark as verified
   - Report any unverified anchors

3. **Status Report Generation**
   - Calculate progress metrics
   - Identify current position
   - List next tasks
   - Check for warnings/blockers

4. **State Synchronization**
   - Save updated state
   - Update progress tracking
   - Prepare continuation context

---

## Integration Example

### In AppCreator Server

```typescript
import {
  renderRefreshContextPOML,
  calculateRefreshMetrics,
  formatNextTasksList,
  MemoryAnchorManager,
  createDefaultMemoryAnchors
} from './templates/poml/index.js';

class AppCreatorServer {
  private anchorManagers: Map<string, MemoryAnchorManager> = new Map();

  private shouldTriggerRefresh(completedTasks: number): boolean {
    return completedTasks % 20 === 0 && completedTasks > 0;
  }

  private async performContextRefresh(projectName: string, state: ProjectState) {
    // Get or create anchor manager
    let anchorManager = this.anchorManagers.get(projectName);
    if (!anchorManager) {
      anchorManager = new MemoryAnchorManager();
      const defaultAnchors = createDefaultMemoryAnchors(
        state.type,
        state.tech_stack
      );
      defaultAnchors.forEach((anchor, index) => {
        anchorManager!.addAnchor(`anchor-${index}`, anchor, 'high');
      });
      this.anchorManagers.set(projectName, anchorManager);
    }

    // Calculate metrics
    const metrics = calculateRefreshMetrics({
      currentTaskNumber: state.progress.completed_tasks,
      totalTasks: state.progress.total_tasks,
      completedTasks: state.progress.completed_tasks
    });

    // Format next tasks
    const nextTasks = state.next_steps.slice(0, 5).map((step, index) => ({
      id: `TASK-${state.progress.completed_tasks + index + 1}`,
      title: step
    }));

    // Generate refresh POML
    const refreshPOML = renderRefreshContextPOML({
      projectName,
      currentTaskNumber: state.progress.completed_tasks,
      totalTasks: state.progress.total_tasks,
      completedTasks: metrics.completedTasks,
      completionPercentage: metrics.completionPercentage,
      remainingTasks: metrics.remainingTasks,
      tasksSinceRefresh: metrics.tasksSinceRefresh,
      currentPhase: state.progress.current_phase,
      totalPhases: 5,
      phaseProgress: 50,
      currentFeature: state.features[state.features.length - 1],
      memoryAnchors: anchorManager.getAnchorsFormatted(),
      nextTasksList: formatNextTasksList(nextTasks),
      lastCheckpoint: metrics.lastCheckpoint,
      nextCheckpoint: metrics.nextCheckpoint,
      tasksUntilCheckpoint: metrics.tasksUntilCheckpoint,
      nextTaskNumber: metrics.nextTaskNumber
    });

    return refreshPOML;
  }
}
```

---

## Best Practices

### 1. **Never Skip Refresh**
- Always refresh at 20-task intervals
- Don't wait until context is lost
- Treat it as mandatory, not optional

### 2. **Maintain Memory Anchors**
- Add project-specific anchors early
- Keep them concise and clear
- Update only when necessary
- Verify during every refresh

### 3. **Keep Documents Updated**
- Update constitution.md when principles change
- Keep SPEC.md current with requirements
- Update PLAN.md as architecture evolves
- Maintain TASKS.md breakdown accuracy

### 4. **Monitor Refresh Reports**
- Review status reports
- Check for warnings/blockers
- Verify progress accuracy
- Ensure anchors are verified

### 5. **Use Custom Frequency When Needed**
- Default: 20 tasks
- Complex projects: 15 tasks
- Simple projects: 25 tasks
- Adjust based on context usage

---

## Example Output

### Generated Status Report

```markdown
# 🔄 my-web-app - CONTEXT REFRESH REPORT

**Date:** 2025-11-17T16:45:00.000Z
**Session ID:** refresh-1700237100000-abc123
**Refresh Trigger:** Task #40 (Auto-refresh every 20 tasks)

## 📊 PROGRESS STATUS
- **Total Tasks:** 100
- **Completed:** 40 (40%)
- **Remaining:** 60
- **Tasks Since Last Refresh:** 20

## 🎯 CURRENT POSITION
- **Active Phase:** implementation / 5
- **Phase Progress:** 50%
- **Active Feature:** User Authentication
- **Last Completed Task:** Implement password hashing
- **Current Task:** Create login endpoint

## ✅ MEMORY ANCHOR VERIFICATION
    - [x] Project uses React + TypeScript + Vite [CRITICAL]
    - [x] All API endpoints require JWT authentication [CRITICAL]
    - [x] Minimum 80% test coverage required [HIGH]
    - [x] All UI text must be in Spanish [HIGH]

## 📋 NEXT 5 TASKS
    1. TASK-041: Create login endpoint [high]
    2. TASK-042: Add input validation [medium]
    3. TASK-043: Write login tests
    4. TASK-044: Implement logout endpoint
    5. TASK-045: Add session management

## ⚠️ WARNINGS / BLOCKERS
No warnings or blockers detected.

## 🎉 CHECKPOINT INFO
- **Last Checkpoint:** Task #40
- **Next Checkpoint:** Task #60 (20 tasks away)
- **Checkpoint Frequency:** Every 20 tasks

## 📚 DOCUMENTS RELOADED
- [x] constitution.md - Project principles verified
- [x] SPEC.md - Requirements confirmed
- [x] PLAN.md - Implementation strategy loaded
- [x] TASKS.md - Task breakdown reviewed
- [x] session-progress.json - State synchronized

✅ Context refresh complete. Ready to continue from task #41!
```

---

## Summary

**File Created:** `src/templates/poml/refresh-context.poml.ts`

**Size:** 9.5 KB (compiled)

**Key Features:**
- ✅ Automatic refresh every 20 tasks
- ✅ Document reloading system
- ✅ Memory anchor verification
- ✅ Comprehensive status reports
- ✅ Progress tracking
- ✅ Next tasks preview
- ✅ Warning/blocker detection
- ✅ Checkpoint management

**Exported Components:**
- `REFRESH_CONTEXT_POML` - Template string
- `renderRefreshContextPOML()` - Rendering function
- `formatNextTasksList()` - Task list formatter
- `calculateRefreshMetrics()` - Metrics calculator
- `MemoryAnchorManager` - Anchor management class
- `createDefaultMemoryAnchors()` - Default anchors generator

**Integration Status:** ✅ Ready for integration with main server

---

**CRITICAL IMPORTANCE:** This template is the cornerstone of AppCreator's context preservation system. Without it, long development sessions would suffer from context drift and loss of critical project knowledge.

---

**Last Updated:** 2025-11-17
**Version:** 1.0.0
