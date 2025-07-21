import React, { useEffect, useState } from "react";
import ProjectsNavigation from "../components/projects/ProjectsNavigation";
import ProjectSection from "../components/projects/ProjectSection";
import projectsData from "../data/projectsData.json";

const ProjectsPage = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    // Active navigation highlighting for project sections
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
    <section id="projects">
      <h2>Welcome to my projects</h2>
      <p
        style={{
          textAlign: "center",
          marginBottom: "3rem",
          fontSize: "1.1rem",
        }}
      >
        Click on one of the sections below or scroll down by yourself.
      </p>

      <ProjectsNavigation
        navigation={projectsData.navigation}
        onNavClick={handleNavClick}
        activeSection={activeSection}
      />

      {projectsData.sections.map((section) => (
        <ProjectSection key={section.id} section={section} />
      ))}
    </section>
  );
};

export default ProjectsPage;
