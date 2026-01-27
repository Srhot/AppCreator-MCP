# 🏭 AppCreator MCP - Kapsamlı Kullanım Rehberi

**Versiyon:** 2.1
**Son Güncelleme:** 2025-01-27
**Hedef Kitle:** Başlangıçtan ileri seviyeye tüm kullanıcılar

---

## 📋 İçindekiler

1. [Hızlı Başlangıç](#hızlı-başlangıç)
2. [Smart Workflow (Önerilen)](#smart-workflow-önerilen)
3. [Standard Workflow (İleri Seviye)](#standard-workflow-ileri-seviye)
4. [NotebookLM Entegrasyonu](#notebooklm-entegrasyonu)
5. [Prompt Şablonları](#prompt-şablonları)
6. [Best Practices](#best-practices)
7. [Sorun Giderme](#sorun-giderme)
8. [Gerçek Dünya Örnekleri](#gerçek-dünya-örnekleri)

---

## 🚀 Hızlı Başlangıç

### Ön Gereksinimler

```bash
# 1. Claude Desktop yüklü olmalı
# 2. AppCreator MCP kurulu ve aktif olmalı
# 3. AI API Key tanımlı olmalı (ANTHROPIC_API_KEY)
```

### İlk Projenizi 5 Dakikada Oluşturun

```javascript
// Claude Desktop'ta bu prompt'u kullanın:

"AppCreator MCP kullanarak basit bir todo uygulaması oluştur.
Web tabanlı olsun, görev ekleme/silme/düzenleme özellikleri olsun."
```

Claude otomatik olarak doğru workflow'u seçer ve size rehberlik eder.

---

## 🤖 Smart Workflow (Önerilen)

**Ne zaman kullanmalı:** Her durumda! Özellikle:
- Yeni başlıyorsanız
- Teknik detaylarla uğraşmak istemiyorsanız
- Hızlı prototip istiyorsanız
- NotebookLM'de hazır dokümantasyon varsa

### Workflow Adımları

```
1. PROMPT VER → 2. İNCELE → 3. ONAYLA → 4. HAZIR! 🎉
   (2 dakika)    (5 dakika)   (1 tık)     (Otomatik)
```

---

## 📝 PROMPT ŞABLONLARI

### 🟢 SENARYO 1: NotebookLM VAR (Önerilen!)

**Ne zaman:** Projeniz hakkında PDF, Word, web sayfası gibi dokümantasyon varsa

#### Adım 1: NotebookLM Hazırlığı

```
1. NotebookLM'e git: https://notebooklm.google.com
2. Yeni Notebook oluştur
3. Dokümantasyonunu yükle:
   - PDF'ler
   - Word dokümanları
   - Excel tabloları
   - Web sayfaları (URL)
   - Metin notları
4. Notebook'a açıklayıcı isim ver (örn: "E-Ticaret Projesi Dokümanları")
```

#### Adım 2: Prompt Şablonu

```javascript
// ===== ŞABLON 1.1: TAM ÖZELLİKLİ =====

AppCreator MCP'yi kullanarak proje oluşturmak istiyorum.

analyze_project_requirements aracını kullan:

{
  "project_name": "e-ticaret-sistemi",
  "project_type": "web",
  "description": "Küçük işletmeler için e-ticaret platformu. Ürün yönetimi, sipariş takibi, ödeme entegrasyonu içerecek. Kullanıcı ve admin panelleri olacak.",
  "features": [
    "Ürün katalog yönetimi (CRUD)",
    "Sepet sistemi",
    "Ödeme entegrasyonu (iyzico)",
    "Sipariş takip sistemi",
    "Kullanıcı kayıt/giriş",
    "Admin panel",
    "Raporlama"
  ],
  "notebook_name": "E-Ticaret Projesi Dokümanları",
  "expected_users": 500,
  "data_volume": "medium",
  "branches": ["Ankara", "Istanbul", "Izmir"]
}
```

**Açıklama:**
- `project_name`: Proje klasör adı (tire veya underscore kullanın)
- `project_type`: web, api, cli, desktop, mobile, library
- `description`: Ne yaptığını 2-3 cümle ile anlat
- `features`: Özellikleri madde madde listele
- `notebook_name`: NotebookLM'deki notebook'un TAM adı
- `expected_users`: Kaç kullanıcı bekliyorsun? (scale detection için)
- `data_volume`: small/medium/large/massive
- `branches`: Farklı lokasyonlar varsa (dağıtık sistem gerekli mi?)

#### Adım 3: Analiz Sonuçlarını İnceleme

AI size şöyle bir özet sunacak:

```
✅ PROJECT ANALYSIS COMPLETE

📋 PROJECT DETAILS:
  • Name: e-ticaret-sistemi
  • Type: web
  • Scale: LARGE
  • NotebookLM: ✓ Using "E-Ticaret Projesi Dokümanları"

🎯 AI RECOMMENDATIONS:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗄️  DATABASE RECOMMENDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PostgreSQL

📊 RATIONALE:
  1. 500 concurrent users için ACID compliance critical
  2. Complex queries (products, orders, users) için relational DB ideal
  3. Transaction safety needed (payment operations)

🔄 ALTERNATIVES:
  • MongoDB: Schema flexibility var ama ACID garantisi zayıf
  • MySQL: Uygun ama PostgreSQL kadar advanced features yok

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏗️  ARCHITECTURE RECOMMENDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Modular Monolith

📊 RATIONALE:
  1. 500 users için microservices overhead gereksiz
  2. Modules: Products, Orders, Payments, Auth, Admin
  3. Scale etmeye başlarsan microservices'e geçiş kolay

🔄 ALTERNATIVES:
  • Microservices: Over-engineering olur bu aşamada
  • Pure Monolith: Kod karmaşası yaratır

[... Authentication, Frontend önerileri devam eder ...]
```

**ÖNEMLİ:** Önerileri dikkatlice okuyun! AI neden o teknolojiyi seçtiğini açıklıyor.

#### Adım 4: Onaylama

```javascript
// Önerileri beğendiniz mi? Onaylayın:

create_project_from_analysis aracını kullan:

{
  "project_name": "e-ticaret-sistemi",
  "approved": true
}

// Beğenmediniz mi? Parametre değiştirip tekrar analyze_project_requirements çağırın
```

#### Adım 5: Sonuç

```
✅ PROJECT CREATED SUCCESSFULLY! 🎉

📁 PROJECT LOCATION
C:\Users\serha\OneDrive\Desktop\appcreator-projects\e-ticaret-sistemi

🎯 IMPLEMENTED RECOMMENDATIONS
  ✓ Database: PostgreSQL with ACID compliance
  ✓ Architecture: Modular Monolith (5 modules)
  ✓ Authentication: JWT + OAuth2
  ✓ Frontend: React + Material-UI

📄 GENERATED ARTIFACTS
  ✓ docs/CONSTITUTION.md
  ✓ docs/SPECIFICATION.md
  ✓ docs/TECHNICAL_PLAN.md
  ✓ docs/TASKS.md
  ✓ PROJECT.poml
  ✓ tests/postman/e-ticaret-sistemi.collection.json
  ✓ tests/features/*.feature
  ✓ frontend/a2ui-spec.json
  ✓ frontend/src/...

📊 PROJECT STATS
  • Scale: LARGE
  • Complexity: high
  • Duration: 4-6 weeks estimated
  • Tasks: 47 planned
  • Estimated Hours: 180
  • Features: 12
  • NotebookLM Coverage: 73.5%

🚀 QUICK START
1️⃣  BACKEND:
   cd C:\Users\serha\OneDrive\Desktop\appcreator-projects\e-ticaret-sistemi
   npm install
   npm run dev

2️⃣  FRONTEND:
   cd C:\Users\serha\OneDrive\Desktop\appcreator-projects\e-ticaret-sistemi\frontend
   npm install
   npm run dev
```

---

### 🔴 SENARYO 2: NotebookLM YOK (Fikir Aşamasında)

**Ne zaman:** Sadece bir fikriniz var, dokümantasyon yok

#### Adım 1: Prompt Şablonu

```javascript
// ===== ŞABLON 2.1: DETAYLI AÇIKLAMA =====

AppCreator MCP ile proje oluştur:

analyze_project_requirements aracını kullan:

{
  "project_name": "gorev-yoneticisi",
  "project_type": "web",
  "description": "Ekip için görev yönetim sistemi. Kanban board tarzı. Görevler oluşturulabilir, atanabilir, öncelik verilebilir. Zaman takibi olacak. Bildirimler gerçek zamanlı olacak. Raporlar oluşturulabilecek.",
  "features": [
    "Görev oluşturma ve atama",
    "Kanban board görünümü",
    "Görev önceliklendirme",
    "Zaman takibi (time tracking)",
    "Gerçek zamanlı bildirimler",
    "Ekip üye yönetimi",
    "Proje bazlı organizasyon",
    "Dashboard ve raporlar",
    "Yorumlar ve etiketler"
  ],
  "expected_users": 50,
  "data_volume": "small"
}
```

**ÖNEMLİ:** NotebookLM olmadan:
- `description` alanını MÜMKün olduğunca detaylı yazın
- `features` listesini eksiksiz yapın
- Teknik terimler kullanın (örn: "Kanban board", "real-time")
- Benzer sistemlere referans verin (örn: "Trello benzeri ama...")

#### Adım 2: Basit Proje İçin Minimal Prompt

```javascript
// ===== ŞABLON 2.2: MİNİMAL (Basit projeler için) =====

AppCreator MCP kullan:

analyze_project_requirements aracını kullan:

{
  "project_name": "basit-blog",
  "project_type": "web",
  "description": "Kişisel blog sitesi. Yazı yazabilme, kategorilere ayırma, yorum yapabilme özellikleri olsun.",
  "features": [
    "Yazı oluşturma/düzenleme",
    "Kategori sistemi",
    "Yorum yapabilme",
    "Admin panel"
  ]
}
```

**Not:** `expected_users` ve `data_volume` belirtmezseniz, AI description'dan tahmin eder.

---

## 📊 PROJE TİPLERİ VE ÖRNEKLER

### 1. Web Application (`"project_type": "web"`)

```javascript
// E-ticaret, Blog, SaaS, Dashboard, CMS, vb.
{
  "project_name": "crm-sistemi",
  "project_type": "web",
  "description": "Müşteri ilişkileri yönetimi. Lead tracking, müşteri kayıtları, satış pipeline.",
  "features": ["lead-management", "contact-database", "sales-pipeline", "reporting"]
}
```

### 2. API Server (`"project_type": "api"`)

```javascript
// RESTful API, GraphQL API, Microservice
{
  "project_name": "payment-api",
  "project_type": "api",
  "description": "Ödeme gateway API. İyzico ve PayTR entegrasyonu. Ödeme doğrulama ve webhook handling.",
  "features": ["payment-processing", "webhook-handling", "transaction-logging", "refund-support"]
}
```

### 3. Mobile App (`"project_type": "mobile"`)

```javascript
// React Native, Ionic
{
  "project_name": "fitness-tracker",
  "project_type": "mobile",
  "description": "Fitness takip uygulaması. Egzersiz kaydı, kalori takibi, hedef belirleme.",
  "features": ["exercise-logging", "calorie-tracking", "goal-setting", "progress-charts"]
}
```

### 4. CLI Tool (`"project_type": "cli"`)

```javascript
// Command-line araçları
{
  "project_name": "backup-tool",
  "project_type": "cli",
  "description": "Otomatik backup aracı. Dosyaları belirli aralıklarla yedekler. Cloud storage entegrasyonu.",
  "features": ["scheduled-backups", "cloud-sync", "compression", "restore-functionality"]
}
```

### 5. Desktop App (`"project_type": "desktop"`)

```javascript
// Electron, Tauri
{
  "project_name": "invoice-generator",
  "project_type": "desktop",
  "description": "Fatura oluşturma uygulaması. PDF export, şablon sistemi, müşteri veritabanı.",
  "features": ["invoice-creation", "pdf-export", "template-system", "customer-database"]
}
```

### 6. Library/Package (`"project_type": "library"`)

```javascript
// npm package, utility library
{
  "project_name": "turkish-id-validator",
  "project_type": "library",
  "description": "TC Kimlik No doğrulama kütüphanesi. Algoritma doğrulaması, format kontrolü.",
  "features": ["id-validation", "format-checking", "typescript-support", "zero-dependencies"]
}
```

---

## 🎯 PROJE ÖLÇEĞİ (SCALE) BELİRLEME

AI otomatik algılar ama sen de yönlendirebilirsin:

### Small Scale (Küçük Ölçek)
```javascript
{
  "expected_users": 10,      // < 50 kullanıcı
  "data_volume": "small",    // < 10K kayıt
  // Öneri: Monolithic, SQLite/PostgreSQL, Simple Auth
}
```

### Medium Scale (Orta Ölçek)
```javascript
{
  "expected_users": 200,     // 50-500 kullanıcı
  "data_volume": "medium",   // 10K-100K kayıt
  // Öneri: Modular Monolith, PostgreSQL, JWT Auth
}
```

### Large Scale (Büyük Ölçek)
```javascript
{
  "expected_users": 2000,    // 500-5K kullanıcı
  "data_volume": "large",    // 100K-1M kayıt
  // Öneri: Modular Monolith veya Microservices, PostgreSQL Cluster, OAuth2
}
```

### Enterprise Scale (Kurumsal Ölçek)
```javascript
{
  "expected_users": 20000,   // > 5K kullanıcı
  "data_volume": "massive",  // > 1M kayıt
  "branches": ["Ankara", "Istanbul", "Izmir", "Antalya"],
  // Öneri: Microservices, Distributed DB, Advanced Auth (SSO/SAML)
}
```

---

## 🔄 İŞ AKIŞI SONRASI NE YAPMALI?

### 1. Spec-Kit'i İnceleyin

```bash
# Proje klasörüne gidin
cd C:\Users\serha\OneDrive\Desktop\appcreator-projects\[PROJE_ADI]

# Docs klasörünü açın
cd docs

# 4 ana dokümanı okuyun:
# - CONSTITUTION.md (Proje vizyon ve prensipler)
# - SPECIFICATION.md (Fonksiyonel gereksinimler, data model, API design)
# - TECHNICAL_PLAN.md (Mimari, teknoloji stack, güvenlik planı)
# - TASKS.md (Tüm tasklar, öncelikler, bağımlılıklar)
```

### 2. POML Context'i Anlayın

```bash
# Ana klasörde PROJECT.poml dosyasını açın
# Bu dosya:
# - Projenin mevcut durumunu tutar
# - Her 20-25 task'te güncelenir (checkpoint)
# - Context kaybını önler
# - Claude Code'un projeyi anlamasını sağlar
```

### 3. Backend Geliştirmeye Başlayın

```javascript
// Claude Code'a şöyle prompt verin:

"PROJECT.poml dosyasını oku.
TASKS.md'deki ilk 5 backend task'ı sırayla implement et.
Her task'tan sonra complete_task aracını çağır."

// Claude Code:
// 1. Task T001'i okur
// 2. Kodu yazar
// 3. complete_task({project_name: "...", task_id: "T001"})
// 4. Task T002'ye geçer
// 5. Her 20-25 task'te otomatik checkpoint oluşturur
```

### 4. Testleri Çalıştırın

```bash
# API testleri (Postman)
cd tests/postman
# Collection'ı Postman'e import edin
# Veya Newman ile CLI'dan çalıştırın:
npm run test:api

# BDD testleri
npm run test:bdd
```

### 5. Frontend Geliştirin

```bash
cd frontend
npm install
npm run dev

# A2UI spec'e göre component'ler zaten oluşturulmuş
# Customize etmek için:
```

```javascript
// Claude Code'a:

"frontend/a2ui-spec.json'u oku.
ProductList component'ini Material-UI ile implement et.
Responsive olsun, dark mode desteği olsun."
```

### 6. Checkpoint Sistemi

```javascript
// Her 20-25 task sonunda otomatik checkpoint
// Manuel checkpoint için:

"create_checkpoint aracını kullan:
{
  project_name: 'e-ticaret-sistemi',
  completed_task_ids: ['T001', 'T002', 'T003', 'T004', 'T005'],
  current_task_id: 'T006',
  issues_encountered: []
}"

// POML güncellenir, continuation prompt oluşturulur
```

---

## ⚡ BEST PRACTICES

### ✅ YAPILMASI GEREKENLER

1. **NotebookLM Kullanın**
   - Tüm dokümantasyonu NotebookLM'e yükleyin
   - PDF, Word, Excel, web sayfaları
   - Daha iyi context = Daha iyi öneriler

2. **Detaylı Description Yazın**
   ```javascript
   // ❌ KÖTÜ:
   "description": "E-ticaret sitesi"

   // ✅ İYİ:
   "description": "Küçük işletmeler için e-ticaret platformu.
   Ürün katalog yönetimi, stok takibi, sipariş yönetimi,
   ödeme entegrasyonu (iyzico), kargo entegrasyonu içerecek.
   Hem müşteri hem admin paneli olacak. Mobil responsive olmalı."
   ```

3. **Features'ı Madde Madde Listeleyin**
   ```javascript
   // ❌ KÖTÜ:
   "features": ["e-ticaret özellikleri"]

   // ✅ İYİ:
   "features": [
     "Ürün CRUD (oluşturma, okuma, güncelleme, silme)",
     "Kategori ve alt kategori yönetimi",
     "Stok takibi ve uyarıları",
     "Sepet sistemi",
     "Sipariş yönetimi ve takibi",
     "Ödeme entegrasyonu (iyzico)",
     "Kargo entegrasyonu (MNG, Aras)",
     "Kullanıcı kayıt/giriş (email + sosyal medya)",
     "Admin dashboard",
     "Raporlama (satış, stok, kullanıcı)",
     "Email bildirimleri",
     "Mobil responsive tasarım"
   ]
   ```

4. **Scale Bilgisi Verin**
   ```javascript
   // Scale'i belirtirseniz daha doğru öneriler alırsınız
   "expected_users": 500,
   "data_volume": "medium"
   ```

5. **Spec-Kit'i Mutlaka Okuyun**
   - AI'ın önerilerini anlamak için
   - Projeyi kafanızda şekillendirmek için
   - Eksik/yanlış varsa düzeltmek için

6. **Checkpoint Alın**
   - Her 20-25 task'te otomatik
   - Major değişiklik öncesi manuel
   - Uzun development sessioni öncesi

7. **POML'yi Güncel Tutun**
   - complete_task kullanın
   - Context kaybını önler

### ❌ YAPILMAMASI GEREKENLER

1. **Belirsiz Prompt Vermeyin**
   ```javascript
   // ❌ KÖTÜ:
   "Bir web sitesi yap"

   // ✅ İYİ:
   "Blog sitesi yap. Yazı yaz, düzenle, kategori ekle, yorum yap"
   ```

2. **NotebookLM'i Atlamayın**
   - Varsa mutlaka kullanın
   - %60-80 daha iyi sonuç

3. **Spec-Kit'i Okumadan Kodlamaya Başlamayın**
   - AI'ın planını anlamadan kod yazmak = Kaos

4. **Checkpoint Sistemini Bypass Etmeyin**
   - Context kaybedersiniz
   - Büyük projeler için kritik

5. **Tüm Features'ı Bir Seferde İstemeyin**
   ```javascript
   // ❌ KÖTÜ:
   "features": ["50 tane özellik..."]

   // ✅ İYİ:
   // MVP (Minimum Viable Product) ile başla
   "features": ["Temel 5-7 özellik"]
   // Sonra add_feature_to_project ile ekle
   ```

---

## 🔧 SORUN GİDERME

### Sorun 1: "NotebookLM MCP server not available"

**Çözüm:**
```javascript
// 1. NotebookLM MCP kurulu mu kontrol et
// 2. Claude Desktop config'de tanımlı mı?
// 3. Yoksa graceful fallback çalışır, sorun değil
// Sistem NotebookLM olmadan da çalışır
```

### Sorun 2: "Project not found"

**Çözüm:**
```javascript
// analyze_project_requirements çağırdınız mı?
// create_project_from_analysis'den önce mutlaka analyze çağırın
```

### Sorun 3: AI Önerileri Yanlış

**Çözüm:**
```javascript
// Description ve features'ı daha detaylı yazın
// Scale parametrelerini düzeltin (expected_users, data_volume)
// Tekrar analyze_project_requirements çağırın
```

### Sorun 4: Context Kaybı

**Çözüm:**
```javascript
// PROJECT.poml dosyasını Claude Code'a verin:
"PROJECT.poml dosyasını oku ve projeyi anımsa."

// Veya .devforge/continuation-prompt.txt'yi kullanın
```

### Sorun 5: Build/Test Hatası

**Çözüm:**
```javascript
// Claude Code'a hatayı gösterin:
"Bu hatayı gördüm: [hata mesajı]
TASKS.md ve TECHNICAL_PLAN.md'ye göre düzelt."
```

---

## 🌟 GERÇEK DÜNYA ÖRNEKLERİ

### Örnek 1: E-Ticaret Platformu (NotebookLM + Detaylı)

```javascript
// NotebookLM'de hazır:
// - İş Gereksinimleri.pdf
// - Database Şeması.xlsx
// - UI Mockup'lar (Figma export)

analyze_project_requirements({
  "project_name": "beyaz-esya-eticaret",
  "project_type": "web",
  "description": "Beyaz eşya satan e-ticaret platformu. B2C model. Ürünler kategorilere ayrılmış (buzdolabı, çamaşır makinesi vb). Teknik özellikler detaylı gösterilecek. Taksit sistemi olacak. Kargo takibi olacak. Müşteri yorumları ve puanlama sistemi. Admin panelden stok, fiyat, kampanya yönetimi.",
  "features": [
    "Ürün katalog yönetimi (kategori, marka, model)",
    "Detaylı ürün sayfası (teknik özellikler, görseller, videolar)",
    "Sepet ve favoriler",
    "Ödeme (kredi kartı taksit, havale)",
    "Kargo entegrasyonu ve takip",
    "Kullanıcı kayıt/giriş",
    "Yorum ve puanlama sistemi",
    "Admin panel (ürün, sipariş, stok, kampanya yönetimi)",
    "Kampanya ve indirim sistemi",
    "Email bildirimleri (sipariş onay, kargo)",
    "Raporlama (satış, ürün, müşteri analizleri)"
  ],
  "notebook_name": "Beyaz Eşya E-Ticaret Dokümanları",
  "expected_users": 1000,
  "data_volume": "large",
  "branches": ["Ankara", "Istanbul", "Izmir"]
})

// Sonuç:
// ✓ Scale: LARGE
// ✓ DB: PostgreSQL (ACID, complex queries)
// ✓ Architecture: Modular Monolith (modules: Products, Orders, Payments, Users, Admin)
// ✓ Auth: JWT + OAuth2 (Google, Facebook login)
// ✓ Frontend: React + Material-UI
// ✓ Coverage: 81.2% (NotebookLM'den)
```

### Örnek 2: Basit Blog (NotebookLM YOK)

```javascript
analyze_project_requirements({
  "project_name": "kisisel-blog",
  "project_type": "web",
  "description": "Kişisel blog sitesi. Markdown ile yazı yazabilme. Kategorilere ayırma. Etiket sistemi. Yorum yapabilme (Disqus entegrasyonu). RSS feed. SEO friendly URL'ler. Admin panel.",
  "features": [
    "Markdown ile yazı yazma",
    "Kategori sistemi",
    "Etiket (tag) sistemi",
    "Yorum (Disqus)",
    "RSS feed",
    "SEO (meta tags, sitemap)",
    "Admin panel",
    "Responsive tasarım"
  ]
})

// Sonuç:
// ✓ Scale: SMALL
// ✓ DB: PostgreSQL (yeterli, basit)
// ✓ Architecture: Monolithic (basit proje)
// ✓ Auth: JWT (admin için)
// ✓ Frontend: React + Tailwind CSS
```

### Örnek 3: Mobil Fitness App (Detaylı)

```javascript
analyze_project_requirements({
  "project_name": "fitness-tracker",
  "project_type": "mobile",
  "description": "Fitness takip mobil uygulaması. Egzersiz planları oluşturabilme. Kalori takibi (yemek kaydı). Ağırlık takibi (grafikler). Hedef belirleme (kilo kaybı, kas kütlesi artırma). Progress tracking. Social feed (arkadaşlarını takip et). Bildirimler (egzersiz hatırlatıcıları).",
  "features": [
    "Egzersiz planı oluşturma",
    "Egzersiz kaydı (set, tekrar, ağırlık)",
    "Kalori takibi (yemek database)",
    "Ağırlık takibi ve grafikler",
    "Hedef belirleme ve progress tracking",
    "Social feed (arkadaş takibi)",
    "Bildirimler (push notifications)",
    "Profil ve istatistikler",
    "Dark mode"
  ],
  "expected_users": 5000,
  "data_volume": "medium"
})

// Sonuç:
// ✓ Scale: LARGE (5000 user)
// ✓ DB: PostgreSQL + Redis (cache için)
// ✓ Architecture: Modular Monolith (API + Mobile)
// ✓ Auth: JWT + Social Login
// ✓ Frontend: React Native + NativeBase
// ✓ Push: Firebase Cloud Messaging
```

### Örnek 4: REST API (Microservice)

```javascript
analyze_project_requirements({
  "project_name": "notification-service",
  "project_type": "api",
  "description": "Bildirim servisi microservice. Email, SMS, push notification gönderebilme. Template sistemi. Queue sistemi (RabbitMQ). Retry mekanizması. Delivery status tracking. Rate limiting. Webhook desteği.",
  "features": [
    "Email gönderme (SMTP, SendGrid)",
    "SMS gönderme (Netgsm, İleti Merkezi)",
    "Push notification (Firebase)",
    "Template sistemi (Handlebars)",
    "Queue management (RabbitMQ)",
    "Retry mekanizması",
    "Delivery tracking",
    "Rate limiting",
    "Webhook support",
    "API authentication (API Key)"
  ],
  "expected_users": 100,
  "data_volume": "massive"
})

// Sonuç:
// ✓ Scale: ENTERPRISE (massive data)
// ✓ DB: PostgreSQL + MongoDB (logs için)
// ✓ Architecture: Microservice (single responsibility)
// ✓ Queue: RabbitMQ
// ✓ Auth: API Key + Rate Limiting
```

---

## 📚 EK KAYNAKLAR

### Oluşturulan Dosyalar

```
appcreator-projects/
└── [project-name]/
    ├── docs/
    │   ├── CONSTITUTION.md       # Proje vizyon, prensipler
    │   ├── SPECIFICATION.md       # Fonksiyonel gereksinimler, data model, API
    │   ├── TECHNICAL_PLAN.md      # Mimari, teknoloji stack, güvenlik
    │   ├── TASKS.md               # Tüm tasklar, öncelikler
    │   ├── API_TESTING_GUIDE.md   # Postman/Newman kullanımı
    │   └── FRONTEND_GUIDE.md      # A2UI kullanımı
    ├── tests/
    │   ├── postman/
    │   │   ├── [project].collection.json
    │   │   └── environments/
    │   └── features/              # BDD/Cucumber tests
    ├── frontend/
    │   ├── a2ui-spec.json         # A2UI declarative spec
    │   └── src/                   # React/Vue components
    ├── .devforge/
    │   ├── state.json             # Proje durumu
    │   └── continuation-prompt.txt # Context recovery prompt
    └── PROJECT.poml               # POML context preservation
```

### Faydalı Komutlar

```bash
# Proje durumu
npm run status

# API testleri
npm run test:api

# BDD testleri
npm run test:bdd

# Frontend
cd frontend && npm run dev

# Backend
npm run dev

# Build
npm run build

# Deployment (gelecek versiyon)
npm run deploy
```

---

## 🎓 İLERİ SEVİYE KULLANIM

### Feature Ekleme (Manuel - Gelecekte Tool Olacak)

```javascript
// Şimdilik Claude Code'a:

"PROJECT.poml'i oku.
Projeye yeni feature ekle: 'Kullanıcı profil fotoğrafı yükleme'

1. SPECIFICATION.md'yi güncelle (yeni endpoint)
2. TASKS.md'ye yeni tasklar ekle
3. Backend endpoint'i yaz (POST /api/users/avatar)
4. Frontend component'i yaz (AvatarUpload.tsx)
5. Test yaz
6. POML'i güncelle"
```

### Checkpoint Recovery

```bash
# Context kaybettiyseniz:

# 1. Continuation prompt'u kullanın
cat .devforge/continuation-prompt.txt

# 2. Claude Code'a verin:
"[continuation-prompt içeriği]"

# 3. Veya POML'i direkt verin:
"PROJECT.poml dosyasını oku ve projeyi anımsa"
```

### Multi-Project Management

```javascript
// Aynı anda birden fazla proje
// Her proje kendi klasöründe

analyze_project_requirements({project_name: "proje-1", ...})
analyze_project_requirements({project_name: "proje-2", ...})

// Her biri bağımsız POML'e sahip
```

---

## 💬 DESTEK

### Hata Bulduysanız
- GitHub Issues: [repo-url]/issues
- POML dosyasını ve hata mesajını paylaşın

### Öneriniz Varsa
- Pull Request gönderin
- Yeni özellik önerileri için Discussion açın

### Dökümantasyon
- README.md: Genel bakış
- INTEGRATION_GUIDE.md: NotebookLM + A2UI detaylar
- Bu dosya: Kullanım rehberi

---

## 📝 VERSİYON NOTU

**v2.1 (2025-01-27):**
- ✅ Smart Workflow eklendi
- ✅ NotebookLM entegrasyonu
- ✅ A2UI frontend generation
- ✅ Otomatik scale detection
- ✅ AI-driven recommendations

**Gelecek Versiyonlar:**
- v2.2: Feature Factory tool
- v2.3: Self-healing tests
- v2.4: Auto-deployment
- v2.5: Code generation improvements

---

**Mutlu Kodlamalar! 🎉**

*AppCreator MCP ile fikirleri gerçeğe dönüştürün!*
