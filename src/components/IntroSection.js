import React from "react";
import PropTypes from "prop-types";
import Button from "./Button";

const IntroSection = ({ introduction, callToAction }) => {
  return (
    <div className="intro-text">
      <h1>{introduction.greeting}</h1>
      <h3>{introduction.subtitle}</h3>
      {introduction.description.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}

      <div className="cta-buttons">
        {callToAction.map((cta, index) => (
          <Button key={index} to={cta.link} variant={cta.type}>
            {cta.text}
          </Button>
        ))}
      </div>
    </div>
  );
};

IntroSection.propTypes = {
  introduction: PropTypes.shape({
    greeting: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    description: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  callToAction: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default IntroSection;
