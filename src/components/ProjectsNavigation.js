import React from "react";
import PropTypes from "prop-types";

const ProjectsNavigation = ({ navigation, onNavClick, activeSection }) => {
  return (
    <div className="projects-nav">
      {navigation.map((navItem) => (
        <a
          key={navItem.id}
          href={`#${navItem.id}`}
          onClick={onNavClick}
          style={{
            background: activeSection === navItem.id ? "#007acc" : "#f8f9fa",
            color: activeSection === navItem.id ? "white" : "#333",
          }}
        >
          {navItem.label}
        </a>
      ))}
    </div>
  );
};

ProjectsNavigation.propTypes = {
  navigation: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onNavClick: PropTypes.func.isRequired,
  activeSection: PropTypes.string,
};

export default ProjectsNavigation;
