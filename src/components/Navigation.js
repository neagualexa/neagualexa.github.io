import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/resume"
            className={`nav-link ${isActive("/resume") ? "active" : ""}`}
          >
            Resume
          </Link>
        </li>
        <li>
          <Link
            to="/projects"
            className={`nav-link ${isActive("/projects") ? "active" : ""}`}
          >
            Projects
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
