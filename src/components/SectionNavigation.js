import React, { useState } from "react";
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

const NavLinks = ({ navigation, onNavClick, activeSection, onClickExtra }) =>
  navigation.map((navItem) => (
    <a
      key={navItem.id}
      href={`#${navItem.id}`}
      onClick={(e) => { onNavClick(e); onClickExtra?.(); }}
      className={activeSection === navItem.id ? "active" : ""}
    >
      {navItem.label}
    </a>
  ));

// Static variant: always visible under the page title, no toggle behaviour
const StaticNav = ({ navigation, onNavClick, activeSection }) => (
  <div className="section-nav section-nav--static">
    <NavLinks navigation={navigation} onNavClick={onNavClick} activeSection={activeSection} />
  </div>
);
StaticNav.propTypes = navShape;

// Sticky variant: fixed at bottom-left, appears when static nav scrolls out of view
const StickyNav = ({ navigation, onNavClick, activeSection, visible }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const showAll = isExpanded || !activeSection;
  const activeItem = navigation.find((item) => item.id === activeSection);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      {/* Desktop: full section nav */}
      {isHidden ? (
        <button
          className={`section-nav-restore section-nav--desktop-only${visible ? " visible" : ""}`}
          onClick={() => setIsHidden(false)}
          aria-label="Show section navigation"
        >
          ☰
        </button>
      ) : (
        <div
          className={`section-nav section-nav--sticky section-nav--desktop-only${visible ? " visible" : ""}${showAll ? "" : " collapsed"}`}
        >
          <div className="section-nav-controls">
            <button
              className="section-nav-hide"
              onClick={() => { setIsHidden(true); setIsExpanded(false); }}
              aria-label="Hide navigation"
            >
              ✕
            </button>
            <button
              className="section-nav-toggle"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? "Collapse navigation" : "Expand navigation"}
            >
              {isExpanded ? "▼" : "▲"}
            </button>
          </div>

          {showAll ? (
            <NavLinks
              navigation={navigation}
              onNavClick={onNavClick}
              activeSection={activeSection}
              onClickExtra={() => setIsExpanded(false)}
            />
          ) : (
            activeItem && (
              <a href={`#${activeItem.id}`} onClick={onNavClick} className="active">
                {activeItem.label}
              </a>
            )
          )}
        </div>
      )}

      {/* Mobile: scroll-to-top button with current section label */}
      <button
        className={`section-nav-mobile-top${visible ? " visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <span className="section-nav-mobile-arrow">↑</span>
        {activeItem && (
          <span className="section-nav-mobile-label">{activeItem.label}</span>
        )}
      </button>
    </>
  );
};
StickyNav.propTypes = { ...navShape, visible: PropTypes.bool };

export { StaticNav, StickyNav };
