cat > ../PRD_BACKEND_PRISMA.md <<'EOF'
# PRD Backend Sense's Clinic — Migrasi ke Prisma

## 1. Ringkasan Produk

Backend Sense's Clinic adalah layanan API untuk mengelola proses reservasi layanan klinik, mulai dari registrasi pasien, login, pengelolaan profil pasien, pengelolaan data pasien oleh resepsionis, layanan, jadwal, reservasi, hingga pembayaran.

Backend akan dimigrasikan dari penggunaan `pg` dan `node-pg-migrate` menuju Prisma ORM agar pengelolaan database, relasi, dan query menjadi lebih terstruktur.

---

## 2. Tujuan

Tujuan utama backend adalah:

1. Menyediakan API untuk pasien dan resepsionis.
2. Mengelola data pasien, layanan, jadwal, reservasi, dan pembayaran.
3. Menjamin alur reservasi berjalan sesuai aturan klinik.
4. Menyediakan struktur database yang konsisten dengan rancangan sistem.
5. Memigrasikan query dan migration database ke Prisma.

---

## 3. Tech Stack

| Komponen | Teknologi |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT |
| Password Hash | bcrypt |
| Environment Config | dotenv |

---

## 4. Aktor Sistem

Aktor yang berada dalam scope sistem:

1. Pasien
2. Resepsionis

Aktor yang tidak termasuk scope:

1. Dokter
2. Admin
3. Farmasi

---

## 5. Scope Backend

Backend mencakup modul berikut:

1. Auth dan akun
2. Data pasien
3. Layanan
4. Jadwal
5. Reservasi
6. Pembayaran

Backend tidak mencakup:

1. Rekam medis
2. Diagnosa
3. Resep obat
4. Antrean
5. Manajemen dokter

---

## 6. Struktur Proses Sistem

### 1. Kelola Akun dan Data Pasien

1.1 Login

1.2 Registrasi Pasien  
- 1.2.1 Buat Akun Pasien
- 1.2.2 Lengkapi Profil Pasien

1.3 Kelola Profil Pasien  
- 1.3.1 Lihat Profil Pasien
- 1.3.2 Ubah Profil Pasien

1.4 Kelola Data Pasien  
- 1.4.1 Lihat Data Pasien
- 1.4.2 Tambah Data Pasien
- 1.4.3 Ubah Data Pasien

### 2. Manajemen Layanan, Jadwal, dan Reservasi

2.1 Kelola Data Layanan  
- 2.1.1 Lihat Layanan
- 2.1.2 Tambah Layanan
- 2.1.3 Nonaktifkan Layanan

2.2 Kelola Jadwal Klinik  
- 2.2.1 Lihat Jadwal
- 2.2.2 Aktifkan Jadwal
- 2.2.3 Nonaktifkan Jadwal

2.3 Proses Reservasi  
- 2.3.1 Lihat Ketersediaan Jadwal
- 2.3.2 Buat Reservasi
- 2.3.3 Kelola Status Reservasi
- 2.3.4 Batalkan Reservasi

### 3. Administrasi Pembayaran

3.1 Kalkulasi dan Simpan Pembayaran  
3.2 Lihat Pembayaran

---

## 7. Standarisasi Primary Key dan ID

| Entitas | Primary Key | Tipe Data | Panjang | Contoh |
|---|---|---|---:|---|
| Resepsionis | id_resepsionis | Integer | 11 | 1 |
| Pasien | email | Varchar | 100 | pasien@gmail.com |
| Layanan | id_layanan | Integer | 11 | 1 |
| Jadwal | id_jadwal | Integer | 11 | 1 |
| Reservasi | no_reservasi | Varchar | 11 | RSV-000001 |
| Pembayaran | id_pembayaran | Varchar | 11 | PAY-000001 |

Catatan:

- `id_resepsionis`, `id_layanan`, dan `id_jadwal` adalah ID internal sistem.
- `email` digunakan sebagai primary key pasien karena digunakan untuk login pasien.
- `no_reservasi` menggunakan format `RSV-000001`.
- `id_pembayaran` menggunakan format `PAY-000001`.

---

## 8. Aturan Database Utama

### 8.1 Reservasi

1. `no_reservasi` menjadi primary key.
2. `id_reservasi` tidak digunakan.
3. Format `no_reservasi` adalah `RSV-000001`.
4. Tabel reservasi tidak menyimpan `tanggal_kunjungan`.
5. Tabel reservasi tidak menyimpan `waktu_mulai`.
6. Tabel reservasi tidak menyimpan `waktu_selesai`.
7. Tanggal dan waktu kunjungan diambil dari tabel `jadwal`.
8. Satu reservasi dapat memakai satu atau lebih slot jadwal.
9. Tabel `jadwal` menyimpan `no_reservasi` sebagai foreign key.

### 8.2 Id Resepsionis pada Reservasi

`id_resepsionis` pada tabel reservasi bersifat nullable.

Aturan:

1. Jika pasien membuat reservasi sendiri, `id_resepsionis` bernilai `NULL`.
2. Jika resepsionis membuat reservasi untuk pasien, `id_resepsionis` langsung terisi.
3. Jika resepsionis memproses reservasi mandiri pasien, misalnya menandai hadir, selesai, atau membatalkan, maka `id_resepsionis` diisi dengan ID resepsionis yang sedang login.

Makna final `id_resepsionis` pada reservasi:

> Resepsionis yang membuat atau menangani reservasi.

### 8.3 Jadwal

1. Jadwal memiliki slot 30 menit.
2. Status jadwal hanya `Aktif` atau `Nonaktif`.
3. Slot aktif dan `no_reservasi = NULL` berarti slot tersedia.
4. Slot aktif dan `no_reservasi IS NOT NULL` berarti slot sudah dipesan.
5. Slot nonaktif tidak bisa dipesan.
6. Kombinasi `tanggal` dan `jam_mulai` harus unik.

### 8.4 Layanan

1. Layanan tidak dihapus.
2. Jika layanan tidak digunakan lagi, status layanan diubah menjadi `Nonaktif`.
3. Durasi layanan disimpan dalam satuan menit.
4. Estimasi durasi harus kelipatan 30 menit.
5. Harga layanan tidak boleh kurang dari 0.

### 8.5 Pembayaran

1. `id_pembayaran` menjadi primary key.
2. Format `id_pembayaran` adalah `PAY-000001`.
3. Pembayaran hanya dapat dibuat untuk reservasi berstatus `Selesai`.
4. Satu reservasi maksimal memiliki satu pembayaran.
5. Tabel pembayaran tidak menyimpan `id_resepsionis`.
6. Informasi resepsionis dapat ditelusuri melalui reservasi.

Relasi penelusuran resepsionis pembayaran:

    pembayaran.no_reservasi
    -> reservasi.no_reservasi
    -> reservasi.id_resepsionis
    -> resepsionis.id_resepsionis

---

## 9. Entitas Database

### 9.1 Resepsionis

| Field | Tipe | Keterangan |
|---|---|---|
| id_resepsionis | Integer | Primary key, auto increment |
| nama_lengkap | Varchar(100) | Not null |
| telepon | Varchar(20) | Not null |
| password | Varchar(255) | Not null, disimpan dalam bentuk hash |

### 9.2 Pasien

| Field | Tipe | Keterangan |
|---|---|---|
| email | Varchar(100) | Primary key |
| password | Varchar(255) | Not null, disimpan dalam bentuk hash |
| nama_lengkap | Varchar(100) | Not null |
| telepon | Varchar(20) | Nullable |
| jenis_kelamin | Varchar(15) | Nullable |
| tempat_lahir | Varchar(50) | Nullable |
| tanggal_lahir | Date | Nullable |
| pendidikan_terakhir | Varchar(50) | Nullable |
| pekerjaan | Varchar(50) | Nullable |
| status_perkawinan | Varchar(20) | Nullable |
| agama | Varchar(20) | Nullable |
| alamat_domisili | Varchar(255) | Nullable |
| kota | Varchar(50) | Nullable |
| profil_lengkap | Boolean | Default false |

### 9.3 Layanan

| Field | Tipe | Keterangan |
|---|---|---|
| id_layanan | Integer | Primary key, auto increment |
| nama_layanan | Varchar(100) | Not null |
| estimasi_durasi | Integer | Not null, durasi dalam menit |
| deskripsi_layanan | Varchar(255) | Not null |
| harga | Decimal(10,2) | Not null, default 0 |
| status_layanan | Varchar(20) | Aktif atau Nonaktif |

### 9.4 Reservasi

| Field | Tipe | Keterangan |
|---|---|---|
| no_reservasi | Varchar(11) | Primary key, format RSV-000001 |
| email_pasien | Varchar(100) | Foreign key ke pasien.email |
| id_layanan | Integer | Foreign key ke layanan.id_layanan |
| id_resepsionis | Integer | Nullable, foreign key ke resepsionis.id_resepsionis |
| tanggal_reservasi | Date | Tanggal reservasi dibuat |
| status_reservasi | Varchar(20) | Terjadwal, Hadir, Selesai, Dibatalkan, Tidak Hadir |
| keluhan_awal | Varchar(255) | Nullable |
| alasan_pembatalan | Varchar(255) | Nullable |

### 9.5 Jadwal

| Field | Tipe | Keterangan |
|---|---|---|
| id_jadwal | Integer | Primary key, auto increment |
| no_reservasi | Varchar(11) | Nullable, foreign key ke reservasi.no_reservasi |
| tanggal | Date | Not null |
| jam_mulai | Time | Not null |
| jam_selesai | Time | Not null |
| status_jadwal | Varchar(20) | Aktif atau Nonaktif |

### 9.6 Pembayaran

| Field | Tipe | Keterangan |
|---|---|---|
| id_pembayaran | Varchar(11) | Primary key, format PAY-000001 |
| no_reservasi | Varchar(11) | Unique, foreign key ke reservasi.no_reservasi |
| tanggal_bayar | Timestamp | Not null |
| total_biaya | Decimal(10,2) | Not null |
| metode_pembayaran | Varchar(20) | Tunai, Debit, Transfer, QRIS |

---

## 10. Endpoint API

### 10.1 Auth

| Method | Endpoint | Role | Fungsi |
|---|---|---|---|
| POST | /auth/register | Pasien | Membuat akun pasien |
| PUT | /auth/profile | Pasien | Melengkapi profil pasien |
| POST | /auth/login | Pasien / Resepsionis | Login |

### 10.2 Pasien

| Method | Endpoint | Role | Fungsi |
|---|---|---|---|
| GET | /pasien/profile | Pasien | Melihat profil sendiri |
| PUT | /pasien/profile | Pasien | Mengubah profil sendiri |
| GET | /resepsionis/pasien | Resepsionis | Melihat data pasien |
| POST | /resepsionis/pasien | Resepsionis | Menambah data pasien |
| PUT | /resepsionis/pasien/:email | Resepsionis | Mengubah data pasien |

### 10.3 Layanan

| Method | Endpoint | Role | Fungsi |
|---|---|---|---|
| GET | /layanan | Public / Pasien | Melihat layanan aktif |
| GET | /layanan/:id_layanan | Public / Pasien | Melihat detail layanan |
| GET | /resepsionis/layanan | Resepsionis | Melihat semua layanan |
| POST | /resepsionis/layanan | Resepsionis | Menambah layanan |
| PATCH | /resepsionis/layanan/:id_layanan/nonaktif | Resepsionis | Menonaktifkan layanan |

### 10.4 Jadwal

| Method | Endpoint | Role | Fungsi |
|---|---|---|---|
| GET | /jadwal/tersedia | Pasien | Melihat slot tersedia |
| GET | /resepsionis/jadwal | Resepsionis | Melihat jadwal |
| POST | /resepsionis/jadwal | Resepsionis | Menambah slot jadwal |
| PATCH | /resepsionis/jadwal/:id_jadwal/aktif | Resepsionis | Mengaktifkan jadwal |
| PATCH | /resepsionis/jadwal/:id_jadwal/nonaktif | Resepsionis | Menonaktifkan jadwal |

### 10.5 Reservasi

| Method | Endpoint | Role | Fungsi |
|---|---|---|---|
| POST | /reservasi | Pasien | Membuat reservasi mandiri |
| GET | /reservasi/me | Pasien | Melihat riwayat reservasi sendiri |
| GET | /reservasi/:no_reservasi | Pasien / Resepsionis | Melihat detail reservasi |
| PATCH | /reservasi/:no_reservasi/batal | Pasien | Membatalkan reservasi sendiri |
| GET | /resepsionis/reservasi | Resepsionis | Melihat semua reservasi |
| POST | /resepsionis/reservasi | Resepsionis | Membuat reservasi untuk pasien |
| PATCH | /resepsionis/reservasi/:no_reservasi/hadir | Resepsionis | Menandai hadir |
| PATCH | /resepsionis/reservasi/:no_reservasi/selesai | Resepsionis | Menandai selesai |
| PATCH | /resepsionis/reservasi/:no_reservasi/tidak-hadir | Resepsionis | Menandai tidak hadir |
| PATCH | /resepsionis/reservasi/:no_reservasi/batal | Resepsionis | Membatalkan reservasi |

### 10.6 Pembayaran

| Method | Endpoint | Role | Fungsi |
|---|---|---|---|
| GET | /resepsionis/reservasi/:no_reservasi/tagihan | Resepsionis | Menghitung tagihan |
| POST | /resepsionis/pembayaran | Resepsionis | Menyimpan pembayaran |
| GET | /resepsionis/pembayaran | Resepsionis | Melihat pembayaran |
| GET | /resepsionis/pembayaran/:id_pembayaran | Resepsionis | Melihat detail pembayaran |

---

## 11. Aturan Authentication dan Authorization

### 11.1 JWT Payload

Payload pasien:

    {
      "user": {
        "email": "pasien@gmail.com",
        "nama_lengkap": "Pasien Satu",
        "role": "pasien",
        "profil_lengkap": true
      }
    }

Payload resepsionis:

    {
      "user": {
        "id_resepsionis": 1,
        "nama_lengkap": "Resepsionis Satu",
        "role": "resepsionis"
      }
    }

### 11.2 Role Access

| Role | Akses |
|---|---|
| Public | Melihat layanan aktif |
| Pasien | Profil sendiri, jadwal tersedia, reservasi mandiri, riwayat reservasi |
| Resepsionis | Data pasien, layanan, jadwal, semua reservasi, pembayaran |

---

## 12. Rencana Migrasi ke Prisma

### 12.1 Target Migrasi

Prisma akan menggantikan:

1. `node-pg-migrate` sebagai migration tool.
2. `pg` atau raw query sebagai akses database utama.

### 12.2 Langkah Migrasi

1. Install Prisma.
2. Inisialisasi Prisma.
3. Buat `schema.prisma`.
4. Buat migration awal Prisma.
5. Tambahkan sequence untuk `no_reservasi` dan `id_pembayaran`.
6. Buat Prisma Client instance.
7. Migrasikan service auth.
8. Migrasikan service pasien.
9. Migrasikan service layanan.
10. Migrasikan service jadwal.
11. Migrasikan service reservasi.
12. Migrasikan service pembayaran.
13. Hapus penggunaan `pg` jika seluruh service sudah menggunakan Prisma.
14. Hapus `node-pg-migrate` jika Prisma Migrate sudah menjadi migration utama.

---

## 13. Instalasi Prisma

Jalankan dari folder backend:

    npm install @prisma/client
    npm install -D prisma

Inisialisasi Prisma:

    npx prisma init --datasource-provider postgresql

Tambahkan script ke `package.json`:

    {
      "scripts": {
        "prisma:generate": "prisma generate",
        "prisma:migrate": "prisma migrate dev",
        "prisma:studio": "prisma studio"
      }
    }

---

## 14. Environment Variable

Pastikan `.env` memiliki:

    DATABASE_URL="postgresql://username:password@localhost:5432/senses_clinic?schema=public"
    JWT_SECRET="your_jwt_secret"

---

## 15. Target Prisma Schema

File target:

    backend/prisma/schema.prisma

Draft model:

    generator client {
      provider = "prisma-client-js"
    }

    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }

    model Resepsionis {
      id_resepsionis Int    @id @default(autoincrement())
      nama_lengkap   String @db.VarChar(100)
      telepon        String @db.VarChar(20)
      password       String @db.VarChar(255)

      reservasi      Reservasi[]

      @@map("resepsionis")
    }

    model Pasien {
      email               String      @id @db.VarChar(100)
      password            String      @db.VarChar(255)
      nama_lengkap        String      @db.VarChar(100)
      telepon             String?     @db.VarChar(20)
      jenis_kelamin       String?     @db.VarChar(15)
      tempat_lahir        String?     @db.VarChar(50)
      tanggal_lahir       DateTime?   @db.Date
      pendidikan_terakhir String?     @db.VarChar(50)
      pekerjaan           String?     @db.VarChar(50)
      status_perkawinan   String?     @db.VarChar(20)
      agama               String?     @db.VarChar(20)
      alamat_domisili     String?     @db.VarChar(255)
      kota                String?     @db.VarChar(50)
      profil_lengkap      Boolean     @default(false)

      reservasi           Reservasi[]

      @@map("pasien")
    }

    model Layanan {
      id_layanan        Int         @id @default(autoincrement())
      nama_layanan      String      @db.VarChar(100)
      estimasi_durasi   Int
      deskripsi_layanan String      @db.VarChar(255)
      harga             Decimal     @default(0) @db.Decimal(10, 2)
      status_layanan    String      @default("Aktif") @db.VarChar(20)

      reservasi         Reservasi[]

      @@map("layanan")
    }

    model Reservasi {
      no_reservasi      String       @id @default(dbgenerated("'RSV-' || LPAD(nextval('reservasi_no_seq')::text, 6, '0')")) @db.VarChar(11)
      email_pasien      String       @db.VarChar(100)
      id_layanan        Int
      id_resepsionis    Int?
      tanggal_reservasi DateTime     @default(now()) @db.Date
      status_reservasi  String       @default("Terjadwal") @db.VarChar(20)
      keluhan_awal      String?      @db.VarChar(255)
      alasan_pembatalan String?      @db.VarChar(255)

      pasien            Pasien       @relation(fields: [email_pasien], references: [email], onDelete: Restrict, onUpdate: Cascade)
      layanan           Layanan      @relation(fields: [id_layanan], references: [id_layanan], onDelete: Restrict, onUpdate: Cascade)
      resepsionis       Resepsionis? @relation(fields: [id_resepsionis], references: [id_resepsionis], onDelete: SetNull, onUpdate: Cascade)

      jadwal            Jadwal[]
      pembayaran        Pembayaran?

      @@index([email_pasien])
      @@index([id_layanan])
      @@index([id_resepsionis])
      @@index([status_reservasi])
      @@map("reservasi")
    }

    model Jadwal {
      id_jadwal     Int        @id @default(autoincrement())
      no_reservasi  String?    @db.VarChar(11)
      tanggal       DateTime   @db.Date
      jam_mulai     DateTime   @db.Time
      jam_selesai   DateTime   @db.Time
      status_jadwal String     @default("Aktif") @db.VarChar(20)

      reservasi     Reservasi? @relation(fields: [no_reservasi], references: [no_reservasi], onDelete: SetNull, onUpdate: Cascade)

      @@unique([tanggal, jam_mulai])
      @@index([no_reservasi])
      @@map("jadwal")
    }

    model Pembayaran {
      id_pembayaran    String    @id @default(dbgenerated("'PAY-' || LPAD(nextval('pembayaran_id_seq')::text, 6, '0')")) @db.VarChar(11)
      no_reservasi     String    @unique @db.VarChar(11)
      tanggal_bayar    DateTime  @default(now()) @db.Timestamp(6)
      total_biaya       Decimal   @db.Decimal(10, 2)
      metode_pembayaran String    @db.VarChar(20)

      reservasi         Reservasi @relation(fields: [no_reservasi], references: [no_reservasi], onDelete: Restrict, onUpdate: Cascade)

      @@map("pembayaran")
    }

---

## 16. Catatan Migration Prisma

Karena `no_reservasi` dan `id_pembayaran` memakai sequence custom, file SQL migration Prisma perlu menambahkan:

    CREATE SEQUENCE IF NOT EXISTS reservasi_no_seq START 1;
    CREATE SEQUENCE IF NOT EXISTS pembayaran_id_seq START 1;

Selain itu, beberapa check constraint perlu ditambahkan manual di file migration SQL karena Prisma schema tidak menuliskan semua check constraint secara eksplisit.

Contoh check constraint:

    ALTER TABLE "layanan"
    ADD CONSTRAINT "check_harga_layanan"
    CHECK (harga >= 0);

    ALTER TABLE "layanan"
    ADD CONSTRAINT "check_estimasi_durasi"
    CHECK (estimasi_durasi > 0 AND estimasi_durasi % 30 = 0);

    ALTER TABLE "layanan"
    ADD CONSTRAINT "check_status_layanan"
    CHECK (status_layanan IN ('Aktif', 'Nonaktif'));

    ALTER TABLE "jadwal"
    ADD CONSTRAINT "check_status_jadwal"
    CHECK (status_jadwal IN ('Aktif', 'Nonaktif'));

    ALTER TABLE "jadwal"
    ADD CONSTRAINT "check_waktu_jadwal"
    CHECK (jam_selesai > jam_mulai);

    ALTER TABLE "reservasi"
    ADD CONSTRAINT "check_no_reservasi_format"
    CHECK (no_reservasi ~ '^RSV-[0-9]{6}$');

    ALTER TABLE "reservasi"
    ADD CONSTRAINT "check_status_reservasi"
    CHECK (
      status_reservasi IN (
        'Terjadwal',
        'Hadir',
        'Selesai',
        'Dibatalkan',
        'Tidak Hadir'
      )
    );

    ALTER TABLE "pembayaran"
    ADD CONSTRAINT "check_id_pembayaran_format"
    CHECK (id_pembayaran ~ '^PAY-[0-9]{6}$');

    ALTER TABLE "pembayaran"
    ADD CONSTRAINT "check_total_biaya"
    CHECK (total_biaya >= 0);

    ALTER TABLE "pembayaran"
    ADD CONSTRAINT "check_metode_pembayaran"
    CHECK (
      metode_pembayaran IN (
        'Tunai',
        'Debit',
        'Transfer',
        'QRIS'
      )
    );

---

## 17. Prisma Client Instance

Buat file:

    backend/src/config/prisma.js

Isi:

    import { PrismaClient } from "@prisma/client";

    const prisma = new PrismaClient();

    export default prisma;

---

## 18. Strategi Migrasi Service

Migrasi service dilakukan bertahap.

Urutan migrasi:

1. Auth service
2. Pasien service
3. Layanan service
4. Jadwal service
5. Reservasi service
6. Pembayaran service

Selama migrasi belum selesai:

1. Jangan langsung hapus `src/config/db.js`.
2. Jangan langsung uninstall `pg`.
3. Pastikan setiap service yang sudah dipindah ke Prisma dites sebelum lanjut ke service berikutnya.

Setelah semua service memakai Prisma:

1. Hapus import `pool` dari seluruh file.
2. Hapus `src/config/db.js` jika sudah tidak digunakan.
3. Hapus dependency `pg` jika tidak lagi dipakai.
4. Hapus `node-pg-migrate` jika migration sepenuhnya memakai Prisma.

---

## 19. Contoh Perubahan Query

Sebelum Prisma:

    const result = await pool.query(
      "SELECT * FROM pasien WHERE email = $1",
      [email]
    );

    const pasien = result.rows[0];

Setelah Prisma:

    const pasien = await prisma.pasien.findUnique({
      where: {
        email,
      },
    });

---

## 20. Alur Pembuatan Reservasi

### Pasien Membuat Reservasi Mandiri

1. Pasien memilih layanan.
2. Sistem membaca estimasi durasi layanan.
3. Pasien memilih jadwal tersedia.
4. Sistem memvalidasi slot jadwal:
   - status jadwal Aktif
   - no_reservasi masih NULL
   - slot berurutan sesuai durasi layanan
5. Sistem membuat data reservasi.
6. Database membuat `no_reservasi` otomatis.
7. Sistem mengisi `jadwal.no_reservasi`.
8. `id_resepsionis` bernilai NULL.

### Resepsionis Membuat Reservasi

1. Resepsionis memilih pasien.
2. Resepsionis memilih layanan.
3. Resepsionis memilih jadwal.
4. Sistem membuat reservasi.
5. `id_resepsionis` langsung diisi dari resepsionis yang sedang login.

### Resepsionis Memproses Reservasi

Saat resepsionis menandai reservasi sebagai Hadir, Selesai, Tidak Hadir, atau Dibatalkan:

1. Sistem membaca `no_reservasi`.
2. Sistem membaca ID resepsionis dari token.
3. Sistem mengubah status reservasi.
4. Sistem mengisi atau memperbarui `id_resepsionis`.

---

## 21. Alur Pembayaran

1. Resepsionis memilih reservasi.
2. Sistem memastikan reservasi berstatus Selesai.
3. Sistem membaca harga layanan dari tabel layanan.
4. Sistem menghitung total tagihan.
5. Sistem menyimpan pembayaran.
6. Database membuat `id_pembayaran` otomatis.
7. Satu reservasi hanya boleh memiliki satu pembayaran.

---

## 22. Acceptance Criteria

Backend dianggap sesuai jika:

1. Prisma berhasil terpasang.
2. Prisma schema sesuai dengan rancangan database final.
3. Migration Prisma berhasil membuat semua tabel.
4. Sequence `reservasi_no_seq` dan `pembayaran_id_seq` berjalan.
5. `no_reservasi` otomatis berbentuk `RSV-000001`.
6. `id_pembayaran` otomatis berbentuk `PAY-000001`.
7. Login pasien berhasil.
8. Login resepsionis berhasil.
9. Registrasi pasien dua tahap berhasil.
10. Pasien dapat melihat dan mengubah profil.
11. Resepsionis dapat melihat, menambah, dan mengubah data pasien.
12. Resepsionis dapat menambah dan menonaktifkan layanan.
13. Resepsionis dapat mengelola jadwal.
14. Pasien dapat melihat jadwal tersedia.
15. Pasien dapat membuat reservasi mandiri.
16. Resepsionis dapat membuat reservasi untuk pasien.
17. Resepsionis dapat mengubah status reservasi.
18. `id_resepsionis` pada reservasi terisi saat reservasi dibuat atau diproses resepsionis.
19. Pembayaran hanya dapat dibuat untuk reservasi berstatus Selesai.
20. Satu reservasi tidak dapat memiliki lebih dari satu pembayaran.
21. Tanggal dan waktu kunjungan dapat ditampilkan dari tabel jadwal.
22. Tidak ada lagi query raw SQL untuk service yang sudah dimigrasikan ke Prisma.

---

## 23. Prompt Implementasi untuk Codex

Gunakan prompt berikut untuk implementasi bertahap:

    Saya ingin memigrasikan backend Express.js Sense's Clinic dari pg + node-pg-migrate ke Prisma ORM.

    Kondisi saat ini:
    - Backend menggunakan Node.js, Express.js, ES Modules, PostgreSQL.
    - Saat ini masih ada config database dengan pg/pool.
    - Migration sebelumnya menggunakan node-pg-migrate.
    - Saya ingin Prisma menjadi ORM utama dan Prisma Migrate menjadi sistem migration utama.

    Tolong lakukan migrasi bertahap dengan ketentuan:

    1. Install dan konfigurasi Prisma.
    2. Buat folder prisma dan file schema.prisma.
    3. Buat model Prisma untuk entitas:
       - Resepsionis
       - Pasien
       - Layanan
       - Jadwal
       - Reservasi
       - Pembayaran

    4. Gunakan aturan database berikut:
       - Resepsionis.id_resepsionis integer primary key auto increment.
       - Pasien.email varchar(100) primary key.
       - Layanan.id_layanan integer primary key auto increment.
       - Jadwal.id_jadwal integer primary key auto increment.
       - Reservasi.no_reservasi varchar(11) primary key dengan format RSV-000001.
       - Pembayaran.id_pembayaran varchar(11) primary key dengan format PAY-000001.
       - Jadwal.no_reservasi nullable foreign key ke Reservasi.no_reservasi.
       - Pembayaran.no_reservasi unique foreign key ke Reservasi.no_reservasi.
       - Reservasi.id_resepsionis nullable foreign key ke Resepsionis.id_resepsionis.
       - Reservasi tidak menyimpan tanggal_kunjungan, waktu_mulai, dan waktu_selesai.
       - Tanggal dan waktu kunjungan diambil dari tabel Jadwal.
       - Pembayaran tidak menyimpan id_resepsionis.

    5. Buat file src/config/prisma.js yang mengekspor instance PrismaClient.
    6. Jangan langsung menghapus db.js sampai semua service selesai dimigrasikan.
    7. Migrasikan service secara bertahap mulai dari authService.
    8. Update package.json dengan script Prisma:
       - prisma:generate
       - prisma:migrate
       - prisma:studio

    Pastikan project tetap menggunakan ES Modules.

EOF