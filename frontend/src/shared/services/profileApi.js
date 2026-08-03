import api from "../utils/api.js";

export async function getPatientProfile() {
  const response = await api.get("/auth/profile");
  if (!response?.user) {
    throw new Error("Format profil dari server tidak valid.");
  }
  return response.user;
}

export async function updatePatientProfile(payload) {
  const response = await api.put("/auth/profile", payload);
  if (!response?.user) {
    throw new Error("Format profil dari server tidak valid.");
  }
  return response.user;
}
