import { createAxiosInstance } from "../config/axiosInstance";

const axiosInstance = createAxiosInstance(
  `${import.meta.env.VITE_SERVER_URL}/users`
);

export const getMe = async () => {
  return (await axiosInstance.get(`/me`)).data;
};
