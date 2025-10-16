import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Row = {
  id: string;
  title: string;
  url: string;
  type: string;
  lang: string;
  created_at: string;
};

export default function ErgonomicsKit(){
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("resources").select("*").order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setRows(data as Row[]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="section">
      <div className="shell">
        <div className="glass" style={{ padding: 18 }}>
          <h1 className="display" style={{ fontSize: "clamp(28px,4vw,42px)" }}>Ergonomics Kit</h1>
          <p className="kicker">Curated videos & articles from your Supabase database.</p>

          <div className="glass" style={{ overflowX:"auto", marginTop: 12, padding: 8 }}>
            <table className="table">
              <thead>
                <tr><th>Title</th><th>Type</th><th>Lang</th><th>Open</th></tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan={4}>Loading…</td></tr>}
                {!loading && rows.length === 0 && <tr><td colSpan={4}>No resources yet.</td></tr>}
                {rows.map(r => (
                  <tr key={r.id}>
                    <td>{r.title}</td>
                    <td>{r.type}</td>
                    <td>{(r.lang || "en").toUpperCase()}</td>
                    <td><a className="btn ghost" href={r.url} target="_blank" rel="noreferrer">View</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
