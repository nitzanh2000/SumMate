import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {

  return (
    <Router>
      {<Navbar />}

      <div
        className="d-flex justify-content-center align-items-center"
        style={{ backgroundColor: "#F9E4E3", height: "100vh" }}
      >
        (
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        )
      </div>
    </Router>
  );
}

export default App;
