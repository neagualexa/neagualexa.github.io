import React from "react";
import { IntroSection, ContactSection, NewsTimeline } from "../components";
import personalInfo from "../data/personalInfo.json";

const HomePage = () => {
  return (
    <section id="home">
      <div className="home-hero">
        <IntroSection
          introduction={personalInfo.introduction}
          callToAction={personalInfo.callToAction}
        />
        <ContactSection contact={personalInfo.contact} />
      </div>
      <NewsTimeline />
    </section>
  );
};

export default HomePage;
