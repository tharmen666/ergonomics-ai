import React, { useEffect, useState } from "react";
import ErgonomicsKit from "./pages/ErgonomicsKit";

type Tab = "home" | "kit";

export default function App() {
  // minimal hash-based tabs (no router)
  const getTab = (): Tab => (window.location.hash === "#kit" ? "kit" : "home");
  const [tab, setTab] = useState<Tab>(getTab());

  useEffect(() => {
    const onHash = () => setTab(getTab());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (t: Tab) => {
    window.location.hash = t === "kit" ? "#kit" : "";
    setTab(t);
  };

  return (
    <div>
      <nav style={{display:"flex",gap:16,padding:16,background:"#fff",borderBottom:"1px solid #e5e7eb"}}>
        <button onClick={() => go("home")}>Home</button>
        <button onClick={() => go("kit")}>Ergonomics Kit</button>
      </nav>

      <div style={{padding:16}}>
        {tab === "home" && (
          <div style={{maxWidth:720}}>
            <h1 style={{fontWeight:700,fontSize:24,marginBottom:8}}>ErgoPulse | OHS Haven</h1>
            <p style={{color:"#555"}}>
              Welcome! Click <b>Ergonomics Kit</b> to view the training & compliance package.
            </p>
          </div>
        )}
        {tab === "kit" && <ErgonomicsKit />}
      </div>
    </div>
  );
}
