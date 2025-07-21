import React from "react";
import PropTypes from "prop-types";

const CertificationsSection = ({ certifications }) => {
  return (
    <div className="resume-section" style={{ marginTop: "3rem" }}>
      <h3>{certifications.title}</h3>
      <ul>
        {certifications.items.map((cert, index) => (
          <li key={index}>{cert}</li>
        ))}
      </ul>
    </div>
  );
};

CertificationsSection.propTypes = {
  certifications: PropTypes.shape({
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default CertificationsSection;
