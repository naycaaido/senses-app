import { StatusReservasi } from "@prisma/client";

const PUBLIC_TO_INTERNAL = new Map([
  ["Terjadwal", StatusReservasi.Terjadwal],
  ["Hadir", StatusReservasi.Hadir],
  ["Selesai", StatusReservasi.Selesai],
  ["Dibatalkan", StatusReservasi.Dibatalkan],
  ["Tidak Hadir", StatusReservasi.TidakHadir],
]);

const INTERNAL_TO_PUBLIC = new Map(
  [...PUBLIC_TO_INTERNAL].map(([publicStatus, internalStatus]) => [
    internalStatus,
    publicStatus,
  ]),
);

export const PUBLIC_RESERVATION_STATUSES = [...PUBLIC_TO_INTERNAL.keys()];

export const toInternalReservationStatus = (status) =>
  PUBLIC_TO_INTERNAL.get(status);

export const toPublicReservationStatus = (status) =>
  INTERNAL_TO_PUBLIC.get(status) ?? status;
