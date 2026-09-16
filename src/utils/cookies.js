const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const prefix = `${encodeURIComponent(name)}=`;
  const cookie = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(prefix));
  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
};

export const setCookie = (name, value, maxAge = COOKIE_MAX_AGE) => {
  if (typeof document === "undefined") return false;
  const serialized = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
  if (serialized.length > 4096) return false;
  document.cookie = serialized;
  return getCookie(name) === value;
};

export const removeCookie = (name) => {
  if (typeof document === "undefined") return;
  document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; Path=/; SameSite=Lax`;
};

export const getJsonCookie = (name, fallback = null) => {
  try {
    const chunkCount = Number(getCookie(`${name}.count`));
    const value =
      chunkCount > 0
        ? Array.from(
            { length: chunkCount },
            (_, index) => getCookie(`${name}.${index}`) || "",
          ).join("")
        : getCookie(name);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const setJsonCookie = (name, value) => {
  const serialized = JSON.stringify(value);
  removeCookie(name);
  const chunks = serialized.match(/.{1,2000}/gs) || [serialized];
  const stored = chunks.every((chunk, index) =>
    setCookie(`${name}.${index}`, chunk),
  );
  return stored && setCookie(`${name}.count`, String(chunks.length));
};
