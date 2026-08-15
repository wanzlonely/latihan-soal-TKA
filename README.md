# TKA SMK Perhotelan - FINAL FULL SOURCE - Fokus Latihan Soal

Full source code lengkap 100% siap deploy ke Vercel + Upstash Redis.

## Fitur Final Fokus Latihan
- Fokus UI: Latihan Soal Only, clean, keren, enak dilihat
- 250 soal per mapel x 4 = 1000 soal via API generator (bukan hardcoded)
- 4 Mapel: Bahasa Indonesia, Matematika, Bahasa Inggris, Perhotelan Pilihan
- Tryout Campur 50 soal random
- Penjelasan lengkap BENAR/SALAH + analogi hotel + tips TKA
- XP, Level, Streak realtime via Upstash Redis
- API: /api/questions, /api/progress, /api/leaderboard, /api/seed

## Deploy
1. Buat Redis di console.upstash.com
2. Push ke GitHub, import di Vercel, isi env UPSTASH_REDIS_REST_URL & TOKEN
3. Deploy, buka /api/seed untuk seed awal

## Struktur Full (tidak ada yang hilang)
app/layout.tsx, globals.css, page.tsx (fokus latihan), lib/*, app/api/*
