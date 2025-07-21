import React from "react";
import resumeData from "../data/resumeData.json";
import ResumeSection from "../components/resume/ResumeSection";
import SkillsSection from "../components/resume/SkillsSection";
import CertificationsSection from "../components/resume/CertificationsSection";
import OtherInterestsSection from "../components/resume/OtherInterestsSection";

const ResumePage = () => {
  // Find specific sections
  const educationSection = resumeData.sections.find(
    (s) => s.title === "Education"
  );
  const experienceSection = resumeData.sections.find(
    (s) => s.title === "Experience"
  );
  const skillsSection = resumeData.sections.find(
    (s) => s.title === "Technical Skills and Languages"
  );
  const certificationsSection = resumeData.sections.find(
    (s) => s.title === "Certifications"
  );
  const interestsSection = resumeData.sections.find(
    (s) => s.title === "Other Interests and Experiences"
  );

  return (
    <section id="resume">
      <h2>Resume</h2>

      {/* Education and Experience in 2-column grid */}
      <div className="resume-grid">
        {educationSection && <ResumeSection section={educationSection} />}
        {experienceSection && <ResumeSection section={experienceSection} />}
      </div>

      {/* Skills as separate full-width section */}
      {skillsSection && <SkillsSection skills={skillsSection} />}

      {/* Certifications as separate full-width section */}
      {certificationsSection && (
        <CertificationsSection certifications={certificationsSection} />
      )}

      {/* Other Interests as separate full-width section */}
      {interestsSection && (
        <OtherInterestsSection interests={interestsSection} />
      )}
    </section>
  );
};

export default ResumePage;
