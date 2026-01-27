# AppCreator MCP v2.1 - Integration Guide

**NotebookLM + A2UI Integration**

---

## 🎉 What's New in v2.1

AppCreator MCP now supports two revolutionary integrations:

### 1. **NotebookLM Integration** 📚
- Use existing documentation as project foundation
- Citation-backed specifications
- Hybrid AI research (NotebookLM + AI)
- Zero hallucinations

### 2. **Google A2UI Integration** 🎨
- AI-generated UI components
- Declarative, security-first approach
- Framework-agnostic (React, Vue, Angular)
- Incremental UI streaming

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [NotebookLM Setup](#notebooklm-setup)
3. [A2UI Overview](#a2ui-overview)
4. [Usage Scenarios](#usage-scenarios)
5. [New MCP Tools](#new-mcp-tools)
6. [Complete Workflow Examples](#complete-workflow-examples)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required
- Node.js 16+
- Claude Desktop with MCP support
- AI API key (Claude, OpenAI, or Gemini)

### Optional (for enhanced features)
- **NotebookLM MCP Server**: For documentation-based projects
  - Repository: [PleasePrompto/notebooklm-mcp](https://github.com/PleasePrompto/notebooklm-mcp)
  - Install: `npm install -g notebooklm-mcp`

- **Google A2UI Tools**: For advanced UI generation
  - Repository: [google/A2UI](https://github.com/google/A2UI)
  - Version: v0.8+

---

## NotebookLM Setup

### Step 1: Install NotebookLM MCP Server

```bash
npm install -g notebooklm-mcp
```

### Step 2: Configure Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "appCreator": {
      "command": "node",
      "args": [
        "C:\\path\\to\\AppCreator-MCP\\build\\index.js"
      ],
      "env": {
        "AI_API_KEY": "your-api-key",
        "AI_PROVIDER": "claude",
        "NOTEBOOKLM_MCP_ENABLED": "true"
      }
    },
    "notebooklm": {
      "command": "notebooklm-mcp"
    }
  }
}
```

### Step 3: Prepare NotebookLM Notebooks

1. Go to [NotebookLM](https://notebooklm.google.com/)
2. Create a notebook for your project
3. Upload documentation:
   - PDF specs
   - Word documents
   - Website URLs
   - Text notes
4. Name your notebook (e.g., "Real Estate Management Docs")

---

## A2UI Overview

### What is A2UI?

Google's A2UI (Agent-to-User Interface) is a declarative standard for AI-generated UIs.

**Key Features:**
- **Declarative JSON**: UI described as data, not code
- **Security**: No arbitrary code execution
- **Framework-agnostic**: Works with React, Vue, Angular, native
- **Streaming**: Incremental UI updates

### How AppCreator Uses A2UI

AppCreator generates:
1. **A2UI Spec JSON**: Declarative UI description
2. **Implementation Code**: Framework-specific components
3. **Google Stitch Prompt**: Alternative no-code approach
4. **API Bindings**: Automatic data integration

---

## Usage Scenarios

### Scenario 1: Standard Project (No Documentation)

**Use Case:** You have an idea but no existing documentation.

**Tools to Use:**
- `start_project` → Standard workflow
- `approve_architecture` → Generate Spec-Kit
- `generate_frontend_prompt` → Traditional prompt generation
OR
- `generate_a2ui_frontend` → AI-powered UI generation

**Example:**
```
User: "AppCreator MCP kullanarak Taşınmaz Takip Sistemi oluştur"

Claude:
→ Calls start_project
→ Generates decision matrix
→ User answers questions
→ Calls approve_architecture
→ Generates Spec-Kit
→ Calls generate_a2ui_frontend
→ Generates working React app
```

---

### Scenario 2: Documentation-Based Project (NotebookLM)

**Use Case:** You have comprehensive documentation in NotebookLM.

**Tools to Use:**
- `start_project_with_notebook` → Uses NotebookLM
- `approve_architecture_with_notebook` → Enriched Spec-Kit
- `generate_a2ui_frontend` → AI-powered UI

**Example:**
```
User: "AppCreator MCP kullanarak 'Taşınmaz Takip Dokümanları' adlı NotebookLM
       kaynağını baz almak suretiyle Taşınmaz Takip Sistemi oluştur"

Claude:
→ Calls start_project_with_notebook
  - Fetches docs from NotebookLM
  - Generates enriched decision matrix
→ User answers questions
→ Calls approve_architecture_with_notebook
  - Creates hybrid Spec-Kit (NotebookLM + AI research)
  - Coverage report: 85% from docs, 15% AI-supplemented
→ Calls generate_a2ui_frontend
  - Generates UI based on enriched specs
```

---

### Scenario 3: Hybrid Approach

**Use Case:** Some documentation exists, but needs AI enhancement.

**Tools:**
- Start with NotebookLM for core specs
- AI fills gaps in missing areas
- A2UI generates modern UI

---

## New MCP Tools

### 1. `start_project_with_notebook`

**Description:** Start project using NotebookLM documentation.

**Parameters:**
```json
{
  "project_name": "real-estate-tracker",
  "project_type": "web",
  "notebook_name": "Real Estate Management Docs",
  "additional_requirements": [
    "Multi-currency support",
    "Export to PDF"
  ]
}
```

**Output:**
- Decision matrix enriched with notebook content
- Notebook information (source count, key topics)
- Questions tailored to existing documentation

---

### 2. `approve_architecture_with_notebook`

**Description:** Generate enriched Spec-Kit with NotebookLM.

**Parameters:**
```json
{
  "project_name": "real-estate-tracker",
  "notebook_name": "Real Estate Management Docs",
  "decision_matrix_answers": [
    { "questionId": "arch_01", "answer": "Microservices" },
    { "questionId": "tech_01", "answer": "PostgreSQL" }
  ],
  "additional_requirements": []
}
```

**Output:**
- Complete Spec-Kit (Constitution, Spec, Plan, Tasks)
- Enrichment report showing:
  - Coverage score (% from NotebookLM vs AI)
  - Notebook contributions with citations
  - AI-supplemented topics
- POML with context preservation

---

### 3. `generate_a2ui_frontend`

**Description:** Generate AI-powered frontend using A2UI.

**Parameters:**
```json
{
  "project_name": "real-estate-tracker",
  "platform": "web",
  "framework": "react",
  "ui_library": "material-ui",
  "design_style": "modern",
  "color_scheme": "dark",
  "primary_color": "blue",
  "features": [
    "dark-mode-toggle",
    "responsive",
    "animations"
  ]
}
```

**Output:**
- A2UI JSON specification
- React/Vue/Angular implementation code
- Google Stitch-compatible prompt
- API integration code
- Documentation

---

## Complete Workflow Examples

### Example 1: Documentation-Based Real Estate System

#### Step 1: Prepare NotebookLM
```
1. Create notebook: "Real Estate Management Docs"
2. Upload:
   - Real_Estate_Requirements.pdf
   - Database_Schema.docx
   - API_Endpoints.txt
3. NotebookLM processes documents
```

#### Step 2: Start Project
```
User to Claude: "AppCreator MCP kullanarak 'Real Estate Management Docs' adlı
                 NotebookLM kaynağını baz alarak Taşınmaz Takip Sistemi oluştur"

Claude: [Calls start_project_with_notebook]
```

**Output:**
```
✅ PHASE 1 COMPLETE: Decision Matrix Generated (NotebookLM-Enhanced)

NotebookLM Source: Real Estate Management Docs

📚 Notebook Information:
  • Sources: 3
  • Key Topics: Property management, Tenant contracts, Payment tracking

📋 Decision Matrix Questions (6 questions):

1. [ARCHITECTURE] What architecture pattern?
   Options: Monolithic, Microservices, Serverless

2. [TECHNOLOGY] Preferred database?
   Options: PostgreSQL, MongoDB, MySQL

3. [FEATURE] Authentication method?
   Options: JWT, OAuth2, Session-based

...
```

#### Step 3: Answer Questions
```
User: {
  "project_name": "real-estate-tracker",
  "notebook_name": "Real Estate Management Docs",
  "decision_matrix_answers": [
    { "questionId": "arch_01", "answer": "Microservices" },
    { "questionId": "tech_01", "answer": "PostgreSQL" },
    { "questionId": "feat_01", "answer": "JWT" }
  ]
}

Claude: [Calls approve_architecture_with_notebook]
```

**Output:**
```
✅ PHASE 2 COMPLETE: NotebookLM-Enriched Spec-Kit Generated

📚 NotebookLM Enrichment:
  • Coverage Score: 87.3%
  • Notebook Contributions: 8
  • AI-Supplemented Topics: 2

📊 Project Breakdown:
  • Tasks: 45 tasks planned
  • Estimated: 180 hours
  • Features: 12 functional requirements

💾 Generated Files:
  ✓ docs/CONSTITUTION.md
  ✓ docs/SPECIFICATION.md
  ✓ docs/TECHNICAL_PLAN.md
  ✓ docs/TASKS.md
  ✓ docs/NOTEBOOKLM_ENRICHMENT.md
  ✓ PROJECT.poml
```

#### Step 4: Generate A2UI Frontend
```
User: "A2UI kullanarak modern bir frontend oluştur. React, Material-UI, dark mode"

Claude: [Calls generate_a2ui_frontend with preferences]
```

**Output:**
```
✅ PHASE 4 COMPLETE: A2UI-Powered Frontend Generated

🎨 Frontend Stack:
  • Platform: web
  • Framework: react
  • UI Library: material-ui
  • Design Style: modern

📊 A2UI Specification:
  • Layouts: 8
  • Components: 47
  • Routes: 8
  • API Bindings: 12

📁 Generated Files:
  ✓ frontend/a2ui-spec.json
  ✓ frontend/src/App.tsx
  ✓ frontend/src/components/PropertyList.tsx
  ✓ frontend/src/components/TenantForm.tsx
  ✓ frontend/src/api/client.ts
  ... 42 more files

🎯 USAGE OPTIONS:

1. Direct Development:
   cd frontend
   npm install
   npm run dev

2. Google Stitch:
   Copy: docs/GOOGLE_STITCH_PROMPT.md
```

---

### Example 2: Standard Project with A2UI Enhancement

#### Step 1: Standard Start
```
User: "Envanter yönetim sistemi oluştur"

Claude: [Calls start_project]
```

#### Step 2: Generate Frontend with A2UI
```
User: "A2UI ile Vue ve Tailwind kullanarak minimal tasarım"

Claude: [Calls generate_a2ui_frontend]
```

**Result:** Working Vue + Tailwind app with A2UI architecture

---

## NotebookLM Best Practices

### 1. Document Organization
```
✅ Good:
- Single notebook per project
- Clear document titles
- Relevant sources only

❌ Bad:
- Multiple notebooks for one project
- Generic filenames ("document1.pdf")
- Unrelated documents
```

### 2. Coverage Optimization
```
To get high coverage (>80%):
- Include architecture documents
- Add API specifications
- Upload data models
- Document user flows
- Include technical decisions
```

### 3. Missing Information Handling
```
AppCreator automatically:
1. Identifies gaps in documentation
2. Generates AI research for missing parts
3. Creates hybrid specifications
4. Cites sources for all claims
```

---

## A2UI Best Practices

### 1. Component Catalog
```javascript
// AppCreator generates pre-approved catalog
{
  "componentCatalog": {
    "id": "catalog-material-ui",
    "components": [
      "Button", "Form", "DataTable",
      "Modal", "Card", "Navigation"
    ]
  }
}
```

### 2. Data Bindings
```javascript
// Auto-generated API integration
{
  "dataBindings": [
    {
      "componentId": "PropertyList",
      "apiEndpoint": "/api/properties",
      "dataMapping": {
        "response": "data",
        "loading": "isLoading",
        "error": "error"
      }
    }
  ]
}
```

### 3. Customization
```javascript
// Generated code is editable
// Modify components in: frontend/src/components/
// Update A2UI spec: frontend/a2ui-spec.json
```

---

## Troubleshooting

### NotebookLM Issues

**Problem:** "NotebookLM MCP server not available"

**Solution:**
```bash
# Check environment variable
echo $NOTEBOOKLM_MCP_ENABLED  # should be "true"

# Verify NotebookLM MCP installed
which notebooklm-mcp

# Check Claude Desktop config
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

---

**Problem:** "Notebook not found"

**Solution:**
- Ensure notebook name matches exactly
- Check NotebookLM account is logged in
- Verify MCP server has access

---

**Problem:** Low coverage score (<50%)

**Solution:**
- Add more detailed documentation
- Include technical specifications
- Upload API/database schemas
- Document user requirements clearly

---

### A2UI Issues

**Problem:** "Generated components don't compile"

**Solution:**
```bash
# Check Node.js version
node --version  # should be 16+

# Install dependencies
cd frontend
npm install

# Check for missing peer dependencies
npm ls
```

---

**Problem:** "UI doesn't match design preferences"

**Solution:**
- A2UI generates baseline - customize in code
- Edit `frontend/src/components/*.tsx`
- Modify theme in `frontend/src/theme.ts`
- Or use Google Stitch prompt for iteration

---

## Configuration Reference

### Environment Variables

```bash
# Required
AI_API_KEY=your-api-key
AI_PROVIDER=claude  # or openai, gemini

# Optional
AI_MODEL=claude-sonnet-4-20250514  # custom model
NOTEBOOKLM_MCP_ENABLED=true  # enable NotebookLM
```

### Claude Desktop Config

```json
{
  "mcpServers": {
    "appCreator": {
      "command": "node",
      "args": ["C:\\path\\to\\AppCreator-MCP\\build\\index.js"],
      "env": {
        "AI_API_KEY": "your-key",
        "AI_PROVIDER": "claude",
        "NOTEBOOKLM_MCP_ENABLED": "true"
      }
    },
    "notebooklm": {
      "command": "notebooklm-mcp",
      "args": []
    }
  }
}
```

---

## Resources

### Official Documentation
- [NotebookLM](https://notebooklm.google.com/)
- [Google A2UI](https://github.com/google/A2UI)
- [A2UI Blog Post](https://developers.googleblog.com/introducing-a2ui-an-open-project-for-agent-driven-interfaces/)

### NotebookLM MCP Servers
- [PleasePrompto/notebooklm-mcp](https://github.com/PleasePrompto/notebooklm-mcp) - Recommended
- [jacob-bd/notebooklm-mcp](https://github.com/jacob-bd/notebooklm-mcp)
- [khengyun/notebooklm-mcp](https://www.pulsemcp.com/servers/khengyun-notebooklm)

### Community
- [MCP Servers Registry](https://mcpservers.org/)
- [Claude MCP Documentation](https://docs.anthropic.com/mcp)

---

## Version History

### v2.1.0 (Current)
- ✅ NotebookLM integration
- ✅ Google A2UI support
- ✅ Hybrid documentation + AI research
- ✅ Enhanced frontend generation

### v2.0.0
- Decision Matrix
- Complete Spec-Kit generation
- Postman API tests
- BDD/Cucumber tests
- Context preservation (POML)

---

## Next Steps

After setup, try:

1. **Create test notebook** in NotebookLM with sample docs
2. **Run standard workflow** to understand baseline
3. **Try NotebookLM workflow** with documentation
4. **Generate A2UI frontend** to see AI-powered UI
5. **Compare approaches** to find what works best

---

**Questions?** Open an issue on GitHub or check USAGE_GUIDE.md for more examples.

**Happy Building!** 🚀
