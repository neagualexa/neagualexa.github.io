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

const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const todayISO = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

const parts = (iso) => {
  const [y, m, d] = iso.split("-");
  return { year: y, month: MONTH_ABBR[parseInt(m, 10) - 1], day: String(parseInt(d, 10)) };
};

const formatDateRange = (start, end, includeYear) => {
  const s = parts(start);
  const yearSuffix = includeYear ? ` ${s.year}` : "";
  if (!end || end === start) {
    return `${s.day} ${s.month}${yearSuffix}`;
  }
  const e = parts(end);
  if (s.month === e.month && s.year === e.year) {
    return `${s.day}–${e.day} ${s.month}${yearSuffix}`;
  }
  return `${s.day} ${s.month} – ${e.day} ${e.month}${yearSuffix}`;
};

const NewsTimeline = () => {
  const today = todayISO();
  const upcoming = [];
  const pastByYear = {};

  for (const event of newsData.events) {
    const lastDate = event.end || event.start;
    if (lastDate >= today) {
      upcoming.push(event);
    } else {
      const year = event.start.slice(0, 4);
      (pastByYear[year] ||= []).push(event);
    }
  }

  upcoming.sort((a, b) => a.start.localeCompare(b.start));
  const pastYears = Object.keys(pastByYear)
    .sort((a, b) => b.localeCompare(a))
    .map((year) => ({
      year,
      isFuture: false,
      events: pastByYear[year].sort((a, b) => b.start.localeCompare(a.start)),
    }));

  const blocks = [];
  if (upcoming.length > 0) {
    blocks.push({ year: "Upcoming", isFuture: true, events: upcoming });
  }
  blocks.push(...pastYears);

  return (
    <div className="news-timeline-section">
      <h2 className="news-timeline-heading">News</h2>

      <div className="news-timeline">
        {blocks.map((block) => (
          <YearBlock key={block.year} yearBlock={block} />
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
      {yearBlock.events.map((event, idx) => (
        <EventRow key={idx} event={event} includeYear={yearBlock.isFuture} />
      ))}
    </div>
  </div>
);

const EventRow = ({ event, includeYear }) => (
  <div className="timeline-event">
    <div className="timeline-dot-column">
      <div className="timeline-dot" />
    </div>
    <div className="timeline-event-body">
      <div className="timeline-event-meta">
        <span className="timeline-date">{formatDateRange(event.start, event.end, includeYear)}</span>
        {event.type && (
          <span className={`timeline-tag timeline-tag--${event.type}`}>
            {TYPE_LABELS[event.type] || event.type}
          </span>
        )}
      </div>
      <div className="timeline-event-title" dangerouslySetInnerHTML={{ __html: event.title }} />
      {event.description && (
        <div
          className="timeline-event-desc"
          dangerouslySetInnerHTML={{ __html: event.description.replace(/\n/g, "<br />") }}
        />
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
