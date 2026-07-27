-- Reconcile legacy databases that were created before the reservation-price snapshot.
ALTER TABLE "reservasi"
ADD COLUMN IF NOT EXISTS "harga_layanan" DECIMAL(10, 2);

-- Existing reservations keep the best available value when no historical snapshot exists.
UPDATE "reservasi" AS reservasi
SET "harga_layanan" = layanan."harga"
FROM "layanan" AS layanan
WHERE reservasi."id_layanan" = layanan."id_layanan"
  AND reservasi."harga_layanan" IS NULL;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "reservasi" WHERE "harga_layanan" IS NULL) THEN
    RAISE EXCEPTION 'Cannot set harga_layanan: one or more reservations have no matching service price';
  END IF;
END $$;

ALTER TABLE "reservasi"
ALTER COLUMN "harga_layanan" SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'check_harga_layanan_snapshot'
      AND conrelid = 'reservasi'::regclass
  ) THEN
    ALTER TABLE "reservasi"
    ADD CONSTRAINT "check_harga_layanan_snapshot" CHECK ("harga_layanan" >= 0);
  END IF;
END $$;
