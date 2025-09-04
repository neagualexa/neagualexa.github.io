import React from "react";
import PropTypes from "prop-types";

const CertificationsSection = ({ certifications }) => {
  const getLogoPath = (logoFileName) => {
    if (!logoFileName) return null;
    try {
      return require(`../data/images/resume/${logoFileName}`);
    } catch (error) {
      console.warn(`Logo not found: ${logoFileName}`);
      return null;
    }
  };

  return (
    <div className="resume-section" style={{ marginTop: "3rem" }}>
      <h3>{certifications.title}</h3>
      <div className="certifications-grid">
        {certifications.items.map((cert, index) => (
          <div key={index} className="certification-item">
            {cert.logo && (
              <div className="certification-logo">
                <img
                  src={getLogoPath(cert.logo)}
                  alt={`${cert.name} logo`}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
            <div className="certification-name">{cert.name || cert}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

CertificationsSection.propTypes = {
  certifications: PropTypes.shape({
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          logo: PropTypes.string,
        }),
      ])
    ).isRequired,
  }).isRequired,
};

export default CertificationsSection;
