import { useState } from "react";
import { IMAGES_URL } from "../constants/files";
import { PostComment } from "../interfaces/comment";

interface PostCommentsProps {
  comments: PostComment[];
  onCommentAdd: (commentContent: string) => void;
}

const PostComments = ({ comments, onCommentAdd }: PostCommentsProps) => {
  const [newCommentContent, setNewCommentContent] = useState("");

  const handleAddComment = () => {
    if (newCommentContent.trim() !== "") {
      onCommentAdd(newCommentContent);
      setNewCommentContent("");
    }
  };

  return (
    <div>
      <div className="mt-1">
        <ul className="list-group" style={{
          overflowY: 'auto',
          height: "400px"
        }}>
          { comments.length ? comments.map((comment) => (
            <li className="list-group-item m-1" style={{ borderRadius: "50px" }} key={comment.content}>
              <div className="d-flex align-items-center">
                <img
                  src={
                    comment.user.photo
                      ? IMAGES_URL + comment.user.photo
                      : "/temp-user.png"
                  }
                  alt={comment.user.username}
                  className="rounded-circle user-photo my-1 mx-2"
                  style={{ width: "15px", height: "15px" }}
                />
                <span>{comment.content}</span>
              </div>
            </li>
          )): <div className="m-4">No comments yet..</div>}
        </ul>
        {/* Add comment input */}
        <div className="d-flex align-items-center my-3">
          <input
            style={{ borderRadius: "50px" }}
            type="text"
            className="form-control"
            placeholder="Add a comment..."
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
          />
          <button className="btn btn-primary m-1" style={{ borderRadius: "50px" }} onClick={handleAddComment}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostComments;
