# Panduan Deploy LIVE DEMO - BPKH Limited RAG Platform

## Cara Tercepat: Buka Langsung di Browser

```
1. Double-click file: index.html
2. Atau drag & drop ke browser (Chrome/Edge/Firefox)
```

Demo akan langsung berjalan tanpa server!

---

## Deploy ke Hosting GRATIS (Online)

### Opsi 1: GitHub Pages (Recommended)

```bash
# 1. Buat repository baru di GitHub
# 2. Upload file index.html

# Atau via command line:
git init
git add index.html
git commit -m "BPKH Limited RAG Demo"
git branch -M main
git remote add origin https://github.com/USERNAME/bpkh-demo.git
git push -u origin main

# 3. GitHub > Settings > Pages > Source: main branch
# 4. Demo live di: https://USERNAME.github.io/bpkh-demo/
```

### Opsi 2: Netlify (Drag & Drop)

1. Buka https://app.netlify.com/drop
2. Drag folder "BPKH Limited" ke area upload
3. Tunggu deploy selesai
4. Demo live dengan URL netlify otomatis!

### Opsi 3: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd "C:\BPKH Limited"
vercel

# Ikuti prompt, demo akan live!
```

### Opsi 4: Cloudflare Pages

1. Buka https://pages.cloudflare.com/
2. Connect ke GitHub repo
3. Build settings: kosongkan (static HTML)
4. Deploy!

---

## Untuk LIVE DEMO Presentasi

### Local Server (Opsional, untuk development)

```bash
# Python (jika terinstall)
cd "C:\BPKH Limited"
python -m http.server 8000
# Buka: http://localhost:8000

# Node.js (jika terinstall)
npx serve .
# Buka: http://localhost:3000
```

### Tips Presentasi
- Gunakan Chrome/Edge untuk performa terbaik
- Tekan F11 untuk fullscreen
- Koneksi internet diperlukan (CDN resources)

---

## Struktur File

```
BPKH Limited/
├── index.html          <- Demo utama (buka ini!)
├── CLAUDE.md           <- Dokumentasi teknis
├── DEPLOY.md           <- Panduan ini
├── bpkh-limited-rag-solution.jsx  <- Source component
└── Transformasi_Digital_BPKH-Limited.html  <- Training curriculum
```

## Resources (CDN - Free Tier)
- React 18: unpkg.com
- Tailwind CSS: cdn.tailwindcss.com
- Babel: unpkg.com

Total bandwidth: ~500KB per load
