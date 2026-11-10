import api from "./axios";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthApiResponse {
  success: boolean;
  message?: string;
  accessToken?: string;
  user?: {
    id?: string;
    _id?: string;
    name?: string;
    email?: string;
    role?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

// REGISTER API
export const registerUser = async (userData: RegisterPayload): Promise<AuthApiResponse> => {
  const response = await api.post<AuthApiResponse>("/auth/register", userData);
  return response.data;
};

// LOGIN API
export const loginUser = async (credentials: LoginPayload): Promise<AuthApiResponse> => {
  const response = await api.post<AuthApiResponse>("/auth/login", credentials);
  return response.data;
};

// FORGOT PASSWORD API
export const forgotPasswordApi = async (email: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.post<{ success: boolean; message: string }>("/auth/forgot-password", { email });
  return response.data;
};

// RESET PASSWORD API
export const resetPasswordApi = async (
  token: string,
  password: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post<{ success: boolean; message: string }>(`/auth/reset-password/${token}`, {
    password,
  });
  return response.data;
};

