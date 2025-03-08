import { useEffect, useState } from "react";
import PostComponent from "../components/Post";
import { usePostsContext } from "../context/PostsContext";

const Home = () => {
  const { posts, fetchPosts, isLoading } = usePostsContext() ?? {};

  useEffect(() => {
    fetchPosts?.();
  }, []);

  return !isLoading && <> {posts && <PostComponent post={posts[0]} inFeed />} </>
};

export default Home;
