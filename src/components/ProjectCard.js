import PropTypes from "prop-types";
import ImageGallery from "./ImageGallery";

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
            >
              {link.text}
            </a>
          ))}
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
      })
    ),
  }).isRequired,
};

export default ProjectCard;
