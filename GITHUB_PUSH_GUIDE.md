# 🚀 GitHub Push Rehberi

## ✅ Yapılan Değişiklikler

Tüm **AppCreator** referansları **AppCreator** olarak değiştirildi:

### Değiştirilen Dosyalar:
1. ✅ `package.json` - name, description, keywords
2. ✅ `src/index.ts` - class name, server name, log messages
3. ✅ `src/modules/smart-workflow.ts` - project paths
4. ✅ `src/modules/auto-workflow.ts` - project paths
5. ✅ `README.md` - tüm referanslar
6. ✅ `SESSION_SUMMARY.md` - project paths
7. ✅ `KULLANIM_REHBERI.md` - project paths

### Değişiklik Özeti:
- `AppCreator` → `AppCreator`
- `AppCreator` → `appcreator`
- `appcreator-mcp-server` → `appcreator-mcp-server`
- `AppCreator-projects` → `appcreator-projects`
- Server name: `"appcreator-mcp-server"`
- Version: `2.1.0`

### ✅ Build Başarılı
```bash
npm run build
# ✅ No errors!
```

---

## 🚀 GitHub'a Yükleme Adımları

### 1. Git Repository Başlatma

```bash
# AppCreator-MCP klasörüne git
cd C:\Users\serha\OneDrive\Desktop\AppCreator-MCP

# Git repository başlat
git init

# Tüm dosyaları ekle
git add .

# İlk commit
git commit -m "Initial commit: AppCreator MCP v2.1 with Smart Workflow, NotebookLM, and A2UI integration"
```

### 2. GitHub'a Bağlan

```bash
# Remote repository ekle
git remote add origin https://github.com/Srhot/AppCreator-MCP.git

# Ana branch'i main olarak ayarla
git branch -M main
```

### 3. GitHub'a Push Et

```bash
# İlk push
git push -u origin main
```

### 4. Version Tag Oluştur

```bash
# Stable version tag
git tag -a v2.1.0 -m "AppCreator MCP v2.1.0 - Smart Workflow, NotebookLM, A2UI"
git push origin v2.1.0

# Stable checkpoint tag
git tag -a v2.1-stable -m "Stable checkpoint before testing"
git push origin v2.1-stable
```

---

## 📋 Komutların Tümü (Tek Seferde)

PowerShell veya Git Bash'te şu komutları sırayla çalıştır:

```bash
cd C:\Users\serha\OneDrive\Desktop\AppCreator-MCP
git init
git add .
git commit -m "Initial commit: AppCreator MCP v2.1 with Smart Workflow, NotebookLM, and A2UI integration"
git remote add origin https://github.com/Srhot/AppCreator-MCP.git
git branch -M main
git push -u origin main
git tag -a v2.1.0 -m "AppCreator MCP v2.1.0 - Smart Workflow, NotebookLM, A2UI"
git push origin v2.1.0
git tag -a v2.1-stable -m "Stable checkpoint before testing"
git push origin v2.1-stable
```

---

## 🔧 Claude Desktop Configuration

GitHub'a push ettikten sonra, Claude Desktop config'i güncelle:

### Windows: `%APPDATA%\Claude\claude_desktop_config.json`

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

**ÖNEMLİ:** Key'i `"appcreator"` olarak kullan (artık `"AppCreator"` değil!)

### Development Mode (Opsiyonel):

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

---

## ✅ Doğrulama

Push sonrası kontrol:

1. **GitHub'da Kontrol Et:**
   - https://github.com/Srhot/AppCreator-MCP
   - Tüm dosyalar orada mı?
   - README.md düzgün görünüyor mu?
   - Tags oluşmuş mu? (v2.1.0, v2.1-stable)

2. **Claude Desktop'ta Test Et:**
   ```
   Claude Desktop'ı yeniden başlat

   Sonra Claude Code'da:
   "AppCreator MCP kullanarak basit bir todo uygulaması oluştur"
   ```

3. **MCP Çalışıyor mu?**
   ```bash
   # Terminal'de test
   cd C:\Users\serha\OneDrive\Desktop\AppCreator-MCP
   node build/index.js

   # "AppCreator MCP Server running on stdio" görmeli
   ```

---

## 🎯 Sonraki Adımlar

1. ✅ GitHub push tamamlandı
2. ✅ Claude Desktop config güncellendi
3. ⏳ Bilgisayarı yeniden başlat (RAM temizliği)
4. ⏳ Test prompt'unu hazırla
5. ⏳ Test et!

---

## 🚨 Sorun Giderme

### Hata: "repository already exists"
```bash
# Remote'u kontrol et
git remote -v

# Yanlışsa sil ve yeniden ekle
git remote remove origin
git remote add origin https://github.com/Srhot/AppCreator-MCP.git
```

### Hata: "failed to push some refs"
```bash
# Pull sonra push
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Claude Desktop MCP Görmüyor
```bash
# Config path'i kontrol et
echo %APPDATA%\Claude\claude_desktop_config.json

# Server name'i kontrol et (appcreator olmalı, AppCreator değil!)
# Claude Desktop'ı kapat ve tekrar aç
```

---

**Push'tan sonra bu dosyayı silebilirsin!** ✅
