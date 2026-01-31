# AppCreator v2.0 - Comprehensive Usage Guide

**Complete AI-Powered Software Factory with Context Preservation**

---

## 📚 Table of Contents

1. [Understanding AppCreator & Claude Desktop](#understanding-AppCreator--claude-desktop)
2. [How AI Providers Work](#how-ai-providers-work)
3. [Complete Workflow (6 Phases)](#complete-workflow-6-phases)
4. [Available Tools](#available-tools)
5. [Step-by-Step Examples](#step-by-step-examples)
6. [Provider Comparison](#provider-comparison)
7. [Troubleshooting](#troubleshooting)
8. [FAQ](#faq)

---

## 🤖 Understanding AppCreator & Claude Desktop

### What is AppCreator?

AppCreator is **not a chatbot** - it's an **MCP (Model Context Protocol) server** that provides specialized tools to Claude Desktop.

### The Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLAUDE DESKTOP                          │
│  (Anthropic's AI - Your Claude Pro subscription)           │
│                                                             │
│  You chat here normally with Claude                        │
│  But when you ask to use AppCreator tools...                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ MCP Protocol
                     │
┌────────────────────▼────────────────────────────────────────┐
│              AppCreator MCP SERVERS                           │
│  (3 separate servers in background)                        │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  AppCreator-  │  │  AppCreator-  │  │  AppCreator-  │        │
│  │   claude    │  │    gpt4     │  │   gemini    │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                │                │                │
└─────────┼────────────────┼────────────────┼────────────────┘
          │                │                │
          ▼                ▼                ▼
    ┌─────────┐      ┌─────────┐      ┌─────────┐
    │ Claude  │      │ OpenAI  │      │ Gemini  │
    │ API     │      │ API     │      │ API     │
    │ (your   │      │ (your   │      │ (your   │
    │  key)   │      │  key)   │      │  key)   │
    └─────────┘      └─────────┘      └─────────┘
```

### Key Concepts

**1. Claude Desktop (Anthropic AI)**
- Bu **senin normal Claude konuştuğun yerdir**
- **Her zaman Anthropic'in Claude AI'ı** seninle konuşur
- **Claude Pro aboneliğin** burada geçerlidir
- MCP araçlarını kullanmadığın sürece, **tamamen normal Claude'dur**

**2. AppCreator MCP Servers (Background)**
- Arka planda çalışan **3 ayrı sunucu**: AppCreator-claude, AppCreator-gpt4, AppCreator-gemini
- **Sadece araç çağrıldığında** aktive olurlar
- Her biri **farklı AI sağlayıcısına** bağlıdır
- **Kendi API key'lerini kullanırlar** (senin verdiğin)

**3. How They Work Together**

```
Senaryo 1: Normal Sohbet (AppCreator kullanmıyorsun)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sen: "Merhaba, bana React hakkında bilgi ver"
↓
Claude Desktop: [Normal Claude AI cevap verir]
↓
Kullanılan: Claude Pro aboneliğin (Anthropic)
Cost: Abonelik dahilinde


Senaryo 2: AppCreator Aracı Kullanıyorsun
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sen: "AppCreator'un start_project aracını kullanarak bir web sitesi oluştur"
↓
Claude Desktop: [Aracı çağırır]
    ↓
    AppCreator MCP Server (AppCreator-gemini): [Çalışır]
        ↓
        Gemini API: [Spec-Kit üretir]
        ↓
        Kullanılan: Senin Gemini API keyin
        Cost: Gemini API fiyatları
    ↓
Claude Desktop: [Sonucu sana gösterir]
```

---

## 🔑 How AI Providers Work

### Provider Roles

| Who | What | When | Cost |
|-----|------|------|------|
| **Claude Desktop (Anthropic)** | Normal sohbet, araç çağırma | Her zaman | Pro abonelik |
| **AppCreator-claude API** | Spec-Kit, BDD üretimi | Araç çağrıldığında | Senin Claude API keyin |
| **AppCreator-gpt4 API** | Spec-Kit, BDD üretimi | Araç çağrıldığında | Senin OpenAI API keyin |
| **AppCreator-gemini API** | Spec-Kit, BDD üretimi | Araç çağrıldığında | Senin Gemini API keyin |

### Which Claude is Which?

**ÇOK ÖNEMLİ:**

1. **Claude Desktop (Anthropic)** = Seninle konuşan AI
   - Pro aboneliğin burada
   - MCP araçlarını yönetir
   - Her zaman aktif

2. **AppCreator-claude API** = Arka planda çalışan tool
   - **Sadece araç çağrıldığında** çalışır
   - **Senin Claude API keyin** (sk-ant-api03-...) kullanılır
   - Spec-Kit, Postman, BDD üretir
   - **Ayrı maliyet** (API kullanımı)

### Cost Breakdown

```
Normal Kullanım (AppCreator yok):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sen: "React component nasıl yazılır?"
→ Claude Desktop cevap verir
→ Cost: $0 (Pro abonelik dahilinde)


AppCreator ile Proje Oluşturma:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sen: "AppCreator start_project aracını kullan"
↓
Claude Desktop: Aracı çağırır (ücretsiz)
↓
AppCreator-Gemini: Spec-Kit üretir
→ Cost: ~$0.01 (Gemini API)
↓
Claude Desktop: Sonucu gösterir (ücretsiz)

TOPLAM COST: ~$0.01 (sadece araç kullanımı)
```

---

## 🚀 Complete Workflow (6 Phases)

AppCreator şimdi **tam bir software factory**! İşte 6 aşamalı iş akışı:

### PHASE 1: Discovery & Planning

**Ne Olur:**
1. Proje fikrini söylersin
2. AppCreator **5-8 mimari karar sorusu** sorar
3. Sen cevapları verirsin
4. Mimariyi onaylarsın

**Örnek:**

```
Sen Claude Desktop'ta:
━━━━━━━━━━━━━━━━━━
"AppCreator'un start_project aracını kullanarak bir Taşınmaz Takip Sistemi web sitesi oluştur"

Claude Desktop (Anthropic AI) cevap verir:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Tabii! AppCreator ile proje oluşturalım."
[start_project aracını çağırır]
    ↓
    AppCreator-gemini çalışır:
    ↓
    Gemini API: Karar matrisi üretir

Claude Desktop sana gösterir:
━━━━━━━━━━━━━━━━━━━━━━━━━━
"İşte mimari kararlar için 5 soru:

1. Frontend Framework?
   a) React
   b) Vue
   c) Angular

2. Backend Framework?
   a) Express (Node.js)
   b) NestJS
   c) FastAPI (Python)

3. Database?
   a) PostgreSQL
   b) MongoDB
   c) MySQL

... vs"

Sen cevapları verirsin:
━━━━━━━━━━━━━━━━━━
"1-a, 2-a, 3-a, ..."
```

### PHASE 2: Specification Generation

**Ne Olur:**
1. Cevaplarını onaylarsın
2. AppCreator **tam Spec-Kit üretir**:
   - Constitution (proje ilkeleri)
   - Specification (detaylı gereksinimler)
   - Technical Plan (mimari)
   - Task Breakdown (20-25 task)
   - **POML dosyaları** (context preservation!)

**Örnek:**

```
Sen:
━━━━
"Cevaplarımı onayla ve projeyi oluştur"

Claude Desktop:
━━━━━━━━━━━━━━━
[approve_architecture aracını çağırır]
    ↓
    AppCreator-gemini:
    ↓
    - Constitution oluşturur
    - Specification oluşturur
    - Technical Plan oluşturur
    - 20 task oluşturur
    ↓
Claude Desktop sonuçları gösterir:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"✅ Spec-Kit oluşturuldu!
✅ 20 task planlandı
✅ Dosyalar kaydedildi:
   - docs/CONSTITUTION.md
   - docs/SPECIFICATION.md
   - docs/TECHNICAL_PLAN.md
   - docs/TASKS.md
   - PROJECT.poml
   - .appcreator/state.json"
```

### PHASE 3: Backend Development & API Testing

**Ne Olur:**
1. Backend kodunu yazarsın (manuel veya Claude Desktop ile)
2. AppCreator **Postman collections üretir**
3. API'leri test edersin (Postman veya Newman)
4. Sorunları raporlarsın

**Örnek:**

```
Sen:
━━━━
"Backend tamamlandı. AppCreator'un generate_api_tests aracını kullanarak API testleri oluştur"

Claude Desktop:
━━━━━━━━━━━━━━━
[generate_api_tests aracını çağırır]
    ↓
    AppCreator-gemini:
    ↓
    - Postman collection oluşturur
    - Environments oluşturur (dev, staging, prod)
    - Newman CLI komutları üretir
↓
"✅ API testleri oluşturuldu:
   - postman/collection.json
   - postman/dev.environment.json
   - docs/API_TESTING_GUIDE.md

Test etmek için:
npm install -g newman
newman run postman/collection.json -e postman/dev.environment.json"
```

### PHASE 4: Frontend Development

**Ne Olur:**
1. AppCreator frontend tercihleri sorar
2. Sen platform, renk, stil seçersin
3. AppCreator **comprehensive prompt üretir**
4. Google Stitch/Lovable/v0'a yapıştırırsın
5. Dakikalar içinde frontend hazır!

**Örnek:**

```
Sen:
━━━━
"Frontend için prompt oluştur"

Claude Desktop:
━━━━━━━━━━━━━━━
[ask_frontend_questions aracını çağırır]
↓
"İşte frontend soruları:
1. Platform? (google-stitch/lovable/v0/bolt)
2. Design style? (modern/minimal/colorful)
3. Color scheme? (light/dark/auto)
4. Primary color?"

Sen:
━━━━
"lovable, modern, dark, blue"

Claude Desktop:
━━━━━━━━━━━━━━━
[generate_frontend_prompt aracını çağırır]
    ↓
    AppCreator-gemini:
    ↓
    - Comprehensive prompt üretir
    - Component breakdown
    - Design system specs
    - API integration guide
↓
"✅ Frontend prompt hazır!
   - docs/FRONTEND_PROMPT.md

Bu dosyayı aç, promptu kopyala, Lovable'a yapıştır!
Frontend otomatik oluşacak."
```

### PHASE 5: BDD Testing

**Ne Olur:**
1. AppCreator **Cucumber/Gherkin testleri** üretir
2. Feature files (.feature)
3. Step definitions (TypeScript)
4. Test configuration

**Örnek:**

```
Sen:
━━━━
"BDD testleri oluştur"

Claude Desktop:
━━━━━━━━━━━━━━━
[generate_bdd_tests aracını çağırır]
    ↓
    AppCreator-gemini:
    ↓
    - Feature files üretir
    - Step definitions üretir
    - cucumber.js config üretir
↓
"✅ BDD testleri oluşturuldu:
   - tests/features/*.feature
   - tests/step-definitions/steps.ts
   - cucumber.js

Testleri çalıştır:
npm install @cucumber/cucumber
npm run test:bdd"
```

### PHASE 6: Context Preservation (OTOMATIK!)

**Ne Olur:**
1. Her 20 task tamamladığında **otomatik checkpoint**
2. Tüm state kaydedilir
3. Context kaybı önlenir!

**Örnek:**

```
Sen:
━━━━
"Task T001 tamamlandı"

Claude Desktop:
━━━━━━━━━━━━━━━
[complete_task aracını çağırır]
↓
"✅ Task T001 tamamlandı! (1/20)

... (19 task daha)

Sen:
━━━━
"Task T020 tamamlandı"

Claude Desktop:
━━━━━━━━━━━━━━━
[complete_task aracını çağırır]
    ↓
    AppCreator-gemini:
    ↓
    ⚠️ AUTO-CHECKPOINT TRIGGERED! ⚠️
    ↓
    - PROJECT.poml güncellenir
    - .appcreator/state.json güncellenir
    - .appcreator/continuation-prompt.txt oluşturulur
↓
"✅ Task T020 tamamlandı! (20/20)
💾 CHECKPOINT OLUŞTURULDU!
   Context korundu. Daha sonra kaldığın yerden devam edebilirsin!"
```

---

## 🛠️ Available Tools

AppCreator v2.0'da **9 araç** var:

### 1. start_project
**Ne Yapar:** Proje başlatır, karar matrisi üretir

**Nasıl Kullanılır:**
```
"AppCreator'un start_project aracını kullanarak bir [proje açıklaması] oluştur"
```

**Örnek:**
```
"AppCreator'un start_project aracını kullanarak bir e-ticaret sitesi oluştur"
```

**Çıktı:**
- 5-8 mimari karar sorusu
- Proje türü analizi

---

### 2. approve_architecture
**Ne Yapar:** Karar matrisi cevaplarını alır, tam Spec-Kit üretir

**Nasıl Kullanılır:**
```
Önce karar sorularını cevapla, sonra:
"Bu cevaplarla devam et ve Spec-Kit oluştur"
```

**Çıktı:**
- docs/CONSTITUTION.md
- docs/SPECIFICATION.md
- docs/TECHNICAL_PLAN.md
- docs/TASKS.md
- PROJECT.poml
- .appcreator/state.json

---

### 3. generate_api_tests
**Ne Yapar:** Postman collections + environments üretir

**Nasıl Kullanılır:**
```
"API testleri oluştur"
veya
"AppCreator'un generate_api_tests aracını kullan"
```

**Çıktı:**
- postman/collection.json
- postman/dev.environment.json
- postman/staging.environment.json
- postman/prod.environment.json
- docs/API_TESTING_GUIDE.md

---

### 4. ask_frontend_questions
**Ne Yapar:** Frontend tercihleri sorar

**Nasıl Kullanılır:**
```
"Frontend için hangi soruları sormalısın?"
```

**Çıktı:**
- Platform sorusu (Lovable, Stitch, v0, Bolt)
- Design style sorusu
- Color scheme sorusu
- Primary color sorusu

---

### 5. generate_frontend_prompt
**Ne Yapar:** Frontend prompt üretir (Google Stitch, Lovable, v0, Bolt için)

**Nasıl Kullanılır:**
```
Önce soruları cevapla, sonra:
"Bu cevaplarla frontend prompt oluştur"
```

**Çıktı:**
- docs/FRONTEND_PROMPT.md
  - Main comprehensive prompt
  - Component breakdown
  - Design system specs
  - API integration guide

---

### 6. generate_bdd_tests
**Ne Yapar:** BDD/Cucumber testleri üretir

**Nasıl Kullanılır:**
```
"BDD testleri oluştur"
```

**Çıktı:**
- tests/features/*.feature (Gherkin files)
- tests/step-definitions/steps.ts
- cucumber.js config

---

### 7. create_checkpoint
**Ne Yapar:** Manuel checkpoint oluşturur

**Nasıl Kullanılır:**
```
"Checkpoint oluştur"
```

**Çıktı:**
- PROJECT.poml güncellenir
- .appcreator/state.json güncellenir
- .appcreator/continuation-prompt.txt oluşturulur

---

### 8. get_workflow_status
**Ne Yapar:** Mevcut ilerleme durumunu gösterir

**Nasıl Kullanılır:**
```
"Proje durumu nedir?"
```

**Çıktı:**
- Current phase
- Completed phases
- Tasks completed (X/Y)
- Issues encountered

---

### 9. complete_task
**Ne Yapar:** Task'ı tamamlar, 20'de otomatik checkpoint

**Nasıl Kullanılır:**
```
"Task T005 tamamlandı"
```

**Çıktı:**
- Task counter artar
- 20. task'te otomatik checkpoint!

---

## 📝 Step-by-Step Examples

### Example 1: Complete E-Commerce Site (Gemini)

**STEP 1: Start Project**

```
Claude Desktop'ta yaz:
━━━━━━━━━━━━━━━━━━━━━
"AppCreator-Gemini'nin start_project aracını kullanarak bir e-ticaret sitesi oluştur.

Özellikler:
- Ürün katalog
- Sepet sistemi
- Kullanıcı girişi
- Ödeme entegrasyonu"
```

Claude Desktop cevap verecek:
```
"İşte mimari kararlar için sorular:

1. Frontend framework?
   a) React
   b) Vue
   c) Angular

2. Backend framework?
   a) Express
   b) NestJS
   c) Django

3. Database?
   a) PostgreSQL
   b) MongoDB
   c) MySQL

4. Authentication?
   a) JWT
   b) OAuth2
   c) Session-based

5. Payment gateway?
   a) Stripe
   b) PayPal
   c) Square"
```

**STEP 2: Answer Questions**

```
Sen:
━━━━
"1-a (React), 2-a (Express), 3-a (PostgreSQL), 4-a (JWT), 5-a (Stripe)"
```

**STEP 3: Approve Architecture**

```
Sen:
━━━━
"Bu cevaplarla devam et ve Spec-Kit oluştur"
```

Claude Desktop:
```
"✅ Spec-Kit oluşturuldu!

Dosyalar:
- docs/CONSTITUTION.md (proje ilkeleri)
- docs/SPECIFICATION.md (detaylı gereksinimler)
- docs/TECHNICAL_PLAN.md (mimari + tech stack)
- docs/TASKS.md (22 task)
- PROJECT.poml (context preservation)
- .appcreator/state.json

22 task planlandı:
T001: Project setup
T002: Database schema design
T003: User authentication API
...
T022: Deployment preparation"
```

**STEP 4: Backend Development**

```
Sen (normal Claude ile):
━━━━━━━━━━━━━━━━━━━━
"docs/TASKS.md dosyasına göre backend kodunu yaz"

[Claude Desktop normal şekilde kod yazar - AppCreator kullanmaz]
```

**STEP 5: API Tests**

```
Sen:
━━━━
"Backend tamamlandı. generate_api_tests aracını kullanarak API testleri oluştur"

Claude Desktop:
━━━━━━━━━━━━━━━
"✅ Postman collections oluşturuldu!
   - postman/collection.json (15 endpoint)
   - postman/dev.environment.json
   - postman/staging.environment.json
   - postman/prod.environment.json

Test etmek için:
npm install -g newman
newman run postman/collection.json -e postman/dev.environment.json"
```

**STEP 6: Frontend Prompt**

```
Sen:
━━━━
"Frontend için hangi soruları sormalısın?"

Claude Desktop:
━━━━━━━━━━━━━━━
[ask_frontend_questions kullanır]

"İşte sorular:
1. Platform? (lovable/stitch/v0/bolt)
2. Design style? (modern/minimal/colorful)
3. Color scheme? (light/dark/auto)
4. Primary color?"

Sen:
━━━━
"lovable, modern, dark, purple"

Claude Desktop:
━━━━━━━━━━━━━━━
[generate_frontend_prompt kullanır]

"✅ Frontend prompt hazır: docs/FRONTEND_PROMPT.md

Şimdi:
1. Dosyayı aç
2. Main prompt'u kopyala
3. Lovable'a yapıştır
4. Dakikalar içinde frontend hazır!"
```

**STEP 7: BDD Tests**

```
Sen:
━━━━
"BDD testleri oluştur"

Claude Desktop:
━━━━━━━━━━━━━━━
[generate_bdd_tests kullanır]

"✅ BDD testleri oluşturuldu!
   - tests/features/user-auth.feature
   - tests/features/product-catalog.feature
   - tests/features/shopping-cart.feature
   - tests/features/checkout.feature
   - tests/step-definitions/steps.ts
   - cucumber.js

Çalıştır:
npm run test:bdd"
```

**STEP 8: Track Progress**

```
20 task tamamladıkça:

Sen:
━━━━
"Task T001 tamamlandı"
[complete_task aracı]

...

"Task T020 tamamlandı"
[complete_task aracı]
↓
⚠️ AUTO-CHECKPOINT! ⚠️
💾 Context korundu!
```

---

### Example 2: Simple Blog (Claude)

**Why Use Claude API Instead of Gemini?**
- Daha kaliteli Spec-Kit
- Daha detaylı task breakdown
- Production-ready mimari

```
"AppCreator-Claude'un start_project aracını kullanarak bir blog sitesi oluştur"

[Aynı workflow, ama AppCreator-claude API kullanılır]

Cost: ~$0.50 (Gemini: ~$0.01)
Quality: Daha yüksek
```

---

### Example 3: CLI Tool (GPT-4o)

```
"AppCreator-GPT4'ün start_project aracını kullanarak bir file organizer CLI tool oluştur"

[Aynı workflow, ama AppCreator-gpt4 API kullanılır]

Cost: ~$0.60 (Gemini: ~$0.01)
Reliability: Çok güvenilir
```

---

## 🏆 Provider Comparison

| Feature | Claude Sonnet 4 | OpenAI GPT-4o | Gemini 2.0 Flash |
|---------|-----------------|---------------|------------------|
| **Speed** | Orta | Orta | Hızlı ⚡ |
| **Quality** | Mükemmel 🏆 | Mükemmel 🏆 | Çok İyi |
| **Cost** | Orta ($$) | Yüksek ($$$) | Düşük ($) 💰 |
| **Free Tier** | Hayır | Hayır | Evet ✅ |
| **Context** | 200K tokens | 128K tokens | 1M tokens 🎯 |
| **Best For** | Production apps | Reliable systems | Prototypes, testing |

### Cost Examples (Typical Small Project)

| Provider | Input Tokens | Output Tokens | Total Cost |
|----------|--------------|---------------|------------|
| **Gemini** | 30K (~$0.002) | 20K (~$0.006) | **~$0.01** |
| **Claude** | 30K (~$0.09) | 20K (~$0.30) | **~$0.40** |
| **GPT-4o** | 30K (~$0.15) | 20K (~$0.30) | **~$0.45** |

### Recommendation

```
Testing/Learning:
→ AppCreator-gemini (free tier!)

Production/Important:
→ AppCreator-claude (best quality)

Enterprise/Reliable:
→ AppCreator-gpt4 (proven track record)
```

---

## 🐛 Troubleshooting

### Problem 1: "Araçlar görünmüyor"

**Çözüm:**
1. Claude Desktop'ı **tamamen kapat**
2. **Yeniden aç**
3. Araçlar otomatik yüklenecek

Kontrol et:
```
Claude Desktop → Ayarlar → Developer → MCP Servers
Görmeli:
- AppCreator-claude
- AppCreator-gpt4
- AppCreator-gemini
```

---

### Problem 2: "Karar matrisi görünmedi, direkt kod yazdı"

**Sebep:** Araç adını açıkça belirtmedin

**Yanlış:**
```
"Bir web sitesi oluştur"
→ Claude normal kod yazar
```

**Doğru:**
```
"AppCreator'un start_project aracını kullanarak bir web sitesi oluştur"
→ AppCreator araç çalışır
```

---

### Problem 3: "Hangi AI kullanıldı anlamadım"

**Açıklama:**

```
SENARYO 1: Normal Sohbet
━━━━━━━━━━━━━━━━━━━━━━━
Sen: "React nasıl kullanılır?"
↓
Claude Desktop (Anthropic AI): Cevap verir
↓
Kullanılan: Claude Pro aboneliğin
Cost: $0 (abonelik dahilinde)
AppCreator: Kullanılmadı


SENARYO 2: AppCreator Aracı
━━━━━━━━━━━━━━━━━━━━━━━━━
Sen: "AppCreator-Gemini start_project kullan"
↓
Claude Desktop: Aracı çağırır
    ↓
    AppCreator-gemini MCP server: Çalışır
        ↓
        Gemini API: Spec üretir
        ↓
        Kullanılan: Senin Gemini API keyin
        Cost: Gemini API fiyatları (~$0.01)
    ↓
Claude Desktop: Sonucu gösterir
↓
Toplam: Claude Desktop + Gemini API birlikte çalıştı
```

---

### Problem 4: "API key hatası"

**Çözüm:**

1. Config dosyasını kontrol et:
```
C:\Users\serha\AppData\Roaming\Claude\claude_desktop_config.json
```

2. API key doğru mu?
   - Claude: https://console.anthropic.com/settings/keys
   - OpenAI: https://platform.openai.com/api-keys
   - Gemini: https://aistudio.google.com/apikey

3. Yeni key al

4. Config'e yapıştır

5. Claude Desktop'ı yeniden başlat

---

### Problem 5: "Context kaybı"

**Çözüm:**

AppCreator **otomatik checkpoint** yapıyor:
- Her 20 task'te
- Manuel: `create_checkpoint` aracı

Eğer context kaybettiysen:
```
1. Oku: TODO.md
2. Oku: .appcreator/continuation-prompt.txt
3. Oku: PROJECT.poml
4. Claude'a göster: "Bu prompttan devam et"
```

---

## ❓ FAQ

### Q1: AppCreator kullanmazken Claude Pro aboneliğim mi kullanılır?

**A:** Evet! Normal sohbette her zaman Claude Pro aboneliğin kullanılır. AppCreator sadece **araç çağırdığında** kendi API key'lerini kullanır.

---

### Q2: AppCreator aracını kullandığımda hem Claude Pro hem API key mi harcanır?

**A:**
```
Claude Desktop (Anthropic):
- Aracı çağırır: Abonelik dahilinde (ücretsiz)
- Sonucu gösterir: Abonelik dahilinde (ücretsiz)

AppCreator API (Gemini/Claude/GPT):
- Spec üretir: API key kullanır (ücretli)

TOPLAM: Sadece araç kullanımı ücretli
```

---

### Q3: Hangi provider'ı seçmeliyim?

**A:**
```
Öğreniyorum / Test ediyorum:
→ AppCreator-gemini (free tier!)

Önemli proje / Production:
→ AppCreator-claude (en kaliteli)

Kurumsal / Güvenilir olmalı:
→ AppCreator-gpt4

Para önemli değil:
→ Her biri için ayrı dene, karşılaştır
```

---

### Q4: Context preservation nasıl çalışır?

**A:**

```
Otomatik Checkpoint (Her 20 Task):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Task 1-19: Normal çalışma
Task 20: ⚠️ AUTO-CHECKPOINT!
    ↓
    PROJECT.poml → Güncellenir
    .appcreator/state.json → Kaydedilir
    .appcreator/continuation-prompt.txt → Oluşturulur

Yeni session başladığında:
    ↓
    continuation-prompt.txt'yi Claude'a göster
    ↓
    Kaldığın yerden devam et!
```

---

### Q5: POML nedir?

**A:**

**POML (Project Orchestration Markup Language)** = Context preservation formatı

```yaml
PROJECT: E-Commerce Site
STATUS: In Progress (15/22 tasks)
PHASE: Backend Development

COMPLETED TASKS:
- T001: Project setup ✅
- T002: Database schema ✅
...
- T015: Checkout API ✅

CURRENT TASK:
- T016: Payment integration

NEXT TASKS:
- T017: Email notifications
- T018: Admin panel
...

ISSUES:
- Stripe webhook authentication needs fixing

CHECKPOINTS:
- Checkpoint #1 at task 20
```

Bu sayede context kaybolsa bile **tüm bilgi korunur**!

---

### Q6: Frontend prompt ne işe yarar?

**A:**

AppCreator şunları üretir:
```
docs/FRONTEND_PROMPT.md:
━━━━━━━━━━━━━━━━━━━━━━
## Main Prompt (kopyala → Lovable'a yapıştır)
"Create a modern e-commerce site with..."

## Component Breakdown
- ProductCard: "Create a product card component..."
- ShoppingCart: "Create a cart sidebar..."
...

## Design System
- Colors: Purple primary, dark mode
- Typography: Modern sans-serif
...

## API Integration
- GET /api/products
- POST /api/cart/add
...
```

Sen sadece **Main Prompt'u kopyala** → **Lovable/Stitch/v0'a yapıştır** → **Frontend hazır**!

---

### Q7: Neden hem Claude Desktop hem API key gerekiyor?

**A:**

```
Claude Desktop (Anthropic):
━━━━━━━━━━━━━━━━━━━━━━━
- Seninle konuşur
- Araçları yönetir
- Workflow organize eder
- Pro aboneliğin burada

AppCreator API Keys:
━━━━━━━━━━━━━━━━━━
- Spec-Kit üretir
- BDD testleri üretir
- Postman collections üretir
- Sadece araç çalışırken kullanılır

İkisi birlikte çalışır:
Desktop = Brain (yönetici)
API = Worker (üretici)
```

---

### Q8: Gemini free tier yeterli mi?

**A:**

**Gemini Free Tier Limits:**
- 15 request/minute
- 1 million tokens/minute
- 1,500 requests/day

**Bir proje için:**
- start_project: 1 request (~50K tokens)
- approve_architecture: 1 request (~100K tokens)
- generate_api_tests: 1 request (~80K tokens)
- generate_frontend_prompt: 1 request (~50K tokens)
- generate_bdd_tests: 1 request (~70K tokens)

**TOPLAM: 5 requests, ~350K tokens**

✅ Free tier **kesinlikle yeterli**!
✅ Günde 300 proje oluşturabilirsin teoride!

---

## 📊 Summary

### AppCreator v2.0 Nedir?

**Tam bir AI Software Factory:**

1. ✅ **6-Phase Workflow** (Discovery → Deployment)
2. ✅ **9 Specialized Tools** (start_project, approve_architecture, vs.)
3. ✅ **3 AI Providers** (Claude, OpenAI, Gemini)
4. ✅ **Context Preservation** (otomatik checkpoint her 20 task)
5. ✅ **Complete Spec-Kit** (Constitution, Spec, Plan, Tasks)
6. ✅ **POML Architecture** (context kaybı önleme)
7. ✅ **API Testing** (Postman + Newman)
8. ✅ **Frontend Prompts** (Lovable, Stitch, v0, Bolt)
9. ✅ **BDD Tests** (Cucumber/Gherkin)

### Best Workflow

```
1. Claude Desktop'ı aç
2. "AppCreator-Gemini start_project kullan" de
3. Karar sorularını cevapla
4. Spec-Kit oluşsun
5. Backend yaz (Claude Desktop ile)
6. API testleri oluştur (generate_api_tests)
7. Frontend prompt oluştur (generate_frontend_prompt)
8. Lovable'a yapıştır → Frontend hazır!
9. BDD testleri oluştur (generate_bdd_tests)
10. Her 20 task'te otomatik checkpoint!
```

### Cost Optimization

```
Prototype/Test:
→ AppCreator-gemini (free!)

Production:
→ AppCreator-claude (kalite)

Enterprise:
→ AppCreator-gpt4 (güvenilir)
```

---

## 🚀 Next Steps

### Hemen Başla!

1. **Claude Desktop'ı aç**

2. **İlk projeyi oluştur:**
```
"AppCreator-Gemini'nin start_project aracını kullanarak bir [proje fikri] oluştur"
```

3. **Karar sorularını cevapla**

4. **Spec-Kit oluşsun**

5. **Tadını çıkar!** 🎉

---

**AppCreator v2.0 - Never Lose Context, Always Build Better!** 🚀

*Last Updated: 2025-11-19*
*Version: 2.0.0*
*All 3 providers working, all 9 tools ready!*



** Sisteme Sorulan soru ve ardından alınan cevaplar
 Şimdi burada merak ettiğim husus şu: been klavuzun tamamını okudum. Bu klavuza göre proje oluşturmak istediğimde
AppCreator klasörü içinde yeni bi yeni proje oluşturuluyor demi? Rehberde spec kit dosyaları oluşturulduktan sonra
backend dosyalarının claude desktop ile oluşturulmasına ilişkin bişeyler yazmışsın. Bunun yerine ben Spec kit
dosyaları vs oluşturuldukan sonra bunu claude code ile açsam ve orada backend işlemi gerçekleştirildikten sonra
yine
 MCP üzerinden diğer işlemlerin gerçekleştirilmesi için gerekli iş ve işlemleri yapsam? Yada başka bi soru daha
sorayım. Ben bu MCP'yi vs code'a entegre edebiliyor muyum? oraya entegre etsem ve proje kök dizini içerisinde
claude code vs kullanarak projeyi ayağa kaldırabilme durumum mümkün mü?

● Harika sorular! Tek tek cevaplayayım:

  📁 Proje Nereye Oluşturulur?

  HAYIR! AppCreator klasörü içine değil - sen nerede istersen oraya oluşturur!

  Örnek:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Claude Desktop'ta:
  "C:\Users\serha\Projects\ dizininde AppCreator start_project
  aracını kullanarak bir e-ticaret sitesi oluştur"

  Sonuç:
  C:\Users\serha\Projects\
  ├── e-commerce-site/      ← Buraya oluşturulur!
      ├── docs/
      ├── src/
      ├── PROJECT.poml
      └── ...

  ---
  🔄 Backend için Claude Code Kullanma (MÜKEMMEL FIKIR!)

  EVET, kesinlikle! Hatta bu en iyi yöntem!

  Önerilen Hibrit Workflow:

  1️⃣ PHASE 1-2: Claude Desktop (AppCreator)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Claude Desktop:
  "AppCreator start_project kullan"
  → Karar matrisi
  → Spec-Kit oluşturulur
  → docs/ klasörü hazır

  Dosyalar:
  C:\Users\serha\Projects\my-project\
  ├── docs/
  │   ├── CONSTITUTION.md
  │   ├── SPECIFICATION.md
  │   ├── TECHNICAL_PLAN.md
  │   └── TASKS.md
  ├── PROJECT.poml
  └── .appcreator/


  2️⃣ PHASE 3: Claude Code (Backend Development)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Terminal:
  cd C:\Users\serha\Projects\my-project
  [Claude Code ile aç]

  Claude Code'da:
  "docs/TASKS.md dosyasına göre backend kodunu yaz.
  SPECIFICATION.md'ye göre API'leri oluştur."

  → src/ klasörü oluşturulur
  → Backend kodu yazılır
  → package.json oluşturulur


  3️⃣ PHASE 4: Claude Desktop (API Tests)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Claude Desktop:
  "C:\Users\serha\Projects\my-project dizininde
  AppCreator generate_api_tests aracını kullan"

  → postman/ klasörü oluşturulur
  → API testleri hazır


  4️⃣ PHASE 5: Claude Code (Test & Fix)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Claude Code'da geliştirmeye devam


  5️⃣ PHASE 6: Claude Desktop (Frontend & BDD)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Claude Desktop:
  "generate_frontend_prompt kullan"
  "generate_bdd_tests kullan"

  ---
  🔌 VS Code'a MCP Entegrasyonu

  MAALESEF HAYIR - MCP şu anda sadece Claude Desktop ile çalışıyor.

  Neden?

  MCP (Model Context Protocol):
  ━━━━━━━━━━━━━━━━━━━━━━━━━━
  - Anthropic'in geliştirdiği protokol
  - Sadece Claude Desktop destekliyor
  - VS Code entegrasyonu YOK (henüz)
  - GitHub Copilot farklı bir sistem kullanıyor

  Ama Çözüm Var! (En İyi Yöntem)

  ┌──────────────────────────────────────────────────┐
  │  PHASE 1-2: Planning & Spec                     │
  │  Tool: Claude Desktop + AppCreator MCP             │
  │  ───────────────────────────────────────────────│
  │  • start_project → Decision matrix              │
  │  • approve_architecture → Spec-Kit              │
  │  • Dosyalar oluşturulur                         │
  └──────────────────────────────────────────────────┘
                      ↓
  ┌──────────────────────────────────────────────────┐
  │  PHASE 3: Backend Development                   │
  │  Tool: Claude Code (Terminal)                   │
  │  ───────────────────────────────────────────────│
  │  cd C:\Users\serha\Projects\my-project           │
  │  [Claude Code başlat]                           │
  │  • Backend kod yazılır                          │
  │  • API'ler implement edilir                     │
  │  • Tests yazılır                                │
  └──────────────────────────────────────────────────┘
                      ↓
  ┌──────────────────────────────────────────────────┐
  │  PHASE 4: API Testing                           │
  │  Tool: Claude Desktop + AppCreator MCP             │
  │  ───────────────────────────────────────────────│
  │  • generate_api_tests → Postman collections    │
  │  • Newman testleri çalıştır                    │
  └──────────────────────────────────────────────────┘
                      ↓
  ┌──────────────────────────────────────────────────┐
  │  PHASE 5: Bug Fixes & Iteration                 │
  │  Tool: Claude Code (Terminal)                   │
  │  ───────────────────────────────────────────────│
  │  • API testlerindeki hataları düzelt           │
  │  • Yeni featurelar ekle                        │
  └──────────────────────────────────────────────────┘
                      ↓
  ┌──────────────────────────────────────────────────┐
  │  PHASE 6: Frontend & BDD                        │
  │  Tool: Claude Desktop + AppCreator MCP             │
  │  ───────────────────────────────────────────────│
  │  • generate_frontend_prompt                    │
  │  • generate_bdd_tests                          │
  └──────────────────────────────────────────────────┘

  ---
  💡 Pratik Kullanım Senaryosu

  Senaryo: E-Ticaret Sitesi Yapıyorsun

  Adım 1: Claude Desktop (5 dakika)
  Sen:
  "C:\Users\serha\Projects\ dizininde AppCreator-Gemini
  start_project aracını kullanarak bir e-ticaret sitesi oluştur"

  AppCreator:
  → Karar matrisi soruları
  → Sen cevapla
  → Spec-Kit oluşturulur

  Dosyalar:
  C:\Users\serha\Projects\e-commerce-site\
  ├── docs/
  │   ├── SPECIFICATION.md (15 sayfa detaylı gereksinim!)
  │   ├── TASKS.md (22 task!)
  │   └── ...
  └── PROJECT.poml

  Adım 2: Claude Code (2-3 saat)
  Terminal:
  cd C:\Users\serha\Projects\e-commerce-site
  [Claude Code başlat]

  Claude Code'da:
  "docs/SPECIFICATION.md ve docs/TASKS.md'ye göre
  backend kodunu yaz. Express + PostgreSQL kullan."

  → src/ klasörü oluşturulur
  → API routes yazılır
  → Database models yazılır
  → package.json hazırlanır

  Sonuç:
  e-commerce-site/
  ├── docs/ (değişmedi)
  ├── src/          ← YENİ!
  │   ├── routes/
  │   ├── models/
  │   ├── controllers/
  │   └── server.js
  ├── package.json  ← YENİ!
  └── PROJECT.poml

  Adım 3: Claude Desktop (2 dakika)
  Claude Desktop:
  "C:\Users\serha\Projects\e-commerce-site dizininde
  AppCreator generate_api_tests aracını kullan"

  → postman/ klasörü oluşturulur
  → 15 endpoint test hazır
  → Newman komutları hazır

  Test et:
  npm install -g newman
  newman run postman/collection.json -e postman/dev.environment.json

  Adım 4: Claude Code (1-2 saat)
  Claude Code'da:
  "API testlerinde 3 hata var, düzelt"

  → Hatalar düzeltilir
  → Yeni testler yazılır

  Adım 5: Claude Desktop (2 dakika)
  Claude Desktop:
  "generate_frontend_prompt kullan - Lovable, modern, dark, purple"

  → docs/FRONTEND_PROMPT.md oluşturulur
  → Kopyala → Lovable'a yapıştır → Frontend hazır!

  ---
  🎯 Özet

  ✅ Yapabileceklerin:

  1. Proje nereye olursa olsun oluşturabilirsin
    - AppCreator klasörü içine DEĞİL
    - İstediğin dizine!
  2. Claude Code ile backend yazabilirsin (EN İYİ YÖNTEM!)
    - AppCreator Spec-Kit oluşturur
    - Claude Code backend yazar
    - AppCreator API testleri oluşturur
  3. İkisini birlikte kullanabilirsin (HİBRİT)
    - Planning: Claude Desktop + AppCreator
    - Development: Claude Code
    - Testing/Frontend: Claude Desktop + AppCreator

  ❌ Yapamayacakların:

  1. VS Code'a MCP entegrasyonu YOK
    - Sadece Claude Desktop destekliyor
    - Ama Claude Code (terminal) kullanabilirsin!
  2. AppCreator ile backend kodu yazamazsın
    - AppCreator sadece planning/testing tools
    - Kod yazmak için Claude Code kullan

  ---
  🚀 En İyi Workflow (Önerim)

  1. Claude Desktop → AppCreator start_project
     (Spec-Kit oluştur - 5 dakika)

  2. Claude Code → Backend geliştirme
     (Kod yaz - 2-3 saat)

  3. Claude Desktop → AppCreator generate_api_tests
     (Test oluştur - 2 dakika)

  4. Terminal → Newman testleri çalıştır
     (Test et - 5 dakika)

  5. Claude Code → Hataları düzelt
     (Bug fix - 1 saat)

  6. Claude Desktop → AppCreator generate_frontend_prompt
     (Frontend prompt - 2 dakika)

  7. Lovable → Frontend oluştur
     (Prompt yapıştır - 10 dakika)

  8. Claude Desktop → AppCreator generate_bdd_tests
     (BDD testleri - 2 dakika)

  TOPLAM: ~4-5 saat tam proje!

  Bu şekilde en verimli şekilde kullanırsın! 🎯
