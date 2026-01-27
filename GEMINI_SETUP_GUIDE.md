# Gemini API Kurulum Rehberi

API key'in çalışmıyor çünkü **Generative Language API** henüz aktif değil veya yanlış yöntemle key oluşturulmuş.

---

## ✅ Doğru Kurulum Adımları

### Yöntem 1: Google AI Studio (Önerilen - Daha Kolay)

1. **Google AI Studio'ya git:**
   ```
   https://aistudio.google.com/app/apikey
   ```

2. **"Create API Key" butonuna tık**

3. **Yeni bir Google Cloud projesi seç veya oluştur**

4. **API key oluşturulduğunda, otomatik olarak şu API'ler aktif edilir:**
   - Generative Language API
   - AI Platform API

5. **API key'i kopyala ve sakla**

**Not:** AI Studio'dan oluşturulan key'ler otomatik olarak doğru API'leri aktifleştirir!

---

### Yöntem 2: Google Cloud Console (Manuel)

Eğer Cloud Console'dan yapıyorsan:

1. **Google Cloud Console'a git:**
   ```
   https://console.cloud.google.com
   ```

2. **Proje seç veya oluştur**

3. **Generative Language API'yi aktifleştir:**
   ```
   https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
   ```
   - "ENABLE" butonuna tık
   - Birkaç saniye bekle

4. **API Key oluştur:**
   - Sol menüden "APIs & Services" → "Credentials"
   - "CREATE CREDENTIALS" → "API key"
   - Key oluşturuldu!

5. **API Key kısıtlamalarını kontrol et:**
   - Oluşturulan key'e tık
   - "API restrictions" kısmını kontrol et
   - "Don't restrict key" seçili olmalı (veya "Generative Language API" seçili)
   - "Application restrictions" → "None" olmalı

---

## 🔍 Mevcut Sorun

Şu anda aldığımız hata:
```
404 Not Found - models/gemini-xxx is not found for API version v1beta
```

Bu şu anlama geliyor:
- ❌ Generative Language API aktif değil
- ❌ Veya API key yanlış proje için oluşturulmuş
- ❌ Veya API key kısıtlamaları var

---

## ✅ Çözüm

### Seçenek A: Google AI Studio'dan Yeni Key (EN KOLAY)

1. https://aistudio.google.com/app/apikey adresine git
2. Mevcut key'i sil
3. "Create API Key" ile yeni key oluştur
4. YENİ bir Google Cloud projesi seç (veya oluştur)
5. Key oluşturulmasını bekle
6. Oluşan key'i test et

### Seçenek B: Mevcut Key'i Düzelt

1. https://console.cloud.google.com/apis/credentials adresine git
2. API key'ine tık (`AIzaSyDvI2u7NC9TImGCfq-MY3v-pwO_7e2DtqY`)
3. Şunları kontrol et:
   - **API restrictions:** "Don't restrict key" veya "Generative Language API" seçili
   - **Application restrictions:** "None"
4. Save → Key'in güncellenmesi için 5 dakika bekle

5. https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
6. Eğer "MANAGE" yazıyorsa zaten aktif
7. Eğer "ENABLE" yazıyorsa, tıkla ve aktifleştir

---

## 🧪 Test Komutu

Key'i düzelttikten sonra test et:

```bash
node test-new-gemini-key.js
```

Başarılı olursa göreceksin:
```
🎉 SUCCESS! Gemini API is working!
✅ Working Model: gemini-1.5-flash-latest
✅ Response: "Hello from Gemini"
```

---

## 💡 Alternatif: Vertex AI Kullan

Eğer Gemini API çalışmıyorsa, Vertex AI de kullanabilirsin:

1. Vertex AI'da yeni bir adapter yaz
2. `@google-cloud/vertexai` paketi kullan
3. Proje ID ve location gerekir

Ama şimdilik standart Gemini API'yi çalıştırmaya odaklanalım!

---

## 📝 Hangi Yöntemi Denedin?

Şu ana kadar:
- ✅ Google Cloud'dan API key aldın
- ✅ $5 kredi yükledin
- ✅ Vertex AI ve Generative Language API'yi aktifleştirdin (dediklerine göre)
- ❌ Ama hâlâ 404 hatası alıyoruz

**Muhtemelen sorun:** API key farklı bir proje için oluşturulmuş veya API restrictions var.

---

## 🎯 Şimdi Ne Yapmalısın?

**Önerim:** Google AI Studio'dan TAMAMEN YENİ bir key oluştur:

1. https://aistudio.google.com/app/apikey
2. "Create API Key" → "Create API key in new project"
3. Yeni proje adı ver (örn: "devforge-gemini")
4. Key oluşturulmasını bekle
5. Yeni key'i bana gönder, test edelim!

Bu yöntem %90 işe yarar çünkü AI Studio otomatik olarak gerekli API'leri aktifleştirir!

---

**Test etmeye hazırım! Yeni key oluşturursan hemen test ederiz.** 🚀
