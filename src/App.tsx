import React, { useMemo, useState } from "react";

function Home() {
  return (
    <div className="container">
      <h1>ErgoGuard™ — Ergonomic Training</h1>
      <p>Protect posture. Prevent injury. Stay compliant.</p>
      <p>
        <a href="#/assess">Start Assessment</a> ·{" "}
        <a href="#/kit">Ergonomics Kit</a>
      </p>
      <hr />
      <h3>Pass Mark</h3>
      <p>Minimum pass score: <strong>90%</strong> (low 90s).</p>
    </div>
  );
}

function Assess() {
  // simple 7-question mock (1–5) just to show wiring
  const [scores, setScores] = useState<number[]>(Array(7).fill(3));
  const total = useMemo(() => scores.reduce((a, b) => a + b, 0), [scores]);
  const percent = Math.round((total / (7 * 5)) * 100);

  return (
    <div className="container">
      <h2>Self-Assessment</h2>
      <p>Rate 1–5 (5 is best) for each item:</p>
      {[
        "Chair height",
        "Monitor position",
        "Keyboard/mouse",
        "Lighting",
        "Breaks",
        "Stretching",
        "Reporting knowledge"
      ].map((label, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <label>{label}: </label>
          <select
            value={scores[i]}
            onChange={(e) => {
              const next = [...scores];
              next[i] = Number(e.target.value);
              setScores(next);
            }}
          >
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      ))}

      <p><strong>Score:</strong> {percent}%</p>
      <p>
        {percent >= 90
          ? "✅ Pass — eligible for certificate."
          : "⚠️ Below pass mark — HR follow-up recommended."}
      </p>
      <p><a href="#/">Back</a></p>
    </div>
  );
}

function Kit() {
  return (
    <div className="container">
      <h2>Ergonomic Training Package for HR</h2>
      <h3>1. Employee Ergonomic Assessment Tool</h3>
      <p><strong>Purpose:</strong> Evaluate workstation setup and ergonomic awareness.</p>
      <table border={1} cellPadding={6}>
        <thead>
          <tr><th>Item</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td>Chair height</td><td>Feet flat, knees at 90°</td></tr>
          <tr><td>Monitor position</td><td>Eye level, arm’s length</td></tr>
          <tr><td>Keyboard/mouse</td><td>Elbows at 90°, wrists straight</td></tr>
          <tr><td>Lighting</td><td>No glare, adequate brightness</td></tr>
          <tr><td>Breaks</td><td>Every 2 hours (micro-breaks better)</td></tr>
          <tr><td>Stretching</td><td>Daily routine followed</td></tr>
          <tr><td>Reporting</td><td>Knows how to report discomfort</td></tr>
        </tbody>
      </table>

      <h3>Videos</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=g8okeqaQHsU" target="_blank">360° HEALTH: Ergonomics & Wellness</a></li>
        <li><a href="https://www.youtube.com/watch?v=MSU1-16ztHo" target="_blank">Optimize Your Ergonomics for Remote Work</a></li>
        <li><a href="https://www.youtube.com/watch?v=nIQECMXsGdM" target="_blank">Ergonomics for Your Workspace</a></li>
        <li><a href="https://www.youtube.com/watch?v=7YDeeb5SGkc" target="_blank">Ergonomic Tips for Working at Home – Kate Ayoub, PT</a></li>
      </ul>

      <h3>Visual Guides</h3>
      <ul>
        <li><a href="https://www.upwork.com/resources/home-office-ergonomics-tips" target="_blank">Upwork Ergonomics Tips</a></li>
        <li><a href="https://www.publichealthdegrees.org/resources/how-to-create-work-from-home-set-up/" target="_blank">Public Health Degrees – WFH Setup</a></li>
      </ul>

      <p><a href="#/">Back</a></p>
    </div>
  );
}

export default function App() {
  const route = typeof window !== "undefined" ? window.location.hash : "#/";
  if (route.startsWith("#/assess")) return <Assess />;
  if (route.startsWith("#/kit")) return <Kit />;
  return <Home />;
}
