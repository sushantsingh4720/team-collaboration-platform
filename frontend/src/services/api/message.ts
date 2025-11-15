import axiosInstance from "@/config/axiosInstance";

export const messagesAPI = {
  getByTeam: (teamId: string) =>
    axiosInstance.get(`/messages?teamId=${teamId}`),
  send: (data: any) => axiosInstance.post("/messages", data),
};
