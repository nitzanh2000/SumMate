import { authLogout } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { enqueueSnackbar } from "notistack";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserContext() ?? {};

  const handleLogout = async () => {
    try {
      await authLogout();
      setUser?.(null);
      navigate("/");
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to logout", { variant: "error" });
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ height: "10vh", backgroundColor: "#FFFFFF", borderColor: "grey" }}
    >
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img
            src="/logo.png"
            alt="SumMate Logo"
            className="logo mt-1"
            style={{ height: "50px" }}
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item mx-3">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item mx-3">
              <Link to="/add-post" className="nav-link">New Post</Link>
            </li>
            <li className="nav-item mx-3">
              <Link to="/summarize" className="nav-link">Summarize</Link>
            </li>
            <li className="nav-item mx-3">
              <Link to={`/profile/${user?._id}`} className="nav-link">My Profile</Link>
            </li>
            <li className="nav-item mx-3">
              <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
