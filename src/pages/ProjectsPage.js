import React, { useEffect, useState, useRef } from "react";
import { StaticNav, StickyNav, ProjectSection } from "../components";
import projectsData from "../data/projectsData.json";

const SCROLL_OFFSET = 120;

const ProjectsPage = () => {
  const [activeSection, setActiveSection] = useState("");
  const [showStickyNav, setShowStickyNav] = useState(false);
  const staticNavRef = useRef(null);

  useEffect(() => {
    const scrollToHashSection = () => {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          const target = document.querySelector(hash);
          if (target) {
            window.scrollTo({ top: target.offsetTop - SCROLL_OFFSET, behavior: "smooth" });
          }
        }, 100);
      }
    };

    const handleScroll = () => {
      const sections = document.querySelectorAll(".year-section");
      let current = "";
      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 200) {
          current = section.getAttribute("id");
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    scrollToHashSection();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyNav(!entry.isIntersecting),
      { threshold: 0 }
    );
    const el = staticNavRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e) => {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute("href"));
    if (target) {
      window.scrollTo({ top: target.offsetTop - SCROLL_OFFSET, behavior: "smooth" });
    }
  };

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
