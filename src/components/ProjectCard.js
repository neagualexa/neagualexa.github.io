import React from "react";
import PropTypes from "prop-types";
import ImageGallery from "./ImageGallery";
import GithubIcon from "../data/misc/Github_icon.png";

// Import all PDFs from the projects docs folder
const importAll = (r) => {
  let files = {};
  r.keys().forEach((item) => {
    files[item.replace("./", "")] = r(item);
  });
  return files;
};

const projectPDFs = importAll(
  require.context("../data/misc/projects/docs", false, /\.(pdf)$/)
);

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      <h4>{project.title}</h4>
      <p dangerouslySetInnerHTML={{ __html: project.description }}></p>

      {project.technologies && project.technologies.length > 0 && (
        <div className="project-technologies">
          {project.technologies.map((tech, index) => (
            <span key={index} className="tech-tag">
              {tech}
            </span>
          ))}
        </div>
      )}

      {((project.images && project.images.length > 0) ||
        (project.videos && project.videos.length > 0)) && (
        <ImageGallery
          images={project.images}
          videos={project.videos}
          projectTitle={project.title}
        />
      )}

      {project.links && project.links.length > 0 && (
        <div className="project-links">
          {project.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                marginRight: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              {link.type === "github" && (
                <img
                  src={GithubIcon}
                  alt="GitHub icon"
                  style={{ width: "16px", height: "16px" }}
                />
              )}
              {link.text}
            </a>
          ))}
        </div>
      )}

      {project.resources && project.resources.length > 0 && (
        <div className="project-resources">
          <strong>Resources:</strong>
          <div style={{ marginTop: "0.5rem" }}>
            {project.resources.map((resource, index) => {
              let href = resource.url;

              // If we have a filename that matches imported PDFs, use the imported PDF
              if (resource.url && projectPDFs[resource.url]) {
                href = projectPDFs[resource.url];
              }

              return (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="publication-link"
                >
                  {resource.text}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    technologies: PropTypes.arrayOf(PropTypes.string),
    images: PropTypes.arrayOf(PropTypes.string),
    videos: PropTypes.arrayOf(PropTypes.string),
    links: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        type: PropTypes.string,
      })
    ),
    resources: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

export default ProjectCard;
