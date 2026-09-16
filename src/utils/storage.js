export const getStoredPreference = (key, fallback, allowedValues = []) => {
  try {
    const value = window.localStorage.getItem(key);
    if (
      !value ||
      (allowedValues.length > 0 && !allowedValues.includes(value))
    ) {
      return fallback;
    }
    return value;
  } catch {
    return fallback;
  }
};

export const setStoredPreference = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {}
};

export const getStoredJsonPreference = (key, fallback) => {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const setStoredJsonPreference = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};
