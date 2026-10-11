// Draws a dragon seen from above, head pointing up, onto a 2D canvas.
// Adapted from the "Dragon Overhead" sketch: a spine of points with a
// swaying tail, flapping membrane wings, tail/hip fins, opal eyes that look
// ahead (and close for naps) and a dorsal ridge.
//
//   cx, cy  where the body sits (head is ~0.66u above cy, tail ~1.27u below)
//   u       scale unit (wingspan is ~2.24u)
//   t       animation time (drives the tail sway)
//   s       wing pose: 0 = folded up, 1 = fully spread
//   C       colors: body, shade, plate, wing, wingTip, opalA, opalB
//   options     eyesClosed: sleepy closed eyes instead of open ones
//               bite: 0..1, the head lunges forward and the jaws snap open

const N = 44; // spine points

export const drawDragon = (
  c,
  cx,
  cy,
  u,
  t,
  s,
  C,
  { eyesClosed = false, bite = 0 } = {},
) => {
  const len = 1.6 * u;
  const P = [];
  for (let i = 0; i <= N; i++) {
    const q = i / N;
    const tail = Math.max(0, q - 0.3);
    const amp = u * (0.012 + 0.42 * Math.pow(tail, 1.6));
    P.push({
      x: cx + amp * Math.sin(t * 1.1 - q * 6.5),
      y: cy + (q - 0.3) * len,
      q,
    });
  }

  // Body half-width along the spine, and the normal/tangent at a point
  const wid = (q) =>
    u *
      (0.055 * (1 - q) + 0.1 * Math.exp(-Math.pow((q - 0.32) / 0.17, 2))) *
      (1 - Math.pow(q, 4)) +
    u * 0.004;
  const nrm = (i) => {
    const a = P[Math.max(0, i - 1)];
    const b = P[Math.min(N, i + 1)];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const m = Math.hypot(dx, dy) || 1;
    return { x: -dy / m, y: dx / m, tx: dx / m, ty: dy / m };
  };

  // Wings: shoulder → elbow → wrist, then three finger tips back to the hip
  const S = P[Math.round(N * 0.24)];
  const Hp = P[Math.round(N * 0.47)];
  const spread = 0.55 + 0.45 * s;
  const sweep = (1 - s) * 0.22 * u;
  for (const sx of [-1, 1]) {
    const E = {
      x: S.x + sx * 0.3 * u * spread,
      y: S.y - 0.14 * u + sweep * 0.3,
    };
    const Wr = {
      x: E.x + sx * 0.26 * u * spread,
      y: E.y - 0.1 * u + sweep * 0.6,
    };
    const T = [
      { x: Wr.x + sx * 0.56 * u * spread, y: Wr.y + 0.02 * u + sweep },
      { x: Wr.x + sx * 0.42 * u * spread, y: Wr.y + 0.4 * u + sweep * 0.7 },
      { x: Wr.x + sx * 0.14 * u * spread, y: Wr.y + 0.58 * u + sweep * 0.4 },
      { x: Hp.x + sx * wid(Hp.q), y: Hp.y },
    ];
    const mid = (a, b, k) => ({
      x: (a.x + b.x) / 2 + (Wr.x - (a.x + b.x) / 2) * k,
      y: (a.y + b.y) / 2 + (Wr.y - (a.y + b.y) / 2) * k,
    });
    c.beginPath();
    c.moveTo(S.x, S.y);
    c.lineTo(E.x, E.y);
    c.lineTo(Wr.x, Wr.y);
    c.lineTo(T[0].x, T[0].y);
    for (let k = 0; k < 3; k++) {
      const m = mid(T[k], T[k + 1], 0.35);
      c.quadraticCurveTo(m.x, m.y, T[k + 1].x, T[k + 1].y);
    }
    c.closePath();
    const g = c.createLinearGradient(S.x, S.y, T[0].x, T[1].y);
    g.addColorStop(0, C.wing);
    g.addColorStop(1, C.wingTip);
    c.fillStyle = g;
    c.fill();

    c.strokeStyle = C.shade;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.lineWidth = u * 0.012;
    c.beginPath();
    for (const f of T.slice(0, 3)) {
      c.moveTo(Wr.x, Wr.y);
      c.lineTo(f.x, f.y);
    }
    c.stroke();
    c.lineWidth = u * 0.03;
    c.beginPath();
    c.moveTo(S.x, S.y);
    c.lineTo(E.x, E.y);
    c.lineTo(Wr.x, Wr.y);
    c.stroke();
    c.fillStyle = C.plate;
    c.beginPath();
    c.arc(Wr.x, Wr.y, u * 0.014, 0, Math.PI * 2);
    c.fill();
  }

  // Body and tail as one outline around the spine
  c.beginPath();
  for (let i = 0; i <= N; i++) {
    const n = nrm(i);
    const w = wid(P[i].q);
    c.lineTo(P[i].x + n.x * w, P[i].y + n.y * w);
  }
  for (let i = N; i >= 0; i--) {
    const n = nrm(i);
    const w = wid(P[i].q);
    c.lineTo(P[i].x - n.x * w, P[i].y - n.y * w);
  }
  c.closePath();
  c.fillStyle = C.body;
  c.fill();

  // Twin fins at the tail tip and smaller ones at the hips
  const fin = (p, n, a, sx) => {
    c.beginPath();
    c.moveTo(p.x - n.tx * a * 0.9, p.y - n.ty * a * 0.9);
    c.quadraticCurveTo(
      p.x + sx * n.x * a * 0.9 - n.tx * a * 0.3,
      p.y + sx * n.y * a * 0.9 - n.ty * a * 0.3,
      p.x + sx * n.x * a * 1.15 + n.tx * a * 0.45,
      p.y + sx * n.y * a * 1.15 + n.ty * a * 0.45,
    );
    c.quadraticCurveTo(
      p.x + sx * n.x * a * 0.4 + n.tx * a * 0.5,
      p.y + sx * n.y * a * 0.4 + n.ty * a * 0.5,
      p.x + n.tx * a,
      p.y + n.ty * a,
    );
    c.closePath();
    c.fillStyle = C.plate;
    c.fill();
  };
  const tip = P[N - 1];
  const tipN = nrm(N - 1);
  fin(tip, tipN, u * 0.13, -1);
  fin(tip, tipN, u * 0.13, 1);
  const hip = P[Math.round(N * 0.6)];
  const hipN = nrm(Math.round(N * 0.6));
  fin(hip, hipN, u * 0.085, -1);
  fin(hip, hipN, u * 0.085, 1);

  // Head: swept-back horn plates, a broad rounded skull, opal eyes, nostrils
  const h = P[0];
  const hn = nrm(0);
  c.save();
  c.translate(h.x, h.y);
  c.rotate(Math.atan2(hn.ty, hn.tx) - Math.PI / 2);
  c.translate(0, -bite * u * 0.09); // lunge forward on a bite
  c.scale(1.4 * (1 + 0.18 * bite), 1.22 * (1 + 0.18 * bite));
  c.fillStyle = C.plate;
  for (const sx of [-1, 1]) {
    c.beginPath();
    c.moveTo(sx * u * 0.045, 0);
    c.quadraticCurveTo(sx * u * 0.115, u * 0.04, sx * u * 0.09, u * 0.15);
    c.quadraticCurveTo(sx * u * 0.05, u * 0.09, sx * u * 0.015, u * 0.04);
    c.fill();
    c.beginPath();
    c.moveTo(sx * u * 0.07, -u * 0.03);
    c.lineTo(sx * u * 0.125, u * 0.035);
    c.lineTo(sx * u * 0.06, u * 0.015);
    c.fill();
  }
  c.fillStyle = C.body;
  c.beginPath();
  c.moveTo(0, -u * 0.15);
  c.bezierCurveTo(
    u * 0.06,
    -u * 0.15,
    u * 0.095,
    -u * 0.07,
    u * 0.088,
    -u * 0.01,
  );
  c.quadraticCurveTo(u * 0.07, u * 0.06, 0, u * 0.06);
  c.quadraticCurveTo(-u * 0.07, u * 0.06, -u * 0.088, -u * 0.01);
  c.bezierCurveTo(-u * 0.095, -u * 0.07, -u * 0.06, -u * 0.15, 0, -u * 0.15);
  c.fill();
  if (bite > 0.05) {
    // Open jaws: a pink wedge splitting the snout
    c.fillStyle = C.opalB;
    c.beginPath();
    c.moveTo(-u * 0.04 * bite, -u * 0.152);
    c.lineTo(0, -u * 0.09);
    c.lineTo(u * 0.04 * bite, -u * 0.152);
    c.closePath();
    c.fill();
  }
  for (const sx of [-1, 1]) {
    const ex = sx * u * 0.052;
    const ey = -u * 0.055;
    const tilt = -sx * 0.5; // tops of the two eyes lean in toward each other
    if (eyesClosed) {
      // Sleepy closed eye: a soft curved lid line
      c.strokeStyle = C.opalB;
      c.lineWidth = u * 0.014;
      c.lineCap = "round";
      c.beginPath();
      c.ellipse(ex, ey, u * 0.022, u * 0.016, tilt, 0.15, Math.PI - 0.15);
      c.stroke();
    } else {
      const og = c.createRadialGradient(
        sx * u * 0.058,
        -u * 0.065,
        0,
        ex,
        ey,
        u * 0.03,
      );
      og.addColorStop(0, C.opalA);
      og.addColorStop(1, C.opalB);
      c.fillStyle = og;
      c.beginPath();
      c.ellipse(ex, ey, u * 0.025, u * 0.033, tilt, 0, Math.PI * 2);
      c.fill();
      // Round pupil toward the (tilted) top of the eye, so it looks ahead
      c.fillStyle = C.shade;
      c.beginPath();
      c.ellipse(
        sx * u * 0.045,
        -u * 0.068,
        u * 0.012,
        u * 0.014,
        0,
        0,
        Math.PI * 2,
      );
      c.fill();
    }
    // Nostril
    c.fillStyle = C.shade;
    c.beginPath();
    c.arc(sx * u * 0.016, -u * 0.128, u * 0.005, 0, Math.PI * 2);
    c.fill();
  }
  c.restore();

  // Dorsal ridge spikes down the back
  c.fillStyle = C.plate;
  for (let i = 3; i < N; i += 2) {
    const p = P[i];
    const r = wid(p.q) * 0.3 + u * 0.003;
    c.beginPath();
    c.moveTo(p.x, p.y - r * 1.4);
    c.lineTo(p.x + r * 0.6, p.y + r);
    c.lineTo(p.x - r * 0.6, p.y + r);
    c.fill();
  }
};
