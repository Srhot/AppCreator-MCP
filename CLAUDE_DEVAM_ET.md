# CLAUDE - BU DOSYAYI OKU VE DEVAM ET

> **KULLANICI ICIN:** Yarin sadece su komutu ver:
> ```
> Bu dosyayi oku ve talimatlari uygula: C:\Users\serha\OneDrive\Desktop\AppCreator-MCP\CLAUDE_DEVAM_ET.md
> ```

---

## PROJE NEDIR?

**AppCreator-MCP** - Yapay zeka destekli proje olusturma araci. MCP (Model Context Protocol) server olarak calisir. Claude Desktop ile entegre.

**Konum:** `C:\Users\serha\OneDrive\Desktop\AppCreator-MCP`

**Ne yapar:**
- Kullanicidan proje gereksinimlerini alir
- AI ile mimari kararlar olusturur
- Otomatik dokumantasyon uretir (Constitution, Specification, Technical Plan, Tasks)
- API testleri, frontend prompt'lari, BDD testleri olusturur

---

## SON OTURUM NE YAPILDI? (29 Ocak 2026)

### Yapilan Duzeltmeler:

1. **JSON Parser Utility Olusturuldu**
   - Dosya: `src/utils/json-parser.ts`
   - AI'in urettigi hatali JSON'lari duzeltir
   - `parseJSONWithDefault()` fonksiyonu tum modullerde kullaniliyor

2. **7 Modul Guncellendi** (JSON parsing icin):
   - spec-kit.ts
   - bdd-generator.ts
   - a2ui-generator.ts
   - decision-matrix.ts
   - frontend-prompt-generator.ts
   - notebooklm-integration.ts
   - postman-generator.ts

3. **Standard Workflow Test Edildi** - CALISIYOR
   - `start_project` + `approve_architecture` = BASARILI
   - Ornek proje: `C:\Users\serha\OneDrive\Desktop\appcreator-projects\faldiz-app`

4. **Smart Workflow Test Edildi** - SORUNLU
   - `analyze_project_requirements` = BASARILI
   - `create_project_from_analysis` = JSON PARSING HATASI

---

## SIMDI NE YAPILACAK? (ONCELIK SIRASI)

### GOREV 1: .appcreator -> .appcreator DEGISIKLIGI (KRITIK!)

Tum kod tabaninda ".appcreator" referanslari ".appcreator" olarak degistirilecek.

**28 referans var. Degistirilecek dosyalar:**

```
src/index.ts                              (6 yer)
src/modules/master-orchestrator.ts        (6 yer)
src/modules/poml-orchestrator.ts          (5 yer)
src/modules/auto-workflow.ts              (2 yer)
src/modules/smart-workflow.ts             (1 yer)
src/modules/project-generator.ts          (1 yer - "AppCreator" metni)
src/templates/poml/api.poml.ts            (1 yer)
src/templates/poml/base.poml.ts           (1 yer)
src/templates/poml/cli.poml.ts            (1 yer)
src/templates/poml/constitution.template.ts (1 yer)
src/templates/poml/mobile.poml.ts         (1 yer)
src/templates/poml/refresh.template.ts    (3 yer)
src/templates/poml/web.poml.ts            (1 yer)
```

**Yapilacak degisiklikler:**
- `.appcreator` -> `.appcreator`
- `AppCreator` -> `AppCreator`
- `AppCreator` -> `appcreator`

**Komutlar:**
```bash
# Referanslari bul
cd "C:\Users\serha\OneDrive\Desktop\AppCreator-MCP"
grep -rn "AppCreator" --include="*.ts" src/

# Degisiklikleri yap (Edit tool ile her dosyayi guncelle)

# Build
npm run build
```

---

### GOREV 2: Smart Workflow JSON Hatasini Coz

**Problem:** `create_project_from_analysis` cagirildiginda:
```
Error: Expected ',' or ']' after array element in JSON at position 14638 (line 375 column 6)
```

**Olasi cozumler:**
1. MCP server yeniden baslatilmis olabilir (kullanici Claude Desktop'i yeniden acti)
2. Eger hata devam ederse, `smart-workflow.ts` icinde debug logging ekle
3. AI prompt'larini daha kisa JSON uretecek sekilde optimize et

**Test komutu:**
```
analyze_project_requirements ile kucuk bir proje olustur, sonra create_project_from_analysis ile dene
```

---

### GOREV 3: API Endpoint Uretimini Duzelt

**Problem:** Specification'da `apiDesign.endpoints` bos geliyor, bu yuzden `generate_api_tests` calismıyor.

**Cozum:** `src/modules/spec-kit.ts` icindeki `generateSpecification` metodunda AI prompt'unu guclendir - projeye ozel API endpoint'ler uretsin.

---

### GOREV 4: Diger Tool'lari Test Et

Sirasıyla test edilecekler:
- [ ] `generate_api_tests`
- [ ] `ask_frontend_questions`
- [ ] `generate_frontend_prompt`
- [ ] `generate_a2ui_frontend`
- [ ] `generate_bdd_tests`
- [ ] `complete_task`
- [ ] `create_checkpoint`
- [ ] `get_workflow_status`

---

## TEKNIK DETAYLAR

### Proje Yapisi
```
AppCreator-MCP/
├── src/
│   ├── index.ts                 # MCP server ana dosyasi
│   ├── adapters/                # AI adapterleri (Claude, OpenAI, Gemini)
│   ├── core/                    # Context manager, template engine
│   ├── modules/                 # Ana moduller
│   │   ├── spec-kit.ts          # Specification uretici
│   │   ├── smart-workflow.ts    # Akilli workflow
│   │   ├── master-orchestrator.ts
│   │   ├── bdd-generator.ts
│   │   ├── a2ui-generator.ts
│   │   ├── postman-generator.ts
│   │   └── ...
│   ├── templates/               # POML sablonlari
│   └── utils/
│       └── json-parser.ts       # JSON parsing utility (YENI)
├── build/                       # Compiled JS
├── docs/
│   └── SESSION_SUMMARY_2026-01-29.md
└── package.json
```

### Onemli Dosyalar
- `src/utils/json-parser.ts` - JSON parsing utility (dun eklendi)
- `src/modules/spec-kit.ts` - Ana specification uretici
- `src/modules/smart-workflow.ts` - Smart workflow motoru

### Build Komutu
```bash
cd "C:\Users\serha\OneDrive\Desktop\AppCreator-MCP"
npm run build
```

### MCP Tools Listesi
```
analyze_project_requirements  - Proje analizi (Smart Workflow 1)
create_project_from_analysis  - Proje olustur (Smart Workflow 2)
start_project                 - Proje baslat (Standard Workflow 1)
approve_architecture          - Mimari onayla (Standard Workflow 2)
generate_api_tests            - Postman testleri
ask_frontend_questions        - Frontend sorulari
generate_frontend_prompt      - Frontend prompt
generate_a2ui_frontend        - A2UI frontend
generate_bdd_tests            - BDD testleri
complete_task                 - Gorev tamamla
create_checkpoint             - Checkpoint olustur
get_workflow_status           - Durum sorgula
```

---

## BASARILI PROJE ORNEGI

```
C:\Users\serha\OneDrive\Desktop\appcreator-projects\faldiz-app\
├── docs/
│   ├── CONSTITUTION.md
│   ├── SPECIFICATION.md
│   ├── TECHNICAL_PLAN.md
│   └── TASKS.md
├── .appcreator/              <- Bu ".appcreator" olacak
│   └── state.json
└── PROJECT.poml
```

---

## HIZLI BASLANGIÇ

Claude, bu dosyayi okudugunda su adimlari izle:

1. **Once** `.appcreator` -> `.appcreator` degisikligini yap (GOREV 1)
2. **Sonra** build yap: `npm run build`
3. **Sonra** smart workflow'u test et (GOREV 2)
4. Eger calismiyorsa debug ekle
5. Diger gorevlere gec

---

*Son guncelleme: 29 Ocak 2026*
