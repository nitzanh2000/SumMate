import { Link } from "react-router-dom";

const Navbar = () => {
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
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
