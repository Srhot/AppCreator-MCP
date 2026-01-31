# Checkpoint Review Template - Documentation

## Overview

The **Checkpoint Review Template** runs **AUTOMATICALLY every 20 tasks** to ensure quality and consistency throughout development. It performs comprehensive quality checks, constitution compliance verification, and project-specific validations.

## Critical Importance

### Why Automatic Reviews Matter

**Without Checkpoint Reviews**:
- ❌ Quality degrades over time
- ❌ Technical debt accumulates
- ❌ Constitution violations go unnoticed
- ❌ Test coverage drops
- ❌ Documentation becomes stale

**With Checkpoint Reviews**:
- ✅ Consistent quality maintained
- ✅ Early issue detection
- ✅ Constitution compliance enforced
- ✅ Test coverage monitored
- ✅ Continuous improvement

---

## Template Structure

### File Location
`src/templates/poml/checkpoint-review.poml.ts`

### Compiled Size
16 KB (largest template - comprehensive functionality)

### Main Components

#### 1. Role Definition
```xml
<role>
  You are the Checkpoint Quality Assurance Manager.
  You run automatic reviews every 20 tasks to ensure quality and consistency.
</role>
```

#### 2. Four-Step Review Process

**Step 1: Verify Recent Work**
- Review last 20 completed tasks
- Check code quality
- Verify tests exist
- Validate documentation

**Step 2: Constitution Compliance**
- Language requirements met?
- TypeScript strict mode enforced?
- Test coverage >= 70%?
- Audit logging present?

**Step 3: Project-Specific Checks**
- Custom validations based on project type
- Technology-specific requirements
- Architecture compliance

**Step 4: Update Tracking Files**
- Update session-progress.json
- Log checkpoint in checkpoint-history.json
- Save review results

#### 3. Quality Gates
```xml
<quality-gates>
  <minimum-code-quality>7</minimum-code-quality>
  <minimum-test-coverage>70</minimum-test-coverage>
  <required-documentation>complete</required-documentation>
  <constitution-compliance>mandatory</constitution-compliance>
</quality-gates>
```

---

## Usage

### Basic Usage

```typescript
import {
  renderCheckpointReviewPOML,
  type CheckpointReviewPOMLContext
} from './templates/poml';

const context: Partial<CheckpointReviewPOMLContext> = {
  checkpointTaskNumber: 40,
  startTask: 21,
  endTask: 40,
  tasksReviewed: 20,
  checkpointNumber: 2,
  codeQualityScore: 8.5,
  testCoverage: 75,
  documentationStatus: 'Complete',
  overallGrade: 'A',
  language: 'English',
  languageCompliance: '✅ Pass',
  languageNotes: 'All UI text in English',
  typescriptCompliance: '✅ Pass',
  typescriptNotes: 'Strict mode enforced',
  testCompliance: '✅ Pass',
  testNotes: 'Coverage at 75%',
  auditCompliance: '✅ Pass',
  auditNotes: 'Audit logs implemented',
  actionItems: formatActionItems([]),
  recommendations: formatRecommendations([
    'Consider increasing test coverage to 80%'
  ]),
  totalCheckpoints: 2,
  averageQualityScore: 8.3,
  issuesFound: 0,
  issuesResolved: 2,
  nextCheckpointNumber: 60,
  tasksUntilNext: 20
};

const checkpointPOML = renderCheckpointReviewPOML(context);
```

### Using Checkpoint Review Manager

```typescript
import {
  CheckpointReviewManager,
  createDefaultProjectChecks
} from './templates/poml';

// Create manager
const reviewManager = new CheckpointReviewManager();

// Register project-specific checks
const webChecks = createDefaultProjectChecks('web');
webChecks.forEach(check => reviewManager.registerCheck(check));

// Check if should trigger (every 20 tasks)
if (reviewManager.shouldTriggerCheckpoint(40)) {
  // Run checkpoint review
  const tasksCompleted = getCompletedTasks(); // Your task list
  const result = await reviewManager.runCheckpoint(40, tasksCompleted);

  console.log('Checkpoint passed:', result.passed);
  console.log('Code quality:', result.codeQualityScore);
  console.log('Test coverage:', result.testCoverage);
  console.log('Action items:', result.actionItems);
  console.log('Recommendations:', result.recommendations);

  // Get statistics
  const stats = reviewManager.getStatistics();
  console.log('Average quality:', stats.averageQualityScore);
  console.log('Pass rate:', stats.passRate + '%');
}
```

---

## Compliance Checks

### Constitution Compliance

The checkpoint reviews enforce the project constitution with mandatory checks:

#### 1. Language Requirements
```typescript
{
  rule: 'Language Requirements',
  status: '✅ Pass' | '⚠️ Warning' | '❌ Fail',
  notes: 'All UI text in specified language'
}
```

#### 2. TypeScript Strict Mode
```typescript
{
  rule: 'TypeScript Strict Mode',
  status: '✅ Pass',
  notes: 'Strict mode enforced, no type: any'
}
```

#### 3. Test Coverage
```typescript
{
  rule: 'Test Coverage',
  status: '✅ Pass',
  notes: 'Coverage at 75% (minimum: 70%)'
}
```

#### 4. Audit Logging
```typescript
{
  rule: 'Audit Logging',
  status: '✅ Pass',
  notes: 'All mutations logged'
}
```

### Compliance Status Types

```typescript
type ComplianceStatus = '✅ Pass' | '⚠️ Warning' | '❌ Fail';
```

- **✅ Pass**: Fully compliant
- **⚠️ Warning**: Minor issues, not blocking
- **❌ Fail**: Critical issues, must fix

---

## Project-Specific Checks

### Default Checks by Project Type

#### Web Projects
```typescript
const webChecks = [
  {
    id: 'accessibility',
    description: 'WCAG 2.1 AA accessibility compliance',
    priority: 'critical'
  },
  {
    id: 'responsive',
    description: 'Responsive design implemented',
    priority: 'high'
  },
  {
    id: 'no-console-logs',
    description: 'No console.log in production code',
    priority: 'medium'
  }
];
```

#### API Projects
```typescript
const apiChecks = [
  {
    id: 'api-docs',
    description: 'API endpoints documented (OpenAPI/Swagger)',
    priority: 'critical'
  },
  {
    id: 'input-validation',
    description: 'All endpoints have input validation',
    priority: 'critical'
  },
  {
    id: 'rate-limiting',
    description: 'Rate limiting implemented',
    priority: 'high'
  }
];
```

#### CLI Projects
```typescript
const cliChecks = [
  {
    id: 'help-docs',
    description: 'All commands have --help documentation',
    priority: 'critical'
  },
  {
    id: 'error-handling',
    description: 'User-friendly error messages',
    priority: 'high'
  }
];
```

### Custom Checks

```typescript
const customCheck: ProjectSpecificCheck = {
  id: 'custom-validation',
  description: 'Custom business rule validation',
  checkFunction: async () => {
    // Your validation logic
    const isValid = await validateBusinessRule();
    return isValid;
  },
  priority: 'high'
};

reviewManager.registerCheck(customCheck);
```

---

## Helper Functions

### Format Compliance Table

```typescript
import { formatComplianceTable } from './templates/poml';

const checks: ComplianceCheck[] = [
  {
    rule: 'Language Requirements',
    status: '✅ Pass',
    notes: 'All UI text in English'
  },
  {
    rule: 'Test Coverage',
    status: '⚠️ Warning',
    notes: 'Coverage at 68% (target: 70%)'
  }
];

const table = formatComplianceTable(checks);
// | Language Requirements | ✅ Pass | All UI text in English |
// | Test Coverage | ⚠️ Warning | Coverage at 68% (target: 70%) |
```

### Format Action Items

```typescript
import { formatActionItems } from './templates/poml';

const items = [
  'Increase test coverage to 70%',
  'Fix TypeScript strict mode violations',
  'Add missing API documentation'
];

const formatted = formatActionItems(items);
// - Increase test coverage to 70%
// - Fix TypeScript strict mode violations
// - Add missing API documentation
```

### Calculate Overall Grade

```typescript
import { calculateOverallGrade } from './templates/poml';

const grade = calculateOverallGrade(8.5, 75);
// Returns: 'A (Very Good)'

// Grading Scale:
// A+ (Excellent): >= 90%
// A (Very Good): >= 80%
// B (Good): >= 70%
// C (Satisfactory): >= 60%
// D (Needs Improvement): < 60%
```

### Generate Achievements

```typescript
import { generateAchievements } from './templates/poml';

const achievements = generateAchievements(9.2, 85, 5);
// Returns:
// 🏆 Code Quality Excellence
// 🧪 Testing Champion
// ⭐ Perfect Score
// 🎯 Consistency Master
```

---

## Checkpoint Review Manager

### Full API

```typescript
class CheckpointReviewManager {
  // Register custom checks
  registerCheck(check: ProjectSpecificCheck): void

  // Determine if checkpoint should trigger
  shouldTriggerCheckpoint(completedTasks: number, frequency?: number): boolean

  // Run comprehensive checkpoint review
  async runCheckpoint(
    taskNumber: number,
    tasksCompleted: string[]
  ): Promise<CheckpointReviewResult>

  // Get historical statistics
  getStatistics(): {
    totalCheckpoints: number
    averageQualityScore: number
    averageTestCoverage: number
    passRate: number
  }

  // Get checkpoint history
  getHistory(): CheckpointRecord[]

  // Get latest checkpoint
  getLatestCheckpoint(): CheckpointRecord | null
}
```

### Checkpoint Result Structure

```typescript
interface CheckpointReviewResult {
  passed: boolean                    // Did checkpoint pass all gates?
  codeQualityScore: number           // 0-10 score
  testCoverage: number               // Percentage
  complianceChecks: ComplianceCheck[] // Constitution compliance
  actionItems: string[]              // Required fixes
  recommendations: string[]          // Suggested improvements
  issuesFound: number               // New issues discovered
  issuesResolved: number            // Issues fixed since last checkpoint
}
```

---

## Quality Gates

### Minimum Requirements

1. **Code Quality**: >= 7/10
   - Below 7: Action item created
   - 7-8: Good
   - 9-10: Excellent (achievement unlocked)

2. **Test Coverage**: >= 70%
   - Below 70%: Action item created
   - 70-79%: Good
   - 80%+: Excellent (achievement unlocked)

3. **Documentation**: Complete
   - Missing docs: Action item created
   - Partial: Warning
   - Complete: Pass

4. **Constitution Compliance**: Mandatory
   - Any failure: Critical action item
   - All pass: Checkpoint passes

### Failure Handling

If checkpoint fails:
- ❌ Action items created
- ⚠️ Development should pause to address issues
- 📊 Statistics tracked for improvement
- 🔄 Next checkpoint monitors resolution

---

## Example Output

### Successful Checkpoint

```markdown
# ✅ CHECKPOINT REPORT - Task #40

**Date:** 2025-11-17T17:00:00.000Z
**Tasks Reviewed:** #21 - #40 (20 tasks)
**Checkpoint Number:** 2

## 🔍 QUALITY CONTROL
- **Code Quality:** 8.5/10
- **Test Coverage:** 75%
- **Documentation:** Complete
- **Overall Grade:** A (Very Good)

## ✅ CONSTITUTION COMPLIANCE

| Rule | Status | Notes |
|------|--------|-------|
| English Language | ✅ Pass | All UI text in English |
| TypeScript Strict | ✅ Pass | Strict mode enforced |
| Test Coverage | ✅ Pass | Coverage at 75% |
| Audit Logging | ✅ Pass | All mutations logged |

## 🎯 PROJECT-SPECIFIC CHECKS

- WCAG 2.1 AA accessibility compliance: ✅ Pass
- Responsive design implemented: ✅ Pass
- No console.log in production code: ✅ Pass

## ⚠️ ACTION ITEMS

No action items. All checks passed!

## 💡 RECOMMENDATIONS

- Consider increasing test coverage to 80%
- Add performance monitoring
- Document complex algorithms

## 📊 CHECKPOINT STATISTICS
- **Total Checkpoints:** 2
- **Average Quality Score:** 8.3/10
- **Issues Found:** 0
- **Issues Resolved:** 2

## 📈 NEXT CHECKPOINT
**Task:** #60 (20 tasks away)

## 🏆 ACHIEVEMENTS
🏆 Code Quality Excellence
🧪 Testing Champion
⭐ Perfect Score
🎯 Consistency Master

---
✅ Checkpoint review complete. All systems green.
```

### Failed Checkpoint

```markdown
# ✅ CHECKPOINT REPORT - Task #60

**Date:** 2025-11-17T18:00:00.000Z
**Tasks Reviewed:** #41 - #60 (20 tasks)
**Checkpoint Number:** 3

## 🔍 QUALITY CONTROL
- **Code Quality:** 6.5/10
- **Test Coverage:** 62%
- **Documentation:** Partial
- **Overall Grade:** C (Satisfactory)

## ✅ CONSTITUTION COMPLIANCE

| Rule | Status | Notes |
|------|--------|-------|
| English Language | ✅ Pass | All UI text in English |
| TypeScript Strict | ⚠️ Warning | 3 any types found |
| Test Coverage | ❌ Fail | Coverage at 62% (minimum: 70%) |
| Audit Logging | ✅ Pass | All mutations logged |

## ⚠️ ACTION ITEMS

- Improve code quality (current: 6.5/10, minimum: 7/10)
- Increase test coverage (current: 62%, minimum: 70%)
- Fix compliance issue: TypeScript Strict - Remove any types
- Complete missing documentation

## 💡 RECOMMENDATIONS

- Refactor complex functions for better maintainability
- Add integration tests for new features
- Set up automated code quality checks

## 📊 CHECKPOINT STATISTICS
- **Total Checkpoints:** 3
- **Average Quality Score:** 7.8/10
- **Issues Found:** 4
- **Issues Resolved:** 0

## 📈 NEXT CHECKPOINT
**Task:** #80 (20 tasks away)

---
⚠️ Checkpoint review complete. Action items require attention.
```

---

## Integration with AppCreator

### Automatic Trigger

```typescript
// In main AppCreator server
import {
  CheckpointReviewManager,
  renderCheckpointReviewPOML,
  createDefaultProjectChecks
} from './templates/poml/index.js';

class AppCreatorServer {
  private checkpointManagers: Map<string, CheckpointReviewManager> = new Map();

  private async checkAndRunCheckpoint(projectName: string, state: ProjectState) {
    const completedTasks = state.progress.completed_tasks;

    // Get or create checkpoint manager
    let manager = this.checkpointManagers.get(projectName);
    if (!manager) {
      manager = new CheckpointReviewManager();
      // Register project-specific checks
      const checks = createDefaultProjectChecks(state.type);
      checks.forEach(check => manager!.registerCheck(check));
      this.checkpointManagers.set(projectName, manager);
    }

    // Check if should trigger
    if (manager.shouldTriggerCheckpoint(completedTasks)) {
      // Run checkpoint
      const result = await manager.runCheckpoint(
        completedTasks,
        state.files_created
      );

      // Generate report
      const report = renderCheckpointReviewPOML({
        checkpointTaskNumber: completedTasks,
        checkpointNumber: Math.floor(completedTasks / 20),
        codeQualityScore: result.codeQualityScore,
        testCoverage: result.testCoverage,
        // ... other context
      });

      // Save checkpoint history
      await this.saveCheckpointReport(projectName, report, result);

      return {
        triggered: true,
        passed: result.passed,
        report
      };
    }

    return { triggered: false };
  }
}
```

---

## Best Practices

### 1. Never Skip Checkpoints
❌ **Don't**: Disable checkpoints "to move faster"
✅ **Do**: Use checkpoints to maintain quality

### 2. Address Action Items Immediately
❌ **Don't**: Accumulate technical debt
✅ **Do**: Fix issues before continuing

### 3. Monitor Trends
❌ **Don't**: Ignore declining scores
✅ **Do**: Track quality trends over time

### 4. Customize Checks
❌ **Don't**: Use only default checks
✅ **Do**: Add project-specific validations

### 5. Review Reports
❌ **Don't**: Auto-generate and ignore
✅ **Do**: Read reports and act on recommendations

---

## Summary

**File Created:** `src/templates/poml/checkpoint-review.poml.ts`

**Compiled Size:** 16 KB

**Key Features:**
- ✅ Automatic trigger every 20 tasks
- ✅ Code quality scoring (0-10)
- ✅ Test coverage monitoring
- ✅ Constitution compliance checks
- ✅ Project-specific validations
- ✅ Action item generation
- ✅ Recommendations
- ✅ Achievement system
- ✅ Historical tracking
- ✅ Quality gates

**Exported Components:**
- `CHECKPOINT_REVIEW_POML` - Template string
- `renderCheckpointReviewPOML()` - Rendering function
- `CheckpointReviewManager` - Manager class
- `formatComplianceTable()` - Table formatter
- `formatActionItems()` - Item formatter
- `formatRecommendations()` - Recommendation formatter
- `calculateOverallGrade()` - Grade calculator
- `generateAchievements()` - Achievement generator
- `createDefaultProjectChecks()` - Default checks generator

**Integration Ready:** ✅ Yes

---

**Last Updated:** 2025-11-17
**Version:** 1.0.0
