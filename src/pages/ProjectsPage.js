import React from "react";
import { StaticNav, StickyNav, ProjectSection } from "../components";
import projectsData from "../data/projectsData.json";
import useSectionNav from "../hooks/useSectionNav";

const ProjectsPage = () => {
  const { activeSection, showStickyNav, staticNavRef, handleNavClick } =
    useSectionNav(".year-section");

  return (
    <section id="projects">
      <h2>Welcome to my projects</h2>
      <p
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          fontSize: "1.1rem",
        }}
      >
        This is a collection of projects I have worked on throughout the years
        (and academic phases). <br />I have included details about each project,
        the technologies used, and links to the code repositories or demos where
        applicable.
      </p>

      <div ref={staticNavRef}>
        <StaticNav
          navigation={projectsData.navigation}
          onNavClick={handleNavClick}
          activeSection={activeSection}
        />
      </div>

      <StickyNav
        navigation={projectsData.navigation}
        onNavClick={handleNavClick}
        activeSection={activeSection}
        visible={showStickyNav}
      />

      {projectsData.sections.map((section) => (
        <ProjectSection key={section.id} section={section} />
      ))}
    </section>
  );
};

export default ProjectsPage;
