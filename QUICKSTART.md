# AppCreator Quick Start Guide

Get started with AppCreator in 5 minutes!

## 1. Install (1 minute)

```bash
cd appcreator-mcp-server
npm install
npm run build
```

## 2. Configure Claude Desktop (2 minutes)

Edit `claude_desktop_config.json`:

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

Add this:
```json
{
  "mcpServers": {
    "AppCreator": {
      "command": "node",
      "args": ["C:\\Users\\serha\\OneDrive\\Desktop\\appcreator-mcp-server\\build\\index.js"]
    }
  }
}
```

*Replace the path with your actual installation path!*

## 3. Restart Claude Desktop (30 seconds)

1. Quit Claude Desktop completely
2. Start Claude Desktop
3. AppCreator tools should now be available

## 4. Create Your First Project (1 minute)

In Claude Desktop, say:

```
Use AppCreator to create a web application called "todo-app"
using React and TypeScript with features for task management
and user authentication.
```

## 5. Explore the Project (30 seconds)

AppCreator will create:
- ✅ Complete folder structure
- ✅ Configuration files
- ✅ Boilerplate code
- ✅ POML project manifest
- ✅ Progress tracking

## Available Commands

### Create a Project
```
Create a [type] project called "[name]" using [tech stack]
```

Examples:
- "Create an API project called 'blog-api' using Express and TypeScript"
- "Create a CLI tool called 'dev-helper' using Node.js"
- "Create a mobile app called 'chat-app' using React Native"

### Check Progress
```
Get the status of the "[project-name]" project
```

### Save State (Important!)
```
Use auto-refresh on "[project-name]" to save state
```

### Add Features
```
Add a "[feature-name]" feature to "[project-name]"
```

### Generate/Update POML
```
Generate POML template for "[project-name]"
```

## Project Types

| Type | Description | Examples |
|------|-------------|----------|
| `web` | Web applications | React, Vue, Angular apps |
| `api` | API servers | REST APIs, GraphQL servers |
| `cli` | Command-line tools | Developer utilities |
| `desktop` | Desktop apps | Electron, Tauri apps |
| `mobile` | Mobile apps | React Native, Ionic |
| `library` | Reusable libraries | npm packages |

## Tech Stacks

Popular combinations:
- `react-typescript` - React with TypeScript
- `nextjs-typescript` - Next.js with TypeScript
- `express-typescript` - Express API with TypeScript
- `fastify-typescript` - Fastify API with TypeScript
- `vue-typescript` - Vue with TypeScript
- `react-native-typescript` - React Native with TypeScript

## Typical Workflow

1. **Create** → Use `create_project`
2. **Check** → Use `get_project_status`
3. **Develop** → Work on features
4. **Save** → Use `auto_refresh` (before context limit!)
5. **Extend** → Use `add_feature`
6. **Track** → Use `get_project_status` regularly
7. **Document** → Use `generate_poml` to update manifest

## Pro Tips

1. **Auto-refresh is critical!** Use it every 30-60 minutes to prevent context loss
2. **Check status frequently** to stay oriented
3. **POML files are documentation** - commit them to git
4. **Features are tracked automatically** - AppCreator counts tasks
5. **State is saved in `.appcreator/`** - don't commit this folder

## Troubleshooting

### Tools not showing?
1. Check config file path is correct
2. Verify absolute path to `build/index.js`
3. Restart Claude Desktop completely

### Build fails?
```bash
rm -rf node_modules
npm install
npm run build
```

### Permission errors?
On Unix systems:
```bash
chmod +x build/index.js
```

## Example Session

```
You: Create a full-stack app called "taskmaster" with React frontend
     and Express backend

Claude: [Uses create_project tool]
        ✅ Project created!
        - Frontend: src/components/
        - Backend: src/routes/, src/controllers/
        - Config: package.json, tsconfig.json
        - POML: PROJECT.poml

You: Get the status

Claude: [Uses get_project_status]
        Progress: 5/35 tasks (14.3%)
        Phase: setup
        Next: Install dependencies

You: Add a real-time chat feature

Claude: [Uses add_feature]
        ✅ Feature added!
        New tasks: +5
        Updated progress: 5/40 tasks

You: Save the state

Claude: [Uses auto_refresh]
        ✅ State saved!
        Location: .appcreator/state.json
        Continuation prompt generated
```

## Next Steps

After creating your first project:

1. **Read the README.md** for full documentation
2. **Check SETUP.md** for advanced configuration
3. **Review POML_EXAMPLE.md** for POML details
4. **Explore the generated project** structure
5. **Start building** your features!

## Support

Need help?
- Check `README.md` for detailed docs
- Review `SETUP.md` for configuration
- See `POML_EXAMPLE.md` for manifest examples

---

**You're ready to build! Start creating amazing projects with AppCreator! 🚀**
