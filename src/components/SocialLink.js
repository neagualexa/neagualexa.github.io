import React from "react";
import PropTypes from "prop-types";
import GitHubIcon from "../data/misc/Github_icon.png";
import LinkedInIcon from "../data/misc/LinkedIn_icon.png";

const SocialLink = ({ name, url, display }) => {
  // Function to get the appropriate icon based on the social platform
  const getIcon = (socialName) => {
    const lowerName = socialName.toLowerCase();
    if (lowerName.includes("github")) {
      return GitHubIcon;
    } else if (lowerName.includes("linkedin")) {
      return LinkedInIcon;
    }
    return null;
  };

  const icon = getIcon(name);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="social-link"
    >
      {icon && (
        <img
          src={icon}
          alt={`${name} icon`}
          style={{ width: "16px", height: "16px", marginRight: "0.5rem" }}
        />
      )}
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
