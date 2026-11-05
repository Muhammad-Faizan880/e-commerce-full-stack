import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { User, AuthMode } from '../../types/auth';
import { registerUser, loginUser } from '../../api/authApi';
import { setAccessToken, clearAccessToken } from '../../utils/tokenStore';

const STORAGE_KEY = 'copenhagen_authenticated_user';

const loadSavedUser = (): User | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as User;
  } catch {
    // Ignore error if storage is restricted
  }
  return null;
};

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  authModalOpen: boolean;
  authMode: AuthMode;
  resetSentEmail: string;
}

const initialUser = loadSavedUser();

const initialState: AuthState = {
  user: initialUser,
  isAuthenticated: Boolean(initialUser),
  isLoading: false,
  error: null,
  authModalOpen: false,
  authMode: 'login',
  resetSentEmail: '',
};

// ASYNC THUNK: User Registration via API (Does not auto-login; directs user to Login screen)
export const registerUserThunk = createAsyncThunk<
  { email: string },
  { name: string; email: string; password: string; firstName?: string; lastName?: string },
  { rejectValue: string }
>('auth/registerUser', async (payload, { rejectWithValue }) => {
  try {
    await registerUser(payload);
    return { email: payload.email.toLowerCase() };
  } catch (err: unknown) {
    const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
    const message =
      apiErr.response?.data?.message ||
      apiErr.message ||
      'Failed to register. Please check your connection.';
    return rejectWithValue(message);
  }
});

// ASYNC THUNK: User Login via API
export const loginUserThunk = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginUser(credentials);

    // Save Access Token in-memory
    if (response?.accessToken) {
      setAccessToken(response.accessToken);
    }

    const resUser = response?.user;
    const nameParts = (resUser?.name || '').trim().split(' ');
    const userFirstName = nameParts[0] || 'Member';
    const userLastName = nameParts.slice(1).join(' ') || '';

    const user: User = {
      id: resUser?.id || resUser?._id || `usr_${Date.now()}`,
      firstName: userFirstName,
      lastName: userLastName,
      name: resUser?.name || `${userFirstName} ${userLastName}`.trim(),
      email: resUser?.email || credentials.email.toLowerCase(),
      role: resUser?.role || 'customer',
      phone: resUser?.phone || '',
      address: resUser?.address || '',
      city: resUser?.city || '',
      state: resUser?.state || '',
      postalCode: resUser?.postalCode || '',
      country: resUser?.country || '',
      memberTier: resUser?.role === 'admin' ? 'Architect Club' : 'Member',
      memberSince: 'Today',
      ordersCount: 0,
    };

    // Save to local storage for persistence across reloads
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      // storage unavailable
    }

    return user;
  } catch (err: unknown) {
    const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
    const message =
      apiErr.response?.data?.message ||
      apiErr.message ||
      'Invalid email or password.';
    return rejectWithValue(message);
  }
});

// AUTH SLICE
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = Boolean(action.payload);
      try {
        if (action.payload) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        // storage unavailable
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      clearAccessToken();
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // storage unavailable
      }
    },
    openAuthModal: (state, action: PayloadAction<AuthMode | undefined>) => {
      if (action.payload) {
        state.authMode = action.payload;
      }
      state.authModalOpen = true;
      state.error = null;
    },
    closeAuthModal: (state) => {
      state.authModalOpen = false;
      state.error = null;
    },
    setAuthMode: (state, action: PayloadAction<AuthMode>) => {
      state.authMode = action.payload;
      state.error = null;
    },
    setResetSentEmail: (state, action: PayloadAction<string>) => {
      state.resetSentEmail = action.payload;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases: Switches to Login screen on success
      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.authMode = 'login';
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Registration failed';
      })
      // Login cases
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
        state.authModalOpen = false;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
      });
  },
});

export const {
  setUser,
  logout,
  openAuthModal,
  closeAuthModal,
  setAuthMode,
  setResetSentEmail,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
