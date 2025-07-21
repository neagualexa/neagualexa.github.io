import React from "react";
import PropTypes from "prop-types";

const ResumeItem = ({ item }) => {
  return (
    <div className="resume-item">
      <div className="date">{item.period}</div>
      <h4>{item.title}</h4>
      <div className="institution">{item.institution}</div>

      {item.details && (
        <ul>
          {item.details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      )}

      {item.dissertation && (
        <p>
          <strong>Final Year Dissertation Project:</strong>
          <em> {item.dissertation}</em>
        </p>
      )}

      {item.publications && (
        <div>
          <strong>Publications:</strong>
          <ul>
            {item.publications.map((pub, index) => (
              <li key={index}>{pub}</li>
            ))}
          </ul>
        </div>
      )}

      {item.yearBreakdown && (
        <div>
          {Object.entries(item.yearBreakdown).map(([year, subjects]) => (
            <div key={year}>
              <strong>{year}:</strong>
              <ul>
                {subjects.map((subject, index) => (
                  <li key={index}>{subject}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {item.languages && <li>{item.languages}</li>}

      {item.projects && (
        <div>
          {item.projects.map((project, index) => (
            <li key={index}>
              <strong>Project {index + 1}:</strong> {project}
            </li>
          ))}
        </div>
      )}
    </div>
  );
};

ResumeItem.propTypes = {
  item: PropTypes.shape({
    period: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    institution: PropTypes.string.isRequired,
    details: PropTypes.arrayOf(PropTypes.string),
    dissertation: PropTypes.string,
    publications: PropTypes.arrayOf(PropTypes.string),
    yearBreakdown: PropTypes.object,
    languages: PropTypes.string,
    projects: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ResumeItem;
