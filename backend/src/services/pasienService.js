import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import { PROFILE_FIELDS } from "../constants/pasien.js";
import BadRequestError from "../exceptions/BadRequestError.js";
import ConflictError from "../exceptions/ConflictError.js";
import NotFoundError from "../exceptions/NotFoundError.js";

const RESEPSIONIS_EDITABLE_FIELDS = ["nama_lengkap", "telepon", ...PROFILE_FIELDS];

const PATIENT_PROFILE_SELECT = {
  email: true,
  nama_lengkap: true,
  telepon: true,
  jenis_kelamin: true,
  tempat_lahir: true,
  tanggal_lahir: true,
  pendidikan_terakhir: true,
  pekerjaan: true,
  status_perkawinan: true,
  agama: true,
  alamat_domisili: true,
  kota: true,
  profil_lengkap: true,
};

const normalizeOptionalValue = (value) => {
  if (typeof value === "string") {
    return value.trim() || null;
  }

  return value ?? null;
};

const requiredText = (value, field) => {
  const normalized = typeof value === "string" ? value.trim() : value;
  if (!normalized) {
    throw new BadRequestError(`${field} is required`);
  }

  return normalized;
};

const profileIsComplete = (patient) =>
  PROFILE_FIELDS.every((field) => Boolean(patient[field]));

const profileDataFrom = (payload) =>
  Object.fromEntries(
    PROFILE_FIELDS.filter((field) => field in payload).map((field) => [
      field,
      normalizeOptionalValue(payload[field]),
    ]),
  );

const createPasienByResepsionis = async (payload) => {
  const email = requiredText(payload.email, "email").toLowerCase();
  const password = requiredText(payload.password, "password");
  const nama_lengkap = requiredText(payload.nama_lengkap, "nama_lengkap");
  const telepon = requiredText(payload.telepon, "telepon");

  const existing = await prisma.pasien.findUnique({
    where: { email },
    select: { email: true },
  });
  if (existing) {
    throw new ConflictError("Email already registered");
  }

  const profileData = profileDataFrom(payload);
  const patientData = {
    email,
    password: await bcrypt.hash(password, 10),
    nama_lengkap,
    telepon,
    ...profileData,
  };

  patientData.profil_lengkap = profileIsComplete(patientData);

  return prisma.pasien.create({
    data: patientData,
    select: PATIENT_PROFILE_SELECT,
  });
};

const listPasienByResepsionis = async ({ page, limit, search }) => {
  const where = search
    ? {
        OR: [
          { nama_lengkap: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { telepon: { contains: search, mode: "insensitive" } },
          { kota: { contains: search, mode: "insensitive" } },
        ],
      }
    : undefined;
  const [data, total] = await Promise.all([
    prisma.pasien.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { nama_lengkap: "asc" },
      select: PATIENT_PROFILE_SELECT,
    }),
    prisma.pasien.count({ where }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  };
};

const updatePasienByResepsionis = async (email, payload) => {
  const existing = await prisma.pasien.findUnique({
    where: { email },
    select: PATIENT_PROFILE_SELECT,
  });
  if (!existing) {
    throw new NotFoundError("Patient not found");
  }

  const requestedFields = RESEPSIONIS_EDITABLE_FIELDS.filter(
    (field) => field in payload,
  );
  if (requestedFields.length === 0) {
    throw new BadRequestError("No editable patient fields were provided");
  }

  const data = {};
  for (const field of requestedFields) {
    data[field] =
      field === "nama_lengkap" || field === "telepon"
        ? requiredText(payload[field], field)
        : normalizeOptionalValue(payload[field]);
  }

  data.profil_lengkap = profileIsComplete({ ...existing, ...data });

  return prisma.pasien.update({
    where: { email },
    data,
    select: PATIENT_PROFILE_SELECT,
  });
};

export default {
  createPasienByResepsionis,
  listPasienByResepsionis,
  updatePasienByResepsionis,
};
