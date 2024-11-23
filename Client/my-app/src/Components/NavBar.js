import "./NavBar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../App/AuthContext";

const Nav = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light" id="navbar">
      <div className="container-fluid" id="nav">
        <Link to="/" className="navbar-brand">
          <img src="/logo.jpg" alt="Logo" style={{ height: "3rem" }} />

        </Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/about" className="nav-link">
                About
              </Link>
            </li>
            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Log In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">
                    Register
                  </Link>
                </li>
              </>
            )}
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link to="/statistics" className="nav-link">
                    Statistics
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/allGames" className="nav-link">
                    My Games
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="/addGame" className="nav-link">
                    Add Game
                  </Link>
                </li>

                <li className="nav-item">
                  <button onClick={logout} className="btn btn-danger">
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export { Nav };
