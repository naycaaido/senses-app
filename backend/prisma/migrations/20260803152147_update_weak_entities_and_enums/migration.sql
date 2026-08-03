-- This migration intentionally fails before destructive DDL when legacy values
-- cannot be represented by the new schema or cancellation data needs backfill.
DO $$
DECLARE
  invalid_values text;
  legacy_cancellation_count bigint;
BEGIN
  SELECT string_agg(DISTINCT status_layanan, ', ')
    INTO invalid_values
    FROM layanan
   WHERE status_layanan NOT IN ('Aktif', 'Nonaktif');
  IF invalid_values IS NOT NULL THEN
    RAISE EXCEPTION 'Unsupported layanan.status_layanan values: %', invalid_values;
  END IF;

  SELECT string_agg(DISTINCT status_jadwal, ', ')
    INTO invalid_values
    FROM jadwal
   WHERE status_jadwal NOT IN ('Aktif', 'Nonaktif');
  IF invalid_values IS NOT NULL THEN
    RAISE EXCEPTION 'Unsupported jadwal.status_jadwal values: %', invalid_values;
  END IF;

  SELECT string_agg(DISTINCT status_reservasi, ', ')
    INTO invalid_values
    FROM reservasi
   WHERE status_reservasi NOT IN
     ('Terjadwal', 'Hadir', 'Selesai', 'Dibatalkan', 'Tidak Hadir');
  IF invalid_values IS NOT NULL THEN
    RAISE EXCEPTION 'Unsupported reservasi.status_reservasi values: %', invalid_values;
  END IF;

  SELECT string_agg(DISTINCT metode_pembayaran, ', ')
    INTO invalid_values
    FROM pembayaran
   WHERE metode_pembayaran NOT IN ('Tunai', 'Debit', 'Transfer', 'QRIS');
  IF invalid_values IS NOT NULL THEN
    RAISE EXCEPTION 'Unsupported pembayaran.metode_pembayaran values: %', invalid_values;
  END IF;

  IF EXISTS (SELECT 1 FROM pembayaran WHERE no_reservasi IS NULL) THEN
    RAISE EXCEPTION 'pembayaran.no_reservasi contains NULL values';
  END IF;
  IF EXISTS (
    SELECT no_reservasi FROM pembayaran
    GROUP BY no_reservasi HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'pembayaran.no_reservasi contains duplicate values';
  END IF;

  SELECT count(*)
    INTO legacy_cancellation_count
    FROM reservasi
   WHERE status_reservasi = 'Dibatalkan'
      OR alasan_pembatalan IS NOT NULL;
  IF legacy_cancellation_count > 0 THEN
    RAISE EXCEPTION
      'Migration requires explicit cancellation backfill for % reservasi row(s); pihak_pembatalan and dibatalkan_pada cannot be inferred',
      legacy_cancellation_count;
  END IF;
END $$;

-- Block removal of id_pembayaran if an unexpected constraint depends on it.
DO $$
DECLARE
  dependency_names text;
BEGIN
  SELECT string_agg(c.conname, ', ')
    INTO dependency_names
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_attribute a
      ON a.attrelid = t.oid
     AND a.attnum = ANY(c.conkey)
   WHERE t.relname = 'pembayaran'
     AND a.attname = 'id_pembayaran'
     AND c.conname NOT IN ('pembayaran_pkey', 'check_id_pembayaran_format');
  IF dependency_names IS NOT NULL THEN
    RAISE EXCEPTION 'Unexpected dependencies on pembayaran.id_pembayaran: %', dependency_names;
  END IF;

  SELECT string_agg(format('%I.%I', child.relname, c.conname), ', ')
    INTO dependency_names
    FROM pg_constraint c
    JOIN pg_class parent ON parent.oid = c.confrelid
    JOIN pg_class child ON child.oid = c.conrelid
    JOIN pg_attribute a
      ON a.attrelid = parent.oid
     AND a.attnum = ANY(c.confkey)
   WHERE parent.relname = 'pembayaran'
     AND a.attname = 'id_pembayaran';
  IF dependency_names IS NOT NULL THEN
    RAISE EXCEPTION 'Foreign keys depend on pembayaran.id_pembayaran: %', dependency_names;
  END IF;
END $$;

CREATE TYPE "StatusLayanan" AS ENUM ('Aktif', 'Nonaktif');
CREATE TYPE "StatusJadwal" AS ENUM ('Aktif', 'Nonaktif');
CREATE TYPE "StatusReservasi" AS ENUM
  ('Terjadwal', 'Hadir', 'Selesai', 'Dibatalkan', 'Tidak Hadir');
CREATE TYPE "MetodePembayaran" AS ENUM ('Tunai', 'Debit', 'Transfer', 'QRIS');
CREATE TYPE "PihakPembatalan" AS ENUM ('Pasien', 'Resepsionis');

ALTER TABLE layanan DROP CONSTRAINT "check_status_layanan";
ALTER TABLE layanan ALTER COLUMN status_layanan DROP DEFAULT;
ALTER TABLE layanan
  ALTER COLUMN status_layanan TYPE "StatusLayanan"
  USING status_layanan::text::"StatusLayanan";
ALTER TABLE layanan ALTER COLUMN status_layanan SET DEFAULT 'Aktif';

ALTER TABLE jadwal DROP CONSTRAINT "check_status_jadwal";
ALTER TABLE jadwal ALTER COLUMN status_jadwal DROP DEFAULT;
ALTER TABLE jadwal
  ALTER COLUMN status_jadwal TYPE "StatusJadwal"
  USING status_jadwal::text::"StatusJadwal";
ALTER TABLE jadwal ALTER COLUMN status_jadwal SET DEFAULT 'Aktif';

ALTER TABLE reservasi DROP CONSTRAINT "check_status_reservasi";
ALTER TABLE reservasi ALTER COLUMN status_reservasi DROP DEFAULT;
ALTER TABLE reservasi
  ALTER COLUMN status_reservasi TYPE "StatusReservasi"
  USING status_reservasi::text::"StatusReservasi";
ALTER TABLE reservasi ALTER COLUMN status_reservasi SET DEFAULT 'Terjadwal';
ALTER TABLE reservasi ALTER COLUMN tanggal_reservasi SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE pembayaran DROP CONSTRAINT "check_metode_pembayaran";
ALTER TABLE pembayaran
  ALTER COLUMN metode_pembayaran TYPE "MetodePembayaran"
  USING metode_pembayaran::text::"MetodePembayaran";

CREATE TABLE pembatalan_reservasi (
  no_reservasi VARCHAR(11) NOT NULL,
  alasan_pembatalan VARCHAR(255) NOT NULL,
  pihak_pembatalan "PihakPembatalan" NOT NULL,
  dibatalkan_pada TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pembatalan_reservasi_pkey PRIMARY KEY (no_reservasi),
  CONSTRAINT pembatalan_reservasi_no_reservasi_fkey
    FOREIGN KEY (no_reservasi) REFERENCES reservasi(no_reservasi)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Safe because the preflight block guarantees no legacy cancellation rows.
ALTER TABLE reservasi DROP COLUMN alasan_pembatalan;

ALTER TABLE pembayaran DROP CONSTRAINT pembayaran_no_reservasi_fkey;
ALTER TABLE pembayaran DROP CONSTRAINT pembayaran_pkey;
ALTER TABLE pembayaran DROP CONSTRAINT check_id_pembayaran_format;
ALTER TABLE pembayaran DROP CONSTRAINT pembayaran_no_reservasi_key;
ALTER TABLE pembayaran DROP COLUMN id_pembayaran;
ALTER TABLE pembayaran
  ADD CONSTRAINT pembayaran_pkey PRIMARY KEY (no_reservasi);
ALTER TABLE pembayaran
  ADD CONSTRAINT pembayaran_no_reservasi_fkey
  FOREIGN KEY (no_reservasi) REFERENCES reservasi(no_reservasi)
  ON DELETE CASCADE ON UPDATE CASCADE;
DROP SEQUENCE IF EXISTS pembayaran_id_seq;
