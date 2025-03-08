import { useState } from "react";
import PostActions from "./PostActions";
import { Post } from "../interfaces/post";
import DropzoneComponent from "./Dropzone";
import { useNavigate } from "react-router-dom";
import { IMAGES_URL } from "../constants/files";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { useUserContext } from "../context/UserContext";
import { usePostsContext } from "../context/PostsContext";
import { deletePostById, updatePost } from "../services/posts";

interface PostProps {
  post: Post;
  enableChanges?: boolean;
  inFeed?: boolean;
}

const PostComponent = ({ post, enableChanges, inFeed }: PostProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(post.content);
  const [editedPhoto, setEditedPhoto] = useState<File | null>();
  const [editedPhotoURL, setEditedPhotoURL] = useState<string | null>();
  const { user } = useUserContext() ?? {};
  const { setPosts, posts } = usePostsContext() ?? {};
  const navigate = useNavigate();

  const isLikedByCurrUser = (): boolean => {
    return post.likedBy.find((currUser) => currUser?._id === user?._id)
      ? true
      : false;
  };
  const onEditSave = () => {
    updatePost(post._id, { photo: editedPhoto, content: description });
    setEditedPhotoURL(editedPhoto ? URL.createObjectURL(editedPhoto) : null);
  };

  const deletePost = () => {
    deletePostById(post._id);
    setPosts?.(
      posts?.filter((currentPost) => currentPost._id !== post._id) ?? []
    );
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

  const handleSave = () => {
    onEditSave();

    setIsEditing(false);
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
              onClick={() => setIsEditing(!isEditing)} // Trigger edit mode
            >
              <FaRegEdit size={20} />
            </button>
          )}
          {deletePost && (
            <button
              className="btn btn-light"
              style={{ border: "none", background: "transparent" }}
              onClick={deletePost} // Trigger deletePost function on click
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
        <div className="d-flex align-items-center mb-1" onClick={() => navigate("/profile/" + post.owner._id)}>
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

        {isEditing ? (
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control mb-3"
              rows={3} // Adjusted to make it fit better in the card
              style={{ height: "40px", resize: "none" }} // Set height to fit
            />
            <DropzoneComponent
              onFileSelect={(file) => setEditedPhoto(file)}
              selectedFile={editedPhoto ?? null}
            />
            <button className="btn btn-primary mt-3 w-100" style={{ borderRadius: "50px" }} onClick={handleSave}>
              Save
            </button>
          </div>
        ) : (
          <div
            {...(inFeed
              ? {
                onClick: () => navigate(`/post/${post._id}`),
                style: { cursor: "pointer" },
              }
              : {})}
            className="hover-shadow justify-content-center row"
          >
            <img
              style={{ height: "250px" }}
              src={editedPhotoURL ? editedPhotoURL : IMAGES_URL + post.photoSrc}
              alt="Post"
              className="img-fluid mb-1"
            />
            <p className="text-center">{description}</p>
          </div>
        )}
        {!isEditing &&
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
