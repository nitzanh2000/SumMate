import { createAxiosInstance } from "../config/axiosInstance";

const axiosInstance = createAxiosInstance(`${import.meta.env.VITE_SERVER_URL}`);
const RATE_LIMIT_DELAY = 100;

export const improveTextWithAI = async (content: string): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_DELAY));

  const response = await axiosInstance.post(
    `/AI/api/improve-text`,
    {
      text: content,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const result = response.data.improvedText;
  return result;
};
