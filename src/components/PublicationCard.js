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

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

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

  // date is ISO, as precise as known: "2026-06-28", "2026-06" or "2026"
  const dateLabel = (() => {
    const [year, month] = publication.date.split("-");
    return month ? `${MONTHS[parseInt(month, 10) - 1]} ${year}` : year;
  })();

  const venue =
    publication.journal ||
    publication.conference ||
    [publication.type, publication.institution].filter(Boolean).join(", ");

  const resolveHref = (link) => {
    if (link.type === "PDF" && link.filename) {
      if (publicationPDFs[link.filename]) return publicationPDFs[link.filename];
      if (link.filename.startsWith("http")) return link.filename;
    }
    return link.url;
  };

  return (
    <article
      ref={cardRef}
      className={`card publication-card${highlighted ? " publication-card--highlighted" : ""}`}
      id={publication.id}
    >
      <div className="publication-meta">
        <span>{dateLabel}</span>
        {publication.role && (
          <span className="publication-role">{publication.role}</span>
        )}
      </div>

      <h3 className="publication-title">{publication.title}</h3>
      <p className="publication-authors">{formatAuthors(publication.authors)}</p>
      {venue && <p className="publication-venue">{venue}</p>}

      {publication.abstract && (
        <>
          <p
            className={`publication-abstract${
              expanded ? "" : " publication-abstract--clamped"
            }`}
            dangerouslySetInnerHTML={{
              __html: publication.abstract.replace(/\n/g, "<br>"),
            }}
          />
          <button
            className="publication-abstract-toggle"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : "Read abstract"}
          </button>
        </>
      )}

      {publication.links && publication.links.length > 0 && (
        <div className="publication-links">
          {publication.links.map((link, index) => (
            <a
              key={index}
              href={resolveHref(link)}
              target="_blank"
              rel="noopener noreferrer"
              className="publication-text-link"
            >
              {link.type}
              <span aria-hidden="true" className="publication-text-link__arrow">
                →
              </span>
            </a>
          ))}
        </div>
      )}
    </article>
  );
};

PublicationCard.propTypes = {
  publication: PropTypes.shape({
    title: PropTypes.string.isRequired,
    role: PropTypes.string,
    authors: PropTypes.arrayOf(PropTypes.string).isRequired,
    date: PropTypes.string.isRequired,
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
