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

  const renderItemHeader = (item) => (
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
  );

  const renderProject = (project, projectIndex) => {
    const colonIndex = project.indexOf(":");
    if (colonIndex !== -1) {
      const title = project.substring(0, colonIndex);
      const description = project.substring(colonIndex + 1);
      return (
        <div key={projectIndex}>
          <strong>{title}:</strong>
          {description}
        </div>
      );
    } else {
      return (
        <div key={projectIndex}>
          <strong>Project {projectIndex + 1}:</strong> {project}
        </div>
      );
    }
  };

  const renderPublication = (pub, pubIndex) => (
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
  );

  const renderYearBreakdown = (yearBreakdown) => (
    <div>
      {Object.entries(yearBreakdown).map(([year, subjects]) => (
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
  );

  return (
    <div className="resume-section">
      <h3>{section.title}</h3>

      {section.items.map((item, index) => (
        <div key={index} className="resume-item">
          {renderItemHeader(item)}

          {item.details && (
            <ul>
              {item.details.map((detail, detailIndex) =>
                typeof detail === "string" ? (
                  <li key={detailIndex}>{detail}</li>
                ) : (
                  <li key={detailIndex}>
                    {detail.text}
                    {detail.subpoints && (
                      <ul>
                        {detail.subpoints.map((sub, subIndex) => (
                          <li key={subIndex}>{sub}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              )}
            </ul>
          )}

          {item.publications && (
            <div>
              <strong>Publications:</strong>
              <ul>
                {item.publications.map((pub, pubIndex) =>
                  renderPublication(pub, pubIndex)
                )}
              </ul>
            </div>
          )}

          {item.dissertation && (
            <div>
              <strong>Final Year Dissertation Project:</strong>
              <em>{item.dissertation}</em>
            </div>
          )}

          {item.yearBreakdown && renderYearBreakdown(item.yearBreakdown)}

          {item.languages && <div>{item.languages}</div>}

          {item.projects && (
            <div>
              {item.projects.map((project, projectIndex) =>
                renderProject(project, projectIndex)
              )}
            </div>
          )}

          {item.link && item.link.projectSectionId && (
            <div className="resume-item-link">
              <Button
                variant="secondary"
                onClick={() => {
                  const targetUrl = `${item.link.url}#${item.link.projectSectionId}`;
                  navigate(targetUrl);
                }}
                title={item.link.text}
              >
                {item.link.text}
              </Button>
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
