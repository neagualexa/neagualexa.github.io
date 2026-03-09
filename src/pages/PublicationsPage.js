import React from "react";
import PublicationCard from "../components/PublicationCard";
import publicationsData from "../data/publicationsData.json";

const PublicationsPage = () => {
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
        Below is a collection of my research publications. <br />
        My research focuses on Human-AI Interaction,AI-Assisted Learning, and
        Educational Technology.
      </p>

      <div className="publications-container">
        <div className="publications-list">
          {[...publicationsData.publications]
            .sort((a, b) => Number(b.year) - Number(a.year))
            .map((publication) => (
              <PublicationCard key={publication.id} publication={publication} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default PublicationsPage;
