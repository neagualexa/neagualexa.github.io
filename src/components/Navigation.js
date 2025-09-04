import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleNavClick = (e) => {
    // Always scroll to top when any navigation link is clicked
    window.scrollTo(0, 0);
  };

  return (
    <nav>
      <ul>
        <li>
          <Link
            to="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
            onClick={handleNavClick}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/resume"
            className={`nav-link ${isActive("/resume") ? "active" : ""}`}
            onClick={handleNavClick}
          >
            Resume
          </Link>
        </li>
        <li>
          <Link
            to="/projects"
            className={`nav-link ${isActive("/projects") ? "active" : ""}`}
            onClick={handleNavClick}
          >
            Projects
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
