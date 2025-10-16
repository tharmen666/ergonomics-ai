import React from "react";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import ErgonomicsKit from "./pages/ErgonomicsKit";

function Home() {
  return (
    <>
      {/* HERO */}
      <header className="section">
        <div className="shell">
          <div className="glass" style={{ padding: "28px", borderRadius: "20px" }}>
            <div className="kicker">OHSHAVEN • ErgoPulse</div>
            <h1 className="display">Protect posture. Prevent injury. Stay compliant.</h1>
            <p className="kicker" style={{ maxWidth: 800 }}>
              AI-assisted ergonomic training for office & remote teams. Assessments,
              micro-breaks, videos, and HR-grade audit packs — all in one sleek experience.
            </p>

            <div className="mt-4" style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <Link to="/assess" className="btn emerald">Start Assessment</Link>
              <Link to="/kit" className="btn indigo">Open Training Kit</Link>
              <a
                href="https://ergonomics-ai.netlify.app/#/kit"
                className="btn ghost"
                target="_blank"
                rel="noreferrer"
              >
                Live Demo
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section className="section">
        <div className="shell">
          <div className="grid">
            <article className="glass card col-4">
              <h3 style={{ margin: "0 0 .25rem" }}>Legal-ready</h3>
              <p className="kicker">
                Aligns with SA Ergonomics Regulations (2019): training, RLS policies,
                incident reporting, and traceable certs.
              </p>
            </article>

            <article className="glass card col-4">
              <h3 style={{ margin: "0 0 .25rem" }}>HR dashboards</h3>
              <p className="kicker">
                Track completions, risk flags & certificates. Export to CSV with a click.
              </p>
            </article>

            <article className="glass card col-4">
              <h3 style={{ margin: "0 0 .25rem" }}>Multi-language</h3>
              <p className="kicker">
                English, Afrikaans, Sotho, Xhosa, Zulu, Mandarin, Spanish (extensible).
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* VIDEOS / RESOURCES PREVIEW */}
      <section className="section">
        <div className="shell">
          <div className="glass" style={{ padding: 18 }}>
            <h2 style={{ margin: 0 }}>Quick videos</h2>
            <p className="kicker">Embed your vetted YouTube resources here.</p>
            <div className="grid" style={{ marginTop: 12 }}>
              <div className="glass card col-6">
                <div className="kicker">Optimize Your Ergonomics for Remote Work</div>
                <div className="mt-2" style={{ position: "relative", paddingTop: "56.25%" }}>
                  <iframe
                    title="remote-ergonomics"
                    src="https://www.youtube.com/embed/MSU1-16ztHo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    style={{
                      position: "absolute", inset: 0, width: "100%", height: "100%",
                      border: 0, borderRadius: "14px"
                    }}
                    allowFullScreen
                  />
                </div>
              </div>

              <div className="glass card col-6">
                <div className="kicker">Ergonomic Tips for Working at Home (Kate Ayoub, PT)</div>
                <div className="mt-2" style={{ position: "relative", paddingTop: "56.25%" }}>
                  <iframe
                    title="kate-ayoub"
                    src="https://www.youtube.com/embed/7YDeeb5SGkc"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    style={{
                      position: "absolute", inset: 0, width: "100%", height: "100%",
                      border: 0, borderRadius: "14px"
                    }}
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* Minimal Assessment page (safe fallback) */
function Assessment() {
  return (
    <div className="section">
      <div className="shell">
        <div className="glass" style={{ padding: 20 }}>
          <h2 className="display" style={{ fontSize: "clamp(28px,4vw,42px)" }}>
            7-Point Self-Assessment
          </h2>
          <p className="kicker">
            Quick check: chair height, monitor, keyboard/mouse, lighting, breaks, stretching, reporting.
          </p>
          <p className="kicker">
            (You can replace this with your full assessment UI later — this is just a nice placeholder.)
          </p>
          <div className="mt-4">
            <Link to="/" className="btn">Back home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App(){
  return (
    <HashRouter>
      {/* NAV */}
      <nav className="nav">
        <div className="shell nav-inner">
          <div className="brand">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="url(#g)"/>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="24" y2="24">
                  <stop stopColor="#00AEEF"/><stop offset=".6" stopColor="#6C5CE7"/>
                  <stop offset="1" stopColor="#10B981"/>
                </linearGradient>
              </defs>
            </svg>
            OHSHAVEN • <span style={{ color:"#A7C8FF" }}>ErgoPulse</span>
            <span className="badge">v1</span>
          </div>
          <div style={{ display:"flex", gap:"10px" }}>
            <Link to="/" className="btn ghost">Home</Link>
            <Link to="/assess" className="btn">Assessment</Link>
            <Link to="/kit" className="btn indigo">Training Kit</Link>
          </div>
        </div>
      </nav>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/assess" element={<Assessment/>} />
        <Route path="/kit" element={<ErgonomicsKit/>} />
      </Routes>

      {/* FOOTER */}
      <footer className="footer">
        <div className="shell" style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
          <div>© {new Date().getFullYear()} OHSHAVEN • ErgoPulse. All rights reserved.</div>
          <div>
            <a href="#/kit">Training</a> · <a href="#/assess">Assessment</a> ·{" "}
            <a href="mailto:hello@ohshaven.com">Contact</a>
          </div>
        </div>
      </footer>
    </HashRouter>
  );
}
