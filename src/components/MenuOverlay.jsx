import { useState } from "react";
import { FLIGHTS, LODGING, MEALS, ACTIVITIES, mu } from "../data";

export default function MenuOverlay({ view, onClose }) {
  const [bf, setBf] = useState("all");
  const unsched = ACTIVITIES.filter(a => a.s === "unsched");
  const filtered = bf === "all" ? unsched : unsched.filter(a => a.city === bf);

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: "#0b0b14", color: "#e2e8f0", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 20, cursor: "pointer" }}>←</button>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700 }}>
          {view === "travel" ? "Flights" : view === "lodging" ? "Hotels" : view === "meals" ? "Meals" : "Activity Backlog"}
        </h2>
      </div>

      <div style={{ flex: 1, padding: 16, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
        {/* FLIGHTS */}
        {view === "travel" && FLIGHTS.map(f => (
          <div key={f.id} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#5B8DEF", textTransform: "uppercase", letterSpacing: 1 }}>{f.dir}</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>{f.route}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>🛫 {f.depart} → 🛬 {f.arrive}</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 6 }}>Flight: {f.flight} · Conf: <span style={{ color: "#cbd5e1", fontWeight: 600 }}>{f.conf}</span></div>
          </div>
        ))}

        {/* LODGING */}
        {view === "lodging" && <>
          <div style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: "#34D399" }}>
            Total: ${LODGING.reduce((s, l) => s + (l.cost || 0), 0).toFixed(2)}
          </div>
          {LODGING.map(l => (
            <div key={l.id} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{l.name}</div>
                {l.cost && <span style={{ fontSize: 14, fontWeight: 700, color: "#34D399" }}>${l.cost}</span>}
              </div>
              <div style={{ fontSize: 12, color: "#5B8DEF", fontWeight: 600, marginTop: 2 }}>{l.dates} · {l.nights}n</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>📍 {l.addr}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
                In: {l.ci} · Out: {l.co} · Res: {l.res}{l.pin ? ` · PIN: ${l.pin}` : ""}
              </div>
              <a href={mu(l.lat, l.lng)} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 6, fontSize: 11, fontWeight: 600, color: "#5B8DEF", textDecoration: "none" }}>📍 Maps →</a>
            </div>
          ))}
        </>}

        {/* MEALS */}
        {view === "meals" && MEALS.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ width: 36, textAlign: "center", fontSize: 10, color: "#64748b", fontWeight: 600 }}>{m.date}<br />{m.meal}</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{m.spot}</div>
          </div>
        ))}

        {/* BACKLOG */}
        {view === "backlog" && <>
          <div style={{ display: "flex", gap: 4 }}>
            {["all", "Tokyo", "Kyoto"].map(f => (
              <button key={f} onClick={() => setBf(f)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", cursor: "pointer", background: bf === f ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.03)", color: bf === f ? "#f1f5f9" : "#64748b", fontSize: 11, fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
          {filtered.map(a => (
            <div key={a.id} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 14 }}>{a.ic}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{a.n}</span>
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: a.best?.includes("Skip") ? "rgba(239,68,68,0.1)" : "rgba(251,191,36,0.1)", color: a.best?.includes("Skip") ? "#F87171" : "#FBBF24", textTransform: "uppercase" }}>
                  {a.best?.includes("Skip") ? "Skip" : "Open"}
                </span>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 4, fontSize: 11, color: "#64748b", flexWrap: "wrap" }}>
                <span>📍 {a.city}</span>
                {a.cost && <span>💰 {a.cost}</span>}
                {a.dur && <span>⏱ {a.dur}</span>}
              </div>
              {a.note && <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, lineHeight: 1.5 }}>{a.note}</p>}
              {a.best && <p style={{ fontSize: 10, color: "#475569", marginTop: 3 }}>Best: {a.best}</p>}
              <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                <a href={mu(a.lat, a.lng)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, fontWeight: 600, color: "#5B8DEF", textDecoration: "none" }}>📍 Maps →</a>
                {a.web && <a href={a.web} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, fontWeight: 600, color: "#34D399", textDecoration: "none" }}>🌐 Website →</a>}
              </div>
            </div>
          ))}
        </>}
      </div>
    </div>
  );
}
