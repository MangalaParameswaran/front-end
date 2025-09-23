import { clearAuth } from "../utils/storage";
import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";

const Navbar = ({setIsAuthenticated}: any) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      clearAuth();
      setIsAuthenticated(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        {/* Brand */}
        <a className="navbar-brand fw-bold" href="/">
          🌦️ Weather App
        </a>

        {/* Right Side */}
        <div className="d-flex">
          <button className="btn btn-outline-light d-flex align-items-center" onClick={handleLogout}>
            <IoIosLogOut size={20} className="me-1" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
