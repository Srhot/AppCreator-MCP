# AppCreator MCP Server - Complete Index

## Quick Navigation

### 🚀 Getting Started
1. [QUICKSTART.md](QUICKSTART.md) - Get running in 5 minutes
2. [SETUP.md](SETUP.md) - Detailed setup instructions
3. [README.md](README.md) - Main documentation

### 📚 Documentation
1. [README.md](README.md) - Main documentation and features
2. [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture and design
3. [POML_EXAMPLE.md](POML_EXAMPLE.md) - POML format examples
4. [CHANGELOG.md](CHANGELOG.md) - Version history
5. [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Complete project overview

### 💻 Code
1. [src/index.ts](src/index.ts) - Main server implementation
2. [build/index.js](build/index.js) - Compiled output
3. [tsconfig.json](tsconfig.json) - TypeScript configuration
4. [package.json](package.json) - Project configuration

---

## File Guide

### Documentation Files

#### README.md (8.2 KB)
**Purpose**: Main project documentation
**Contains**:
- Feature overview
- Installation guide
- Tool documentation
- Configuration examples
- Usage examples
- Troubleshooting
- Best practices

**Read this**: First, to understand what AppCreator is

#### QUICKSTART.md (4.9 KB)
**Purpose**: Rapid onboarding guide
**Contains**:
- 5-minute setup
- Essential commands
- Quick examples
- Common workflows
- Pro tips

**Read this**: If you want to start immediately

#### SETUP.md (5.5 KB)
**Purpose**: Detailed setup instructions
**Contains**:
- Step-by-step installation
- Platform-specific config
- Testing procedures
- Troubleshooting
- Advanced configuration

**Read this**: For complete setup details

#### ARCHITECTURE.md (10+ KB)
**Purpose**: System architecture documentation
**Contains**:
- System overview diagrams
- Component details
- Data flow diagrams
- Technology stack
- Extension points
- Performance notes

**Read this**: To understand how AppCreator works internally

#### POML_EXAMPLE.md (8.6 KB)
**Purpose**: POML format documentation
**Contains**:
- POML structure
- Real-world examples
- Section explanations
- Best practices
- Integration details

**Read this**: To understand POML manifests

#### CHANGELOG.md (4.2 KB)
**Purpose**: Version history
**Contains**:
- Release notes
- Feature tracking
- Known limitations
- Future enhancements

**Read this**: To see version history and roadmap

#### PROJECT_SUMMARY.md (10+ KB)
**Purpose**: Complete project overview
**Contains**:
- What's been created
- Features implemented
- Technical highlights
- Testing checklist
- Files summary

**Read this**: For a comprehensive project overview

### Source Files

#### src/index.ts (17 KB)
**Purpose**: Main server implementation
**Contains**:
- AppCreatorServer class
- All 5 tool handlers
- State management
- Project structure generators
- POML generators
- File system operations

**Key Components**:
```typescript
class AppCreatorServer {
  // Core methods
  constructor()
  setupHandlers()
  getTools()
  run()

  // Tool handlers
  createProject()
  getProjectStatus()
  generatePOML()
  autoRefresh()
  addFeature()

  // Utilities
  generateProjectStructure()
  createProjectFiles()
  createPOMLTemplate()
  generateContinuationPrompt()
  generateNextSteps()
  calculateTotalTasks()
}
```

### Configuration Files

#### package.json (610 B)
**Purpose**: Project configuration
**Contains**:
- Dependencies
- Scripts
- Metadata
- Module type

**Key Scripts**:
- `npm run build` - Compile TypeScript
- `npm run dev` - Development mode
- `npm start` - Production mode

#### tsconfig.json (454 B)
**Purpose**: TypeScript configuration
**Contains**:
- Compiler options
- Module settings
- Build paths
- Strict mode config

**Key Settings**:
- Target: ES2022
- Module: ES2022
- Strict: true
- Output: ./build
- Source: ./src

### Build Output

#### build/index.js (18.7 KB)
**Purpose**: Compiled JavaScript
**Contains**:
- Transpiled code
- Ready to execute
- Shebang for CLI

#### build/index.d.ts (66 B)
**Purpose**: TypeScript declarations
**Contains**:
- Type definitions
- Export declarations

#### build/index.js.map (12.1 KB)
**Purpose**: Source maps
**Contains**:
- Debugging information
- Source mapping

---

## Reading Order

### For New Users
1. **QUICKSTART.md** - Get started fast
2. **README.md** - Understand features
3. **Try it out** - Create a project
4. **POML_EXAMPLE.md** - Learn POML format

### For Developers
1. **README.md** - Overview
2. **ARCHITECTURE.md** - System design
3. **src/index.ts** - Implementation
4. **SETUP.md** - Development setup

### For Contributors
1. **PROJECT_SUMMARY.md** - Complete overview
2. **ARCHITECTURE.md** - Architecture
3. **src/index.ts** - Code review
4. **CHANGELOG.md** - Version history

### For Troubleshooting
1. **SETUP.md** - Setup issues
2. **README.md** - General troubleshooting
3. **QUICKSTART.md** - Quick fixes

---

## Feature Location Guide

### Want to know about...

**Project Creation?**
- Overview: README.md → "Automatic Project Creation"
- Implementation: src/index.ts → `createProject()`
- Examples: QUICKSTART.md → "Create a Project"

**Auto-Refresh System?**
- Overview: README.md → "Auto-Refresh System"
- Implementation: src/index.ts → `autoRefresh()`
- Details: ARCHITECTURE.md → "Auto-Refresh Flow"

**Progress Tracking?**
- Overview: README.md → "Automatic Progress Tracking"
- Implementation: src/index.ts → `getProjectStatus()`
- Examples: README.md → "Usage Example"

**POML Templates?**
- Overview: README.md → "POML Template Generation"
- Implementation: src/index.ts → `generatePOML()`
- Examples: POML_EXAMPLE.md → All sections

**Feature Management?**
- Overview: README.md → Tool #5
- Implementation: src/index.ts → `addFeature()`
- Usage: QUICKSTART.md → "Add Features"

**Configuration?**
- Claude Desktop: SETUP.md → Step 2
- TypeScript: tsconfig.json
- npm: package.json
- Advanced: SETUP.md → "Advanced Configuration"

**Architecture?**
- Overview: ARCHITECTURE.md → "System Overview"
- Components: ARCHITECTURE.md → "Component Details"
- Data Flow: ARCHITECTURE.md → "Data Flow"

**Installation?**
- Quick: QUICKSTART.md → Step 1
- Detailed: SETUP.md → Step 1
- Development: SETUP.md → "Development Mode"

---

## Code Navigation

### Main Entry Point
```
src/index.ts:675
→ const server = new AppCreatorServer();
→ server.run().catch(console.error);
```

### Tool Definitions
```
src/index.ts:51-178
→ getTools(): Tool[]
```

### Tool Handlers
```
src/index.ts:39-49
→ CallToolRequestSchema handler
→ Routes to: createProject, getProjectStatus, etc.
```

### State Management
```
src/index.ts:13
→ private projectStates: Map<string, ProjectState>
```

### Project Structure Generation
```
src/index.ts:430-533
→ generateProjectStructure(type, tech_stack)
```

### POML Generation
```
src/index.ts:562-597
→ createPOMLTemplate(state)
```

### Type Definitions
```
src/index.ts:647-670
→ interface ProjectState
→ interface ProjectStructure
```

---

## Command Reference

### Build & Run
```bash
# Install
npm install

# Build
npm run build

# Run (production)
npm start

# Run (development)
npm run dev

# Clean build
rm -rf build && npm run build
```

### Testing
```bash
# Test build
npm run build

# Test server
node build/index.js

# Test with Claude Desktop
# Configure and restart Claude Desktop
```

### Development
```bash
# Watch mode (if added)
npm run watch

# Type check
npx tsc --noEmit

# Format (if added)
npm run format
```

---

## Dependencies Map

### Production Dependencies
```
@anthropic-ai/sdk (0.69.0)
├─ Purpose: Claude API integration (future use)
└─ Used in: Reserved for future features

@modelcontextprotocol/sdk (1.22.0)
├─ Purpose: MCP server implementation
└─ Used in: src/index.ts (Server, StdioServerTransport)

tsx (4.20.6)
├─ Purpose: TypeScript execution
└─ Used in: npm run dev

typescript (5.9.3)
├─ Purpose: TypeScript compiler
└─ Used in: npm run build
```

### Dev Dependencies
```
@types/node (24.10.1)
├─ Purpose: Node.js type definitions
└─ Used in: TypeScript compilation
```

---

## Project Statistics

### Files
- Documentation: 7 files (50+ KB)
- Source Code: 1 file (17 KB)
- Configuration: 2 files (1 KB)
- Build Output: 3 files (31 KB)
- **Total: 13 core files**

### Lines of Code
- TypeScript: ~650 lines
- Documentation: ~1500 lines
- Configuration: ~30 lines
- **Total: ~2200 lines**

### Features
- MCP Tools: 5
- Project Types: 6
- Supported Stacks: 10+
- Documentation Pages: 7

---

## Support & Resources

### Getting Help
1. Check relevant .md file (see above)
2. Review troubleshooting sections
3. Check SETUP.md for configuration
4. Review ARCHITECTURE.md for internals

### Contributing
1. Read PROJECT_SUMMARY.md
2. Review ARCHITECTURE.md
3. Check CHANGELOG.md
4. Update documentation

### Updating
1. Pull latest changes
2. Run `npm install`
3. Run `npm run build`
4. Check CHANGELOG.md for changes
5. Restart Claude Desktop

---

## Version Information

- **Current Version**: 1.0.0
- **Release Date**: 2025-01-17
- **Status**: Production Ready
- **License**: ISC

---

## Quick Links Summary

| Task | File | Section |
|------|------|---------|
| Quick Start | QUICKSTART.md | All |
| Install | SETUP.md | Step 1-2 |
| Configure | SETUP.md | Step 2 |
| First Project | QUICKSTART.md | Step 4 |
| Tool Reference | README.md | MCP Tools |
| POML Format | POML_EXAMPLE.md | All |
| Architecture | ARCHITECTURE.md | System Overview |
| Troubleshooting | SETUP.md | Troubleshooting |
| Code | src/index.ts | All |
| Version History | CHANGELOG.md | All |
| Overview | PROJECT_SUMMARY.md | All |

---

**AppCreator MCP Server - Complete and Production Ready**

Last Updated: 2025-01-17
