import React from "react";
import { IntroSection, ContactSection } from "../components";
import personalInfo from "../data/personalInfo.json";

const HomePage = () => {
  return (
    <section id="home">
      <IntroSection
        introduction={personalInfo.introduction}
        callToAction={personalInfo.callToAction}
      />
      <ContactSection contact={personalInfo.contact} />
    </section>
  );
};

export default HomePage;
