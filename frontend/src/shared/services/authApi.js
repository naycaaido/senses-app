import api from "../utils/api.js";

export function registerPatient(payload) {
  return api.post("/auth/register", payload);
}

export function loginPatient(payload) {
  return api.post("/auth/pasien/login", payload, { handleUnauthorized: false });
}

export function completePatientProfile(payload) {
  return api.put("/auth/profile", payload);
}

export function loginReceptionist(payload) {
  return api.post("/auth/resepsionis/login", payload, { handleUnauthorized: false });
}
