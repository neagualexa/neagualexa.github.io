import React from "react";
import resumeData from "../data/resumeData.json";
import {
  StaticNav,
  StickyNav,
  ResumeSection,
  SkillsSection,
  CertificationsSection,
  OtherInterestsSection,
} from "../components";
import useSectionNav from "../hooks/useSectionNav";

const ResumePage = () => {
  const { activeSection, showStickyNav, staticNavRef, handleNavClick } =
    useSectionNav(".resume-nav-section");

  const educationSection = resumeData.sections.find(
    (s) => s.title === "Education",
  );
  const experienceSection = resumeData.sections.find(
    (s) => s.title === "Experience",
  );
  const skillsSection = resumeData.sections.find(
    (s) => s.title === "Technical Skills and Languages",
  );
  const certificationsSection = resumeData.sections.find(
    (s) => s.title === "Certifications",
  );
  const interestsSection = resumeData.sections.find(
    (s) => s.title === "Other Interests and Experiences",
  );

  return (
    <section id="resume">
      <h2>Resume</h2>
      <p
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          fontSize: "1.1rem",
        }}
      >
        I present here my educational background, work experience, technical
        skills, certifications, and other interests. <br />
        For full resume please check the PDF version above.
      </p>

      <div ref={staticNavRef}>
        <StaticNav
          navigation={resumeData.navigation}
          onNavClick={handleNavClick}
          activeSection={activeSection}
        />
      </div>

      <StickyNav
        navigation={resumeData.navigation}
        onNavClick={handleNavClick}
        activeSection={activeSection}
        visible={showStickyNav}
      />

      <div id="resume-education" className="resume-nav-section">
        {educationSection && <ResumeSection section={educationSection} />}
      </div>
      <div id="resume-experience" className="resume-nav-section">
        {experienceSection && <ResumeSection section={experienceSection} />}
      </div>

      <div id="resume-skills" className="resume-nav-section">
        {skillsSection && <SkillsSection skills={skillsSection} />}
      </div>

      <div id="resume-certifications" className="resume-nav-section">
        {certificationsSection && (
          <CertificationsSection certifications={certificationsSection} />
        )}
      </div>

      <div id="resume-interests" className="resume-nav-section">
        {interestsSection && (
          <OtherInterestsSection interests={interestsSection} />
        )}
      </div>
    </section>
  );
};

export default ResumePage;
