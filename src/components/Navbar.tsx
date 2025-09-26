import { clearAuth } from "../utils/storage";
import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { useEffect, useState } from "react";
import { decryptData } from "../utils/common";
import { passKey } from '../api/config';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = ({ setIsAuthenticated }: any) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [img, setImg] = useState('');

  const handleLogout = async () => {
    try {
      clearAuth();
      setIsAuthenticated(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const fetchData = async () => {
    try {
      const userData = sessionStorage.getItem('userData');
      if (!userData) {
        console.log('No user data found in sessionStorage');
        return;
      }
      const decryptObj = await decryptData(userData, passKey);
      const { userName, image } = decryptObj;
      setImg(image);
      setUserName(userName);
    } catch (error) {
      console.log('error:', error);
    }
  }
  useEffect(() => {
    fetchData();
  }, [])

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Left: User Info */}
        <div className="d-flex align-items-center">
          {img ? (
            <img
              src={img}
              alt="User"
              className="rounded-circle me-2"
              style={{ width: 35, height: 35, objectFit: 'cover', cursor: 'pointer' }}
            />
          ) : (
            <FaUserCircle size={35} className="me-2" />
          )}
          <span className="text-white fw-bold">{userName}</span>
        </div>

        <a
          className="navbar-brand fw-bold position-absolute start-50 translate-middle-x"
          href="/"
        >
          🌦️ Global Weather Insights
        </a>

        <div>
          <button
            className="btn btn-outline-light d-flex align-items-center"
            onClick={handleLogout}
          >
            <IoIosLogOut size={20} className="me-1" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
