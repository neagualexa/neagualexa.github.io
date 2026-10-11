import React from "react";
import {
  IntroSection,
  ContactSection,
  NewsTimeline,
  MagicField,
  PetDragon,
} from "../components";
import personalInfo from "../data/personalInfo.json";

const HomePage = () => {
  return (
    <section id="home">
      <div className="home-hero">
        <MagicField />
        <IntroSection
          introduction={personalInfo.introduction}
          callToAction={personalInfo.callToAction}
        />
        <ContactSection contact={personalInfo.contact} />
      </div>
      <NewsTimeline />
      <PetDragon />
    </section>
  );
};

export default HomePage;
