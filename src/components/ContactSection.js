import React from "react";
import PropTypes from "prop-types";
import SocialLink from "./SocialLink";

const ContactSection = ({ contact }) => {
  return (
    <div className="contact-info">
      <h3>Contact Information</h3>
      <p>
        Email: <a href={`mailto:${contact.email}`}>{contact.email}</a>
      </p>
      <p className="social-links">
        {contact.socialLinks.map((social, index) => (
          <SocialLink
            key={index}
            name={social.name}
            url={social.url}
            display={social.display}
          />
        ))}
      </p>
    </div>
  );
};

ContactSection.propTypes = {
  contact: PropTypes.shape({
    email: PropTypes.string.isRequired,
    socialLinks: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        display: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
};

export default ContactSection;
