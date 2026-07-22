CREATE SEQUENCE "reservasi_no_seq" START 1;
CREATE SEQUENCE "pembayaran_id_seq" START 1;

CREATE TABLE "resepsionis" (
    "id_resepsionis" SERIAL NOT NULL,
    "nama_lengkap" VARCHAR(100) NOT NULL,
    "telepon" VARCHAR(20) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    CONSTRAINT "resepsionis_pkey" PRIMARY KEY ("id_resepsionis")
);

CREATE TABLE "pasien" (
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "nama_lengkap" VARCHAR(100) NOT NULL,
    "telepon" VARCHAR(20),
    "jenis_kelamin" VARCHAR(15),
    "tempat_lahir" VARCHAR(50),
    "tanggal_lahir" DATE,
    "pendidikan_terakhir" VARCHAR(50),
    "pekerjaan" VARCHAR(50),
    "status_perkawinan" VARCHAR(20),
    "agama" VARCHAR(20),
    "alamat_domisili" VARCHAR(255),
    "kota" VARCHAR(50),
    "profil_lengkap" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "pasien_pkey" PRIMARY KEY ("email")
);

CREATE TABLE "layanan" (
    "id_layanan" SERIAL NOT NULL,
    "nama_layanan" VARCHAR(100) NOT NULL,
    "estimasi_durasi" INTEGER NOT NULL,
    "deskripsi_layanan" VARCHAR(255) NOT NULL,
    "harga" DECIMAL(10, 2) NOT NULL DEFAULT 0,
    "status_layanan" VARCHAR(20) NOT NULL DEFAULT 'Aktif',
    CONSTRAINT "layanan_pkey" PRIMARY KEY ("id_layanan"),
    CONSTRAINT "check_harga_layanan" CHECK ("harga" >= 0),
    CONSTRAINT "check_estimasi_durasi" CHECK ("estimasi_durasi" > 0 AND "estimasi_durasi" % 30 = 0),
    CONSTRAINT "check_status_layanan" CHECK ("status_layanan" IN ('Aktif', 'Nonaktif'))
);

CREATE TABLE "reservasi" (
    "no_reservasi" VARCHAR(11) NOT NULL DEFAULT ('RSV-' || LPAD(nextval('reservasi_no_seq')::text, 6, '0')),
    "email_pasien" VARCHAR(100) NOT NULL,
    "id_layanan" INTEGER NOT NULL,
    "id_resepsionis" INTEGER,
    "tanggal_reservasi" DATE NOT NULL DEFAULT CURRENT_DATE,
    "status_reservasi" VARCHAR(20) NOT NULL DEFAULT 'Terjadwal',
    "keluhan_awal" VARCHAR(255),
    "alasan_pembatalan" VARCHAR(255),
    "harga_layanan" DECIMAL(10, 2) NOT NULL,
    CONSTRAINT "reservasi_pkey" PRIMARY KEY ("no_reservasi"),
    CONSTRAINT "reservasi_email_pasien_fkey" FOREIGN KEY ("email_pasien") REFERENCES "pasien"("email") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reservasi_id_layanan_fkey" FOREIGN KEY ("id_layanan") REFERENCES "layanan"("id_layanan") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reservasi_id_resepsionis_fkey" FOREIGN KEY ("id_resepsionis") REFERENCES "resepsionis"("id_resepsionis") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "check_no_reservasi_format" CHECK ("no_reservasi" ~ '^RSV-[0-9]{6}$'),
    CONSTRAINT "check_status_reservasi" CHECK ("status_reservasi" IN ('Terjadwal', 'Hadir', 'Selesai', 'Dibatalkan', 'Tidak Hadir')),
    CONSTRAINT "check_harga_layanan_snapshot" CHECK ("harga_layanan" >= 0)
);

CREATE TABLE "jadwal" (
    "id_jadwal" SERIAL NOT NULL,
    "no_reservasi" VARCHAR(11),
    "tanggal" DATE NOT NULL,
    "jam_mulai" TIME(0) NOT NULL,
    "jam_selesai" TIME(0) NOT NULL,
    "status_jadwal" VARCHAR(20) NOT NULL DEFAULT 'Aktif',
    CONSTRAINT "jadwal_pkey" PRIMARY KEY ("id_jadwal"),
    CONSTRAINT "jadwal_no_reservasi_fkey" FOREIGN KEY ("no_reservasi") REFERENCES "reservasi"("no_reservasi") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "jadwal_tanggal_jam_mulai_key" UNIQUE ("tanggal", "jam_mulai"),
    CONSTRAINT "check_status_jadwal" CHECK ("status_jadwal" IN ('Aktif', 'Nonaktif')),
    CONSTRAINT "check_durasi_slot_jadwal" CHECK ("jam_selesai" = "jam_mulai" + INTERVAL '30 minutes')
);

CREATE TABLE "pembayaran" (
    "id_pembayaran" VARCHAR(11) NOT NULL DEFAULT ('PAY-' || LPAD(nextval('pembayaran_id_seq')::text, 6, '0')),
    "no_reservasi" VARCHAR(11) NOT NULL,
    "tanggal_bayar" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_biaya" DECIMAL(10, 2) NOT NULL,
    "metode_pembayaran" VARCHAR(20) NOT NULL,
    CONSTRAINT "pembayaran_pkey" PRIMARY KEY ("id_pembayaran"),
    CONSTRAINT "pembayaran_no_reservasi_key" UNIQUE ("no_reservasi"),
    CONSTRAINT "pembayaran_no_reservasi_fkey" FOREIGN KEY ("no_reservasi") REFERENCES "reservasi"("no_reservasi") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "check_id_pembayaran_format" CHECK ("id_pembayaran" ~ '^PAY-[0-9]{6}$'),
    CONSTRAINT "check_total_biaya" CHECK ("total_biaya" >= 0),
    CONSTRAINT "check_metode_pembayaran" CHECK ("metode_pembayaran" IN ('Tunai', 'Debit', 'Transfer', 'QRIS'))
);

CREATE INDEX "reservasi_email_pasien_idx" ON "reservasi"("email_pasien");
CREATE INDEX "reservasi_id_layanan_idx" ON "reservasi"("id_layanan");
CREATE INDEX "reservasi_id_resepsionis_idx" ON "reservasi"("id_resepsionis");
CREATE INDEX "reservasi_status_reservasi_idx" ON "reservasi"("status_reservasi");
CREATE INDEX "jadwal_no_reservasi_idx" ON "jadwal"("no_reservasi");
CREATE INDEX "jadwal_tanggal_status_jadwal_idx" ON "jadwal"("tanggal", "status_jadwal");
