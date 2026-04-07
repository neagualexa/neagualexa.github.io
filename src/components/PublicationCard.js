import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

// Import all PDFs from the publications docs folder
const importAll = (r) => {
  let files = {};
  r.keys().forEach((item) => {
    files[item.replace("./", "")] = r(item);
  });
  return files;
};

const publicationPDFs = importAll(
  require.context("../data/misc/publications/docs", false, /\.(pdf)$/)
);

const PublicationCard = ({ publication }) => {
  const [expanded, setExpanded] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (window.location.hash === `#${publication.id}`) {
      setExpanded(true);
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlighted(true);
        setTimeout(() => setHighlighted(false), 2000);
      }, 100);
    }
  }, [publication.id]);

  const formatAuthors = (authors) => {
    if (!authors || authors.length === 0) return "";
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
    return `${authors.slice(0, -1).join(", ")}, and ${
      authors[authors.length - 1]
    }`;
  };

  const formatCitation = () => {
    const authors = formatAuthors(publication.authors);
    const title = <strong>"{publication.title}."</strong>;

    if (publication.journal) {
      return <>{authors}. {title} {publication.journal}{publication.volume ? ` ${publication.volume}` : ""}{publication.issue ? `.${publication.issue}` : ""}{publication.pages ? ` (${publication.year}): ${publication.pages}` : ` (${publication.year})`}.</>;
    } else if (publication.conference) {
      return <>{authors}. {title} {publication.conference}{publication.location ? `, ${publication.location}` : ""}. {publication.year}{publication.pages ? `: ${publication.pages}` : ""}.</>;
    } else if (publication.type) {
      return <>{authors}. {title} {publication.type}, {publication.institution}{publication.department ? `, ${publication.department}` : ""}. {publication.year}.</>;
    }

    return <>{authors}. {title} {publication.year}.</>;
  };

  return (
    <div
      ref={cardRef}
      className={`publication-card${highlighted ? " publication-card--highlighted" : ""}`}
      id={publication.id}
    >
      <div className="publication-header">
        <div className="publication-citation">{formatCitation()}</div>

        {publication.links && publication.links.length > 0 && (
          <div className="publication-links">
            {publication.links.map((link, index) => {
              let href = link.url;

              if (link.type === "PDF" && link.filename) {
                if (publicationPDFs[link.filename]) {
                  href = publicationPDFs[link.filename];
                } else if (link.filename.startsWith("http")) {
                  href = link.filename;
                }
              }

              return (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="publication-link"
                >
                  {link.type}
                </a>
              );
            })}
          </div>
        )}
      </div>

      {publication.abstract && (
        <>
          <button
            className="abstract-toggle"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Hide abstract" : "Read abstract"}
          </button>

          {expanded && (
            <div className="publication-abstract">
              <span
                dangerouslySetInnerHTML={{
                  __html: publication.abstract.replace(/\n/g, "<br>"),
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

PublicationCard.propTypes = {
  publication: PropTypes.shape({
    title: PropTypes.string.isRequired,
    authors: PropTypes.arrayOf(PropTypes.string).isRequired,
    year: PropTypes.string.isRequired,
    journal: PropTypes.string,
    conference: PropTypes.string,
    type: PropTypes.string,
    institution: PropTypes.string,
    department: PropTypes.string,
    supervisor: PropTypes.string,
    volume: PropTypes.string,
    issue: PropTypes.string,
    pages: PropTypes.string,
    location: PropTypes.string,
    abstract: PropTypes.string,
    links: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        url: PropTypes.string,
        filename: PropTypes.string,
      })
    ),
  }).isRequired,
};

export default PublicationCard;
