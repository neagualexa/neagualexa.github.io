import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Navigation = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const isActive = (path) => location.pathname === path;

  const handleNavClick = (e) => {
    // Always scroll to top when any navigation link is clicked
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isMobile = window.innerWidth <= 768;

      if (!isMobile) {
        setIsVisible(true);
        return;
      }

      // Show nav when at the top of the page
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else {
        // Hide nav when scrolling down, show when scrolling up
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY) {
          setIsVisible(true);
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  // Simple body class toggle for spacing control
  useEffect(() => {
    if (isVisible) {
      document.body.classList.remove("nav-hidden");
    } else {
      document.body.classList.add("nav-hidden");
    }
  }, [isVisible]);

  return (
    <nav className={`${isVisible ? "nav-visible" : "nav-hidden"}`}>
      <div className="nav-container">
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
          <li>
            <Link
              to="/publications"
              className={`nav-link ${
                isActive("/publications") ? "active" : ""
              }`}
              onClick={handleNavClick}
            >
              Publications
            </Link>
          </li>
        </ul>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navigation;
