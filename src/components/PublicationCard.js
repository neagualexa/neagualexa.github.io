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

    if (publication.journal) {
      // Journal paper format
      return `${authors}. "${publication.title}." ${publication.journal}${
        publication.volume ? ` ${publication.volume}` : ""
      }${publication.issue ? `.${publication.issue}` : ""}${
        publication.pages
          ? ` (${publication.year}): ${publication.pages}`
          : ` (${publication.year})`
      }.`;
    } else if (publication.conference) {
      // Conference paper format
      return `${authors}. "${publication.title}." ${publication.conference}${
        publication.location ? `, ${publication.location}` : ""
      }. ${publication.year}${
        publication.pages ? `: ${publication.pages}` : ""
      }.`;
    } else if (publication.type) {
      // Thesis format
      return `${authors}. "${publication.title}." ${publication.type}, ${
        publication.institution
      }${publication.department ? `, ${publication.department}` : ""}. ${
        publication.year
      }.`;
    }

    return `${authors}. "${publication.title}." ${publication.year}.`;
  };

  return (
    <div className="publication-card">
      <div className="publication-citation">{formatCitation()}</div>

      {publication.doi && (
        <div className="publication-doi">
          <strong>DOI:</strong> {publication.doi}
        </div>
      )}

      {publication.supervisor && (
        <div className="publication-supervisor">
          <strong>Supervisor:</strong> {publication.supervisor}
        </div>
      )}

      {publication.abstract && (
        <div className="publication-abstract">
          <strong>Abstract:</strong>{" "}
          <span
            dangerouslySetInnerHTML={{
              __html: publication.abstract.replace(/\n/g, "<br>"),
            }}
          />
        </div>
      )}

      {publication.keywords && publication.keywords.length > 0 && (
        <div className="publication-keywords">
          <strong>Keywords:</strong>
          <div className="keywords-list">
            {publication.keywords.map((keyword, index) => (
              <span key={index} className="keyword-tag">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {publication.links && publication.links.length > 0 && (
        <div className="publication-links">
          {publication.links.map((link, index) => {
            let href = link.url;

            // If it's a PDF link and we have a filename, use the imported PDF
            if (
              link.type === "PDF" &&
              link.filename &&
              publicationPDFs[link.filename]
            ) {
              href = publicationPDFs[link.filename];
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
    doi: PropTypes.string,
    abstract: PropTypes.string,
    keywords: PropTypes.arrayOf(PropTypes.string),
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
