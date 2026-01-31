# AppCreator MCP Server - Setup Guide

This guide walks you through setting up AppCreator with Claude Desktop.

## Prerequisites

- Node.js 16 or higher
- npm or yarn
- Claude Desktop application

## Step 1: Install AppCreator

```bash
# Navigate to the project directory
cd appcreator-mcp-server

# Install dependencies
npm install

# Build the project
npm run build
```

## Step 2: Configure Claude Desktop

### Windows

1. Locate your Claude Desktop config file:
   ```
   %APPDATA%\Claude\claude_desktop_config.json
   ```

2. Add AppCreator to the configuration:
   ```json
   {
     "mcpServers": {
       "AppCreator": {
         "command": "node",
         "args": [
           "C:\\Users\\serha\\OneDrive\\Desktop\\appcreator-mcp-server\\build\\index.js"
         ]
       }
     }
   }
   ```

### macOS/Linux

1. Locate your Claude Desktop config file:
   ```
   ~/Library/Application Support/Claude/claude_desktop_config.json
   ```

2. Add AppCreator to the configuration:
   ```json
   {
     "mcpServers": {
       "AppCreator": {
         "command": "node",
         "args": [
           "/absolute/path/to/appcreator-mcp-server/build/index.js"
         ]
       }
     }
   }
   ```

## Step 3: Restart Claude Desktop

1. Quit Claude Desktop completely
2. Restart Claude Desktop
3. You should see AppCreator tools available in the MCP section

## Step 4: Verify Installation

In Claude Desktop, try this prompt:

```
Use the create_project tool to create a new web application called "test-app"
with React and TypeScript.
```

If successful, you'll see:
- Project structure created
- Files generated
- POML template created
- Progress tracking initialized

## Development Mode

For development and testing, you can use the development server:

```json
{
  "mcpServers": {
    "AppCreator": {
      "command": "npx",
      "args": [
        "tsx",
        "C:\\Users\\serha\\OneDrive\\Desktop\\appcreator-mcp-server\\src\\index.ts"
      ]
    }
  }
}
```

This allows you to modify the code without rebuilding.

## Testing the Tools

### Test 1: Create Project
```
Create a new API project named "my-api" using Express and TypeScript.
Include features for user authentication and data management.
```

### Test 2: Check Status
```
Get the status of the "my-api" project.
```

### Test 3: Auto-Refresh
```
Use auto-refresh on the "my-api" project to save state.
```

### Test 4: Add Feature
```
Add a "file upload" feature to the "my-api" project.
```

### Test 5: Generate POML
```
Generate an updated POML template for "my-api".
```

## Troubleshooting

### Issue: Tools not appearing in Claude Desktop

**Solution:**
1. Check that the config file path is correct
2. Verify the absolute path to index.js is correct
3. Ensure the project is built (`npm run build`)
4. Restart Claude Desktop completely

### Issue: "Command not found" error

**Solution:**
1. Verify Node.js is installed: `node --version`
2. Check that the path to node is correct
3. On Windows, use full path: `C:\\Program Files\\nodejs\\node.exe`

### Issue: Permission denied errors

**Solution:**
1. On Unix systems, ensure build/index.js is executable:
   ```bash
   chmod +x build/index.js
   ```
2. Check write permissions in the working directory

### Issue: Module import errors

**Solution:**
1. Verify all dependencies are installed: `npm install`
2. Check that package.json has `"type": "module"`
3. Rebuild the project: `npm run build`

## Advanced Configuration

### Custom Working Directory

You can specify where projects should be created by modifying the server code:

```typescript
// In src/index.ts, modify the createProject method
const projectPath = path.join('/custom/path', name);
```

### Environment Variables

Create a `.env` file for configuration:

```env
AppCreator_PROJECT_ROOT=/path/to/projects
AppCreator_AUTO_REFRESH_INTERVAL=3600000
```

### Logging

Enable debug logging by setting the environment variable:

```json
{
  "mcpServers": {
    "AppCreator": {
      "command": "node",
      "args": ["build/index.js"],
      "env": {
        "DEBUG": "true"
      }
    }
  }
}
```

## Usage Examples

### Example 1: Full Stack Web App

```
Create a full-stack web application called "taskmaster" using:
- Frontend: React with TypeScript
- Backend: Express API
- Features: user authentication, task management, real-time updates

Then check the status and generate the POML template.
```

### Example 2: CLI Tool

```
Create a CLI tool called "devtools" for developer productivity.
Include features for:
- Git workflow automation
- Code snippet management
- Project scaffolding
```

### Example 3: Mobile App

```
Create a React Native mobile app called "fitness-tracker" with:
- User profiles
- Workout logging
- Progress charts
- Social features

Use auto-refresh after creation to save the state.
```

## Next Steps

After setup:

1. **Explore Project Types**: Try creating different types of projects
2. **Test Auto-Refresh**: Practice using the auto-refresh feature
3. **Monitor Progress**: Use get_project_status regularly
4. **Review POML**: Examine generated POML templates
5. **Extend Features**: Use add_feature to grow your projects

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Claude Desktop logs
3. Verify your configuration matches this guide
4. Ensure all prerequisites are installed

## Updates

To update AppCreator:

```bash
cd appcreator-mcp-server
git pull  # If using git
npm install
npm run build
```

Then restart Claude Desktop.

---

You're now ready to use AppCreator as your AI Software Factory!
