import { useEffect, useState, useRef } from "react";

const SCROLL_OFFSET = 120;

const useSectionNav = (sectionSelector) => {
  const [activeSection, setActiveSection] = useState("");
  const [showStickyNav, setShowStickyNav] = useState(false);
  const staticNavRef = useRef(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const target = document.querySelector(hash);
        if (target) {
          window.scrollTo({ top: target.offsetTop - SCROLL_OFFSET, behavior: "smooth" });
        }
      }, 100);
    }

    const handleScroll = () => {
      const sections = document.querySelectorAll(sectionSelector);
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
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionSelector]);

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

  return { activeSection, showStickyNav, staticNavRef, handleNavClick };
};

export default useSectionNav;
