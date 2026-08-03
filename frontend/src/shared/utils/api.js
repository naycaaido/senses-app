import { getToken, clearAuthSession, getAuthUser } from "./authStorage.js";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export class ApiError extends Error {
  constructor({ message, statusCode, errorCode, data }) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.data = data;
  }
}

function redirectToLogin(role) {
  const target = role === "resepsionis" ? "/resepsionis/login" : "/login";
  window.location.href = target;
}

function cleanParams(params) {
  if (!params) return undefined;
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== "",
  );
  return entries.length ? Object.fromEntries(entries) : undefined;
}

async function request(method, endpoint, body, options = {}) {
  const { handleUnauthorized = true } = options;
  const url = `${BASE_URL}${endpoint}`;
  const headers = { Accept: "application/json" };
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let fetchBody;
  if (body !== undefined && body !== null) {
    if (body instanceof FormData) {
      fetchBody = body;
    } else {
      headers["Content-Type"] = "application/json";
      fetchBody = JSON.stringify(body);
    }
  }

  let res;
  try {
    res = await fetch(url, { method, headers, body: fetchBody });
  } catch {
    throw new ApiError({
      message: "Koneksi gagal. Periksa jaringan atau server.",
      statusCode: 0,
    });
  }

  if (res.status === 401 && handleUnauthorized) {
    const user = getAuthUser();
    const role = user?.role;
    clearAuthSession();
    redirectToLogin(role);
    throw new ApiError({
      message: "Sesi berakhir. Silakan login ulang.",
      statusCode: 401,
    });
  }

  let data;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      // response JSON rusak — biarkan undefined
    }
  } else if (res.status !== 204 && res.status !== 205) {
    const text = await res.text().catch(() => "");
    if (text) {
      data = { message: text };
    }
  }

  if (!res.ok) {
    const message = data?.message || "Terjadi kesalahan server";
    throw new ApiError({
      message,
      statusCode: res.status,
      errorCode: data?.error_code || "error",
      data,
    });
  }

  return data;
}

function buildQueryString(params) {
  const cleaned = cleanParams(params);
  if (!cleaned) return "";
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(cleaned)) {
    search.set(k, String(v));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

const api = {
  get(endpoint, params, options) {
    const qs = buildQueryString(params);
    return request("GET", `${endpoint}${qs}`, undefined, options);
  },
  post(endpoint, body, options) {
    return request("POST", endpoint, body, options);
  },
  put(endpoint, body, options) {
    return request("PUT", endpoint, body, options);
  },
  patch(endpoint, body, options) {
    return request("PATCH", endpoint, body, options);
  },
  delete(endpoint, options) {
    return request("DELETE", endpoint, undefined, options);
  },
};

export default api;
