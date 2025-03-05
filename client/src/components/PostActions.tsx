import { FaComment, FaHeart } from "react-icons/fa";
import { PostComment } from "../interfaces/comment";

interface PostActionsProps {
  postId: string;
  likesNumber: number;
  likedByUser: boolean;
  comments: PostComment[];
  onLikeToggle: () => void;
  inFeed?: boolean;
}

const PostActions = ({
  likesNumber,
  likedByUser,
  comments,
  onLikeToggle,
}: PostActionsProps) => {

  return (
    <div className="post-actions row">
      <div className="col-2"></div>
      <div className="col-5">
        <button
          className={`btn btn-light ${likedByUser ? "text-danger" : "text-secondary"
            }`}
          onClick={onLikeToggle}
          style={{ border: "none", background: "transparent", padding: "3px" }}
        >
          <FaHeart size={25} />
        </button>
        <span>{likesNumber}</span>
      </div>
      <div className="col-5">
        <button
          className={"btn btn-light text-secondary"}
          style={{ border: "none", background: "transparent", padding: "3px" }}
        >
          <FaComment size={25} />
        </button>
        <span>{comments.length}</span>
      </div>
    </div>
  );
};

export default PostActions;
