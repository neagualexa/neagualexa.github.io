import React from "react";
import PropTypes from "prop-types";

const SocialLink = ({ name, url, display }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="social-link"
    >
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
