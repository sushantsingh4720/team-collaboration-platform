import axiosInstance from "@/config/axiosInstance";

export const usersAPI = {
  getByTeam: (teamId: string) => axiosInstance.get(`/user?teamId=${teamId}`),
};
