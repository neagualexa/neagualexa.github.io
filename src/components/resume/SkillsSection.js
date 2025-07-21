import React from "react";
import PropTypes from "prop-types";

const SkillsSection = ({ skills }) => {
  return (
    <div className="resume-section" style={{ marginTop: "3rem" }}>
      <h3>{skills.title}</h3>
      <div className="skills-grid">
        {skills.categories.map((category, index) => (
          <div key={index} className="skill-category">
            <h5>{category.name}</h5>
            <p>{category.skills}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

SkillsSection.propTypes = {
  skills: PropTypes.shape({
    title: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        skills: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default SkillsSection;
