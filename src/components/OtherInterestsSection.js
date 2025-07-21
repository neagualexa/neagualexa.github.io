import React from "react";
import PropTypes from "prop-types";

const OtherInterestsSection = ({ interests }) => {
  return (
    <div className="resume-section" style={{ marginTop: "3rem" }}>
      <h3>{interests.title}</h3>
      <div className="resume-grid">
        {interests.items.map((item, index) => (
          <div key={index} className="resume-item">
            <div className="date">{item.period}</div>
            <h4>{item.title}</h4>
            {item.institution && (
              <div className="institution">{item.institution}</div>
            )}
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
