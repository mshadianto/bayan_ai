# BPKH Limited - RAG Agentic AI Platform

![BPKH Limited](https://img.shields.io/badge/BPKH-Limited-teal?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

> Platform AI terintegrasi untuk layanan haji & umrah di Arab Saudi dengan 9 fitur interaktif dalam single HTML file.

## Live Demo

| Platform | URL |
|----------|-----|
| **Netlify** | [app-bpkh-limited.netlify.app](https://app-bpkh-limited.netlify.app/) |
| **GitHub Pages** | [mshadianto.github.io/bayan_ai](https://mshadianto.github.io/bayan_ai/) |

---

## Fitur Interaktif

| # | Fitur | Deskripsi | API |
|---|-------|-----------|-----|
| 1 | **AI Chatbot** | Asisten AI bilingual (AR/ID/EN) | Groq Llama 3.3 70B |
| 2 | **WhatsApp Bot** | Simulasi percakapan bilingual | - |
| 3 | **Live Charts** | Grafik KPI & Budget animasi | Chart.js |
| 4 | **Peta Hotel** | Lokasi hotel dekat Masjidil Haram | Leaflet.js + OpenStreetMap |
| 5 | **QR Booking** | Generate QR code konfirmasi | QRCode.js |
| 6 | **Jadwal Sholat** | Waktu sholat Mekkah real-time | Aladhan API |
| 7 | **Cuaca Live** | Cuaca Mekkah & Madinah | Open-Meteo API |
| 8 | **Kalkulator Kurs** | Konversi SAR ↔ IDR | ExchangeRate API |
| 9 | **Kalender Hijriyah** | Tanggal penting Islam | Aladhan API |

---

## Tech Stack

```
Frontend:     React 18 + Tailwind CSS (CDN)
AI/LLM:       Groq API (Llama 3.3 70B) - Free Tier
Maps:         Leaflet.js + OpenStreetMap
Charts:       Chart.js
QR Code:      QRCode.js
APIs:         Aladhan, Open-Meteo, ExchangeRate
Deployment:   Single HTML File (~2300 lines)
```

---

## Quick Start

### 1. Buka Langsung di Browser
```bash
# Double-click file index.html
# Atau drag & drop ke browser
```

### 2. Local Server (Opsional)
```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```

### 3. Aktifkan AI Chatbot
Edit `index.html` baris 117:
```javascript
GROQ_API_KEY: 'your-api-key-here',
```
Dapatkan API key gratis di: [console.groq.com/keys](https://console.groq.com/keys)

---

## Deployment

### Netlify (Drag & Drop)
1. Buka [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag folder project ke area upload
3. Done!

### GitHub Pages
1. Push ke repository GitHub
2. Settings → Pages → Source: `gh-pages` branch
3. Done!

### Vercel
```bash
npx vercel
```

---

## Struktur File

```
bayan_ai/
├── index.html                    # Main app (2300+ lines)
├── CLAUDE.md                     # Project documentation
├── DEPLOY.md                     # Deployment guide
├── README.md                     # This file
├── bpkh-limited-rag-solution.jsx # Original React component
└── Transformasi_Digital_BPKH-Limited.html # Training curriculum
```

---

## Screenshots

### Dashboard Overview
- 9 tombol fitur interaktif
- Live forex rate SAR-IDR
- Architecture diagram

### AI Chatbot
- Bilingual support (Arabic/Indonesian/English)
- Powered by Groq Llama 3.3 70B
- Context-aware responses

### Peta Hotel
- Interactive map centered on Masjidil Haram
- 5 hotel markers dengan popup info
- Distance & price display

### Kalender Hijriyah
- Current Hijri date
- 12 bulan Hijriyah
- Tanggal penting Islam

---

## API Reference

| API | Purpose | Cost |
|-----|---------|------|
| [Groq](https://console.groq.com) | LLM (Llama 3.3 70B) | Free tier |
| [Aladhan](https://aladhan.com/prayer-times-api) | Prayer times & Hijri | Free |
| [Open-Meteo](https://open-meteo.com) | Weather data | Free |
| [ExchangeRate](https://exchangerate-api.com) | Currency rates | Free |

---

## Domain Context

**BPKH Limited** adalah anak perusahaan BPKH (Badan Pengelola Keuangan Haji) yang beroperasi di Arab Saudi dengan 4 lini bisnis:

- **Akomodasi**: Hotel di Mekkah & Madinah
- **Transportasi**: Bus shuttle jamaah
- **Tiket Kereta**: Haramain High Speed Railway
- **Katering**: Makanan halal berkualitas

---

## Credits

- **Developer**: MS Hadianto | Audit Committee BPKH
- **AI Assistant**: Claude Opus 4.5 (Anthropic)
- **Icons**: Native Emoji
- **Maps**: OpenStreetMap Contributors

---

## License

MIT License - Feel free to use and modify.

---

<p align="center">
  <b>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</b><br>
  <i>Transformasi Digital Layanan Jamaah Haji & Umrah</i>
</p>
