import { Post } from "../interfaces/post";
import { useParams } from "react-router-dom";
import PostComponent from "../components/Post";
import { createComment } from "../services/comment";
import PostComments from "../components/PostComments";
import { useUserContext } from "../context/UserContext";
import { usePostsContext } from "../context/PostsContext";

const PostDetails = () => {
  const { setPosts, posts, isLoading } = usePostsContext() ?? {};
  const { user } = useUserContext() ?? {};
  const { id } = useParams();

  const post = posts?.find((post) => post._id == id);

  const onCommentAdd = (commentContent: string) => {
    if (user && post) {
      const newPost: Post = {
        ...post,
        comments: [...post.comments, { content: commentContent, user }],
      };
      updatePostInState(newPost);
      createComment(post._id, { content: commentContent, user: user });
    }
  };

  const updatePostInState = (newPost: Post) => {
    setPosts?.(
      posts?.map((post) => (post._id === newPost._id ? newPost : post)) ?? []
    );
  };

  return isLoading ? (
    <div
      className="spinner-border text-danger"
      style={{ width: "5rem", height: "5rem" }}
    />
  ) : post ? (
    <div>
      <button
        type="button"
        className="btn  btn-light px-4 py-2"
        onClick={() => window.history.back()}
        style={{
          position: "absolute",
          left: "10vw",
          borderRadius: "50px"
        }}
      >
        <i className="bi bi-arrow-left"></i>
      </button>
      <div
        className="card border-darkd p-4"
        style={{ borderRadius: "50px" }}
      ><div className="row col-12">
          <div className="col-7"><PostComponent post={post}></PostComponent></div>
          <div className="col-5"
          >
            <PostComments
              onCommentAdd={onCommentAdd}
              comments={post.comments}
            ></PostComments></div>
        </div>
      </div>
    </div >
  ) : (
    <div>post not found.. </div>
  );
};

export default PostDetails;
