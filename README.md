# TKA SMK Perhotelan PRO - Real-time dengan Upstash Redis

Website belajar TKA Kelas 12 SMK Perhotelan dengan 800+ soal (200+ per mapel), database real-time.

## Fitur PRO v2
- 200+ soal per mapel (B.Indonesia, Matematika, B.Inggris, Perhotelan) = 800+ soal via API dinamis
- Database Upstash Redis: progress, streak, XP, leaderboard, bookmark - REALTIME
- Soal diambil dari API `/api/questions` bukan hardcoded di frontend
- Penjelasan lengkap BENAR/SALAH + analogi perhotelan
- Gamifikasi: XP, Level, Streak, Badge, Leaderboard realtime

## Struktur API
- `GET /api/questions?mapel=matematika&limit=200` -> ambil soal
- `GET /api/questions?mapel=all&limit=50` -> tryout campur
- `POST /api/progress` -> simpan progress user
- `GET /api/progress?userId=xxx` -> ambil progress
- `GET /api/leaderboard` -> leaderboard realtime
- `POST /api/seed` -> seed 800 soal ke Redis (opsional)

## Deploy ke Vercel (1 Klik)

### 1. Buat Database Upstash
1. Buka https://console.upstash.com/redis
2. Create Database -> pilih region Singapore (biar dekat)
3. Copy `UPSTASH_REDIS_REST_URL` dan `UPSTASH_REDIS_REST_TOKEN`

### 2. Deploy
1. Push project ini ke GitHub
2. Import di Vercel: https://vercel.com/new
3. Add Environment Variables:
   - UPSTASH_REDIS_REST_URL
   - UPSTASH_REDIS_REST_TOKEN
4. Deploy -> jadi!

### 3. Seed Data (opsional)
Setelah deploy, buka: `https://your-app.vercel.app/api/seed` dengan method POST untuk isi Redis dengan 800 soal.

## Local Dev
```bash
npm install
cp .env.example .env.local
# isi env
npm run dev
```

## Cara Kerja Realtime
- Frontend fetch soal dari `/api/questions` (generator, bukan file besar)
- Jawaban disimpan via `/api/progress` ke Redis HASH `user:{userId}`
- Leaderboard pakai Redis Sorted Set `leaderboard`
- Streak dihitung di server via Redis

Dibuat untuk TKA 2026 SMK Perhotelan.
