const KEYS = {
  TOKEN: "token",
  USER: "auth_user",
  PENDING_EMAIL: "pendingProfileEmail",
};

export function getToken() {
  return localStorage.getItem(KEYS.TOKEN);
}

export function getAuthUser() {
  try {
    const raw = localStorage.getItem(KEYS.USER);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") throw new Error("Invalid auth_user");
    return parsed;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function setAuthSession(token, user) {
  if (!token || !user || !user.role) {
    console.warn("setAuthSession: token, user, dan role wajib diisi");
    return;
  }
  localStorage.setItem(KEYS.TOKEN, token);
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
}

export function updateAuthUser(user) {
  const current = getAuthUser();
  if (!current) return;
  const merged = { ...current, ...user };
  localStorage.setItem(KEYS.USER, JSON.stringify(merged));
}

export function clearAuthSession() {
  localStorage.removeItem(KEYS.TOKEN);
  localStorage.removeItem(KEYS.USER);
  localStorage.removeItem(KEYS.PENDING_EMAIL);
}

export function isAuthenticated() {
  return !!getToken() && !!getAuthUser();
}

export function hasRole(role) {
  const user = getAuthUser();
  return !!user && user.role === role;
}
