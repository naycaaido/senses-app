# Sense Clinic

Sense Clinic adalah aplikasi klinik berbasis web dengan dua peran utama:
pasien dan resepsionis. Proyek ini berupa monorepo yang berisi frontend React
dan backend Express dengan PostgreSQL melalui Prisma.

## Fitur Utama

- Pasien: registrasi, login, pengisian biodata, melihat layanan, membuat
  reservasi, melihat bukti booking dan riwayat, serta mengubah profil.
- Resepsionis: login terpisah, dashboard, data pasien, pengelolaan layanan,
  pengelolaan jadwal, reservasi, dan pembayaran.
- Jadwal reservasi menggunakan slot 30 menit. Sistem hanya menerima rangkaian
  slot yang berurutan sesuai durasi layanan.
- API dilindungi JWT, memiliki dokumentasi Swagger, dan menyediakan seeder
  data pengembangan.

## Tech Stack

| Area | Teknologi |
| --- | --- |
| Frontend | React, Vite, React Router, Tailwind CSS |
| Backend | Node.js, Express, JWT, bcrypt |
| Database | PostgreSQL, Prisma ORM |
| Dokumentasi API | Swagger UI |

## Struktur Proyek

```text
senses-app/
├── frontend/                  # Aplikasi React + Vite
├── backend/                   # Express API, Prisma, dan test backend
│   ├── prisma/
│   │   ├── migrations/
│   │   └── seed.js             # Data dummy pengembangan
│   └── src/
├── docs/integration/           # Status dan keputusan integrasi
└── package.json                # Menjalankan frontend + backend bersama
```

## Prasyarat

- Node.js dan npm
- PostgreSQL yang dapat diakses dari komputer lokal
- Database PostgreSQL untuk Sense Clinic

## Instalasi

Instal dependensi root, frontend, dan backend dari root proyek:

```bash
npm run install:all
```

## Konfigurasi Environment

Buat file `.env` berdasarkan file `.env.example` di masing-masing folder.
Jangan commit file `.env` atau nilai rahasia ke repository.

`frontend/.env`

```env
VITE_API_URL=http://localhost:5000
```

`backend/.env`

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
JWT_SECRET=ganti_dengan_rahasia_yang_kuat
```

## Menyiapkan Database

Jalankan perintah berikut dari folder `backend`.

```bash
npm run prisma:generate
npm run prisma:migrate
```

Untuk lingkungan deployment yang sudah memiliki migration history, gunakan:

```bash
npm run prisma:deploy
```

### Seeder Data Pengembangan

Seeder menambahkan data dummy untuk resepsionis, pasien dengan biodata lengkap,
layanan aktif/nonaktif, slot jadwal, reservasi, dan pembayaran. Seeder tidak
menghapus seluruh database dan memiliki pengaman agar data non-dummy tidak
tertimpa.

```bash
npm run db:seed
```

Perintah alternatif Prisma:

```bash
npx prisma db seed
```

Gunakan seeder hanya untuk database pengembangan.

## Menjalankan Aplikasi

Dari root proyek, jalankan frontend dan backend bersamaan:

```bash
npm run dev
```

Atau jalankan salah satunya:

```bash
npm run dev:fe   # Frontend Vite
npm run dev:be   # Backend Express
```

Setelah berjalan:

| Layanan | URL |
| --- | --- |
| Frontend | `http://localhost:5173` |
| Backend | `http://localhost:5000` |
| Health check | `http://localhost:5000/api/health` |
| Swagger UI | `http://localhost:5000/api-docs` |

## Perintah Berguna

| Lokasi | Perintah | Kegunaan |
| --- | --- | --- |
| Root | `npm run install:all` | Instal seluruh dependensi |
| Root | `npm run dev` | Jalankan frontend dan backend |
| Frontend | `npm run build` | Build produksi frontend |
| Backend | `npm test` | Jalankan test backend |
| Backend | `npm run prisma:validate` | Validasi Prisma schema dan config |
| Backend | `npm run prisma:studio` | Buka Prisma Studio |
| Backend | `npm run db:seed` | Isi data dummy pengembangan |

## Dokumentasi Lanjutan

- Status integrasi: [`docs/integration/00-INTEGRATION-STATUS.md`](docs/integration/00-INTEGRATION-STATUS.md)
- Kontrak API: [`docs/integration/03-API-CONTRACT.md`](docs/integration/03-API-CONTRACT.md)
- Keputusan arsitektur: [`docs/integration/06-DECISIONS.md`](docs/integration/06-DECISIONS.md)

## Catatan Keamanan

- Jangan gunakan seeder pada database produksi.
- Jangan memasukkan `DATABASE_URL`, `JWT_SECRET`, token, atau kredensial nyata
  ke source code maupun commit.
- Gunakan migration Prisma untuk perubahan struktur database.
