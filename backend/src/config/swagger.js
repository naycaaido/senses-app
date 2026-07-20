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
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "testpasien@gmail.com" },
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
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Email already registered" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
