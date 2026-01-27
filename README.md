# AppCreator MCP v2.1

**Complete AI-Powered Software Factory with NotebookLM + A2UI Integration**

AppCreator (formerly AppCreator) is an AI Software Factory that automatically creates production-ready projects from ideas OR existing documentation. It's an MCP (Model Context Protocol) server that integrates with Claude to provide a complete project generation and management workflow.

## 🚀 What's New in v2.1

### NotebookLM Integration 📚
- **Documentation-Based Projects**: Use existing docs in NotebookLM as foundation
- **Citation-Backed Specs**: Every claim traced to source documents
- **Hybrid AI Research**: Combines notebook content with AI research for gaps
- **Zero Hallucinations**: Grounded in actual documentation

### Google A2UI Integration 🎨
- **AI-Generated UI**: Real working components, not just prompts
- **Declarative & Secure**: No arbitrary code execution
- **Framework-Agnostic**: React, Vue, Angular, native support
- **Streaming UI**: Incremental component generation

## Features

### 1. Dual-Mode Project Creation
- **Standard Mode**: AI generates from scratch based on requirements
- **Documentation Mode**: Uses NotebookLM for documentation-based generation
- Supports multiple project types: web, API, CLI, desktop, mobile, library
- Configures appropriate folder structures and boilerplate code

### 2. NotebookLM Integration (NEW)
- Fetch documentation from NotebookLM notebooks
- Citation-backed specifications with source references
- Hybrid approach: NotebookLM content + AI research for gaps
- Coverage reporting: Shows % from docs vs AI-supplemented
- Zero hallucinations: Every claim grounded in sources

### 3. A2UI-Powered Frontend (NEW)
- Real UI code generation using Google's A2UI standard
- Framework-agnostic: React, Vue, Angular, native
- Security-first: Declarative JSON, not executable code
- Complete implementation: Components, routes, API bindings
- Google Stitch-compatible prompts for no-code alternatives

### 4. Complete Spec-Kit Generation
- **Constitution**: Project vision, principles, constraints
- **Specification**: Functional requirements, data models, APIs
- **Technical Plan**: Architecture, security, testing strategy
- **Task Breakdown**: Granular tasks with dependencies and estimates

### 5. Auto-Refresh System (CRITICAL)
- Prevents context loss during long development sessions
- Automatically saves project state every 20-25 tasks
- Generates continuation prompts for seamless work resumption
- POML (Project Orchestration Markup Language) templates
- Maintains full context across multiple sessions

### 6. Testing & Quality Assurance
- **API Testing**: Postman collections + Newman CLI commands
- **BDD Testing**: Cucumber/Gherkin human-readable tests
- **Multi-environment**: Dev, staging, production configs

## Installation

1. Clone or download this repository
2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Usage

### 📚 Kapsamlı Kullanım Rehberi

**[KULLANIM_REHBERI.md](./KULLANIM_REHBERI.md) dosyasını mutlaka okuyun!**

İçerik:
- ✅ NotebookLM var/yok senaryoları için prompt şablonları
- ✅ Proje tiplerine göre örnekler (web, api, mobile, cli, desktop, library)
- ✅ Best practices ve yapılmaması gerekenler
- ✅ Gerçek dünya örnekleri
- ✅ Sorun giderme rehberi
- ✅ İleri seviye kullanım

### Running in Development Mode
```bash
npm run dev
```

### Running in Production
```bash
npm start
```

### Building
```bash
npm run build
```

## MCP Tools

AppCreator provides 13 powerful tools organized into workflows:

### 🤖 Smart Workflow (NEW - Recommended!)

The easiest way to create projects - let AI handle all technical decisions!

#### `analyze_project_requirements`
**Step 1:** Analyzes your requirements and generates AI-driven recommendations.

**Features:**
- Automatic project scale detection (small/medium/large/enterprise)
- Graceful NotebookLM fallback (works with or without)
- AI recommends: Database, Architecture, Authentication, Frontend
- Each recommendation includes detailed rationale and alternatives
- Single approval point - no technical knowledge required!

**Parameters:**
- `project_name` (string, required): Project name
- `project_type` (string, required): web, api, cli, desktop, mobile, library
- `description` (string, required): Project description
- `features` (array, required): List of features
- `notebook_name` (string, optional): NotebookLM notebook for docs
- `expected_users` (number, optional): Expected concurrent users
- `data_volume` (string, optional): small, medium, large, massive
- `branches` (array, optional): Geographic branches/locations

**Example:**
```json
{
  "project_name": "real-estate-tracker",
  "project_type": "web",
  "description": "Real estate property tracking system",
  "features": ["property-listing", "agent-management", "client-portal"],
  "notebook_name": "Taşınmaz Takip Dokümanları",
  "expected_users": 100,
  "data_volume": "medium"
}
```

#### `create_project_from_analysis`
**Step 2:** Creates complete project after you approve AI recommendations.

**Generates:**
- Complete Spec-Kit (Constitution, Specification, Technical Plan, Tasks)
- Backend structure with recommended architecture
- API tests (Postman + Newman)
- A2UI-powered frontend
- BDD/Cucumber tests
- POML context preservation

**Parameters:**
- `project_name` (string, required): Project name from analysis
- `approved` (boolean, required): true to proceed

**Example:**
```json
{
  "project_name": "real-estate-tracker",
  "approved": true
}
```

---

### 📋 Standard Workflow (Advanced Users)

For users who want more control over the workflow:

### 1. `create_project`
Creates a complete project from scratch.

**Parameters:**
- `name` (string, required): Project name
- `type` (string, required): Project type (web, api, cli, desktop, mobile, library)
- `tech_stack` (string, required): Technology stack
- `description` (string, required): Project description
- `features` (array, optional): List of features to implement

**Example:**
```json
{
  "name": "my-awesome-app",
  "type": "web",
  "tech_stack": "react-typescript",
  "description": "A modern web application",
  "features": ["user-auth", "dashboard", "api-integration"]
}
```

### 2. `get_project_status`
Get current status and progress of a project.

**Parameters:**
- `project_name` (string, required): Name of the project

**Returns:**
- Current progress
- Completed tasks
- Next steps
- Progress percentage

### 3. `generate_poml`
Generate or update POML template.

**Parameters:**
- `project_name` (string, required): Name of the project
- `update_mode` (boolean, optional): Update existing or create new

**Output:**
Creates/updates `PROJECT.poml` file with current project state.

### 4. `auto_refresh`
Save state and generate continuation prompt to prevent context loss.

**Parameters:**
- `project_name` (string, required): Name of the project

**Critical Feature:**
- Saves complete project state to `.appcreator/state.json`
- Generates continuation prompt for seamless resumption
- Call this before reaching context limits
- Essential for long-running projects

### 5. `add_feature`
Add new features to existing projects.

**Parameters:**
- `project_name` (string, required): Name of the project
- `feature_name` (string, required): Feature description
- `implementation_notes` (string, optional): Additional details

## Configuration with Claude Desktop

Add to your Claude Desktop configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "appcreator": {
      "command": "node",
      "args": [
        "C:\\Users\\serha\\OneDrive\\Desktop\\AppCreator-MCP\\build\\index.js"
      ]
    }
  }
}
```

Or for development:

```json
{
  "mcpServers": {
    "appcreator": {
      "command": "npx",
      "args": [
        "tsx",
        "C:\\Users\\serha\\OneDrive\\Desktop\\AppCreator-MCP\\src\\index.ts"
      ]
    }
  }
}
```

## Project Structure

```
AppCreator-MCP/
├── src/
│   └── index.ts          # Main MCP server implementation
├── build/                # Compiled TypeScript output
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## POML (Project Orchestration Markup Language)

Every project created by AppCreator includes a `PROJECT.poml` file that serves as:

- **Project Manifest**: Single source of truth for project state
- **Progress Tracker**: Real-time progress and task completion
- **Context Keeper**: Maintains project context across sessions
- **Human-Readable**: Easy to understand and edit manually

Example POML:
```toml
[project]
name = "my-app"
type = "web"
tech_stack = "react-typescript"
status = "active"

[progress]
total_tasks = 20
completed_tasks = 8
current_phase = "development"
progress_percentage = 40.00%

[features]
feature_1 = "user-auth"
feature_2 = "dashboard"

[next_steps]
step_1 = "Implement core features"
step_2 = "Write tests"
```

## Workflow Examples

### 🤖 Smart Workflow (Easiest!)

**Perfect for:** Users who want AI to handle technical decisions

1. **Analyze Project:**
```
Call: analyze_project_requirements
→ AI detects scale automatically
→ Generates recommendations with rationale
→ You review summary
→ Single approval needed
```

2. **Create Project:**
```
Call: create_project_from_analysis (approved: true)
→ Full project generated with AI recommendations
→ Backend + Frontend + Tests + Docs
→ Ready to code!
```

**Total:** 2 tool calls, 1 approval ✨

---

### 📋 Standard Workflow (More Control)

**Perfect for:** Users who want granular control

1. **Create Project:**
```
Use create_project tool with your idea
→ AppCreator generates complete structure
→ POML template created
→ Ready to start coding
```

2. **Track Progress:**
```
Use get_project_status
→ See current progress
→ View next steps
→ Monitor completion percentage
```

3. **Prevent Context Loss:**
```
Use auto_refresh before context limit
→ State saved to .appcreator/state.json
→ Continuation prompt generated
→ Resume seamlessly in new session
```

4. **Add Features:**
```
Use add_feature to extend project
→ Project state updated
→ New tasks added to progress tracker
→ POML automatically updated
```

## Supported Project Types

### Web Applications
- React, Vue, Angular, Svelte
- TypeScript/JavaScript
- Modern build tools (Vite, Webpack)
- Component-based architecture

### API Servers
- Express, Fastify, Koa
- REST and GraphQL
- MVC architecture
- Middleware support

### CLI Tools
- Node-based CLI frameworks
- Command structure
- Argument parsing
- Interactive prompts

### Desktop Applications
- Electron
- Tauri
- Cross-platform support

### Mobile Applications
- React Native
- Ionic
- Cross-platform frameworks

### Libraries
- npm packages
- Module bundling
- Testing setup
- Documentation

## Auto-Refresh System Details

The auto-refresh system is **CRITICAL** for preventing context loss:

### When to Use:
- Before reaching Claude's context window limit
- After implementing major features
- Before switching tasks
- At natural breakpoints in development

### What It Saves:
- Complete project state
- All progress tracking data
- Feature list and status
- Next steps and recommendations
- File structure and metadata

### How to Resume:
1. Use the generated continuation prompt
2. Load saved state from `.appcreator/state.json`
3. Continue exactly where you left off
4. No context loss, no repeated work

## Best Practices

1. **Use Auto-Refresh Frequently**: Don't wait until context is full
2. **Update POML Regularly**: Keep project manifest current
3. **Check Status Often**: Use get_project_status to stay informed
4. **Add Features Incrementally**: Break large features into smaller tasks
5. **Review Generated Code**: AppCreator creates structure, you add logic
6. **Commit Regularly**: Use version control for all projects

## Troubleshooting

### Server Won't Start
- Check that all dependencies are installed: `npm install`
- Verify build completed successfully: `npm run build`
- Check Node.js version (requires Node 16+)

### Project Creation Fails
- Ensure project name doesn't contain invalid characters
- Check write permissions in target directory
- Verify disk space available

### State Not Saving
- Check `.appcreator` folder exists and is writable
- Verify project path is correct
- Ensure sufficient permissions

## Contributing

AppCreator is designed to be extensible. To add new project types:

1. Add type to `generateProjectStructure()` method
2. Define folder structure and files
3. Create appropriate boilerplate templates
4. Update POML template generation

## License

ISC

## Support

For issues, questions, or feature requests, please open an issue on the project repository.

---

**AppCreator** - AI Software Factory
*Transforming ideas into production-ready projects automatically*
