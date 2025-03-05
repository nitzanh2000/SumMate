import { Post } from "../interfaces/post";
import { getPosts } from "../services/posts";
import { ReactNode, useEffect } from "react";
import { useUserContext } from "./UserContext";
import { createContext, useContext, useState } from "react";

type PostsContextType = {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  isLoading: boolean;
  fetchPosts: () => Promise<void>;
} | null;

const PostsContext = createContext<PostsContextType>(null);

export const usePostsContext = () => useContext(PostsContext);

export const PostsContextProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUserContext() ?? {};

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setPosts(await getPosts());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  return (
    <PostsContext.Provider
      value={{
        posts,
        setPosts,
        isLoading,
        fetchPosts,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};
