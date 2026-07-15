/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("resepsionis", {
    id_resepsionis: {
      type: "serial",
      primaryKey: true,
    },
    nama_lengkap: {
      type: "varchar(50)",
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
      type: "varchar(50)",
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
    status: {
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
  });

  pgm.createTable("layanan", {
    id_layanan: {
      type: "serial",
      primaryKey: true,
    },
    nama_layanan: {
      type: "varchar(100)",
      notNull: true,
    },
    estimasi_layanan: {
      type: "varchar(50)",
    },
    deskripsi_layanan: {
      type: "varchar(255)",
    },
    harga: {
      type: "decimal(10,2)",
      notNull: true,
      default: 0,
    },
    status: {
      type: "varchar(20)",
      notNull: true,
      default: "Aktif",
    },
  });

  pgm.createTable("jadwal", {
    id_jadwal: {
      type: "serial",
      primaryKey: true,
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
      default: "Tersedia",
    },
  });

  pgm.createTable("reservasi", {
    id_reservasi: {
      type: "serial",
      primaryKey: true,
    },
    no_reservasi: {
      type: "varchar(11)",
      notNull: true,
      unique: true,
    },
    email_pasien: {
      type: "varchar(100)",
      notNull: true,
      references: "pasien(email)",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    id_layanan: {
      type: "integer",
      notNull: true,
      references: "layanan(id_layanan)",
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
    id_jadwal: {
      type: "integer",
      notNull: true,
      references: "jadwal(id_jadwal)",
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
    },
    waktu_mulai: {
      type: "time",
    },
    waktu_selesai: {
      type: "time",
    },
    status_reservasi: {
      type: "varchar(20)",
      notNull: true,
      default: "Menunggu",
    },
    keluhan_awal: {
      type: "varchar(255)",
    },
    alasan_pembatalan: {
      type: "varchar(255)",
    },
  });

  pgm.createTable("pembayaran", {
    id_pembayaran: {
      type: "varchar(20)",
      primaryKey: true,
    },
    no_reservasi: {
      type: "varchar(11)",
      notNull: true,
      references: "reservasi(no_reservasi)",
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
    tanggal_bayar: {
      type: "timestamp",
      notNull: true,
    },
    total_biaya: {
      type: "decimal(10,2)",
      notNull: true,
    },
    metode_pembayaran: {
      type: "varchar(50)",
      notNull: true,
    },
  });

  pgm.createIndex("reservasi", "email_pasien");
  pgm.createIndex("reservasi", "id_layanan");
  pgm.createIndex("reservasi", "id_jadwal");
  pgm.createIndex("reservasi", "id_resepsionis");
  pgm.createIndex("pembayaran", "no_reservasi");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("pembayaran");
  pgm.dropTable("reservasi");
  pgm.dropTable("jadwal");
  pgm.dropTable("layanan");
  pgm.dropTable("pasien");
  pgm.dropTable("resepsionis");
};
