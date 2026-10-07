import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const navShape = {
  navigation: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onNavClick: PropTypes.func.isRequired,
  activeSection: PropTypes.string,
};

// Static variant: always visible under the page title
const StaticNav = ({ navigation, onNavClick, activeSection }) => (
  <div className="section-nav section-nav--static">
    {navigation.map((navItem) => (
      <a
        key={navItem.id}
        href={`#${navItem.id}`}
        onClick={onNavClick}
        className={`btn btn--soft${activeSection === navItem.id ? " active" : ""}`}
      >
        {navItem.label}
      </a>
    ))}
  </div>
);
StaticNav.propTypes = navShape;

// Floating dock: appears once the static nav scrolls out of view.
// Contains a back-to-top button and a toggle that opens a pane listing all sections.
const StickyNav = ({ navigation, onNavClick, activeSection, visible }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dockRef = useRef(null);

  const activeIndex = navigation.findIndex((item) => item.id === activeSection);
  const activeItem = navigation[activeIndex];

  // Close the pane on outside click / Escape, or when the dock hides
  useEffect(() => {
    if (!isOpen) return undefined;
    const handlePointer = (e) => {
      if (dockRef.current && !dockRef.current.contains(e.target)) setIsOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!visible) setIsOpen(false);
  }, [visible]);

  const scrollToTop = () => {
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      ref={dockRef}
      className={`section-dock${visible ? " visible" : ""}${isOpen ? " open" : ""}`}
      aria-hidden={!visible}
    >
      {/* div with role, not <nav>: global `nav` styles target the top navbar */}
      <div
        id="section-dock-menu"
        className="section-dock-menu"
        role="navigation"
        aria-label="Page sections"
      >
        <div className="section-dock-menu-header">Jump to section</div>
        <ul>
          {navigation.map((navItem, i) => (
            <li key={navItem.id}>
              <a
                href={`#${navItem.id}`}
                onClick={(e) => {
                  onNavClick(e);
                  setIsOpen(false);
                }}
                className={activeSection === navItem.id ? "active" : ""}
                aria-current={activeSection === navItem.id ? "location" : undefined}
                tabIndex={isOpen ? 0 : -1}
              >
                <span className="section-dock-menu-index">{i + 1}</span>
                <span className="section-dock-menu-label">{navItem.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="section-dock-bar">
        <button
          className="section-dock-btn"
          onClick={scrollToTop}
          aria-label="Back to top"
          title="Back to top"
          tabIndex={visible ? 0 : -1}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M12 19V5M5 12l7-7 7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <span className="section-dock-divider" aria-hidden="true" />

        <button
          className="section-dock-current"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls="section-dock-menu"
          aria-label={isOpen ? "Close section menu" : "Open section menu"}
          tabIndex={visible ? 0 : -1}
        >
          <span className="section-dock-current-text">
            {activeItem ? activeItem.label : "Sections"}
          </span>
          {activeItem && (
            <span className="section-dock-count">
              {activeIndex + 1}/{navigation.length}
            </span>
          )}
          <svg
            className="section-dock-chevron"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <path
              d="M6 15l6-6 6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
StickyNav.propTypes = { ...navShape, visible: PropTypes.bool };

export { StaticNav, StickyNav };
