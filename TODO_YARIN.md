# YARIN YAPILACAKLAR - 30 Ocak 2026

## ILK IS (KRITIK!)

### .appcreator -> AppCreator Degisikligi

```bash
# 1. Tum referanslari bul
grep -r "AppCreator" --include="*.ts" src/

# 2. Degistir (manuel olarak veya sed ile)
# .appcreator -> .appcreator

# 3. Build yap
npm run build

# 4. Test et
```

**Degisecek yerler (28 referans):**

```
src/index.ts                           - 6 referans
src/modules/master-orchestrator.ts     - 6 referans
src/modules/poml-orchestrator.ts       - 5 referans
src/modules/auto-workflow.ts           - 2 referans
src/modules/smart-workflow.ts          - 1 referans
src/modules/project-generator.ts       - 1 referans (AppCreator text)
src/templates/poml/api.poml.ts         - 1 referans
src/templates/poml/base.poml.ts        - 1 referans
src/templates/poml/cli.poml.ts         - 1 referans
src/templates/poml/constitution.template.ts - 1 referans
src/templates/poml/mobile.poml.ts      - 1 referans
src/templates/poml/refresh.template.ts - 3 referans
src/templates/poml/web.poml.ts         - 1 referans
```

**Onerilen degisiklik:**
- `.appcreator` -> `.appcreator`
- `AppCreator` -> `AppCreator`

---

## SIRASYLA YAPILACAKLAR

### 1. MCP Server Yeniden Baslat
- Claude Desktop'i kapat
- Tekrar ac
- Bu yeni build'i yukleyecek

### 2. Smart Workflow Test
```
analyze_project_requirements -> create_project_from_analysis
```
- JSON parsing hatasi devam ederse debug ekle

### 3. API Endpoint Uretimi
- Specification'da apiDesign olmasi lazim
- Prompt'u guclendir

### 4. Diger Tool'lari Test Et
- [ ] generate_api_tests
- [ ] ask_frontend_questions
- [ ] generate_frontend_prompt
- [ ] generate_a2ui_frontend
- [ ] generate_bdd_tests
- [ ] complete_task
- [ ] create_checkpoint
- [ ] get_workflow_status

---

## HIZLI KOMUTLAR

```bash
# Build
cd C:\Users\serha\OneDrive\Desktop\AppCreator-MCP
npm run build

# AppCreator referanslarini bul
grep -r "AppCreator" --include="*.ts" src/

# JSON.parse kullanimi kontrol
grep -r "JSON\.parse" --include="*.ts" src/
```

---

## NOTLAR

- `src/utils/json-parser.ts` - yeni eklenen JSON parser
- Standard workflow calisiyor (start_project + approve_architecture)
- Smart workflow JSON hatasi veriyor
- faldiz-app projesi basariyla olusturuldu

---

*Bu dosyayi okuduktan sonra silebilirsin.*
