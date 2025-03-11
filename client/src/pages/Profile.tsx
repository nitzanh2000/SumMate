import { useMemo, useState } from "react";
import PostComponent from "../components/Post";
import { updateUser } from "../services/users";
import UserProfile from "../components/UserProfile";
import { usePostsContext } from "../context/PostsContext";
import { useUserContext } from "../context/UserContext";
import { enqueueSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const postsPerPage = 2;

const Profile = () => {
  const { posts } = usePostsContext() ?? {};
  const [currentPage, setCurrentPage] = useState(1);
  const { user, setUser } = useUserContext() ?? {};
  const { id } = useParams();
  const navigate = useNavigate();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredPosts = useMemo(
    () => posts?.filter((post) => post.owner?._id === id),
    [posts, id]
  );

  const paginatedPosts = useMemo(
    () =>
      filteredPosts?.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage
      ),
    [currentPage, filteredPosts]
  );

  const totalPages = useMemo(
    () => Math.ceil((filteredPosts?.length ?? 0) / postsPerPage),
    [filteredPosts]
  );

  const handleSaveProfile = async (
    updatedUsername: string,
    updatedEmail: string,
    updatedProfilePhoto: File | null
  ) => {
    try {
      const updatedData = {
        username: updatedUsername,
        email: updatedEmail,
        ...(updatedProfilePhoto && { photo: updatedProfilePhoto }),
      };
      setUser?.(await updateUser(user!._id, updatedData));
    } catch (error) {
      if (error instanceof Error) {
        console.error("error updating user - ", error.message);
        enqueueSnackbar(error.message, { variant: "error" });
      }
    }
  };
  return (
    <>
      <div className="container d-flex flex-column justify-content-center">
        <div className="row flex-grow-1">
          {paginatedPosts?.length ? (
            paginatedPosts.map((post) => (
              <div className="col-6 mb-3  d-flex justify-content-center" key={post._id}>
                <PostComponent
                  key={post._id}
                  inFeed
                  post={post}
                  enableChanges={user?._id === id}
                />
              </div>
            ))
          ) : (
            <div className="col-12 justify-content-center align-items-center">
              <div>
                <p className="text-center">No posts yet :(</p>
              </div>
              <br />
              <div className="text-center">
                <span>{"add your first post now"} </span>
                <button type="submit" className="btn btn-primary" style={{ borderRadius: "50px" }} onClick={() => navigate("/add-post")}>
                  Add Post
                </button>

              </div>
            </div>
          )}
        </div>

        {/* Pagination Section */}
        <div className="row">
          <div className="col-12 text-center">
            {totalPages > 0 && (
              [...Array(totalPages).keys()].map((num) => (
                <button
                  style={{ borderRadius: "50px" }}
                  key={num}
                  className={`btn btn-${num + 1 === currentPage ? "danger" : "outline-danger"
                    } mx-1`}
                  onClick={() => handlePageChange(num + 1)}
                >
                  {num + 1}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      {user && user?._id == id && (
        <div className="col-6" style={{ width: "30%" }}>
          <UserProfile
            username={user.username}
            email={user.email}
            profilePhoto={user.photo || null}
            onSaveProfile={handleSaveProfile}
          />
        </div>
      )}
    </>
  );
};

export default Profile;
