import React, { useEffect, useState } from "react";
import { PublicationsNavigation, PublicationSection } from "../components";
import publicationsData from "../data/publicationsData.json";

const PublicationsPage = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    // Active navigation highlighting for publication sections
    const handleScroll = () => {
      const sections = document.querySelectorAll(".year-section");
      let current = "";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute("id");
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);

    // Initial scroll position check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavClick = (e) => {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section id="publications">
      <h2>Publications</h2>
      <p
        style={{
          textAlign: "center",
          margin: "20px auto",
          maxWidth: "800px",
          fontSize: "16px",
          lineHeight: "1.6",
        }}
      >
        Below is a collection of my research publications. My research focuses
        on uses of Large Language Models in STEM education, AI-assisted
        learning, and educational technology.
      </p>

      <PublicationsNavigation
        navigation={publicationsData.navigation}
        onNavClick={handleNavClick}
        activeSection={activeSection}
      />

      <div className="publications-container">
        {publicationsData.sections.map((section) => (
          <PublicationSection key={section.id} section={section} />
        ))}
      </div>
    </section>
  );
};

export default PublicationsPage;
