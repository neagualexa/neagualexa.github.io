import React from "react";
import PropTypes from "prop-types";
import GitHubIcon from "../data/misc/Github_icon.png";
import LinkedInIcon from "../data/misc/LinkedIn_icon.png";

const ScholarIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    style={{ marginRight: "0.5rem" }}
    aria-hidden="true"
  >
    <path fill="#4285F4" d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269z" />
    <path fill="#EA4335" d="M12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
  </svg>
);

const SocialLink = ({ name, url, display }) => {
  const lowerName = name.toLowerCase();
  let iconNode = null;
  if (lowerName.includes("scholar")) {
    iconNode = <ScholarIcon />;
  } else if (lowerName.includes("github")) {
    iconNode = (
      <img
        src={GitHubIcon}
        alt={`${name} icon`}
        style={{ width: "16px", height: "16px", marginRight: "0.5rem" }}
      />
    );
  } else if (lowerName.includes("linkedin")) {
    iconNode = (
      <img
        src={LinkedInIcon}
        alt={`${name} icon`}
        style={{ width: "16px", height: "16px", marginRight: "0.5rem" }}
      />
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="social-link"
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
