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

  const showAll = isExpanded || !activeSection;
  const activeItem = showAll ? null : navigation.find((item) => item.id === activeSection);

  return (
    <div
      className={`section-nav section-nav--sticky${visible ? " visible" : ""}${showAll ? "" : " collapsed"}`}
    >
      <button
        className="section-nav-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? "Squish navigation" : "Expand navigation"}
      >
        {isExpanded ? "▼" : "▲"}
      </button>

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
  );
};
StickyNav.propTypes = { ...navShape, visible: PropTypes.bool };

export { StaticNav, StickyNav };
