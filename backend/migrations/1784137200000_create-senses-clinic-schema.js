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

    // Data pribadi boleh kosong pada tahap pertama registrasi
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
  // JADWAL
  // =====================================================
  pgm.createTable("jadwal", {
    id_jadwal: {
      type: "serial",
      primaryKey: true,
    },

    // Ditambahkan constraint FK setelah reservasi dibuat
    id_reservasi: {
      type: "integer",
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
  // RESERVASI
  // =====================================================
  pgm.createTable("reservasi", {
    id_reservasi: {
      type: "serial",
      primaryKey: true,
    },

    no_reservasi: {
      type: "varchar(20)",
      notNull: true,
      unique: true,
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

    tanggal_kunjungan: {
      type: "date",
      notNull: true,
    },

    waktu_mulai: {
      type: "time",
      notNull: true,
    },

    waktu_selesai: {
      type: "time",
      notNull: true,
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
  // RELASI RESERVASI 1 : N JADWAL
  // =====================================================
  pgm.addConstraint("jadwal", "fk_jadwal_reservasi", {
    foreignKeys: {
      columns: "id_reservasi",
      references: "reservasi(id_reservasi)",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
  });

  // =====================================================
  // PEMBAYARAN
  // =====================================================
  pgm.createTable("pembayaran", {
    id_pembayaran: {
      type: "varchar(20)",
      primaryKey: true,
    },
    no_reservasi: {
      type: "varchar(20)",
      notNull: true,
      unique: true,
      references: "reservasi(no_reservasi)",
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
    id_resepsionis: {
      type: "integer",
      notNull: true,
      references: "resepsionis(id_resepsionis)",
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
  // CHECK CONSTRAINTS
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

  pgm.addConstraint("jadwal", "check_status_jadwal", {
    check: "status_jadwal IN ('Aktif', 'Nonaktif')",
  });

  pgm.addConstraint("jadwal", "check_waktu_jadwal", {
    check: "jam_selesai > jam_mulai",
  });

  pgm.addConstraint("reservasi", "check_waktu_reservasi", {
    check: "waktu_selesai > waktu_mulai",
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
  pgm.createIndex("reservasi", ["tanggal_kunjungan", "waktu_mulai"]);

  pgm.createIndex("jadwal", "id_reservasi");

  pgm.createIndex("jadwal", ["tanggal", "jam_mulai"], {
    unique: true,
  });

  // no_reservasi sudah unique, sehingga PostgreSQL otomatis
  // membuat index untuk kolom tersebut.
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("pembayaran");
  pgm.dropConstraint("jadwal", "fk_jadwal_reservasi");
  pgm.dropTable("reservasi");
  pgm.dropTable("jadwal");
  pgm.dropTable("layanan");
  pgm.dropTable("pasien");
  pgm.dropTable("resepsionis");
};
