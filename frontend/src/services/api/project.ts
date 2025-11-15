import axiosInstance from "@/config/axiosInstance";

export const projectsAPI = {
  getAll: () => axiosInstance.get("/projects"),
  create: (data: any) => axiosInstance.post("/projects", data),
  update: (id: string, data: any) => axiosInstance.put(`/projects/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/projects/${id}`),
};
