/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  // =====================================================
  // SEQUENCE UNTUK KODE OTOMATIS
  // =====================================================
  pgm.sql("CREATE SEQUENCE reservasi_no_seq START 1");
  pgm.sql("CREATE SEQUENCE pembayaran_id_seq START 1");

  // =====================================================
  // RESEPSIONIS
  // =====================================================
  pgm.createTable("resepsionis", {
    id_resepsionis: {
      type: "serial",
      primaryKey: true,
    },

    nama_lengkap: {
      type: "varchar(100)",
      notNull: true,
    },

    telepon: {
      type: "varchar(20)",
      notNull: true,
    },

    password: {
      type: "varchar(255)",
      notNull: true,
    },
  });

  // =====================================================
  // PASIEN
  // =====================================================
  pgm.createTable("pasien", {
    email: {
      type: "varchar(100)",
      primaryKey: true,
    },

    password: {
      type: "varchar(255)",
      notNull: true,
    },

    nama_lengkap: {
      type: "varchar(100)",
      notNull: true,
    },

    telepon: {
      type: "varchar(20)",
    },

    jenis_kelamin: {
      type: "varchar(15)",
    },

    tempat_lahir: {
      type: "varchar(50)",
    },

    tanggal_lahir: {
      type: "date",
    },

    pendidikan_terakhir: {
      type: "varchar(50)",
    },

    pekerjaan: {
      type: "varchar(50)",
    },

    status_perkawinan: {
      type: "varchar(20)",
    },

    agama: {
      type: "varchar(20)",
    },

    alamat_domisili: {
      type: "varchar(255)",
    },

    kota: {
      type: "varchar(50)",
    },

    profil_lengkap: {
      type: "boolean",
      notNull: true,
      default: false,
    },
  });

  // =====================================================
  // LAYANAN
  // =====================================================
  pgm.createTable("layanan", {
    id_layanan: {
      type: "serial",
      primaryKey: true,
    },

    nama_layanan: {
      type: "varchar(100)",
      notNull: true,
    },

    estimasi_durasi: {
      type: "integer",
      notNull: true,
    },

    deskripsi_layanan: {
      type: "varchar(255)",
      notNull: true,
    },

    harga: {
      type: "decimal(10,2)",
      notNull: true,
      default: 0,
    },

    status_layanan: {
      type: "varchar(20)",
      notNull: true,
      default: "Aktif",
    },
  });

  // =====================================================
  // RESERVASI
  // =====================================================
  pgm.createTable("reservasi", {
    no_reservasi: {
      type: "varchar(11)",
      primaryKey: true,
      default: pgm.func(
        "'RSV-' || LPAD(nextval('reservasi_no_seq')::text, 6, '0')",
      ),
    },

    email_pasien: {
      type: "varchar(100)",
      notNull: true,
      references: "pasien(email)",
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },

    id_layanan: {
      type: "integer",
      notNull: true,
      references: "layanan(id_layanan)",
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },

    id_resepsionis: {
      type: "integer",
      references: "resepsionis(id_resepsionis)",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },

    tanggal_reservasi: {
      type: "date",
      notNull: true,
      default: pgm.func("CURRENT_DATE"),
    },

    status_reservasi: {
      type: "varchar(20)",
      notNull: true,
      default: "Terjadwal",
    },

    keluhan_awal: {
      type: "varchar(255)",
    },

    alasan_pembatalan: {
      type: "varchar(255)",
    },
  });

  // =====================================================
  // JADWAL
  // =====================================================
  pgm.createTable("jadwal", {
    id_jadwal: {
      type: "serial",
      primaryKey: true,
    },

    no_reservasi: {
      type: "varchar(11)",
      references: "reservasi(no_reservasi)",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },

    tanggal: {
      type: "date",
      notNull: true,
    },

    jam_mulai: {
      type: "time",
      notNull: true,
    },

    jam_selesai: {
      type: "time",
      notNull: true,
    },

    status_jadwal: {
      type: "varchar(20)",
      notNull: true,
      default: "Aktif",
    },
  });

  // =====================================================
  // PEMBAYARAN
  // =====================================================
  pgm.createTable("pembayaran", {
    id_pembayaran: {
      type: "varchar(11)",
      primaryKey: true,
      default: pgm.func(
        "'PAY-' || LPAD(nextval('pembayaran_id_seq')::text, 6, '0')",
      ),
    },

    no_reservasi: {
      type: "varchar(11)",
      notNull: true,
      unique: true,
      references: "reservasi(no_reservasi)",
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },

    tanggal_bayar: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },

    total_biaya: {
      type: "decimal(10,2)",
      notNull: true,
    },

    metode_pembayaran: {
      type: "varchar(20)",
      notNull: true,
    },
  });

  // =====================================================
  // CHECK CONSTRAINTS - LAYANAN
  // =====================================================
  pgm.addConstraint("layanan", "check_harga_layanan", {
    check: "harga >= 0",
  });

  pgm.addConstraint("layanan", "check_estimasi_durasi", {
    check: "estimasi_durasi > 0 AND estimasi_durasi % 30 = 0",
  });

  pgm.addConstraint("layanan", "check_status_layanan", {
    check: "status_layanan IN ('Aktif', 'Nonaktif')",
  });

  // =====================================================
  // CHECK CONSTRAINTS - RESERVASI
  // =====================================================
  pgm.addConstraint("reservasi", "check_no_reservasi_format", {
    check: "no_reservasi ~ '^RSV-[0-9]{6}$'",
  });

  pgm.addConstraint("reservasi", "check_status_reservasi", {
    check: `
      status_reservasi IN (
        'Terjadwal',
        'Hadir',
        'Selesai',
        'Dibatalkan',
        'Tidak Hadir'
      )
    `,
  });

  // =====================================================
  // CHECK CONSTRAINTS - JADWAL
  // =====================================================
  pgm.addConstraint("jadwal", "check_status_jadwal", {
    check: "status_jadwal IN ('Aktif', 'Nonaktif')",
  });

  pgm.addConstraint("jadwal", "check_waktu_jadwal", {
    check: "jam_selesai > jam_mulai",
  });

  // =====================================================
  // CHECK CONSTRAINTS - PEMBAYARAN
  // =====================================================
  pgm.addConstraint("pembayaran", "check_id_pembayaran_format", {
    check: "id_pembayaran ~ '^PAY-[0-9]{6}$'",
  });

  pgm.addConstraint("pembayaran", "check_total_biaya", {
    check: "total_biaya >= 0",
  });

  pgm.addConstraint("pembayaran", "check_metode_pembayaran", {
    check: `
      metode_pembayaran IN (
        'Tunai',
        'Debit',
        'Transfer',
        'QRIS'
      )
    `,
  });

  // =====================================================
  // INDEX
  // =====================================================
  pgm.createIndex("reservasi", "email_pasien");
  pgm.createIndex("reservasi", "id_layanan");
  pgm.createIndex("reservasi", "id_resepsionis");
  pgm.createIndex("reservasi", "status_reservasi");

  pgm.createIndex("jadwal", "no_reservasi");

  pgm.createIndex("jadwal", ["tanggal", "jam_mulai"], {
    unique: true,
  });

  // no_reservasi pada pembayaran sudah unique,
  // sehingga PostgreSQL otomatis membuat index.
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("pembayaran");
  pgm.dropTable("jadwal");
  pgm.dropTable("reservasi");
  pgm.dropTable("layanan");
  pgm.dropTable("pasien");
  pgm.dropTable("resepsionis");

  pgm.sql("DROP SEQUENCE IF EXISTS pembayaran_id_seq");
  pgm.sql("DROP SEQUENCE IF EXISTS reservasi_no_seq");
};
