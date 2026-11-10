import React, { createContext, useContext } from 'react';
import type { User, AuthMode, LoginFormData, RegisterFormData } from '../types/auth';
import { useToast } from './ToastContext';
import { useAppDispatch, useAppSelector } from '../store';
import {
  registerUserThunk,
  loginUserThunk,
  setUser as setReduxUser,
  logout as reduxLogout,
  openAuthModal as reduxOpenModal,
  closeAuthModal as reduxCloseModal,
  setAuthMode as reduxSetMode,
  setResetSentEmail as reduxSetResetEmail,
} from '../store/slices/authSlice';
import { forgotPasswordApi } from '../api/authApi';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  authModalOpen: boolean;
  authMode: AuthMode;
  resetSentEmail: string;
  setAuthMode: (mode: AuthMode) => void;
  openAuthModal: (mode?: AuthMode) => void;
  closeAuthModal: () => void;
  login: (data: LoginFormData) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterFormData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, authModalOpen, authMode, resetSentEmail } = useAppSelector(
    (state) => state.auth
  );

  const openAuthModal = (mode: AuthMode = 'login') => {
    dispatch(reduxOpenModal(mode));
  };

  const closeAuthModal = () => {
    dispatch(reduxCloseModal());
  };

  const setAuthMode = (mode: AuthMode) => {
    dispatch(reduxSetMode(mode));
  };

  const login = async (data: LoginFormData): Promise<{ success: boolean; error?: string }> => {
    if (!data.email.trim() || !data.password.trim()) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    // Dispatch Redux Toolkit Login Thunk to call Backend POST /api/auth/login
    const action = await dispatch(
      loginUserThunk({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      })
    );

    if (loginUserThunk.fulfilled.match(action)) {
      showToast(`Welcome back, ${action.payload.firstName}!`, 'success');
      return { success: true };
    } else {
      const errorMsg = (action.payload as string) || 'Invalid email or password.';
      return { success: false, error: errorMsg };
    }
  };

  const register = async (data: RegisterFormData): Promise<{ success: boolean; error?: string }> => {
    if (!data.firstName.trim() || !data.lastName.trim()) {
      return { success: false, error: 'Please enter your first and last name.' };
    }
    if (!data.email.trim() || !data.email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (data.password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }
    if (data.password !== data.confirmPassword) {
      return { success: false, error: 'Passwords do not match.' };
    }
    if (!data.agreeTerms) {
      return { success: false, error: 'Please agree to the Terms of Service to continue.' };
    }

    const payload = {
      name: `${data.firstName} ${data.lastName}`.trim(),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
    };

    // Dispatch Redux Toolkit Async Thunk!
    const action = await dispatch(registerUserThunk(payload));

    if (registerUserThunk.fulfilled.match(action)) {
      showToast('Registration successful! Please sign in with your password.', 'success');
      dispatch(reduxSetMode('login'));
      return { success: true };
    } else {
      const errorMsg = (action.payload as string) || 'Failed to create account.';
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    dispatch(reduxLogout());
    showToast('You have been signed out.', 'info');
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!email.trim() || !email.includes('@')) {
      return { success: false, error: 'Please provide a valid email address.' };
    }

    try {
      const res = await forgotPasswordApi(email.trim().toLowerCase());
      dispatch(reduxSetResetEmail(email.trim()));
      dispatch(reduxSetMode('reset-sent'));
      showToast(res.message || `Password reset link sent to ${email}`, 'success');
      return { success: true };
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
      const message =
        apiErr.response?.data?.message ||
        apiErr.message ||
        'Unable to process password reset request.';
      return { success: false, error: message };
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      dispatch(setReduxUser(updated));
      showToast('Profile updated successfully', 'success');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        authModalOpen,
        authMode,
        resetSentEmail,
        setAuthMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        requestPasswordReset,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
