import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sense Clinic API",
      version: "1.0.0",
      description: "API documentation for Sense Clinic backend",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        RegisterRequest: {
          type: "object",
          required: ["email", "password", "nama_lengkap"],
          properties: {
            email: { type: "string", example: "testpasien@gmail.com" },
            password: { type: "string", example: "123456" },
            nama_lengkap: { type: "string", example: "Test Pasien" },
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
            email: { type: "string", example: "testpasien@gmail.com" },
            id_resepsionis: { type: "integer", example: 1 },
            password: { type: "string", example: "123456" },
          },
        },
        User: {
          type: "object",
          properties: {
            email: { type: "string", example: "testpasien@gmail.com" },
            nama_lengkap: { type: "string", example: "Test Pasien" },
            telepon: { type: "string", example: "08123456789" },
            jenis_kelamin: { type: "string", example: "Laki-laki" },
            tempat_lahir: { type: "string", example: "Jakarta" },
            tanggal_lahir: { type: "string", format: "date", example: "2003-01-01" },
            pendidikan_terakhir: { type: "string", example: "SMA" },
            pekerjaan: { type: "string", example: "Mahasiswa" },
            status_perkawinan: { type: "string", example: "Belum Menikah" },
            agama: { type: "string", example: "Islam" },
            alamat_domisili: { type: "string", example: "Jl. Contoh No. 1" },
            kota: { type: "string", example: "Jakarta" },
            profil_lengkap: { type: "boolean", example: true },
          },
        },
        ProfileRequest: {
          type: "object",
          required: [
            "email",
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
            email: { type: "string", example: "testpasien@gmail.com" },
            telepon: { type: "string", example: "08123456789" },
            jenis_kelamin: { type: "string", example: "Laki-laki" },
            tempat_lahir: { type: "string", example: "Jakarta" },
            tanggal_lahir: { type: "string", format: "date", example: "2003-01-01" },
            pendidikan_terakhir: { type: "string", example: "SMA" },
            pekerjaan: { type: "string", example: "Mahasiswa" },
            status_perkawinan: { type: "string", example: "Belum Menikah" },
            agama: { type: "string", example: "Islam" },
            alamat_domisili: { type: "string", example: "Jl. Contoh No. 1" },
            kota: { type: "string", example: "Jakarta" },
          },
        },
        ChangePasswordRequest: {
          type: "object",
          required: [
            "password_lama",
            "password_baru",
            "konfirmasi_password",
          ],
          properties: {
            password_lama: { type: "string", example: "password-lama" },
            password_baru: { type: "string", example: "password-baru" },
            konfirmasi_password: {
              type: "string",
              example: "password-baru",
            },
          },
        },
        ReceptionistPatientRequest: {
          type: "object",
          required: ["email", "password", "nama_lengkap", "telepon"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
            nama_lengkap: { type: "string" },
            telepon: { type: "string" },
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
            estimasi_durasi: { type: "integer", example: 60 },
            deskripsi_layanan: { type: "string" },
            harga: { type: "number", example: 250000 },
          },
        },
        JadwalRequest: {
          type: "object",
          required: ["tanggal", "jam_mulai", "jam_selesai"],
          properties: {
            tanggal: { type: "string", format: "date" },
            jam_mulai: { type: "string", example: "09:00" },
            jam_selesai: { type: "string", example: "09:30" },
          },
        },
        ReservationRequest: {
          type: "object",
          required: ["id_layanan", "id_jadwal"],
          properties: {
            id_layanan: { type: "integer", example: 1 },
            id_jadwal: {
              type: "array",
              items: { type: "integer" },
              example: [10, 11],
            },
            keluhan_awal: { type: "string" },
          },
        },
        ReceptionistReservationRequest: {
          allOf: [
            { $ref: "#/components/schemas/ReservationRequest" },
            {
              type: "object",
              required: ["email_pasien"],
              properties: { email_pasien: { type: "string", format: "email" } },
            },
          ],
        },
        CancellationRequest: {
          type: "object",
          properties: { alasan_pembatalan: { type: "string" } },
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
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Email already registered" },
          },
        },
      },
    },
    paths: {
      "/layanan": {
        get: { summary: "List active services", tags: ["Layanan"], responses: { 200: { description: "Active services" } } },
      },
      "/layanan/{id_layanan}": {
        get: {
          summary: "Get an active service", tags: ["Layanan"],
          parameters: [{ name: "id_layanan", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { description: "Service" }, 404: { description: "Not found" } },
        },
      },
      "/jadwal/tersedia": {
        get: {
          summary: "List available schedule slots", tags: ["Jadwal"], security: [{ bearerAuth: [] }],
          parameters: [{ name: "tanggal", in: "query", required: true, schema: { type: "string", format: "date" } }],
          responses: { 200: { description: "Available slots" } },
        },
      },
      "/reservasi": {
        post: { summary: "Create a patient reservation", tags: ["Reservasi"], security: [{ bearerAuth: [] }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ReservationRequest" } } } }, responses: { 201: { description: "Reservation created" } } },
      },
      "/reservasi/me": {
        get: { summary: "List the authenticated patient's reservations", tags: ["Reservasi"], security: [{ bearerAuth: [] }], responses: { 200: { description: "Reservation history" } } },
      },
      "/reservasi/{no_reservasi}": {
        get: { summary: "Get reservation detail", tags: ["Reservasi"], security: [{ bearerAuth: [] }], parameters: [{ name: "no_reservasi", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Reservation detail" } } },
      },
      "/reservasi/{no_reservasi}/batal": {
        patch: { summary: "Cancel a patient's reservation", tags: ["Reservasi"], security: [{ bearerAuth: [] }], parameters: [{ name: "no_reservasi", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/CancellationRequest" } } } }, responses: { 200: { description: "Reservation cancelled" }, 409: { description: "Cancellation is no longer allowed" } } },
      },
      "/resepsionis/pasien": {
        get: { summary: "List patients", tags: ["Resepsionis - Pasien"], security: [{ bearerAuth: [] }], responses: { 200: { description: "Patients" } } },
        post: { summary: "Create a patient", tags: ["Resepsionis - Pasien"], security: [{ bearerAuth: [] }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ReceptionistPatientRequest" } } } }, responses: { 201: { description: "Patient created" } } },
      },
      "/resepsionis/pasien/{email}": {
        put: { summary: "Update patient data", tags: ["Resepsionis - Pasien"], security: [{ bearerAuth: [] }], parameters: [{ name: "email", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Patient updated" } } },
      },
      "/resepsionis/layanan": {
        get: { summary: "List all services", tags: ["Resepsionis - Layanan"], security: [{ bearerAuth: [] }], responses: { 200: { description: "Services" } } },
        post: { summary: "Create a service", tags: ["Resepsionis - Layanan"], security: [{ bearerAuth: [] }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/LayananRequest" } } } }, responses: { 201: { description: "Service created" } } },
      },
      "/resepsionis/layanan/{id_layanan}": {
        put: { summary: "Update a service", tags: ["Resepsionis - Layanan"], security: [{ bearerAuth: [] }], parameters: [{ name: "id_layanan", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Service updated" } } },
      },
      "/resepsionis/layanan/{id_layanan}/nonaktif": {
        patch: { summary: "Deactivate a service", tags: ["Resepsionis - Layanan"], security: [{ bearerAuth: [] }], parameters: [{ name: "id_layanan", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Service deactivated" } } },
      },
      "/resepsionis/jadwal": {
        get: { summary: "List schedule slots", tags: ["Resepsionis - Jadwal"], security: [{ bearerAuth: [] }], responses: { 200: { description: "Schedule slots" } } },
        post: { summary: "Create a schedule slot", tags: ["Resepsionis - Jadwal"], security: [{ bearerAuth: [] }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/JadwalRequest" } } } }, responses: { 201: { description: "Slot created" } } },
      },
      "/resepsionis/jadwal/{id_jadwal}/aktif": {
        patch: { summary: "Activate a schedule slot", tags: ["Resepsionis - Jadwal"], security: [{ bearerAuth: [] }], parameters: [{ name: "id_jadwal", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Slot activated" } } },
      },
      "/resepsionis/jadwal/{id_jadwal}/nonaktif": {
        patch: { summary: "Deactivate a schedule slot", tags: ["Resepsionis - Jadwal"], security: [{ bearerAuth: [] }], parameters: [{ name: "id_jadwal", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Slot deactivated" } } },
      },
      "/resepsionis/reservasi": {
        get: { summary: "List reservations", tags: ["Resepsionis - Reservasi"], security: [{ bearerAuth: [] }], responses: { 200: { description: "Reservations" } } },
        post: { summary: "Create a reservation for a patient", tags: ["Resepsionis - Reservasi"], security: [{ bearerAuth: [] }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ReceptionistReservationRequest" } } } }, responses: { 201: { description: "Reservation created" } } },
      },
      "/resepsionis/reservasi/{no_reservasi}/hadir": {
        patch: { summary: "Mark reservation as present", tags: ["Resepsionis - Reservasi"], security: [{ bearerAuth: [] }], parameters: [{ name: "no_reservasi", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Status updated" } } },
      },
      "/resepsionis/reservasi/{no_reservasi}/selesai": {
        patch: { summary: "Mark reservation as completed", tags: ["Resepsionis - Reservasi"], security: [{ bearerAuth: [] }], parameters: [{ name: "no_reservasi", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Status updated" } } },
      },
      "/resepsionis/reservasi/{no_reservasi}/tidak-hadir": {
        patch: { summary: "Mark reservation as no-show", tags: ["Resepsionis - Reservasi"], security: [{ bearerAuth: [] }], parameters: [{ name: "no_reservasi", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Status updated" } } },
      },
      "/resepsionis/reservasi/{no_reservasi}/batal": {
        patch: { summary: "Cancel a reservation", tags: ["Resepsionis - Reservasi"], security: [{ bearerAuth: [] }], parameters: [{ name: "no_reservasi", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/CancellationRequest" } } } }, responses: { 200: { description: "Reservation cancelled" } } },
      },
      "/resepsionis/reservasi/{no_reservasi}/tagihan": {
        get: { summary: "Calculate reservation bill", tags: ["Resepsionis - Pembayaran"], security: [{ bearerAuth: [] }], parameters: [{ name: "no_reservasi", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Bill" } } },
      },
      "/resepsionis/pembayaran": {
        get: { summary: "List payments", tags: ["Resepsionis - Pembayaran"], security: [{ bearerAuth: [] }], responses: { 200: { description: "Payments" } } },
        post: { summary: "Create a payment", tags: ["Resepsionis - Pembayaran"], security: [{ bearerAuth: [] }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/PaymentRequest" } } } }, responses: { 201: { description: "Payment created" } } },
      },
      "/resepsionis/pembayaran/{id_pembayaran}": {
        get: { summary: "Get payment detail", tags: ["Resepsionis - Pembayaran"], security: [{ bearerAuth: [] }], parameters: [{ name: "id_pembayaran", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Payment" } } },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
