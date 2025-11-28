import React from "react";
import PropTypes from "prop-types";
import ProjectCard from "./ProjectCard";

const ProjectSection = ({ section }) => {
  return (
    <div id={section.id} className="year-section">
      <div className="section-header">
        <h3>{section.title}</h3>
        {section.year && <h4>( {section.year} )</h4>}
      </div>
      <div className="projects-grid">
        {section.projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </div>
  );
};

ProjectSection.propTypes = {
  section: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    projects: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default ProjectSection;
