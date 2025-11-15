import axiosInstance from "@/config/axiosInstance";

export const authAPI = {
  register: (data: any) => axiosInstance.post("/user/auth/register", data),
  getProfile: () => axiosInstance.get("/user/auth"),
};
