import React from "react";
import PropTypes from "prop-types";

const OtherInterestsSection = ({ interests }) => {
  const getLogoPath = (logoFileName) => {
    if (!logoFileName) return null;
    try {
      return require(`../data/misc/resume/${logoFileName}`);
    } catch (error) {
      console.warn(`Logo not found: ${logoFileName}`);
      return null;
    }
  };

  return (
    <div className="resume-section" style={{ marginTop: "3rem" }}>
      <h3>{interests.title}</h3>
      <div className="resume-grid">
        {interests.items.map((item, index) => (
          <div key={index} className="resume-item">
            <div className="resume-item-header">
              {item.logo && (
                <div className="institution-logo">
                  <img
                    src={getLogoPath(item.logo)}
                    alt={`${item.institution || item.title} logo`}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
              <div className="resume-item-content">
                <div className="date">{item.period}</div>
                <h4>{item.title}</h4>
                {item.institution && (
                  <div className="institution">{item.institution}</div>
                )}
              </div>
            </div>
            <ul>
              {item.details.map((detail, detailIndex) => (
                <li key={detailIndex}>
                  {item.link && detail.includes(item.link.text) ? (
                    <>
                      {detail.split(item.link.text)[0]}
                      <a
                        href={item.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.link.text}
                      </a>
                      {detail.split(item.link.text)[1]}
                    </>
                  ) : (
                    detail
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

OtherInterestsSection.propTypes = {
  interests: PropTypes.shape({
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        period: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        institution: PropTypes.string,
        details: PropTypes.arrayOf(PropTypes.string).isRequired,
        link: PropTypes.shape({
          text: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        }),
      })
    ).isRequired,
  }).isRequired,
};

export default OtherInterestsSection;
