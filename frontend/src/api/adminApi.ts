import api from "./axios";

export interface DashboardResponse {
  success: boolean;
  message?: string;
  admin?: {
    userId: string;
    name?: string;
    email?: string;
    role?: string;
  };
  stats?: {
    totalUsers: number;
    totalAdmins: number;
    totalSessions: number;
  };
  recentUsers?: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
}

export const getAdminDashboardData = async (): Promise<DashboardResponse> => {
  const response = await api.get<DashboardResponse>("/admin/dashboard");
  return response.data;
};

export const getAdminUsersList = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};
