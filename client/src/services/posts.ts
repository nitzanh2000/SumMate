import { UpdatePost } from "../interfaces/post";
import { createAxiosInstance } from "../config/axiosInstance";

const axiosInstance = createAxiosInstance(
  `${import.meta.env.VITE_SERVER_URL}/posts`
);

export const getPosts = async () => {
  return (await axiosInstance.get(`/`)).data;
};

export const updatePost = async (
  postId: string,
  updatePostData: UpdatePost
) => {
  const formData = new FormData();
  const { photo, ...updatedPostInfo } = updatePostData;

  if (photo) {
    formData.append("file", photo);
  }

  formData.append("updatedPostContent", JSON.stringify(updatedPostInfo));

  return (
    await axiosInstance.put(`/${postId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  ).data;
};

export const deletePostById = async (postId: string) => {
  return (await axiosInstance.delete(`/${postId}`)).data;
};
