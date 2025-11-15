import axiosInstance from "@/config/axiosInstance";

export const tasksAPI = {
  getTasks: () => axiosInstance.get(`/tasks`),
  create: (data: any) => axiosInstance.post("/tasks", data),
  update: (id: string, data: any) => axiosInstance.put(`/tasks/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/tasks/${id}`),
};
