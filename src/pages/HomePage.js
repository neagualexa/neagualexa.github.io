import React from "react";
import IntroSection from "../components/home/IntroSection";
import ContactSection from "../components/home/ContactSection";
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
