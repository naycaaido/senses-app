import swaggerJsdoc from "swagger-jsdoc";

const schemaRef = (name) => ({ $ref: "#/components/schemas/" + name });
const parameterRef = (name) => ({ $ref: "#/components/parameters/" + name });
const jsonResponse = (description, schema) => ({
  description,
  content: {
    "application/json": {
      schema,
    },
  },
});
const errorResponse = (description) =>
  jsonResponse(description, schemaRef("ErrorResponse"));
const bearerSecurity = [{ bearerAuth: [] }];

const messageSchema = (property, schema) => ({
  type: "object",
  required: ["message", property],
  properties: {
    message: { type: "string" },
    [property]: schema,
  },
});
const paginatedSchema = (itemSchema) => ({
  type: "object",
  required: ["data", "pagination"],
  properties: {
    data: {
      type: "array",
      items: itemSchema,
    },
    pagination: schemaRef("Pagination"),
  },
});

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sense Clinic API",
      version: "1.0.0",
      description:
        "Kontrak API backend Sense Clinic. Endpoint yang membutuhkan autentikasi memakai JWT Bearer token.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],
    tags: [
      { name: "Health", description: "Status aplikasi dan API" },
      { name: "Auth", description: "Registrasi, login, dan profil pasien" },
      { name: "Pasien", description: "Akun pasien terautentikasi" },
      { name: "Layanan", description: "Katalog layanan publik" },
      { name: "Jadwal", description: "Jadwal pasien dan operasional resepsionis" },
      { name: "Reservasi", description: "Reservasi pasien dan resepsionis" },
      { name: "Pembayaran", description: "Tagihan dan pembayaran resepsionis" },
      { name: "Resepsionis - Pasien", description: "Pengelolaan data pasien" },
      { name: "Resepsionis - Layanan", description: "Pengelolaan layanan" },
      { name: "Resepsionis - Jadwal", description: "Pengelolaan slot jadwal" },
      { name: "Resepsionis - Reservasi", description: "Pengelolaan status reservasi" },
      { name: "Resepsionis - Pembayaran", description: "Pengelolaan pembayaran" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Masukkan token JWT dari endpoint login.",
        },
      },
      parameters: {
        Page: {
          name: "page",
          in: "query",
          required: false,
          description: "Halaman data, default 1.",
          schema: { type: "integer", minimum: 1, default: 1 },
        },
        Limit: {
          name: "limit",
          in: "query",
          required: false,
          description: "Jumlah data per halaman, default 20 dan maksimum 100.",
          schema: { type: "integer", minimum: 1, maximum: 100, default: 20 },
        },
        Tanggal: {
          name: "tanggal",
          in: "query",
          required: true,
          description: "Tanggal jadwal dalam format YYYY-MM-DD.",
          schema: { type: "string", format: "date" },
        },
        Search: {
          name: "search",
          in: "query",
          required: false,
          description: "Kata kunci pencarian.",
          schema: { type: "string", minLength: 1 },
        },
        ServiceStatus: {
          name: "status",
          in: "query",
          required: false,
          description: "Filter status layanan.",
          schema: { type: "string", enum: ["Aktif", "Nonaktif"] },
        },
        ReservationStatus: {
          name: "status",
          in: "query",
          required: false,
          description: "Filter status reservasi.",
          schema: {
            type: "string",
            enum: ["Terjadwal", "Hadir", "Selesai", "Dibatalkan", "Tidak Hadir"],
          },
        },
        PatientEmail: {
          name: "email_pasien",
          in: "query",
          required: false,
          description: "Filter reservasi berdasarkan email pasien.",
          schema: { type: "string", format: "email" },
        },
        PaymentMethod: {
          name: "metode_pembayaran",
          in: "query",
          required: false,
          description: "Filter metode pembayaran.",
          schema: { type: "string", enum: ["Tunai", "Debit", "Transfer", "QRIS"] },
        },
        ServiceId: {
          name: "id_layanan",
          in: "path",
          required: true,
          description: "ID layanan bertipe integer positif.",
          schema: { type: "integer", minimum: 1 },
        },
        ScheduleId: {
          name: "id_jadwal",
          in: "path",
          required: true,
          description: "ID jadwal bertipe integer positif.",
          schema: { type: "integer", minimum: 1 },
        },
        ReservationNumber: {
          name: "no_reservasi",
          in: "path",
          required: true,
          description: "Nomor reservasi, misalnya RSV-000001.",
          schema: { type: "string", example: "RSV-000001" },
        },
        Email: {
          name: "email",
          in: "path",
          required: true,
          description: "Alamat email pasien.",
          schema: { type: "string", format: "email" },
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          required: ["message"],
          properties: {
            status: {
              type: "string",
              nullable: true,
              description:
                "Diisi oleh error middleware; controller autentikasi dapat hanya mengirim message.",
              example: "error",
            },
            message: { type: "string", example: "Resource not found" },
            error_code: { type: "string", nullable: true },
          },
        },
        Pagination: {
          type: "object",
          required: ["page", "limit", "total", "total_pages"],
          properties: {
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 20 },
            total: { type: "integer", example: 1 },
            total_pages: { type: "integer", example: 1 },
          },
        },
        HealthResponse: {
          type: "object",
          required: ["status", "message"],
          properties: {
            status: { type: "string", example: "ok" },
            message: { type: "string", example: "Sense Clinic API is running" },
          },
        },
        Pasien: {
          type: "object",
          required: ["email", "nama_lengkap", "profil_lengkap"],
          properties: {
            email: { type: "string", format: "email", example: "pasien@gmail.com" },
            nama_lengkap: { type: "string", example: "Pasien Baru" },
            telepon: { type: "string", nullable: true, example: "081234567890" },
            jenis_kelamin: { type: "string", nullable: true, example: "Perempuan" },
            tempat_lahir: { type: "string", nullable: true, example: "Jakarta" },
            tanggal_lahir: { type: "string", format: "date", nullable: true },
            pendidikan_terakhir: { type: "string", nullable: true, example: "SMA" },
            pekerjaan: { type: "string", nullable: true, example: "Mahasiswa" },
            status_perkawinan: {
              type: "string",
              nullable: true,
              example: "Belum Menikah",
            },
            agama: { type: "string", nullable: true, example: "Islam" },
            alamat_domisili: {
              type: "string",
              nullable: true,
              example: "Jakarta Selatan",
            },
            kota: { type: "string", nullable: true, example: "Jakarta" },
            profil_lengkap: { type: "boolean", example: true },
          },
        },
        AuthUserPasien: {
          type: "object",
          required: ["email", "nama_lengkap", "role", "profil_lengkap"],
          properties: {
            email: { type: "string", format: "email" },
            nama_lengkap: { type: "string" },
            role: { type: "string", enum: ["pasien"] },
            profil_lengkap: { type: "boolean" },
          },
        },
        AuthUserResepsionis: {
          type: "object",
          required: ["id_resepsionis", "nama_lengkap", "role"],
          properties: {
            id_resepsionis: { type: "integer", example: 1 },
            nama_lengkap: { type: "string", example: "Resepsionis" },
            role: { type: "string", enum: ["resepsionis"] },
          },
        },
        Layanan: {
          type: "object",
          required: [
            "id_layanan",
            "nama_layanan",
            "estimasi_durasi",
            "deskripsi_layanan",
            "harga",
            "status_layanan",
          ],
          properties: {
            id_layanan: { type: "integer", example: 1 },
            nama_layanan: {
              type: "string",
              example: "Personal Skin Consultation",
            },
            estimasi_durasi: {
              type: "integer",
              description: "Durasi dalam menit dan kelipatan 30.",
              example: 30,
            },
            deskripsi_layanan: {
              type: "string",
              example: "Konsultasi kondisi kulit pasien.",
            },
            harga: { type: "number", format: "float", example: 100000 },
            status_layanan: {
              type: "string",
              enum: ["Aktif", "Nonaktif"],
              example: "Aktif",
            },
          },
        },
        Jadwal: {
          type: "object",
          required: [
            "id_jadwal",
            "tanggal",
            "jam_mulai",
            "jam_selesai",
            "status_jadwal",
            "tersedia",
          ],
          properties: {
            id_jadwal: { type: "integer", example: 1 },
            no_reservasi: {
              type: "string",
              nullable: true,
              example: "RSV-000001",
            },
            tanggal: { type: "string", format: "date", example: "2026-08-15" },
            jam_mulai: { type: "string", example: "09:00" },
            jam_selesai: { type: "string", example: "09:30" },
            status_jadwal: {
              type: "string",
              enum: ["Aktif", "Nonaktif"],
              example: "Aktif",
            },
            tersedia: { type: "boolean", example: true },
          },
        },
        ReservationPatient: {
          type: "object",
          properties: {
            email: { type: "string", format: "email" },
            nama_lengkap: { type: "string" },
            telepon: { type: "string", nullable: true },
          },
        },
        ReservationService: {
          type: "object",
          properties: {
            id_layanan: { type: "integer" },
            nama_layanan: { type: "string" },
            estimasi_durasi: { type: "integer" },
            harga: { type: "number" },
          },
        },
        Reservasi: {
          type: "object",
          required: [
            "no_reservasi",
            "email_pasien",
            "id_layanan",
            "tanggal_reservasi",
            "status_reservasi",
            "harga_layanan",
            "layanan",
            "jadwal",
            "pembatalan",
            "pembayaran",
          ],
          properties: {
            no_reservasi: { type: "string", example: "RSV-000001" },
            email_pasien: { type: "string", format: "email" },
            id_layanan: { type: "integer" },
            id_resepsionis: { type: "integer", nullable: true },
            tanggal_reservasi: { type: "string", format: "date" },
            status_reservasi: {
              type: "string",
              enum: ["Terjadwal", "Hadir", "Selesai", "Dibatalkan", "Tidak Hadir"],
            },
            keluhan_awal: { type: "string", nullable: true },
            harga_layanan: { type: "number", example: 100000 },
            pasien: schemaRef("ReservationPatient"),
            layanan: schemaRef("ReservationService"),
            jadwal: {
              type: "array",
              items: schemaRef("Jadwal"),
            },
            pembatalan: {
              allOf: [schemaRef("PembatalanReservasi")],
              nullable: true,
            },
            pembayaran: {
              allOf: [schemaRef("ReservationPayment")],
              nullable: true,
            },
          },
        },
        PembatalanReservasi: {
          type: "object",
          required: [
            "no_reservasi",
            "alasan_pembatalan",
            "pihak_pembatalan",
            "dibatalkan_pada",
          ],
          properties: {
            no_reservasi: { type: "string", example: "RSV-000001" },
            alasan_pembatalan: {
              type: "string",
              maxLength: 255,
              example: "Tidak dapat hadir",
            },
            pihak_pembatalan: {
              type: "string",
              enum: ["Pasien", "Resepsionis"],
            },
            dibatalkan_pada: { type: "string", format: "date-time" },
          },
        },
        ReservationPayment: {
          type: "object",
          required: [
            "no_reservasi",
            "tanggal_bayar",
            "total_biaya",
            "metode_pembayaran",
          ],
          properties: {
            no_reservasi: { type: "string", example: "RSV-000001" },
            tanggal_bayar: { type: "string", format: "date-time" },
            total_biaya: { type: "number", example: 100000 },
            metode_pembayaran: {
              type: "string",
              enum: ["Tunai", "Debit", "Transfer", "QRIS"],
            },
          },
        },
        Pembayaran: {
          type: "object",
          required: [
            "no_reservasi",
            "tanggal_bayar",
            "total_biaya",
            "metode_pembayaran",
            "reservasi",
          ],
          properties: {
            no_reservasi: { type: "string", example: "RSV-000001" },
            tanggal_bayar: { type: "string", format: "date-time" },
            total_biaya: { type: "number", example: 100000 },
            metode_pembayaran: {
              type: "string",
              enum: ["Tunai", "Debit", "Transfer", "QRIS"],
            },
            reservasi: {
              type: "object",
              properties: {
                no_reservasi: { type: "string" },
                email_pasien: { type: "string", format: "email" },
                status_reservasi: { type: "string" },
                harga_layanan: { type: "number" },
                pasien: {
                  type: "object",
                  properties: { nama_lengkap: { type: "string" } },
                },
                layanan: {
                  type: "object",
                  properties: { nama_layanan: { type: "string" } },
                },
              },
            },
          },
        },
        Tagihan: {
          type: "object",
          required: [
            "no_reservasi",
            "pasien",
            "layanan",
            "total_biaya",
            "sudah_dibayar",
          ],
          properties: {
            no_reservasi: { type: "string" },
            pasien: {
              type: "object",
              properties: { nama_lengkap: { type: "string" } },
            },
            layanan: {
              type: "object",
              properties: { nama_layanan: { type: "string" } },
            },
            total_biaya: { type: "number" },
            sudah_dibayar: { type: "boolean" },
            pembayaran: {
              allOf: [schemaRef("Pembayaran")],
              nullable: true,
            },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["email", "password", "nama_lengkap"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", format: "password", minLength: 1 },
            nama_lengkap: { type: "string", minLength: 1 },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["role", "password"],
          properties: {
            role: {
              type: "string",
              enum: ["pasien", "resepsionis"],
              example: "pasien",
            },
            email: { type: "string", format: "email" },
            id_resepsionis: { type: "integer", minimum: 1, example: 1 },
            password: { type: "string", format: "password" },
          },
          oneOf: [
            {
              properties: { role: { type: "string", enum: ["pasien"] } },
              required: ["email"],
            },
            {
              properties: { role: { type: "string", enum: ["resepsionis"] } },
              required: ["id_resepsionis"],
            },
          ],
        },
        ProfileRequest: {
          type: "object",
          description:
            "Email tidak dikirim; backend menentukan pasien dari JWT yang digunakan.",
          required: [
            "telepon",
            "jenis_kelamin",
            "tempat_lahir",
            "tanggal_lahir",
            "pendidikan_terakhir",
            "pekerjaan",
            "status_perkawinan",
            "agama",
            "alamat_domisili",
            "kota",
          ],
          properties: {
            telepon: { type: "string" },
            jenis_kelamin: { type: "string" },
            tempat_lahir: { type: "string" },
            tanggal_lahir: { type: "string", format: "date" },
            pendidikan_terakhir: { type: "string" },
            pekerjaan: { type: "string" },
            status_perkawinan: { type: "string" },
            agama: { type: "string" },
            alamat_domisili: { type: "string" },
            kota: { type: "string" },
          },
        },
        ChangePasswordRequest: {
          type: "object",
          required: ["password_lama", "password_baru", "konfirmasi_password"],
          properties: {
            password_lama: { type: "string", format: "password" },
            password_baru: { type: "string", format: "password" },
            konfirmasi_password: { type: "string", format: "password" },
          },
        },
        ReceptionistPatientCreateRequest: {
          type: "object",
          required: ["email", "password", "nama_lengkap", "telepon"],
          properties: {
            email: { type: "string", format: "email" },
            password: {
              type: "string",
              format: "password",
              description: "Password sementara pasien.",
            },
            nama_lengkap: { type: "string" },
            telepon: { type: "string" },
            jenis_kelamin: { type: "string" },
            tempat_lahir: { type: "string" },
            tanggal_lahir: { type: "string", format: "date" },
            pendidikan_terakhir: { type: "string" },
            pekerjaan: { type: "string" },
            status_perkawinan: { type: "string" },
            agama: { type: "string" },
            alamat_domisili: { type: "string" },
            kota: { type: "string" },
          },
        },
        ReceptionistPatientUpdateRequest: {
          type: "object",
          minProperties: 1,
          description:
            "Kirim minimal satu field. Email dan password tidak dapat diubah melalui endpoint ini.",
          properties: {
            nama_lengkap: { type: "string" },
            telepon: { type: "string" },
            jenis_kelamin: { type: "string", nullable: true },
            tempat_lahir: { type: "string", nullable: true },
            tanggal_lahir: { type: "string", format: "date", nullable: true },
            pendidikan_terakhir: { type: "string", nullable: true },
            pekerjaan: { type: "string", nullable: true },
            status_perkawinan: { type: "string", nullable: true },
            agama: { type: "string", nullable: true },
            alamat_domisili: { type: "string", nullable: true },
            kota: { type: "string", nullable: true },
          },
        },
        LayananRequest: {
          type: "object",
          required: [
            "nama_layanan",
            "estimasi_durasi",
            "deskripsi_layanan",
            "harga",
          ],
          properties: {
            nama_layanan: { type: "string" },
            estimasi_durasi: { type: "integer", minimum: 30, multipleOf: 30 },
            deskripsi_layanan: { type: "string" },
            harga: { type: "number", minimum: 0 },
          },
        },
        LayananUpdateRequest: {
          type: "object",
          minProperties: 1,
          description:
            "Kirim minimal satu field. status_layanan tidak dapat diubah melalui endpoint ini.",
          properties: {
            nama_layanan: { type: "string" },
            estimasi_durasi: { type: "integer", minimum: 30, multipleOf: 30 },
            deskripsi_layanan: { type: "string" },
            harga: { type: "number", minimum: 0 },
          },
        },
        JadwalRequest: {
          type: "object",
          required: ["tanggal", "jam_mulai", "jam_selesai"],
          properties: {
            tanggal: { type: "string", format: "date" },
            jam_mulai: { type: "string", pattern: "^([01]\\\\d|2[0-3]):[0-5]\\\\d$" },
            jam_selesai: {
              type: "string",
              pattern: "^([01]\\\\d|2[0-3]):[0-5]\\\\d$",
            },
          },
        },
        ReservationRequest: {
          type: "object",
          required: ["id_layanan", "id_jadwal"],
          properties: {
            id_layanan: { type: "integer", minimum: 1 },
            id_jadwal: {
              type: "array",
              minItems: 1,
              uniqueItems: true,
              items: { type: "integer", minimum: 1 },
            },
            keluhan_awal: { type: "string", nullable: true, maxLength: 255 },
          },
        },
        ReceptionistReservationRequest: {
          allOf: [
            schemaRef("ReservationRequest"),
            {
              type: "object",
              required: ["email_pasien"],
              properties: {
                email_pasien: { type: "string", format: "email" },
              },
            },
          ],
        },
        CancellationRequest: {
          type: "object",
          required: ["alasan_pembatalan"],
          description:
            "Client hanya mengirim alasan. pihak_pembatalan ditentukan backend dari role JWT.",
          properties: {
            alasan_pembatalan: {
              type: "string",
              minLength: 1,
              maxLength: 255,
            },
          },
        },
        PaymentRequest: {
          type: "object",
          required: ["no_reservasi", "metode_pembayaran"],
          properties: {
            no_reservasi: { type: "string", example: "RSV-000001" },
            metode_pembayaran: {
              type: "string",
              enum: ["Tunai", "Debit", "Transfer", "QRIS"],
            },
          },
        },
      },
    },
    paths: {
      "/": {
        get: {
          tags: ["Health"],
          summary: "Backend root status",
          description: "Memeriksa bahwa proses Express sedang berjalan.",
          responses: {
            200: {
              description: "Backend berjalan.",
              content: {
                "text/plain": {
                  schema: {
                    type: "string",
                    example: "Sense Clinic Backend is running",
                  },
                },
              },
            },
          },
        },
      },
      "/api/health": {
        get: {
          tags: ["Health"],
          summary: "API health check",
          responses: {
            200: jsonResponse("API sehat.", schemaRef("HealthResponse")),
          },
        },
      },
      "/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register pasien",
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: schemaRef("RegisterRequest") },
            },
          },
          responses: {
            201: jsonResponse(
              "Registrasi berhasil.",
              messageSchema("user", schemaRef("Pasien")),
            ),
            400: errorResponse("Data registrasi tidak valid."),
            409: errorResponse("Email telah terdaftar."),
            500: errorResponse("Kesalahan server."),
          },
        },
      },
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login pasien atau resepsionis",
          description:
            "Pasien login menggunakan email, sedangkan resepsionis menggunakan id_resepsionis integer.",
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: schemaRef("LoginRequest") },
            },
          },
          responses: {
            200: jsonResponse("Login berhasil.", {
              type: "object",
              required: ["token", "user"],
              properties: {
                token: { type: "string", description: "JWT untuk Bearer auth." },
                user: {
                  oneOf: [
                    schemaRef("AuthUserPasien"),
                    schemaRef("AuthUserResepsionis"),
                  ],
                },
              },
            }),
            400: errorResponse("Role atau identitas login tidak valid."),
            401: errorResponse("Kredensial tidak valid."),
            500: errorResponse("Kesalahan server."),
          },
        },
      },
      "/auth/profile": {
        get: {
          tags: ["Auth"],
          summary: "Profil pasien terautentikasi",
          description: "Pasien ditentukan dari email pada JWT.",
          security: bearerSecurity,
          responses: {
            200: jsonResponse("Profil pasien.", {
              type: "object",
              required: ["user"],
              properties: { user: schemaRef("Pasien") },
            }),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Role tidak diizinkan."),
            404: errorResponse("Pasien tidak ditemukan."),
          },
        },
        JadwalBatchStatusRequest: {
          type: "object",
          required: ["tanggal", "status"],
          properties: {
            tanggal: { type: "string", format: "date" },
            status: { type: "string", enum: ["Aktif", "Nonaktif"] },
          },
        },
        put: {
          tags: ["Auth"],
          summary: "Lengkapi profil pasien",
          description:
            "Pasien ditentukan dari JWT; field email pada body tidak digunakan.",
          security: bearerSecurity,
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: schemaRef("ProfileRequest") },
            },
          },
          responses: {
            200: jsonResponse(
              "Profil berhasil diperbarui.",
              messageSchema("user", schemaRef("Pasien")),
            ),
            400: errorResponse("Seluruh field profil wajib diisi."),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Role tidak diizinkan."),
            404: errorResponse("Pasien tidak ditemukan."),
            500: errorResponse("Kesalahan server."),
          },
        },
      },
      "/pasien/password": {
        put: {
          tags: ["Pasien"],
          summary: "Ubah password pasien",
          security: bearerSecurity,
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: schemaRef("ChangePasswordRequest"),
              },
            },
          },
          responses: {
            200: jsonResponse("Password berhasil diubah.", {
              type: "object",
              required: ["message"],
              properties: { message: { type: "string" } },
            }),
            400: errorResponse("Payload password tidak valid."),
            401: errorResponse("Token atau password lama tidak valid."),
            403: errorResponse("Role tidak diizinkan."),
            404: errorResponse("Pasien tidak ditemukan."),
          },
        },
      },
      "/layanan": {
        get: {
          tags: ["Layanan"],
          summary: "Daftar layanan aktif",
          responses: {
            200: jsonResponse("Daftar layanan aktif.", {
              type: "object",
              required: ["data"],
              properties: {
                data: { type: "array", items: schemaRef("Layanan") },
              },
            }),
          },
        },
      },
      "/layanan/{id_layanan}": {
        get: {
          tags: ["Layanan"],
          summary: "Detail layanan aktif",
          parameters: [parameterRef("ServiceId")],
          responses: {
            200: jsonResponse("Detail layanan.", {
              type: "object",
              required: ["data"],
              properties: { data: schemaRef("Layanan") },
            }),
            400: errorResponse("ID layanan tidak valid."),
            404: errorResponse("Layanan aktif tidak ditemukan."),
          },
        },
      },
      "/jadwal/tersedia": {
        get: {
          tags: ["Jadwal"],
          summary: "Daftar slot jadwal tersedia",
          security: bearerSecurity,
          parameters: [parameterRef("Tanggal")],
          responses: {
            200: jsonResponse("Slot tersedia.", {
              type: "object",
              required: ["data"],
              properties: {
                data: { type: "array", items: schemaRef("Jadwal") },
              },
            }),
            400: errorResponse("Tanggal tidak valid."),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya pasien yang dapat mengakses."),
          },
        },
      },
      "/reservasi": {
        post: {
          tags: ["Reservasi"],
          summary: "Buat reservasi mandiri",
          description:
            "Email pasien diambil dari JWT. Jumlah slot harus sesuai estimasi durasi layanan.",
          security: bearerSecurity,
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: schemaRef("ReservationRequest"),
              },
            },
          },
          responses: {
            201: jsonResponse(
              "Reservasi berhasil dibuat.",
              messageSchema("reservasi", schemaRef("Reservasi")),
            ),
            400: errorResponse("Payload reservasi atau profil pasien tidak valid."),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya pasien yang dapat mengakses."),
            404: errorResponse("Pasien, layanan, atau slot tidak ditemukan."),
            409: errorResponse("Slot tidak tersedia."),
          },
        },
      },
      "/reservasi/me": {
        get: {
          tags: ["Reservasi"],
          summary: "Daftar reservasi pasien login",
          security: bearerSecurity,
          parameters: [parameterRef("Page"), parameterRef("Limit")],
          responses: {
            200: jsonResponse(
              "Daftar reservasi pasien.",
              paginatedSchema(schemaRef("Reservasi")),
            ),
            400: errorResponse("Parameter pagination tidak valid."),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya pasien yang dapat mengakses."),
          },
        },
      },
      "/reservasi/{no_reservasi}": {
        get: {
          tags: ["Reservasi"],
          summary: "Detail reservasi",
          description:
            "Pasien hanya dapat melihat reservasinya sendiri; resepsionis dapat melihat semua reservasi.",
          security: bearerSecurity,
          parameters: [parameterRef("ReservationNumber")],
          responses: {
            200: jsonResponse("Detail reservasi.", {
              type: "object",
              required: ["reservasi"],
              properties: { reservasi: schemaRef("Reservasi") },
            }),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Akses reservasi ditolak."),
            404: errorResponse("Reservasi tidak ditemukan."),
          },
        },
      },
      "/reservasi/{no_reservasi}/batal": {
        patch: {
          tags: ["Reservasi"],
          summary: "Batalkan reservasi pasien",
          description:
            "Hanya reservasi Terjadwal milik pasien. Backend mencatat pihak Pasien dan melepas slot dalam transaksi. Pembatalan tidak dapat dilakukan melalui endpoint status umum.",
          security: bearerSecurity,
          parameters: [parameterRef("ReservationNumber")],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: schemaRef("CancellationRequest"),
              },
            },
          },
          responses: {
            200: jsonResponse(
              "Reservasi berhasil dibatalkan.",
              messageSchema("reservasi", schemaRef("Reservasi")),
            ),
            400: errorResponse("Alasan pembatalan wajib dan maksimal 255 karakter."),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Akses reservasi ditolak."),
            404: errorResponse("Reservasi tidak ditemukan."),
            409: errorResponse("Transisi status atau waktu pembatalan tidak valid."),
          },
        },
      },
      "/resepsionis/pasien": {
        get: {
          tags: ["Resepsionis - Pasien"],
          summary: "Daftar pasien",
          security: bearerSecurity,
          parameters: [
            parameterRef("Page"),
            parameterRef("Limit"),
            parameterRef("Search"),
          ],
          responses: {
            200: jsonResponse(
              "Daftar pasien.",
              paginatedSchema(schemaRef("Pasien")),
            ),
            400: errorResponse("Parameter pagination tidak valid."),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya resepsionis yang dapat mengakses."),
          },
        },
        post: {
          tags: ["Resepsionis - Pasien"],
          summary: "Buat pasien oleh resepsionis",
          description:
            "Password yang dikirim dapat digunakan sebagai password sementara pasien.",
          security: bearerSecurity,
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: schemaRef("ReceptionistPatientCreateRequest"),
              },
            },
          },
          responses: {
            201: jsonResponse(
              "Pasien berhasil dibuat.",
              messageSchema("patient", schemaRef("Pasien")),
            ),
            400: errorResponse("Data pasien tidak valid."),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya resepsionis yang dapat mengakses."),
            409: errorResponse("Email telah terdaftar."),
          },
        },
      },
      "/resepsionis/pasien/{email}": {
        put: {
          tags: ["Resepsionis - Pasien"],
          summary: "Ubah data pasien",
          security: bearerSecurity,
          parameters: [parameterRef("Email")],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: schemaRef("ReceptionistPatientUpdateRequest"),
              },
            },
          },
          responses: {
            200: jsonResponse(
              "Data pasien berhasil diperbarui.",
              messageSchema("patient", schemaRef("Pasien")),
            ),
            400: errorResponse("Tidak ada field pasien yang valid."),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya resepsionis yang dapat mengakses."),
            404: errorResponse("Pasien tidak ditemukan."),
          },
        },
      },
      "/resepsionis/layanan": {
        get: {
          tags: ["Resepsionis - Layanan"],
          summary: "Daftar seluruh layanan",
          security: bearerSecurity,
          parameters: [
            parameterRef("Page"),
            parameterRef("Limit"),
            parameterRef("Search"),
            parameterRef("ServiceStatus"),
          ],
          responses: {
            200: jsonResponse(
              "Daftar layanan.",
              paginatedSchema(schemaRef("Layanan")),
            ),
            400: errorResponse("Parameter atau status layanan tidak valid."),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya resepsionis yang dapat mengakses."),
          },
        },
        post: {
          tags: ["Resepsionis - Layanan"],
          summary: "Buat layanan",
          security: bearerSecurity,
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: schemaRef("LayananRequest") },
            },
          },
          responses: {
            201: jsonResponse(
              "Layanan berhasil dibuat.",
              messageSchema("layanan", schemaRef("Layanan")),
            ),
            400: errorResponse("Data layanan tidak valid."),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya resepsionis yang dapat mengakses."),
          },
        },
      },
      "/resepsionis/layanan/{id_layanan}": {
        put: {
          tags: ["Resepsionis - Layanan"],
          summary: "Ubah layanan",
          security: bearerSecurity,
          parameters: [parameterRef("ServiceId")],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: schemaRef("LayananUpdateRequest"),
              },
            },
          },
          responses: {
            200: jsonResponse(
              "Layanan berhasil diperbarui.",
              messageSchema("layanan", schemaRef("Layanan")),
            ),
            400: errorResponse("Data layanan tidak valid."),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya resepsionis yang dapat mengakses."),
            404: errorResponse("Layanan tidak ditemukan."),
          },
        },
      },
      "/resepsionis/layanan/{id_layanan}/nonaktif": {
        patch: {
          tags: ["Resepsionis - Layanan"],
          summary: "Nonaktifkan layanan",
          security: bearerSecurity,
          parameters: [parameterRef("ServiceId")],
          responses: {
            200: jsonResponse(
              "Layanan berhasil dinonaktifkan.",
              messageSchema("layanan", schemaRef("Layanan")),
            ),
            400: errorResponse("ID layanan tidak valid."),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya resepsionis yang dapat mengakses."),
            404: errorResponse("Layanan tidak ditemukan."),
          },
        },
      },
      "/resepsionis/layanan/{id_layanan}/aktif": {
        patch: {
          tags: ["Resepsionis - Layanan"],
          summary: "Aktifkan layanan",
          security: bearerSecurity,
          parameters: [parameterRef("ServiceId")],
          responses: {
            200: jsonResponse(
              "Layanan berhasil diaktifkan.",
              messageSchema("layanan", schemaRef("Layanan")),
            ),
            400: errorResponse("ID layanan tidak valid."),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya resepsionis yang dapat mengakses."),
            404: errorResponse("Layanan tidak ditemukan."),
          },
        },
      },
      "/resepsionis/jadwal": {
        get: {
          tags: ["Resepsionis - Jadwal"],
          summary: "Daftar slot jadwal",
          security: bearerSecurity,
          parameters: [parameterRef("Tanggal")],
          responses: {
            200: jsonResponse("Daftar slot jadwal.", {
              type: "object",
              required: ["data"],
              properties: {
                data: { type: "array", items: schemaRef("Jadwal") },
              },
            }),
            400: errorResponse("Tanggal tidak valid."),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya resepsionis yang dapat mengakses."),
          },
        },
        post: {
          tags: ["Resepsionis - Jadwal"],
          summary: "Buat slot jadwal",
          security: bearerSecurity,
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: schemaRef("JadwalRequest") },
            },
          },
          responses: {
            201: jsonResponse(
              "Slot jadwal berhasil dibuat.",
              messageSchema("jadwal", schemaRef("Jadwal")),
            ),
            400: errorResponse("Data jadwal tidak valid."),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya resepsionis yang dapat mengakses."),
            409: errorResponse("Slot pada tanggal dan waktu tersebut sudah ada."),
          },
        },
      },
      "/resepsionis/jadwal/batch-status": {
        patch: {
          tags: ["Resepsionis - Jadwal"],
          summary: "Ubah status semua slot pada satu tanggal",
          description:
            "Slot yang sudah terhubung ke reservasi tidak diubah dan dikembalikan dalam data respons.",
          security: bearerSecurity,
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: schemaRef("JadwalBatchStatusRequest") },
            },
          },
          responses: {
            200: jsonResponse("Status slot berhasil diperbarui.", {
              type: "object",
              required: ["message", "data", "updated_count", "skipped_booked_count"],
              properties: {
                message: { type: "string" },
                data: { type: "array", items: schemaRef("Jadwal") },
                updated_count: { type: "integer", minimum: 0 },
                skipped_booked_count: { type: "integer", minimum: 0 },
              },
            }),
            400: errorResponse("Tanggal atau status tidak valid."),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya resepsionis yang dapat mengakses."),
            404: errorResponse("Tidak ada slot pada tanggal tersebut."),
          },
        },
      },
      "/resepsionis/jadwal/{id_jadwal}/aktif": {
        patch: {
          tags: ["Resepsionis - Jadwal"],
          summary: "Aktifkan slot jadwal",
          security: bearerSecurity,
          parameters: [parameterRef("ScheduleId")],
          responses: {
            200: jsonResponse(
              "Slot jadwal berhasil diaktifkan.",
              messageSchema("jadwal", schemaRef("Jadwal")),
            ),
            400: errorResponse("ID jadwal tidak valid."),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya resepsionis yang dapat mengakses."),
            404: errorResponse("Slot jadwal tidak ditemukan."),
          },
        },
      },
      "/resepsionis/jadwal/{id_jadwal}/nonaktif": {
        patch: {
          tags: ["Resepsionis - Jadwal"],
          summary: "Nonaktifkan slot jadwal",
          security: bearerSecurity,
          parameters: [parameterRef("ScheduleId")],
          responses: {
            200: jsonResponse(
              "Slot jadwal berhasil dinonaktifkan.",
              messageSchema("jadwal", schemaRef("Jadwal")),
            ),
            400: errorResponse("ID jadwal tidak valid."),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya resepsionis yang dapat mengakses."),
            404: errorResponse("Slot jadwal tidak ditemukan."),
            409: errorResponse("Slot yang sudah dipesan tidak dapat dinonaktifkan."),
          },
        },
      },
      "/resepsionis/reservasi": {
        get: {
          tags: ["Resepsionis - Reservasi"],
          summary: "Daftar reservasi",
          security: bearerSecurity,
          parameters: [
            parameterRef("Page"),
            parameterRef("Limit"),
            parameterRef("ReservationStatus"),
            parameterRef("PatientEmail"),
          ],
          responses: {
            200: jsonResponse(
              "Daftar reservasi.",
              paginatedSchema(schemaRef("Reservasi")),
            ),
            400: errorResponse("Parameter atau status reservasi tidak valid."),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya resepsionis yang dapat mengakses."),
          },
        },
        post: {
          tags: ["Resepsionis - Reservasi"],
          summary: "Buat reservasi untuk pasien",
          description: "id_resepsionis diambil dari JWT resepsionis.",
          security: bearerSecurity,
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: schemaRef("ReceptionistReservationRequest"),
              },
            },
          },
          responses: {
            201: jsonResponse(
              "Reservasi berhasil dibuat.",
              messageSchema("reservasi", schemaRef("Reservasi")),
            ),
            400: errorResponse("Payload reservasi atau profil pasien tidak valid."),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya resepsionis yang dapat mengakses."),
            404: errorResponse("Pasien, layanan, atau slot tidak ditemukan."),
            409: errorResponse("Slot tidak tersedia."),
          },
        },
      },
      "/resepsionis/reservasi/{no_reservasi}/hadir": {
        patch: {
          tags: ["Resepsionis - Reservasi"],
          summary: "Tandai reservasi hadir",
          description: "Transisi status dari Terjadwal ke Hadir.",
          security: bearerSecurity,
          parameters: [parameterRef("ReservationNumber")],
          responses: {
            200: jsonResponse(
              "Status reservasi berhasil diperbarui.",
              messageSchema("reservasi", schemaRef("Reservasi")),
            ),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya resepsionis yang dapat mengakses."),
            404: errorResponse("Reservasi tidak ditemukan."),
            409: errorResponse("Transisi status tidak valid."),
          },
        },
      },
      "/resepsionis/reservasi/{no_reservasi}/selesai": {
        patch: {
          tags: ["Resepsionis - Reservasi"],
          summary: "Tandai reservasi selesai",
          description: "Transisi status dari Hadir ke Selesai.",
          security: bearerSecurity,
          parameters: [parameterRef("ReservationNumber")],
          responses: {
            200: jsonResponse(
              "Status reservasi berhasil diperbarui.",
              messageSchema("reservasi", schemaRef("Reservasi")),
            ),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya resepsionis yang dapat mengakses."),
            404: errorResponse("Reservasi tidak ditemukan."),
            409: errorResponse("Transisi status tidak valid."),
          },
        },
      },
      "/resepsionis/reservasi/{no_reservasi}/tidak-hadir": {
        patch: {
          tags: ["Resepsionis - Reservasi"],
          summary: "Tandai reservasi tidak hadir",
          description: "Transisi status dari Terjadwal ke Tidak Hadir.",
          security: bearerSecurity,
          parameters: [parameterRef("ReservationNumber")],
          responses: {
            200: jsonResponse(
              "Status reservasi berhasil diperbarui.",
              messageSchema("reservasi", schemaRef("Reservasi")),
            ),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya resepsionis yang dapat mengakses."),
            404: errorResponse("Reservasi tidak ditemukan."),
            409: errorResponse("Transisi status tidak valid."),
          },
        },
      },
      "/resepsionis/reservasi/{no_reservasi}/batal": {
        patch: {
          tags: ["Resepsionis - Reservasi"],
          summary: "Batalkan reservasi",
          description:
            "Endpoint khusus pembatalan. Backend mencatat pihak Resepsionis, resepsionis pemroses, dan melepas seluruh slot dalam satu transaksi.",
          security: bearerSecurity,
          parameters: [parameterRef("ReservationNumber")],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: schemaRef("CancellationRequest"),
              },
            },
          },
          responses: {
            200: jsonResponse(
              "Reservasi berhasil dibatalkan.",
              messageSchema("reservasi", schemaRef("Reservasi")),
            ),
            400: errorResponse("Alasan pembatalan wajib dan maksimal 255 karakter."),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya resepsionis yang dapat mengakses."),
            404: errorResponse("Reservasi tidak ditemukan."),
            409: errorResponse("Transisi status atau waktu pembatalan tidak valid."),
          },
        },
      },
      "/resepsionis/reservasi/{no_reservasi}/tagihan": {
        get: {
          tags: ["Resepsionis - Pembayaran"],
          summary: "Kalkulasi tagihan reservasi",
          description:
            "Hanya reservasi berstatus Selesai yang dapat ditagihkan. Harga berasal dari snapshot reservasi.",
          security: bearerSecurity,
          parameters: [parameterRef("ReservationNumber")],
          responses: {
            200: jsonResponse("Tagihan reservasi.", {
              type: "object",
              required: ["tagihan"],
              properties: { tagihan: schemaRef("Tagihan") },
            }),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya resepsionis yang dapat mengakses."),
            404: errorResponse("Reservasi tidak ditemukan."),
            409: errorResponse("Reservasi belum selesai."),
          },
        },
      },
      "/resepsionis/pembayaran": {
        get: {
          tags: ["Resepsionis - Pembayaran"],
          summary: "Daftar pembayaran",
          security: bearerSecurity,
          parameters: [
            parameterRef("Page"),
            parameterRef("Limit"),
            parameterRef("PaymentMethod"),
          ],
          responses: {
            200: jsonResponse(
              "Daftar pembayaran.",
              paginatedSchema(schemaRef("Pembayaran")),
            ),
            400: errorResponse("Parameter atau metode pembayaran tidak valid."),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya resepsionis yang dapat mengakses."),
          },
        },
        post: {
          tags: ["Resepsionis - Pembayaran"],
          summary: "Simpan pembayaran",
          description:
            "Total biaya dihitung backend dari snapshot harga reservasi; client tidak mengirim total_biaya.",
          security: bearerSecurity,
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: schemaRef("PaymentRequest") },
            },
          },
          responses: {
            201: jsonResponse(
              "Pembayaran berhasil dibuat.",
              messageSchema("pembayaran", schemaRef("Pembayaran")),
            ),
            400: errorResponse("Payload pembayaran tidak valid."),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya resepsionis yang dapat mengakses."),
            404: errorResponse("Reservasi tidak ditemukan."),
            409: errorResponse("Reservasi belum selesai atau sudah dibayar."),
          },
        },
      },
      "/resepsionis/pembayaran/{no_reservasi}": {
        get: {
          tags: ["Resepsionis - Pembayaran"],
          summary: "Detail pembayaran",
          description:
            "Pembayaran adalah weak entity dan diidentifikasi oleh no_reservasi sebagai primary key sekaligus foreign key.",
          security: bearerSecurity,
          parameters: [parameterRef("ReservationNumber")],
          responses: {
            200: jsonResponse("Detail pembayaran.", {
              type: "object",
              required: ["pembayaran"],
              properties: { pembayaran: schemaRef("Pembayaran") },
            }),
            401: errorResponse("Token tidak ada atau tidak valid."),
            403: errorResponse("Hanya resepsionis yang dapat mengakses."),
            404: errorResponse("Pembayaran tidak ditemukan."),
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
