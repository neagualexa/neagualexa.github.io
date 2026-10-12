import React, { useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { drawDragon } from "./drawDragon";
import { petMouth } from "./petMouth";

// A pet dragon for the home page, drawn from above (see drawDragon.js).
// Its home is a corner of the contact card. Click it and it follows your
// cursor (click it again to send it home); on a touch screen there's no
// cursor, so a tap just sends it round a little ∞ instead. Once you scroll
// down to the news it flies onto the timeline line and follows you down it,
// eating each dot it passes; they grow back when you scroll up. It naps on its
// perch when nothing is happening, waking now and then to fly a little
// figure-eight (∞) around it or to move to another of its perches.
// Lives directly inside #home, which it uses as its coordinate space.

const FOLLOW = 0.4; // where on screen it flies to on the line (fraction of viewport)
const FOLLOW_END = 0.85; // ...sliding down to here as you reach the page bottom
const EASE = 0.08; // how quickly it catches up per 60fps frame
const TURN_SPEED = 2.5; // rad/s it turns at, in every mode
const LINE_TURN_SPEED = 7; // rad/s on (and flying to) the line, so it never faces the wrong way for long
const MOVING = 18; // px/s it must be going to count as flying
const LINE_UP = 150; // px/s it must be going up the line before it turns to face up
const LINE_SCALE = 0.7; // drawn smaller on the line (matches home.css)
const BITE_MS = 280; // length of one chomp of the head
const NAP_AFTER = 1500; // ms without scrolling or mouse moves before it naps
const FLIGHT_EVERY = [10000, 25000]; // ms of rest before its own next outing
const FLIGHT_LAP_MS = [7000, 9000]; // how long one trip round the ∞ takes
const FLIGHT_WIDTH = [40, 80]; // px, half the width of the ∞ (it's half as tall)
const FLIGHT_SPEED = 50; // px/s, average pace moving house (≈ the ∞'s pace)
const GLIDE_SPEED = 180; // px/s, top speed flying home after you steered it
const COLOR_TOKENS = {
  body: "--dragon-body",
  shade: "--dragon-shade",
  plate: "--dragon-plate",
  wing: "--dragon-wing",
  wingTip: "--dragon-wing-tip",
  opalA: "--dragon-opal-a",
  opalB: "--dragon-opal-b",
};

const rand = (min, max) => min + Math.random() * (max - min);

// Smallest signed difference between two angles
const turnTo = (from, to) =>
  Math.atan2(Math.sin(to - from), Math.cos(to - from));

const PetDragon = () => {
  const petRef = useRef(null);
  const canvasRef = useRef(null);
  const zRef = useRef(null);
  const { isDarkMode } = useTheme();
  const staleColors = useRef(true);

  // The theme class lands on <body> after this renders; re-read next frame
  useEffect(() => {
    staleColors.current = true;
  }, [isDarkMode]);

  useEffect(() => {
    const pet = petRef.current;
    const canvas = canvasRef.current;
    const z = zRef.current;
    const ctx = canvas.getContext("2d");
    const home = pet.parentElement;

    let size = 0; // px, the pet's box
    let headDist = 0; // px from the box center to the tip of the snout
    const colors = {};
    let mode = "perch"; // perch | cursor | line
    let following = false; // toggled by clicking the pet
    let cursor = null; // last mouse position, viewport coords
    let goal = { x: 0, y: 0 }; // perch/line: where its center goes; cursor: what it faces
    let pos = null; // center, #home coords
    let heading = 0; // radians, 0 = head up, clockwise
    let dots = [];
    let resting = true;
    let napTimer = null;
    let biteAt = -Infinity; // when the last chomp started
    let spot = Math.floor(Math.random() * 4); // which corner it lives on (see perches())
    let perchFace = 0; // the way it faces when settled there
    let flight = null; // its own outing under way: an ∞ loop or a move to another perch
    let flightTimer = null;
    let wasMoving = false;
    let lineUp = false; // on the line: heading back up (you scrolled up) or down
    let wingPose = 0; // 0 folded … 1 spread, eased toward the target pose
    let time = 0;
    let last = 0;
    let frame = null;
    let homeOffset = { x: 0, y: 0 }; // #home's position on the page

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = pet.offsetWidth;
      headDist = size * 0.42;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const readColors = () => {
      const style = getComputedStyle(document.body);
      for (const [key, token] of Object.entries(COLOR_TOKENS)) {
        colors[key] = style.getPropertyValue(token).trim();
      }
      staleColors.current = false;
    };

    // Places it can sleep, in #home coords: tucked inside the four corners of
    // the contact card, each with its head pointing into its corner
    const perches = (origin) => {
      const card = home.querySelector(".contact-info").getBoundingClientRect();
      const inset = size * 0.45; // how far its center sits in from the card's edges
      const left = card.left - origin.left + inset;
      const right = card.right - origin.left - inset;
      const top = card.top - origin.top + inset;
      const bottom = card.bottom - origin.top - inset;
      return [
        { x: left, y: top, face: -Math.PI / 4 },
        { x: right, y: top, face: Math.PI / 4 },
        { x: right, y: bottom, face: (3 * Math.PI) / 4 },
        { x: left, y: bottom, face: (-3 * Math.PI) / 4 },
      ];
    };

    // Decide what it's doing: the line once the news reaches it, otherwise
    // the cursor (if you've clicked it), otherwise its current perch
    const aim = () => {
      const origin = home.getBoundingClientRect();
      homeOffset = {
        x: origin.left + window.scrollX,
        y: origin.top + window.scrollY,
      };
      const lines = home.querySelectorAll(".timeline-events");
      if (!lines.length) return;
      const first = lines[0].getBoundingClientRect();
      const lastLine = lines[lines.length - 1].getBoundingClientRect();
      const lineTop = first.top - origin.top;

      const remaining =
        document.documentElement.scrollHeight -
        window.innerHeight -
        window.scrollY;
      const nearEnd = Math.max(0, 1 - remaining / (window.innerHeight * 0.5));
      const follow =
        window.innerHeight * (FOLLOW + (FOLLOW_END - FOLLOW) * nearEnd) -
        origin.top;

      if (follow >= lineTop - size / 2) {
        mode = "line";
        goal = {
          x: first.left - origin.left + 1,
          y: Math.min(
            Math.max(follow, lineTop),
            lastLine.bottom - origin.top - size / 2,
          ),
        };
      } else if (following && cursor) {
        mode = "cursor";
        goal = { x: cursor.x - origin.left, y: cursor.y - origin.top };
      } else {
        mode = "perch";
        const perch = perches(origin)[spot];
        goal = { x: perch.x, y: perch.y };
        perchFace = perch.face;
      }

      dots = [...home.querySelectorAll(".timeline-event")].map((row) => {
        const dot = row.querySelector(".timeline-dot").getBoundingClientRect();
        return { row, y: dot.top + dot.height / 2 - origin.top };
      });
      pet.dataset.mode = mode;
    };

    // The visible screen in #home coords, shrunk so the whole pet fits in it
    const onScreen = () => {
      const origin = home.getBoundingClientRect();
      const half = size / 2;
      return {
        left: half - origin.left,
        right: document.documentElement.clientWidth - origin.left - half,
        top: half - origin.top,
        bottom: window.innerHeight - origin.top - half,
      };
    };
    const clampTo = (box, p) => ({
      x: Math.min(Math.max(p.x, box.left), box.right),
      y: Math.min(Math.max(p.y, box.top), box.bottom),
    });

    const chomp = () => {
      biteAt = performance.now();
    };

    // Dots its head has passed are eaten; the rest grow back
    const feed = () => {
      const mouth = pos.y - Math.cos(heading) * headDist * LINE_SCALE;
      for (const dot of dots) {
        const eaten = mode === "line" && dot.y < mouth;
        if (eaten !== dot.row.classList.contains("is-eaten")) {
          dot.row.classList.toggle("is-eaten", eaten);
          if (eaten) chomp();
        }
      }
    };

    // How far into a chomp the head is: 0 → 1 (jaws open) → 0
    const biteOf = (now) => {
      const p = (now - biteAt) / BITE_MS;
      return p < 0 || p > 1 ? 0 : Math.sin(Math.PI * p);
    };

    // ∞ (lemniscate of Gerono) crossing at the perch, so it starts and ends
    // there; traced once or twice. Its long axis lies across the way the
    // dragon faces on its perch (facing SW, it loops NW↔SE)
    const loopPoint = (e) => {
      const a = flight.dir * 2 * Math.PI * flight.laps * e;
      const along = Math.sin(a) * flight.r; // across its facing
      const ahead = (Math.sin(2 * a) * flight.r) / 2; // along its facing
      return {
        x: goal.x + Math.cos(perchFace) * along + Math.sin(perchFace) * ahead,
        y: goal.y + Math.sin(perchFace) * along - Math.cos(perchFace) * ahead,
      };
    };

    // Moving house: a gentle arc from where it took off to its new perch
    const movePoint = (e) => {
      const dx = goal.x - flight.from.x;
      const dy = goal.y - flight.from.y;
      const bow = Math.sin(Math.PI * e) * flight.arc; // sideways, 0 at both ends
      const d = Math.hypot(dx, dy) || 1;
      return {
        x: flight.from.x + dx * e - (dy / d) * bow,
        y: flight.from.y + dy * e + (dx / d) * bow,
      };
    };

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;

      // Where its center should go
      let target = goal;
      if (mode !== "perch") flight = null;
      if (flight) {
        // Its own outings all fly the same way: a timed path eased in and out
        // (slow take-off, unhurried middle, soft landing)
        const p = (now - flight.start) / flight.ms;
        if (p >= 1) {
          flight = null;
          stir(); // stay up a moment after landing, then nap
          wasMoving = true; // counts as a landing (see below)
        } else {
          const e = (1 - Math.cos(Math.PI * p)) / 2; // 0 → 1, eased
          // Never off the edge of the screen
          target = clampTo(
            onScreen(),
            flight.kind === "loop" ? loopPoint(e) : movePoint(e),
          );
        }
      }
      if (mode === "cursor") {
        // Hang back so its snout stops just short of the pointer, inside the page
        const dx = goal.x - pos.x;
        const dy = goal.y - pos.y;
        const d = Math.hypot(dx, dy) || 1;
        const reach = headDist + 6;
        const stop =
          d > reach
            ? { x: goal.x - (dx / d) * reach, y: goal.y - (dy / d) * reach }
            : pos;
        target = {
          x: Math.min(Math.max(stop.x, size / 2), home.clientWidth - size / 2),
          y: Math.max(stop.y, size / 2),
        };
      }

      // Same catch-up whatever the refresh rate (60Hz, 120Hz phones...)
      const ease = 1 - Math.pow(1 - EASE, dt * 60);
      let vx = (target.x - pos.x) * ease;
      let vy = (target.y - pos.y) * ease;
      // Flying home after you steered it, it glides at a steady top speed
      const glide = GLIDE_SPEED * dt;
      const speed = Math.hypot(vx, vy);
      if (mode === "perch" && !flight && speed > glide) {
        vx *= glide / speed;
        vy *= glide / speed;
      }
      pos = { x: pos.x + vx, y: pos.y + vy };
      const moving = dt > 0 && Math.hypot(vx, vy) / dt > MOVING;
      // Landing on its perch starts the countdown to its next outing
      if (mode === "perch" && !flight && wasMoving && !moving) restartOutings();
      wasMoving = moving;

      // On the line it faces straight down it, and only turns round to face
      // up when you scroll back up properly (not for a small bounce or
      // nudge); the sideways settling onto the line doesn't turn it
      const onLine = mode === "line" && Math.abs(goal.x - pos.x) < size / 2;
      if (!onLine) lineUp = false;
      else if (dt > 0 && -vy / dt > LINE_UP) lineUp = true;
      else if (vy > 0) lineUp = false;

      // Face the cursor; on the line, along it; otherwise the way it's
      // flying, and once it stops, the way its perch faces
      let face;
      if (mode === "cursor")
        face = Math.atan2(goal.x - pos.x, -(goal.y - pos.y));
      else if (onLine) face = lineUp ? 0 : Math.PI;
      else if (moving) face = Math.atan2(vx, -vy);
      else face = mode === "line" ? Math.PI : perchFace;
      const turn = turnTo(heading, face);
      const maxTurn = (mode === "line" ? LINE_TURN_SPEED : TURN_SPEED) * dt;
      heading += Math.max(-maxTurn, Math.min(maxTurn, turn));

      const turning = Math.abs(turn) > 0.02; // still swinging round to face its way
      const awake =
        mode !== "perch" || moving || turning || !resting || !!flight; // only naps on its perch
      pet.classList.toggle("is-awake", awake);
      pet.style.transform = `translate(${pos.x - size / 2}px, ${pos.y - size / 2}px)`;
      canvas.style.transform = `rotate(${heading}rad)`;
      // The snooze "z" rises from just past its snout and drifts away from its
      // head, wherever the head points
      z.style.left = `${size / 2 + Math.sin(heading) * (headDist + 12) - 3}px`;
      z.style.top = `${size / 2 - Math.cos(heading) * (headDist + 12) - 10}px`;
      z.style.setProperty("--drift-x", `${Math.sin(heading) * 8}px`);
      z.style.setProperty("--drift-y", `${-Math.cos(heading) * 8 - 6}px`);
      feed();

      // Share where its mouth is, so it can eat the hero stardust too
      // (not from the line, and not in its sleep)
      const hungry = mode !== "line" && awake;
      petMouth.x = hungry
        ? homeOffset.x + pos.x + Math.sin(heading) * headDist
        : null;
      petMouth.y = hungry
        ? homeOffset.y + pos.y - Math.cos(heading) * headDist
        : null;

      // Wings beat while awake and fold slowly (~1s) once it naps; the tail
      // always sways
      if (staleColors.current) readColors();
      time += dt * (awake ? 1.3 : 0.35);
      const flap = (Math.sin(time * 3.2) + 1) / 2;
      wingPose +=
        ((awake ? flap : 0) - wingPose) * Math.min(1, dt * (awake ? 12 : 2.5));
      const u = size / 2.3;
      const lift = awake ? 1 + 0.035 * Math.cos(time * 3.2 - 1) : 1;
      ctx.clearRect(0, 0, size, size);
      drawDragon(
        ctx,
        size / 2,
        size / 2 - 0.3 * u,
        u * lift,
        time,
        wingPose,
        colors,
        {
          eyesClosed: !awake, // eyes shut while it naps
          bite: biteOf(now),
        },
      );

      frame = requestAnimationFrame(tick);
    };

    // Keep it up for a moment before it can nap again
    const stir = () => {
      resting = false;
      clearTimeout(napTimer);
      napTimer = setTimeout(() => (resting = true), NAP_AFTER);
    };

    // Something moved it: re-aim, stay up a moment, and restart the countdown
    // to its own next outing
    const wake = () => {
      aim();
      stir();
      restartOutings();
    };

    const onPointerMove = (e) => {
      if (e.pointerType !== "mouse") return;
      cursor = { x: e.clientX, y: e.clientY };
      if (following) wake();
    };
    const onMouseLeave = () => {
      cursor = null;
      wake();
    };
    // A mouse click toggles following the cursor; with no cursor to follow
    // (a tap on a touch screen) it flies a little ∞ for you instead
    let tapType = "mouse";
    const onPointerDown = (e) => {
      tapType = e.pointerType;
    };
    const onClick = () => {
      if (tapType !== "mouse") {
        wake();
        if (mode === "perch" && !flight) takeOff("loop");
        return;
      }
      following = !following;
      pet.setAttribute("aria-pressed", following);
      wake();
    };

    // Start one of its outings: a little ∞ round its perch, or a move to
    // another perch
    const takeOff = (kind) => {
      if (kind === "move") {
        // Only between perches that are both on screen
        const box = onScreen();
        const seen = (p) =>
          p.x >= box.left &&
          p.x <= box.right &&
          p.y >= box.top &&
          p.y <= box.bottom;
        const next = (spot + 1 + Math.floor(Math.random() * 3)) % 4;
        if (!seen(pos) || !seen(perches(home.getBoundingClientRect())[next]))
          return;
        const from = { ...pos };
        spot = next;
        aim();
        const dist = Math.hypot(goal.x - from.x, goal.y - from.y);
        flight = {
          kind: "move",
          start: performance.now(),
          ms: Math.max(3000, (dist / FLIGHT_SPEED) * 1000),
          from,
          arc: dist * 0.15 * (Math.random() < 0.5 ? -1 : 1),
        };
      } else {
        // Small enough to stay on screen round its perch: the ∞ reaches r
        // across its facing and r/2 along it
        const box = onScreen();
        const cos = Math.abs(Math.cos(perchFace));
        const sin = Math.abs(Math.sin(perchFace));
        const room = Math.min(
          (Math.min(goal.x - box.left, box.right - goal.x) || 0) /
            (cos + sin / 2),
          (Math.min(goal.y - box.top, box.bottom - goal.y) || 0) /
            (sin + cos / 2),
        );
        const r = Math.min(rand(...FLIGHT_WIDTH), room);
        if (r < FLIGHT_WIDTH[0] / 2) return; // no room for a loop here
        const laps = Math.random() < 0.5 ? 1 : 2;
        flight = {
          kind: "loop",
          start: performance.now(),
          ms: laps * rand(...FLIGHT_LAP_MS),
          r,
          dir: Math.random() < 0.5 ? -1 : 1,
          laps,
        };
      }
    };

    // Its own outings: while it's home and not following you, it rests for
    // FLIGHT_EVERY, then flies a little ∞ or moves to another perch. The rest
    // counts from its last landing or your last scroll, click or steer.
    const restartOutings = () => {
      clearTimeout(flightTimer);
      flightTimer = setTimeout(
        () => {
          if (mode === "perch" && !following && !document.hidden && !flight)
            takeOff(Math.random() < 0.5 ? "move" : "loop");
          if (!flight) restartOutings(); // no outing started: rest another round
        },
        rand(...FLIGHT_EVERY),
      );
    };
    restartOutings();

    // Start on the perch, settled (no fly-in or turn on load)
    fit();
    aim();
    pos = { ...goal };
    heading = mode === "line" ? Math.PI : perchFace; // already facing its way
    frame = requestAnimationFrame(tick);

    petMouth.chomp = chomp;

    const resizer = new ResizeObserver(() => {
      fit();
      aim();
    });
    resizer.observe(home);
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    pet.addEventListener("pointerdown", onPointerDown);
    pet.addEventListener("click", onClick);

    return () => {
      petMouth.x = null;
      petMouth.chomp = () => {};
      cancelAnimationFrame(frame);
      clearTimeout(napTimer);
      clearTimeout(flightTimer);
      resizer.disconnect();
      window.removeEventListener("scroll", wake);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      pet.removeEventListener("pointerdown", onPointerDown);
      pet.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <button
      ref={petRef}
      type="button"
      className="pet-dragon"
      aria-label="Pet dragon: click to let it follow your cursor"
      aria-pressed="false"
      title="Pet me"
    >
      <canvas ref={canvasRef} />
      <span ref={zRef} className="pet-z" aria-hidden="true">
        z
      </span>
    </button>
  );
};

export default PetDragon;
