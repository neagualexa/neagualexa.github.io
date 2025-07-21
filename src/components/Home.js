import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section id="home">
      <div className="intro-text">
        <h1>Hello</h1>
        <h3>A Bit About Me</h3>
        <p>
          I'm Alexandra Neagu, a PhD student at Imperial College London under
          the guidance of Dr. Peter B. Johnson.
        </p>
        <p>
          My research focuses on the use of Large Language Models (LLMs) in
          automatically generating dialogic feedback for STEM education.
        </p>
        <div className="cta-buttons">
          <Link to="/resume" className="btn">
            View Resume
          </Link>
          <Link to="/projects" className="btn btn-secondary">
            See Projects
          </Link>
        </div>

        {/* Contact */}
        <div className="contact-info">
          <h3>Contact Information</h3>
          <p>
            Email:
            <a href="mailto:alexandra.neagu20@imperial.ac.uk">
              alexandra.neagu20@imperial.ac.uk
            </a>
          </p>
          <p className="social-links">
            <a
              href="https://www.linkedin.com/in/alexandra-neagu-743328116"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <span>LinkedIn</span>
            </a>
            <a
              href="https://github.com/neagualexa"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <span>GitHub</span>
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Home;
