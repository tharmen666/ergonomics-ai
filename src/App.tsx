import React from "react";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import ErgonomicsKit from "./pages/ErgonomicsKit";

/** Minimal placeholder assessment to keep the route alive */
function Assessment() {
  return (
    <div className="section">
      <div className="shell">
        <div className="glass shimmer" style={{ padding: 22 }}>
          <h2 className="display" style={{ fontSize: "clamp(28px,4vw,42px)" }}>
            7-Point Self-Assessment
          </h2>
          <p className="kicker">
            Quick check: chair height, monitor, keyboard/mouse, lighting, breaks, stretching, reporting.
            (Swap this for your full assessment UI later.)
          </p>
          <div className="mt-4">
            <Link to="/" className="btn">Back home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Home() {
  return (
    <>
      {/* HERO */}
      <header className="section">
        <div className="shell">
          <div className="glass shimmer" style={{ padding: 28, borderRadius: 22 }}>
            <div className="kicker">OHSHAVEN • ErgoPulse</div>
            <h1 className="display">Protect posture. Prevent injury. Stay compliant.</h1>
            <p className="kicker" style={{ maxWidth: 820 }}>
              AI-assisted ergonomic training for office & remote teams. Assessments, micro-breaks,
              expert videos, and HR-grade audit packs — all in one glossy experience.
            </p>

            <div className="mt-4" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link to="/assess" className="btn emerald">
                {/* pulse heart icon */}
                <svg className="icon icon-pulse" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 21s-7-4.35-9-8.5C1 9 3 6 6 6c2 0 3.5 1.5 4 2.5C10.5 7.5 12 6 14 6c3 0 5 3 3 6.5C19 16.65 12 21 12 21z" fill="#0EA5E9"/>
                </svg>
                Start Assessment
              </Link>

              <Link to="/kit" className="btn indigo">
                {/* spinning shield */}
                <svg className="icon icon-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l7 3v6c0 5-3.5 9-7 11-3.5-2-7-6-7-11V5l7-3z" fill="#E5E7FF"/>
                </svg>
                Open Training Kit
              </Link>

              <a
                href="https://ergonomics-ai.netlify.app/#/kit"
                target="_blank" rel="noreferrer"
                className="btn ghost"
              >
                {/* bobbing play icon */}
                <svg className="icon icon-bob" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M8 5l12 7-12 7V5z" fill="#CFE9FF"/>
                </svg>
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
              <h3 style={{ margin: "0 0 .25rem" }}>
                {/* badge icon */}
                <svg className="icon icon-bob" width="18" height="18" viewBox="0 0 24 24" fill="none" style={{marginRight:8}}>
                  <path d="M12 2l2.5 5 5.5.8-4 3.9.9 5.6L12 15l-4.9 2.3.9-5.6-4-3.9L9.5 7 12 2z" fill="#10B981"/>
                </svg>
                Legal-ready
              </h3>
              <p className="kicker">
                Aligns with SA Ergonomics Regulations (2019): training, RLS policies, incident
                reporting, and traceable certs.
              </p>
            </article>

            <article className="glass card col-4">
              <h3 style={{ margin: "0 0 .25rem" }}>
                {/* dashboard icon */}
                <svg className="icon icon-pulse" width="18" height="18" viewBox="0 0 24 24" fill="none" style={{marginRight:8}}>
                  <path d="M3 3h18v6H3V3zm0 8h8v10H3V11zm10 0h8v10h-8V11z" fill="#A5B4FC"/>
                </svg>
                HR dashboards
              </h3>
              <p className="kicker">
                Track completions, risk flags & certificates. Export to CSV with a click.
              </p>
            </article>

            <article className="glass card col-4">
              <h3 style={{ margin: "0 0 .25rem" }}>
                {/* globe icon */}
                <svg className="icon icon-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" style={{marginRight:8}}>
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 0c3 2.5 3 15.5 0 18m0-18C9 4.5 9 17.5 12 20M2 12h20" stroke="#60A5FA" strokeWidth="1.6"/>
                </svg>
                Multi-language
              </h3>
              <p className="kicker">
                English, Afrikaans, Sotho, Xhosa, Zulu, Mandarin, Spanish (extensible).
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* VIDEOS */}
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
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, borderRadius: 14 }}
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
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, borderRadius: 14 }}
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

export default function App(){
  return (
    <HashRouter>
      {/* NAV */}
      <nav className="nav">
        <div className="shell nav-inner">
          <div className="brand">
            {/* gradient orb logo */}
            <svg className="icon icon-bob" width="26" height="26" viewBox="0 0 24 24" fill="none">
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
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
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
