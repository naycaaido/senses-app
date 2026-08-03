import BadRequestError from "../exceptions/BadRequestError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import { StatusLayanan } from "@prisma/client";
import prisma from "../config/prisma.js";

const SERVICE_STATUS = Object.values(StatusLayanan);
const EDITABLE_FIELDS = [
  "nama_layanan",
  "estimasi_durasi",
  "deskripsi_layanan",
  "harga",
];

const LAYANAN_SELECT = {
  id_layanan: true,
  nama_layanan: true,
  estimasi_durasi: true,
  deskripsi_layanan: true,
  harga: true,
  status_layanan: true,
};

const serializeLayanan = (layanan) => ({
  ...layanan,
  harga: Number(layanan.harga),
});

const requiredText = (value, field) => {
  const normalized = typeof value === "string" ? value.trim() : value;
  if (!normalized) {
    throw new BadRequestError(`${field} is required`);
  }
  return normalized;
};

const validDuration = (value) => {
  const duration = Number(value);
  if (
    !Number.isSafeInteger(duration) ||
    duration <= 0 ||
    duration % 30 !== 0
  ) {
    throw new BadRequestError(
      "estimasi_durasi must be a positive multiple of 30 minutes",
    );
  }
  return duration;
};

const validPrice = (value) => {
  if (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "")
  ) {
    throw new BadRequestError("harga is required");
  }

  const price = Number(value);
  if (!Number.isFinite(price) || price < 0) {
    throw new BadRequestError("harga must be a number greater than or equal to 0");
  }
  return price;
};

const createDataFrom = (payload) => ({
  nama_layanan: requiredText(payload.nama_layanan, "nama_layanan"),
  estimasi_durasi: validDuration(payload.estimasi_durasi),
  deskripsi_layanan: requiredText(
    payload.deskripsi_layanan,
    "deskripsi_layanan",
  ),
  harga: validPrice(payload.harga),
});

const updateDataFrom = (payload) => {
  const fields = EDITABLE_FIELDS.filter((field) => field in payload);
  if (fields.length === 0) {
    throw new BadRequestError("No editable service fields were provided");
  }

  const data = {};
  for (const field of fields) {
    if (field === "estimasi_durasi") {
      data[field] = validDuration(payload[field]);
    } else if (field === "harga") {
      data[field] = validPrice(payload[field]);
    } else {
      data[field] = requiredText(payload[field], field);
    }
  }

  return data;
};

const getActiveLayanan = async () => {
  const data = await prisma.layanan.findMany({
    where: { status_layanan: StatusLayanan.Aktif },
    orderBy: { nama_layanan: "asc" },
    select: LAYANAN_SELECT,
  });
  return data.map(serializeLayanan);
};

const getActiveLayananById = async (id_layanan) => {
  const layanan = await prisma.layanan.findFirst({
    where: { id_layanan, status_layanan: StatusLayanan.Aktif },
    select: LAYANAN_SELECT,
  });
  if (!layanan) {
    throw new NotFoundError("Active service not found");
  }
  return serializeLayanan(layanan);
};

const listLayananByResepsionis = async ({ page, limit, search, status }) => {
  if (status && !SERVICE_STATUS.includes(status)) {
    throw new BadRequestError("status must be Aktif or Nonaktif");
  }

  const filters = [];
  if (search) {
    filters.push({ nama_layanan: { contains: search, mode: "insensitive" } });
  }
  if (status) {
    filters.push({ status_layanan: status });
  }

  const where = filters.length > 0 ? { AND: filters } : undefined;
  const [data, total] = await Promise.all([
    prisma.layanan.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { nama_layanan: "asc" },
      select: LAYANAN_SELECT,
    }),
    prisma.layanan.count({ where }),
  ]);

  return {
    data: data.map(serializeLayanan),
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  };
};

const createLayanan = async (payload) => {
  return serializeLayanan(
    await prisma.layanan.create({
      data: createDataFrom(payload),
      select: LAYANAN_SELECT,
    }),
  );
};

const updateLayanan = async (id_layanan, payload) => {
  const existing = await prisma.layanan.findUnique({
    where: { id_layanan },
    select: { id_layanan: true },
  });
  if (!existing) {
    throw new NotFoundError("Service not found");
  }

  return serializeLayanan(
    await prisma.layanan.update({
      where: { id_layanan },
      data: updateDataFrom(payload),
      select: LAYANAN_SELECT,
    }),
  );
};

const setLayananStatus = async (id_layanan, status_layanan) => {
  const existing = await prisma.layanan.findUnique({
    where: { id_layanan },
    select: { id_layanan: true },
  });
  if (!existing) {
    throw new NotFoundError("Service not found");
  }

  return serializeLayanan(
    await prisma.layanan.update({
      where: { id_layanan },
      data: { status_layanan },
      select: LAYANAN_SELECT,
    }),
  );
};

export default {
  getActiveLayanan,
  getActiveLayananById,
  listLayananByResepsionis,
  createLayanan,
  updateLayanan,
  setLayananStatus,
};
