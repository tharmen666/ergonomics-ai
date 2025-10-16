import React, { useEffect, useMemo, useState } from "react";
import "./index.css";

type RouteKey = "home" | "kit" | "assess";

function useHashRoute(): RouteKey {
  const parse = () => {
    const raw = (location.hash || "#/").toLowerCase();
    if (raw.startsWith("#/kit")) return "kit";
    if (raw.startsWith("#/assess")) return "assess";
    return "home";
  };
  const [route, setRoute] = useState<RouteKey>(parse);
  useEffect(() => {
    const onHash = () => setRoute(parse());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return route;
}

const Brand = () => (
  <div className="brand">
    <span className="dot floaty" />
    Ohshaven <span style={{ color: "var(--brand)" }}>Ergo</span>
  </div>
);

const Link = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href}>{children}</a>
);

/* ---------------- Pages ---------------- */

const Home = () => (
  <div className="container">
    <section className="main-hero">
      <h1>Ergonomics that actually ships.</h1>
      <p>
        Assessments, certified training, HR export, and a clean resource kit—built for South African OHS compliance and remote teams.
      </p>
      <div className="cta">
        <a className="btn" href="#/assess">Start assessment</a>
        <a className="btn secondary" href="#/kit">Open Ergonomics Kit</a>
      </div>
    </section>

    <section className="grid" style={{ marginTop: 18 }}>
      <article className="card">
        <h2>Compliance-first</h2>
        <p>Aligned to Ergonomics Regulations (2019). Pass mark defaults to 90% with exportable audit trails.</p>
        <span className="badge">OHS • POPIA</span>
      </article>
      <article className="card">
        <h2>For hybrid teams</h2>
        <p>Office and remote workflows with self-assessment, video modules, and instant certificates.</p>
        <span className="badge">Office • Remote</span>
      </article>
      <article className="card">
        <h2>Zero friction</h2>
        <p>No login required to test. Add Auth later when you’re ready to track employees.</p>
        <span className="badge">Prototype ready</span>
      </article>
    </section>
  </div>
);

const Kit = () => (
  <div className="container">
    <h1>Ergonomics Kit</h1>
    <p>Curated videos and articles—ready to embed in training.</p>

    <div className="card" style={{ overflowX: "auto" }}>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Language</th>
            <th>Open</th>
          </tr>
        </thead>
        <tbody>
          {KIT_LINKS.map((r) => (
            <tr key={r.url}>
              <td>{r.title}</td>
              <td>{r.type}</td>
              <td>{r.lang.toUpperCase()}</td>
              <td>
                <a className="btn secondary" href={r.url} target="_blank" rel="noreferrer">View</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <p style={{ marginTop: 10, color: "var(--muted)" }}>
      Tip: Seed these into <code>public.resources</code> (Supabase) and your UI will render live data.
    </p>
  </div>
);

const Assess = () => {
  const [score, setScore] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const pass = useMemo(() => (score ?? 0) >= 90, [score]);

  return (
    <div className="container">
      <h1>Self-Assessment</h1>
      <p>7 quick checks. Pass mark: <strong>90%</strong>.</p>

      <div className="card" style={{ maxWidth: 680 }}>
        <div style={{ display: "grid", gap: 12 }}>
          <label>
            Your email
            <input className="input" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} />
          </label>

          <label>
            Score (0–100)
            <input
              className="input"
              type="number"
              min={0}
              max={100}
              placeholder="e.g. 92"
              value={score ?? ""}
              onChange={e => setScore(e.target.value === "" ? null : Number(e.target.value))}
            />
          </label>

          <div>
            <button className="btn" onClick={() => alert("Hook this up to Supabase insert → certificate/HR export")}>
              Submit assessment
            </button>
            {" "}
            {score !== null && (
              <span className="badge" style={{ marginLeft: 8 }}>
                {pass ? "PASS ✅" : "Needs follow-up ⚠️"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* --------------- Router shell --------------- */

export default function App(){
  const route = useHashRoute();

  return (
    <>
      <header className="header">
        <nav className="nav">
          <Brand/>
          <div className="spacer" />
          <Link href="#/">Home</Link>
          <Link href="#/kit">Ergonomics Kit</Link>
          <Link href="#/assess">Assessment</Link>
        </nav>
      </header>

      {route === "home" && <Home/>}
      {route === "kit" && <Kit/>}
      {route === "assess" && <Assess/>}

      <footer className="container" style={{ opacity:.7, paddingBottom: 40 }}>
        <hr style={{ borderColor:"#243246", borderWidth:0, borderTop:"1px solid #243246", margin:"24px 0" }}/>
        <small>© {new Date().getFullYear()} Ohshaven • Ergonomics & OHS</small>
      </footer>
    </>
  );
}

/* Static links used on Kit page (matches what you seeded) */
const KIT_LINKS = [
  { title: "360° HEALTH: Ergonomics & Wellness", url: "https://www.youtube.com/watch?v=g8okeqaQHsU", type: "video", lang: "en" },
  { title: "Optimize Your Ergonomics for Remote Work", url: "https://www.youtube.com/watch?v=MSU1-16ztHo", type: "video", lang: "en" },
  { title: "Ergonomics for Your Workspace", url: "https://www.youtube.com/watch?v=nIQECMXsGdM", type: "video", lang: "en" },
  { title: "Ergonomic tips for working at home – Kate Ayoub, PT", url: "https://www.youtube.com/watch?v=7YDeeb5SGkc", type: "video", lang: "en" },
  { title: "Upwork: Home Office Ergonomics Tips", url: "https://www.upwork.com/resources/home-office-ergonomics-tips", type: "article", lang: "en" },
  { title: "WFH Setup Guide – Public Health Degrees", url: "https://www.publichealthdegrees.org/resources/how-to-create-work-from-home-set-up/", type: "article", lang: "en" },
];
