const DEFAULT_BASE_URL =
  import.meta.env.VITE_API_URL || "https://student-marketplace-backend-3qqs.onrender.com";

export const TOKEN_STORAGE_KEYS = {
  access: "cm_access_token",
  refresh: "cm_refresh_token",
};

export function getApiBaseUrl() {
  const env = import.meta?.env?.VITE_API_BASE_URL;
  return (env && String(env).trim()) || DEFAULT_BASE_URL;
}

function joinUrl(base, path) {
  const a = base.replace(/\/+$/, "");
  const b = path.startsWith("/") ? path : `/${path}`;
  return `${a}${b}`;
}

async function parseResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const data = await res.json().catch(() => null);
    return data;
  }
  const text = await res.text().catch(() => "");
  return { detail: text || res.statusText };
}

export function readStoredTokens() {
  return {
    access: window.localStorage.getItem(TOKEN_STORAGE_KEYS.access) || "",
    refresh: window.localStorage.getItem(TOKEN_STORAGE_KEYS.refresh) || "",
  };
}

export function writeStoredTokens({ access, refresh }) {
  if (typeof access === "string") {
    if (access) window.localStorage.setItem(TOKEN_STORAGE_KEYS.access, access);
    else window.localStorage.removeItem(TOKEN_STORAGE_KEYS.access);
  }

  if (typeof refresh === "string") {
    if (refresh) window.localStorage.setItem(TOKEN_STORAGE_KEYS.refresh, refresh);
    else window.localStorage.removeItem(TOKEN_STORAGE_KEYS.refresh);
  }
}

let refreshInFlight = null;

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    baseUrl = getApiBaseUrl(),
    accessToken = "",
    refreshToken = "",
    json,
    body,
    headers,
    retryOn401 = true,
    onTokens,
  } = options;

  const url = joinUrl(baseUrl, path);

  const finalHeaders = {
    ...(headers || {}),
  };

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  if (accessToken) {
    finalHeaders.Authorization = `Bearer ${accessToken}`;
  }

  let finalBody = body;
  if (json !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
    finalBody = JSON.stringify(json);
  } else if (isFormData) {
    // Let the browser set multipart boundaries.
  }

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: finalBody,
  });

  if (res.status !== 401 || !retryOn401 || !refreshToken) {
    const data = await parseResponse(res);
    if (!res.ok) {
      const err = new Error(data?.detail || `Request failed (${res.status})`);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  // 401: try refresh once, then retry original request.
  refreshInFlight = refreshInFlight ||
    apiRequest("/api/auth/token/refresh/", {
      method: "POST",
      baseUrl,
      json: { refresh: refreshToken },
      retryOn401: false,
    }).finally(() => {
      refreshInFlight = null;
    });

  const refreshed = await refreshInFlight;
  const nextAccess = refreshed?.access || "";
  if (nextAccess && typeof onTokens === "function") {
    onTokens({ access: nextAccess, refresh: refreshToken });
  }

  return apiRequest(path, {
    ...options,
    accessToken: nextAccess,
    retryOn401: false,
    onTokens,
  });
}
