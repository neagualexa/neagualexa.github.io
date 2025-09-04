import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const ResumeSection = ({ section }) => {
  const navigate = useNavigate();

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
    <div className="resume-section">
      <h3>{section.title}</h3>

      {section.items.map((item, index) => (
        <div key={index} className="resume-item">
          <div className="resume-item-header">
            {item.logo && (
              <div className="institution-logo">
                <img
                  src={getLogoPath(item.logo)}
                  alt={`${item.institution} logo`}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
            <div className="resume-item-content">
              <div className="date">{item.period}</div>
              <h4>{item.title}</h4>
              <div className="institution">{item.institution}</div>
            </div>
          </div>

          {item.details && (
            <ul>
              {item.details.map((detail, detailIndex) => (
                <li key={detailIndex}>{detail}</li>
              ))}
            </ul>
          )}

          {item.publications && (
            <div>
              <strong>Publications:</strong>
              <ul>
                {item.publications.map((pub, pubIndex) => (
                  <li key={pubIndex}>
                    {typeof pub === "string" ? (
                      pub
                    ) : (
                      <div className="publication-item">
                        <span className="publication-text">{pub.citation}</span>
                        <Button
                          variant="secondary"
                          onClick={() => navigate(`/publications#${pub.id}`)}
                          title="View full publication details"
                        >
                          View Details
                        </Button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.dissertation && (
            <div>
              <strong>Final Year Dissertation Project:</strong>
              <em>{item.dissertation}</em>
            </div>
          )}

          {item.yearBreakdown && (
            <div>
              {Object.entries(item.yearBreakdown).map(([year, subjects]) => (
                <div key={year}>
                  <strong>{year}:</strong>
                  <ul>
                    {subjects.map((subject, subjectIndex) => (
                      <li key={subjectIndex}>{subject}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {item.languages && <div>{item.languages}</div>}

          {item.projects && (
            <div>
              {item.projects.map((project, projectIndex) => (
                <div key={projectIndex}>
                  <strong>Project {projectIndex + 1}:</strong> {project}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

ResumeSection.propTypes = {
  section: PropTypes.shape({
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default ResumeSection;
