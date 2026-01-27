# Claude Desktop Configuration Guide

## 📍 Config File Location

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Full Path:**
```
C:\Users\serha\AppData\Roaming\Claude\claude_desktop_config.json
```

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

---

## 🎯 Configuration Examples

### Example 1: Claude (Default - Recommended)

Use this if you want to use Anthropic's Claude as your AI provider.

```json
{
  "mcpServers": {
    "devforge": {
      "command": "node",
      "args": ["C:\\Users\\serha\\OneDrive\\Desktop\\devforge-mcp-server\\build\\index.js"],
      "env": {
        "AI_PROVIDER": "claude",
        "AI_API_KEY": "YOUR_ANTHROPIC_API_KEY_HERE"
      }
    }
  }
}
```

**With Custom Model:**
```json
{
  "mcpServers": {
    "devforge": {
      "command": "node",
      "args": ["C:\\Users\\serha\\OneDrive\\Desktop\\devforge-mcp-server\\build\\index.js"],
      "env": {
        "AI_PROVIDER": "claude",
        "AI_API_KEY": "YOUR_ANTHROPIC_API_KEY_HERE",
        "AI_MODEL": "claude-sonnet-4-20250514"
      }
    }
  }
}
```

**Get your API key:** https://console.anthropic.com/settings/keys

---

### Example 2: OpenAI

Use this if you want to use OpenAI's GPT models.

```json
{
  "mcpServers": {
    "devforge-openai": {
      "command": "node",
      "args": ["C:\\Users\\serha\\OneDrive\\Desktop\\devforge-mcp-server\\build\\index.js"],
      "env": {
        "AI_PROVIDER": "openai",
        "AI_API_KEY": "YOUR_OPENAI_API_KEY_HERE",
        "AI_MODEL": "gpt-4-turbo"
      }
    }
  }
}
```

**Alternative Models:**
- `gpt-4-turbo` - Latest GPT-4 Turbo
- `gpt-4o` - GPT-4 Optimized
- `gpt-4` - Original GPT-4

**Get your API key:** https://platform.openai.com/api-keys

---

### Example 3: Google Gemini

Use this if you want to use Google's Gemini models.

```json
{
  "mcpServers": {
    "devforge-gemini": {
      "command": "node",
      "args": ["C:\\Users\\serha\\OneDrive\\Desktop\\devforge-mcp-server\\build\\index.js"],
      "env": {
        "AI_PROVIDER": "gemini",
        "AI_API_KEY": "YOUR_GOOGLE_API_KEY_HERE",
        "AI_MODEL": "gemini-pro"
      }
    }
  }
}
```

**Alternative Models:**
- `gemini-pro` - Standard text generation
- `gemini-pro-vision` - Multimodal (text + images)

**Get your API key:** https://makersuite.google.com/app/apikey

---

### Example 4: Multiple Providers (Advanced)

Use this if you want to run all three providers simultaneously and switch between them.

```json
{
  "mcpServers": {
    "devforge-claude": {
      "command": "node",
      "args": ["C:\\Users\\serha\\OneDrive\\Desktop\\devforge-mcp-server\\build\\index.js"],
      "env": {
        "AI_PROVIDER": "claude",
        "AI_API_KEY": "YOUR_ANTHROPIC_API_KEY_HERE"
      }
    },
    "devforge-gpt4": {
      "command": "node",
      "args": ["C:\\Users\\serha\\OneDrive\\Desktop\\devforge-mcp-server\\build\\index.js"],
      "env": {
        "AI_PROVIDER": "openai",
        "AI_API_KEY": "YOUR_OPENAI_API_KEY_HERE",
        "AI_MODEL": "gpt-4o"
      }
    },
    "devforge-gemini": {
      "command": "node",
      "args": ["C:\\Users\\serha\\OneDrive\\Desktop\\devforge-mcp-server\\build\\index.js"],
      "env": {
        "AI_PROVIDER": "gemini",
        "AI_API_KEY": "YOUR_GOOGLE_API_KEY_HERE"
      }
    }
  }
}
```

---

## 📝 Step-by-Step Setup Instructions

### 1. Get Your API Key

Choose one provider and get an API key:

- **Claude:** https://console.anthropic.com/settings/keys
- **OpenAI:** https://platform.openai.com/api-keys
- **Gemini:** https://makersuite.google.com/app/apikey

### 2. Open Config File

**Windows - PowerShell:**
```powershell
notepad $env:APPDATA\Claude\claude_desktop_config.json
```

**Windows - Command Prompt:**
```cmd
notepad %APPDATA%\Claude\claude_desktop_config.json
```

**Or navigate manually:**
1. Press `Win + R`
2. Type: `%APPDATA%\Claude`
3. Open `claude_desktop_config.json`

### 3. Update Config File

1. Copy one of the example configurations above
2. Replace `YOUR_XXX_API_KEY_HERE` with your actual API key
3. Save the file

### 4. Restart Claude Desktop

Close and reopen Claude Desktop app for changes to take effect.

---

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `AI_PROVIDER` | AI provider to use | No | `claude` |
| `AI_API_KEY` | API key for the provider | Yes | - |
| `AI_MODEL` | Specific model to use | No | Provider default |

### Default Models

| Provider | Default Model |
|----------|---------------|
| `claude` | `claude-sonnet-4-20250514` |
| `openai` | `gpt-4-turbo` |
| `gemini` | `gemini-pro` |

---

## ✅ Verify Configuration

After updating the config and restarting Claude Desktop, the server should log:

```
🤖 DevForge MCP Server
📡 AI Provider: claude
🎯 Model: claude-sonnet-4-20250514
DevForge MCP Server running on stdio
```

---

## 🐛 Troubleshooting

### Server Not Starting

1. Check that the path to `build/index.js` is correct
2. Verify your API key is valid
3. Check Claude Desktop logs (usually in the app's developer tools)

### API Key Not Working

1. Make sure the API key matches the provider
2. Check that the key has proper permissions
3. Verify the key hasn't expired

### Wrong Provider Running

1. Check the `AI_PROVIDER` value is correct (`claude`, `openai`, or `gemini`)
2. Restart Claude Desktop after config changes

---

## 💡 Tips

### Recommended: Start with Claude

If you're unsure which provider to choose, start with **Example 1 (Claude)** as it's the default and most tested configuration.

### Cost Considerations

- **Claude:** Pay per token, generous context window
- **OpenAI:** Pay per token, various pricing tiers
- **Gemini:** Free tier available, then pay per token

### Performance

All three providers work well, but generation speed may vary:
- **Claude:** Generally balanced speed and quality
- **OpenAI GPT-4:** High quality, can be slower
- **Gemini:** Fast, good for high-volume tasks

---

## 📚 Additional Resources

- [DevForge Documentation](./README.md)
- [MCP Server Guide](https://modelcontextprotocol.io/)
- [Anthropic API Docs](https://docs.anthropic.com/)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Google AI Docs](https://ai.google.dev/)

---

## 🎯 Quick Start (Recommended)

**For most users, use this configuration:**

1. Get your Anthropic API key from https://console.anthropic.com/settings/keys
2. Open `%APPDATA%\Claude\claude_desktop_config.json`
3. Use this config:

```json
{
  "mcpServers": {
    "devforge": {
      "command": "node",
      "args": ["C:\\Users\\serha\\OneDrive\\Desktop\\devforge-mcp-server\\build\\index.js"],
      "env": {
        "AI_PROVIDER": "claude",
        "AI_API_KEY": "YOUR_ANTHROPIC_API_KEY_HERE"
      }
    }
  }
}
```

4. Replace `YOUR_ANTHROPIC_API_KEY_HERE` with your actual key
5. Save and restart Claude Desktop

✅ Done! Your DevForge MCP Server is ready to use.
