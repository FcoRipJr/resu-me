export const getStoredPreference = (key, fallback, allowedValues = []) => {
  try {
    const value = window.localStorage.getItem(key);
    if (!value || (allowedValues.length > 0 && !allowedValues.includes(value))) {
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
