import React, { useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { petMouth } from "./petMouth";

// Stardust behind the home hero: twinkling motes drift around and gather
// into constellations near the cursor. The pet dragon eats any it flies close
// to (they reappear elsewhere a few seconds later). Colors come from the
// --magic-* tokens.

const MAGIC_TOKENS = ["--magic-mint", "--magic-iris", "--magic-rose"];
const MOTE_AREA = 9000; // one mote per this many px² of hero
const REACH = 150; // cursor radius that pulls motes into a constellation
const LINK = 90; // max distance between two linked motes
const SNIFF = 60; // the dragon pulls in motes within this distance...
const BITE = 10; // ...and eats those that reach its mouth
const REGROW = [3, 8]; // seconds before an eaten mote reappears

const rand = (min, max) => min + Math.random() * (max - min);

const makeMote = (w, h) => ({
  x: rand(0, w),
  y: rand(0, h),
  vx: rand(-0.15, 0.15),
  vy: rand(-0.15, 0.15),
  r: rand(0.6, 1.8),
  phase: rand(0, Math.PI * 2),
  speed: rand(0.6, 1.6),
  color: Math.floor(rand(0, MAGIC_TOKENS.length)),
  born: 1, // 0 → 1 fade-in after regrowing
  eaten: 0, // seconds until it regrows (> 0 while eaten)
});

const MagicField = () => {
  const canvasRef = useRef(null);
  const { isDarkMode } = useTheme();
  const themeRef = useRef({ isDarkMode, stale: true });

  // The theme class is applied to <body> by the provider after this renders,
  // so only mark the colors stale here and re-read them on the next frame.
  useEffect(() => {
    themeRef.current = { isDarkMode, stale: true };
  }, [isDarkMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas.parentElement;
    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let colors = [];
    let motes = [];
    let pointer = null;
    let frame = null;
    let visible = true;

    const readColors = () => {
      const style = getComputedStyle(document.body);
      colors = MAGIC_TOKENS.map((t) => style.getPropertyValue(t).trim());
      themeRef.current.stale = false;
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = host.clientWidth;
      height = host.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((width * height) / MOTE_AREA);
      motes = Array.from({ length: count }, () => makeMote(width, height));
    };

    // The dragon's mouth in this canvas's coordinates (null if it's away)
    const mouth = () => {
      if (petMouth.x === null) return null;
      const rect = host.getBoundingClientRect();
      return {
        x: petMouth.x - rect.left - window.scrollX,
        y: petMouth.y - rect.top - window.scrollY,
      };
    };

    const step = (dt) => {
      const pet = mouth();
      for (const m of motes) {
        if (m.eaten > 0) {
          m.eaten -= dt;
          if (m.eaten <= 0)
            Object.assign(m, makeMote(width, height), { born: 0 });
          continue;
        }
        m.born = Math.min(1, m.born + dt);
        if (pet) {
          const dx = pet.x - m.x;
          const dy = pet.y - m.y;
          const d = Math.hypot(dx, dy);
          if (d < BITE) {
            m.eaten = rand(REGROW[0], REGROW[1]);
            petMouth.chomp();
            continue;
          }
          if (d < SNIFF) {
            m.vx += (dx / d) * 0.08;
            m.vy += (dy / d) * 0.08;
          }
        }
        if (pointer) {
          const dx = pointer.x - m.x;
          const dy = pointer.y - m.y;
          const d = Math.hypot(dx, dy);
          if (d < REACH && d > 1) {
            m.vx += (dx / d) * 0.012;
            m.vy += (dy / d) * 0.012;
          }
        }
        m.vx *= 0.985;
        m.vy *= 0.985;
        m.x = (m.x + m.vx + 0.05 + width) % width;
        m.y = (m.y + m.vy + height) % height;
      }
    };

    const draw = (time = 0) => {
      if (themeRef.current.stale) readColors();
      const glow = themeRef.current.isDarkMode;
      const t = time / 1000;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = glow ? "lighter" : "source-over";

      const shown = motes.filter((m) => m.eaten <= 0);

      // Constellation lines between motes near the cursor
      if (pointer) {
        const near = shown.filter(
          (m) => Math.hypot(m.x - pointer.x, m.y - pointer.y) < REACH,
        );
        ctx.lineWidth = 0.6;
        for (let i = 0; i < near.length; i++) {
          for (let j = i + 1; j < near.length; j++) {
            const d = Math.hypot(near[i].x - near[j].x, near[i].y - near[j].y);
            if (d < LINK) {
              ctx.strokeStyle = colors[near[i].color];
              ctx.globalAlpha = (1 - d / LINK) * 0.5;
              ctx.beginPath();
              ctx.moveTo(near[i].x, near[i].y);
              ctx.lineTo(near[j].x, near[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // Twinkling motes, brighter near the cursor
      for (const m of shown) {
        const twinkle = 0.45 + 0.4 * Math.sin(t * m.speed + m.phase);
        const lit =
          pointer && Math.hypot(m.x - pointer.x, m.y - pointer.y) < REACH;
        ctx.globalAlpha = (lit ? 1 : twinkle) * m.born;
        ctx.fillStyle = colors[m.color];
        ctx.beginPath();
        ctx.arc(m.x, m.y, lit ? m.r * 1.5 : m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    let last = 0;
    const loop = (time) => {
      step(Math.min(0.05, (time - last) / 1000 || 0));
      last = time;
      draw(time);
      frame = visible ? requestAnimationFrame(loop) : null;
    };

    const local = (e) => {
      const rect = host.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onMove = (e) => {
      pointer = local(e);
    };

    const onLeave = () => {
      pointer = null;
    };

    const resizer = new ResizeObserver(resize);
    resizer.observe(host);

    // Pause the animation while the hero is scrolled out of view
    const watcher = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(loop);
    });
    watcher.observe(host);

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      resizer.disconnect();
      watcher.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="magic-field" aria-hidden="true" />;
};

export default MagicField;
