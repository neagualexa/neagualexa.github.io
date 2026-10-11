import React from "react";
import PropTypes from "prop-types";
import GitHubIcon from "../data/misc/Github_icon.png";
import LinkedInIcon from "../data/misc/LinkedIn_icon.png";

const SocialLink = ({ name, url, display }) => {
  const lowerName = name.toLowerCase();
  let iconNode = null;
  if (lowerName.includes("github")) {
    iconNode = (
      <img src={GitHubIcon} alt={`${name} icon`} />
    );
  } else if (lowerName.includes("linkedin")) {
    iconNode = (
      <img src={LinkedInIcon} alt={`${name} icon`} />
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn--secondary btn--sm social-link"
    >
      {iconNode}
      <span>{display || name}</span>
    </a>
  );
};

SocialLink.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  display: PropTypes.string,
};

export default SocialLink;
