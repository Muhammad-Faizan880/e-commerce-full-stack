const TOKEN_STORAGE_KEY = 'copenhagen_access_token';

let accessToken: string | null = null;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    // Ignore if localStorage is restricted
  }
};

export const getAccessToken = (): string | null => {
  if (!accessToken) {
    try {
      accessToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      // Ignore if localStorage is restricted
    }
  }
  return accessToken;
};

export const clearAccessToken = (): void => {
  accessToken = null;
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Ignore
  }
};


