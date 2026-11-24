const TOKEN_STORAGE_KEY = 'copenhagen_access_token';
const REFRESH_STORAGE_KEY = 'copenhagen_refresh_token';

let accessToken: string | null = null;
let refreshToken: string | null = null;

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

export const setRefreshToken = (token: string | null): void => {
  refreshToken = token;
  try {
    if (token) {
      localStorage.setItem(REFRESH_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(REFRESH_STORAGE_KEY);
    }
  } catch {
    // Ignore
  }
};

export const getRefreshToken = (): string | null => {
  if (!refreshToken) {
    try {
      refreshToken = localStorage.getItem(REFRESH_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
  return refreshToken;
};

export const clearAccessToken = (): void => {
  accessToken = null;
  refreshToken = null;
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_STORAGE_KEY);
    localStorage.removeItem('copenhagen_authenticated_user');
  } catch {
    // Ignore
  }
};



