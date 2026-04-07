import React from "react";
import { Link } from "react-router-dom";
import newsData from "../data/newsData.json";

const TYPE_LABELS = {
  conference: "Conference",
  presentation: "Presentation",
  workshop: "Workshop",
  collaboration: "Collaboration",
  grant: "Grant",
  milestone: "Milestone",
};

const NewsTimeline = () => {
  const futureYears = newsData.years.filter((y) => y.isFuture);
  const pastYears = newsData.years.filter((y) => !y.isFuture).slice().reverse();

  return (
    <div className="news-timeline-section">
      <h2 className="news-timeline-heading">News</h2>

      <div className="news-timeline">
        {futureYears.map((yearBlock) => (
          <YearBlock key={yearBlock.year} yearBlock={yearBlock} />
        ))}
        {pastYears.map((yearBlock) => (
          <YearBlock key={yearBlock.year} yearBlock={yearBlock} />
        ))}
      </div>
    </div>
  );
};

const YearBlock = ({ yearBlock }) => (
  <div className={`timeline-year-block${yearBlock.isFuture ? " timeline-future" : ""}`}>
    <div className="timeline-year-label">
      {yearBlock.isFuture && <span className="timeline-future-icon">◆</span>}
      {yearBlock.year}
    </div>
    <div className="timeline-events">
      {[...yearBlock.events].reverse().map((event, idx) => (
        <EventRow key={idx} event={event} />
      ))}
    </div>
  </div>
);

const EventRow = ({ event }) => (
  <div className="timeline-event">
    <div className="timeline-dot-column">
      <div className="timeline-dot" />
    </div>
    <div className="timeline-event-body">
      <div className="timeline-event-meta">
        <span className="timeline-date">{event.date}</span>
        {event.type && (
          <span className={`timeline-tag timeline-tag--${event.type}`}>
            {TYPE_LABELS[event.type] || event.type}
          </span>
        )}
      </div>
      <div className="timeline-event-title">{event.title}</div>
      {event.description && (
        <div className="timeline-event-desc">
          {event.description.split("\n").map((line, i) => (
            <span key={i}>{line}{i < event.description.split("\n").length - 1 && <br />}</span>
          ))}
        </div>
      )}
      {event.links && event.links.length > 0 && (
        <div className="timeline-event-links">
          {event.links.map((link, i) =>
            link.internal ? (
              <Link key={i} to={link.url} className="timeline-link">
                {link.label} →
              </Link>
            ) : (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="timeline-link"
              >
                {link.label} →
              </a>
            )
          )}
        </div>
      )}
    </div>
  </div>
);

export default NewsTimeline;
