import React from "react";
import PropTypes from "prop-types";
import PublicationCard from "./PublicationCard";

const PublicationSection = ({ section }) => {
  return (
    <div id={section.id} className="year-section">
      <h3>{section.title}</h3>
      {section.publications.length > 0 ? (
        <div className="publications-list">
          {section.publications.map((publication, index) => (
            <PublicationCard key={index} publication={publication} />
          ))}
        </div>
      ) : (
        <div className="no-publications">
          <p style={{ fontStyle: "italic", color: "#666" }}>
            No publications in this category yet.
          </p>
        </div>
      )}
    </div>
  );
};

PublicationSection.propTypes = {
  section: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    publications: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default PublicationSection;
