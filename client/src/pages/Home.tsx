import { useEffect, useState } from "react";
import PostComponent from "../components/Post";
import { usePostsContext } from "../context/PostsContext";

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;
  const { posts, fetchPosts, isLoading } = usePostsContext() ?? {};

  useEffect(() => {
    fetchPosts?.();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedPosts = posts?.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const totalPages = Math.ceil((posts?.length ?? 0) / postsPerPage);

  return !paginatedPosts || isLoading ? (
    <div
      className="spinner-border text-danger"
      style={{ width: "5rem", height: "5rem" }}
    />
  ) : (
    <div className="container d-flex flex-column justify-content-center">
      <div className="row flex-grow-1">
        {paginatedPosts.length > 0 ? (
          paginatedPosts.map((post) => (
            <div
              className="col-4 mb-3 d-flex justify-content-center "
              key={post._id}
            >
              <PostComponent post={post} inFeed />
            </div>
          ))
        ) : (
          <div className="col-12 d-flex justify-content-center align-items-center">
            <p className="text-center">No posts available.</p>
          </div>
        )}
      </div>

      {/* Pagination Section */}
      <div className="row " >
        <div className="col-12 text-center">
          {totalPages > 0 ? (
            [...Array(totalPages).keys()].map((num) => (
              <button
              style={{ borderRadius: "50px" }}
                key={num}
                className={`btn btn-${
                  num + 1 === currentPage ? "danger" : "outline-danger"
                } mx-1`}
                onClick={() => handlePageChange(num + 1)}
              >
                {num + 1}
              </button>
            ))
          ) : (
            <button className="btn btn-outline-secondary" disabled>
              No Pages
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
