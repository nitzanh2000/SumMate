import { useState } from "react";
import PostActions from "./PostActions";
import { Post } from "../interfaces/post";
import { IMAGES_URL } from "../constants/files";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { useUserContext } from "../context/UserContext";
import { usePostsContext } from "../context/PostsContext";
import { updatePost } from "../services/posts";

interface PostProps {
  post: Post;
  enableChanges?: boolean;
  inFeed?: boolean;
}

const PostComponent = ({ post, enableChanges, inFeed }: PostProps) => {
  const [description] = useState(post.content);
  const { user } = useUserContext() ?? {};
  const { setPosts, posts } = usePostsContext() ?? {};

  const isLikedByCurrUser = (): boolean => {
    return post.likedBy.find((currUser) => currUser?._id === user?._id)
      ? true
      : false;
  };

  const onLikeToggle = () => {
    const prevPosts = posts;
    try {
      if (user) {
        let newLikedBy;
        if (isLikedByCurrUser()) {
          newLikedBy = post.likedBy.filter(
            (currUser) => currUser._id !== user?._id
          );
        } else {
          newLikedBy = [user, ...post.likedBy];
        }
        const newPost: Post = {
          ...post,
          likedBy: newLikedBy,
        };
        updatePostInState(newPost);
        updatePost(post._id, { likedBy: newLikedBy });
      }
    } catch (error) {
      console.error(error);
      setPosts?.(prevPosts ?? []);
    }
  };

  const updatePostInState = (newPost: Post) => {
    setPosts?.(
      (prevPosts) =>
        prevPosts?.map((post) => (post._id === newPost._id ? newPost : post)) ??
        []
    );
  };

  return (
    <div
      className="post card mb-3"
      style={{
        width: "350px",
        borderRadius: "50px",
        overflowY: 'auto',
        overflowX: 'hidden',
        height: "450px"
      }}
    >
      {enableChanges && (
        <div
          className="edit-buttons m-1"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            display: "flex",
            gap: "10px",
          }}
        >
          {enableChanges && (
            <button
              className="btn btn-light"
              style={{ border: "none", background: "transparent", borderRadius: "50px" }}
            >
              <FaRegEdit size={20} />
            </button>
          )}
          {(
            <button
              className="btn btn-light"
              style={{ border: "none", background: "transparent" }}
            >
              <FaRegTrashAlt size={20} />
            </button>
          )}
        </div>
      )}

      <div
        className="card-body d-flex justify-content-center row "
        style={{
          padding: "1rem",
          borderRadius: "50px",
          overflowY: 'auto',
          overflowX: 'hidden',
          height: "400px"
        }}
      >
        <div className="d-flex align-items-center mb-1">
          <img
            src={
              post.owner.photo
                ? IMAGES_URL + post.owner.photo
                : "/temp-user.png"
            }
            alt={post.owner.username}
            className="rounded-circle user-photo m-2"
            style={{ width: "20px", height: "20px" }}
          />
          <span className="ml-3">{post.owner.username}</span>
        </div>
        <div
          {...(inFeed
            ? {
              style: { cursor: "pointer" },
            }
            : {})}
          className="hover-shadow justify-content-center row"
        >
          <img
            style={{ height: "250px" }}
            src={IMAGES_URL + post.photoSrc}
            alt="Post"
            className="img-fluid mb-1"
          />
          <p className="text-center">{description}</p>
        </div>

        {
          <PostActions
            postId={post._id}
            comments={post.comments}
            likesNumber={post.likedBy.length}
            likedByUser={isLikedByCurrUser()}
            key={post._id}
            onLikeToggle={onLikeToggle}
            inFeed={inFeed}
          ></PostActions>}
      </div>
    </div>
  );
};

export default PostComponent;
