// src/App.tsx
import { useEffect, useState } from "react";
import ErgonomicsKit from "./pages/ErgonomicsKit";

function Home() {
  return (
    <div className="card">
      <h2>Welcome to OHS Haven • Ergo</h2>
      <p>Pick a page from the nav to get started.</p>
      <ul>
        <li><a href="#/assess">Self-assessment (pass mark 90%)</a></li>
        <li><a href="#/kit">Ergonomics Kit (videos & guides)</a></li>
      </ul>
    </div>
  );
}

const QUESTIONS = [
  { id: 1, text: "Feet flat on floor or footrest?" },
  { id: 2, text: "Knees ~90° and hips slightly above knees?" },
  { id: 3, text: "Monitor at/near eye height, arm’s length?" },
  { id: 4, text: "External keyboard/mouse (no laptop hunch)?" },
  { id: 5, text: "Wrists neutral, elbows ~90°, shoulders relaxed?" },
  { id: 6, text: "Lighting without glare; can see screen clearly?" },
  { id: 7, text: "Take micro-breaks every 30–60 minutes?" },
  { id: 8, text: "Do 2–5 min stretches 2–3x per day?" },
  { id: 9, text: "Alternate sitting/standing if possible?" },
  { id:10, text: "Know how to report discomfort early?" }
];

function Assessment() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState<number | null>(null);
  const passMark = 90;

  const setAnswer = (id: number, val: number) =>
    setAnswers((prev) => ({ ...prev, [id]: val }));

  const submit = () => {
    const total = QUESTIONS.length * 5;
    const got = QUESTIONS.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    const pct = Math.round((got / total) * 100);
    setScore(pct);
  };

  return (
    <div className="card">
      <h2>Self-Assessment</h2>
      <p>Rate each item 1–5 (5 = ideal). <b>Pass mark: {passMark}%</b></p>

      <table className="table">
        <thead>
          <tr><th>Item</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr>
        </thead>
        <tbody>
          {QUESTIONS.map(q => (
            <tr key={q.id}>
              <td>{q.text}</td>
              {[1,2,3,4,5].map(v => (
                <td key={v}>
                  <input
                    type="radio"
                    name={`q${q.id}`}
                    checked={answers[q.id] === v}
                    onChange={() => setAnswer(q.id, v)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn primary" onClick={submit} style={{marginTop:12}}>
        Calculate score
      </button>

      {score !== null && (
        <div style={{marginTop:12}}>
          <p><b>Score:</b> {score}%</p>
          {score >= passMark ? (
            <p className="badge">✅ Passed – great job!</p>
          ) : (
            <p className="badge" style={{background:'#fff0f0', borderColor:'#ffd1d1', color:'#b10000'}}>
              ⚠️ Below pass mark – please improve your setup and retake.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState<string>(window.location.hash || "#/");

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || "#/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <>
      <nav className="nav">
        <span className="brand">OHS Haven • Ergo</span>
        <a className="btn" href="#/">Home</a>
        <a className="btn" href="#/assess">Assessment</a>
        <a className="btn" href="#/kit">Ergonomics Kit</a>
      </nav>

      <div className="container">
        {route === "#/" && <Home />}
        {route === "#/assess" && <Assessment />}
        {route === "#/kit" && <ErgonomicsKit />}
      </div>
    </>
  );
}
