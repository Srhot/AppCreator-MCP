# DevForge Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Claude Desktop                         │
│                   (MCP Client)                              │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ MCP Protocol (stdio)
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                  DevForge MCP Server                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Server Request Handlers                    │   │
│  │  • ListTools  • CallTool                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                Tool Dispatcher                       │   │
│  │  Routes requests to appropriate handlers            │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │  create  │   get    │ generate │   auto   │   add    │  │
│  │ _project │ _status  │  _poml   │ _refresh │ _feature │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
│                          │                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            State Management System                   │   │
│  │  Map<projectName, ProjectState>                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          File System Operations                      │   │
│  │  • Create directories  • Write files                │   │
│  │  • Generate templates  • Save state                 │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │    File System Output          │
        ├───────────────────────────────┤
        │  • Project folders             │
        │  • Source files                │
        │  • Configuration files         │
        │  • POML templates             │
        │  • State files (.devforge/)   │
        └───────────────────────────────┘
```

## Component Details

### 1. MCP Server Core

```typescript
class DevForgeServer {
  private server: Server                      // MCP SDK server instance
  private projectStates: Map<string, State>   // In-memory state storage

  constructor()         // Initialize server and handlers
  setupHandlers()       // Register MCP request handlers
  getTools()           // Define available tools
  run()                // Start stdio transport
}
```

**Responsibilities:**
- Handle MCP protocol communication
- Route tool requests
- Manage server lifecycle
- Handle errors globally

### 2. Tool Handlers

#### create_project
```
Input: name, type, tech_stack, description, features
  │
  ├─> Generate project structure
  ├─> Create folders and files
  ├─> Initialize state
  ├─> Generate POML
  └─> Return project details
```

#### get_project_status
```
Input: project_name
  │
  ├─> Lookup project state
  ├─> Calculate progress %
  ├─> Generate next steps
  └─> Return status
```

#### generate_poml
```
Input: project_name, update_mode
  │
  ├─> Load project state
  ├─> Create POML content
  ├─> Write to PROJECT.poml
  └─> Return file path
```

#### auto_refresh
```
Input: project_name
  │
  ├─> Serialize project state
  ├─> Save to .devforge/state.json
  ├─> Generate continuation prompt
  ├─> Update POML
  └─> Return resume instructions
```

#### add_feature
```
Input: project_name, feature_name, notes
  │
  ├─> Update project state
  ├─> Add feature to list
  ├─> Recalculate tasks
  ├─> Update next steps
  └─> Return updated state
```

### 3. State Management

```typescript
interface ProjectState {
  name: string
  type: string
  tech_stack: string
  description: string
  features: string[]
  created_at: string
  status: "initializing" | "active" | "completed" | "paused"
  progress: {
    total_tasks: number
    completed_tasks: number
    current_phase: string
  }
  files_created: string[]
  next_steps: string[]
}
```

**State Flow:**
```
Create → Initialize State → Store in Map
   │
   ├─> Modify State (add feature, update progress)
   │
   └─> Save State (auto-refresh) → .devforge/state.json
```

### 4. Project Structure Generator

```
generateProjectStructure(type, tech_stack)
  │
  ├─> Base structure (src/, tests/, docs/)
  │
  ├─> Type-specific additions
  │   ├─> web    → components/, styles/, public/
  │   ├─> api    → routes/, controllers/, models/
  │   ├─> cli    → commands/, utils/
  │   ├─> desktop → main/, renderer/
  │   ├─> mobile  → screens/, navigation/
  │   └─> library → lib/, examples/
  │
  └─> Return { folders: [], files: {} }
```

### 5. POML Generator

```
createPOMLTemplate(state)
  │
  ├─> [project] section
  ├─> [progress] section
  ├─> [features] section
  ├─> [next_steps] section
  ├─> [auto_refresh] section
  └─> [context] section
  │
  └─> Generate TOML format string
```

## Data Flow

### Project Creation Flow

```
User Request
    │
    ▼
Claude Desktop (MCP Client)
    │
    ▼
DevForge Server: create_project
    │
    ├─> Generate structure
    │   └─> { folders: [...], files: {...} }
    │
    ├─> Create file system
    │   ├─> mkdir -p folders
    │   └─> write files
    │
    ├─> Initialize state
    │   └─> projectStates.set(name, state)
    │
    ├─> Generate POML
    │   └─> write PROJECT.poml
    │
    └─> Return response
        └─> { success, project, structure, message }
```

### Auto-Refresh Flow

```
User Request: Save state before context limit
    │
    ▼
DevForge Server: auto_refresh
    │
    ├─> Load state from Map
    │   └─> projectStates.get(name)
    │
    ├─> Serialize to JSON
    │   └─> JSON.stringify(state, null, 2)
    │
    ├─> Save to disk
    │   └─> .devforge/state.json
    │
    ├─> Update POML
    │   └─> PROJECT.poml
    │
    ├─> Generate continuation prompt
    │   └─> Formatted resume instructions
    │
    └─> Return response
        └─> { state_saved, continuation_prompt, timestamp }
```

## File System Layout

### Generated Project Structure

```
project-name/
├── .devforge/
│   └── state.json              # Auto-refresh state
├── docs/
│   └── (documentation)
├── src/
│   ├── components/             # (web only)
│   ├── routes/                 # (api only)
│   ├── commands/               # (cli only)
│   └── (type-specific)
├── tests/
│   └── (test files)
├── public/                     # (web only)
├── .gitignore
├── package.json
├── PROJECT.poml               # POML manifest
└── README.md
```

### DevForge Server Structure

```
devforge-mcp-server/
├── src/
│   └── index.ts               # All implementation
├── build/
│   ├── index.js              # Compiled server
│   ├── index.d.ts            # Type definitions
│   └── *.map                 # Source maps
├── node_modules/
├── docs/
│   ├── README.md
│   ├── SETUP.md
│   ├── QUICKSTART.md
│   ├── POML_EXAMPLE.md
│   ├── ARCHITECTURE.md
│   └── CHANGELOG.md
├── package.json
├── tsconfig.json
└── .gitignore
```

## Technology Stack

### Core Technologies

```
TypeScript 5.9+
    │
    ├─> Strict mode enabled
    ├─> ES2022 target
    ├─> ES modules
    └─> Full type safety

MCP SDK 1.22.0
    │
    ├─> Server implementation
    ├─> Request handlers
    ├─> Tool schemas
    └─> Stdio transport

Node.js 16+
    │
    ├─> File system (fs/promises)
    ├─> Path utilities
    └─> ES module support
```

### Build Pipeline

```
TypeScript Source (src/)
    │
    ▼
TypeScript Compiler (tsc)
    │
    ├─> Type checking
    ├─> ES2022 compilation
    ├─> Source map generation
    └─> Declaration files
    │
    ▼
Built Output (build/)
    │
    ├─> index.js (executable)
    ├─> index.d.ts (types)
    └─> *.map (debugging)
```

## Error Handling

### Strategy

```
Tool Request
    │
    ▼
try {
    Execute handler
    │
    ├─> Validate input
    ├─> Process request
    └─> Return success response
}
catch (error) {
    │
    ├─> Log error
    ├─> Format error message
    └─> Return error response
        └─> { type: "text", text: "Error: ..." }
}
```

### Validation Points

1. **Input Validation**
   - Required parameters present
   - Valid project type
   - Valid tech stack
   - Name doesn't contain invalid chars

2. **State Validation**
   - Project exists in state map
   - State is complete
   - Files can be written

3. **File System Validation**
   - Directory writable
   - No file conflicts
   - Sufficient disk space

## Extension Points

### Adding New Project Types

```typescript
// 1. Add to type enum in schema
enum: ["web", "api", "cli", "desktop", "mobile", "library", "NEW_TYPE"]

// 2. Add case in generateProjectStructure()
case "NEW_TYPE":
  return {
    folders: ["custom", "folders"],
    files: { "custom.ts": "content" }
  }

// 3. Update documentation
```

### Adding New Tools

```typescript
// 1. Define in getTools()
{
  name: "new_tool",
  description: "...",
  inputSchema: { ... }
}

// 2. Add handler in setupHandlers()
case "new_tool":
  return await this.newTool(args);

// 3. Implement method
private async newTool(args: any) {
  // Implementation
}
```

### Custom State Fields

```typescript
// Extend ProjectState interface
interface ProjectState {
  // ... existing fields
  custom_field?: string
  custom_metadata?: Record<string, any>
}
```

## Performance Considerations

### Memory Usage
- State stored in Map (in-memory)
- Cleared on server restart
- O(1) lookup by project name
- Scales to ~1000s of projects

### File System
- Async operations (fs/promises)
- No blocking I/O
- Efficient batch operations
- Minimal disk access

### Tool Response Time
- create_project: ~100-500ms
- get_project_status: ~1-10ms
- generate_poml: ~10-50ms
- auto_refresh: ~50-200ms
- add_feature: ~10-50ms

## Security Considerations

### Input Sanitization
- Project names validated
- Paths sanitized
- No arbitrary code execution
- File system access controlled

### File System Safety
- Write only to intended directories
- No path traversal
- No overwriting system files
- Respects user permissions

### State Security
- State stored locally
- No network transmission
- No sensitive data logged
- User-owned files

## Monitoring & Debugging

### Logging
```typescript
console.error("DevForge MCP Server running on stdio")
// Errors logged to stderr
// Don't interfere with stdout (MCP protocol)
```

### Debugging
- Source maps enabled
- TypeScript declaration files
- Verbose error messages
- Stack traces preserved

### Testing
```bash
# Manual testing
npm run dev

# Build testing
npm run build
node build/index.js

# Integration testing
# Via Claude Desktop
```

## Deployment

### Production Build
```bash
npm install --production
npm run build
chmod +x build/index.js
```

### Claude Desktop Integration
```json
{
  "mcpServers": {
    "devforge": {
      "command": "node",
      "args": ["/absolute/path/to/build/index.js"]
    }
  }
}
```

### Version Management
- Semantic versioning (SemVer)
- CHANGELOG.md maintained
- Git tags for releases
- npm version commands

---

## Architecture Principles

1. **Simplicity**: Single-file implementation for clarity
2. **Type Safety**: Full TypeScript with strict mode
3. **Modularity**: Clear separation of concerns
4. **Extensibility**: Easy to add new features
5. **Reliability**: Comprehensive error handling
6. **Performance**: Async operations, efficient algorithms
7. **Maintainability**: Well-documented, clean code

---

**Version**: 1.0.0
**Last Updated**: 2025-01-17
