import { useRef, useState } from "react";
import { mu } from "../data";

export default function BottomSheet({ stops, si, setSi, listOpen, setListOpen, color, onBrowseBacklog }) {
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const stop = stops[si] || null;

  const onTouchStart = e => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = e => {
    if (touchStartX.current === null) return;
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = touchStartY.current - e.changedTouches[0].clientY;

    // Swipe UP → open schedule list
    if (dy > 40 && Math.abs(dy) > Math.abs(dx)) {
      setListOpen(true);
      setDetailOpen(false);
      touchStartX.current = null;
      touchStartY.current = null;
      return;
    }
    // Swipe DOWN → close detail or list
    if (dy < -40 && Math.abs(dy) > Math.abs(dx)) {
      if (detailOpen) setDetailOpen(false);
      else if (listOpen) setListOpen(false);
      touchStartX.current = null;
      touchStartY.current = null;
      return;
    }
    // Horizontal swipe → navigate stops
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && si < stops.length - 1) { setSi(si + 1); setDetailOpen(false); }
      if (dx < 0 && si > 0) { setSi(si - 1); setDetailOpen(false); }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // ── No stops ──────────────────────────────────────────────────────────────
  if (!stops.length) {
    return (
      <div role="region" aria-label="Daily schedule" style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 1000, padding: "20px 16px 24px", background: "rgba(11,11,20,0.95)", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "#94a3b8" }}>No activities planned for this day</p>
        <button onClick={onBrowseBacklog} aria-label="Browse activity backlog" style={{ marginTop: 8, padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.08)", color: "#e2e8f0", fontSize: 12, fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>
          Browse backlog →
        </button>
      </div>
    );
  }

  // ── Expanded schedule list ─────────────────────────────────────────────────
  if (listOpen) {
    return (
      <div role="dialog" aria-label="Today's schedule" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 1000, background: "rgba(11,11,20,0.97)", borderRadius: "16px 16px 0 0", maxHeight: "65vh", overflowY: "auto", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
        <button onClick={() => setListOpen(false)} aria-label="Collapse schedule" style={{ display: "block", width: "100%", textAlign: "center", padding: "10px 0 6px", cursor: "pointer", background: "none", border: "none" }}>
          <div style={{ width: 32, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.25)", margin: "0 auto" }} />
          <span style={{ fontSize: 10, color: "#94a3b8", marginTop: 4, display: "block" }}>▼ collapse</span>
        </button>
        <div style={{ padding: "0 16px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
          {stops.map((s, i) => (
            <button key={s.id} onClick={() => { setSi(i); setListOpen(false); setDetailOpen(true); }} aria-label={`Stop ${i + 1}: ${s.n}`} aria-pressed={i === si} style={{ display: "flex", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer", background: i === si ? `${color}15` : "rgba(255,255,255,0.02)", border: i === si ? `1px solid ${color}33` : "1px solid rgba(255,255,255,0.05)", textAlign: "left", fontFamily: "'Outfit', sans-serif" }}>
              <div style={{ flexShrink: 0, width: 24, height: 24, borderRadius: "50%", background: i === si ? color : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: i === si ? "#0b0b14" : "#94a3b8" }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12 }}>{s.ic}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: i === si ? "#f1f5f9" : "#cbd5e1" }}>{s.n}</span>
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 2, flexWrap: "wrap" }}>
                  {s.t && <span style={{ fontSize: 10, color, fontWeight: 600 }}>{s.t}</span>}
                  {s.dur && <span style={{ fontSize: 10, color: "#94a3b8" }}>⏱ {s.dur}</span>}
                  {s.cost && <span style={{ fontSize: 10, color: "#94a3b8" }}>💰 {s.cost}</span>}
                </div>
              </div>
            </button>
          ))}
          {(() => {
            const paid = stops.filter(s => s.cost && !["Free", "", "$487", "À la carte", "~¥1,500"].includes(s.cost));
            const total = paid.reduce((sum, s) => { const m = s.cost.match(/[\d,]+/); return sum + (m ? parseInt(m[0].replace(",", "")) : 0); }, 0);
            return total > 0 ? (
              <div style={{ textAlign: "center", padding: "8px 0", fontSize: 12, color: "#94a3b8", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 4 }}>
                Day total: <span style={{ color, fontWeight: 700 }}>¥{total.toLocaleString()}</span> · {stops.length} stops
              </div>
            ) : null;
          })()}
        </div>
      </div>
    );
  }

  // ── Expanded detail view (tap on card) ────────────────────────────────────
  if (detailOpen && stop) {
    return (
      <div role="dialog" aria-label={`Details for ${stop.n}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 1000, background: "rgba(11,11,20,0.98)", borderRadius: "16px 16px 0 0", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
        <button onClick={() => setDetailOpen(false)} aria-label="Close details" style={{ display: "block", width: "100%", textAlign: "center", padding: "10px 0 6px", cursor: "pointer", background: "none", border: "none" }}>
          <div style={{ width: 32, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.25)", margin: "0 auto" }} />
          <span style={{ fontSize: 10, color: "#94a3b8", marginTop: 4, display: "block" }}>▼ close</span>
        </button>
        <div style={{ padding: "4px 20px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 28 }} role="img" aria-label={stop.n}>{stop.ic}</span>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", margin: 0, fontFamily: "'Outfit', sans-serif" }}>{stop.n}</h2>
              {stop.tr && <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0" }}>{stop.tr}</p>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            {stop.t && <span style={{ fontSize: 12, background: `${color}22`, color, borderRadius: 8, padding: "4px 10px", fontWeight: 600 }}>{stop.t}</span>}
            {stop.dur && <span style={{ fontSize: 12, background: "rgba(255,255,255,0.07)", color: "#cbd5e1", borderRadius: 8, padding: "4px 10px" }}>⏱ {stop.dur}</span>}
            {stop.cost && <span style={{ fontSize: 12, background: "rgba(255,255,255,0.07)", color: "#cbd5e1", borderRadius: 8, padding: "4px 10px" }}>💰 {stop.cost}</span>}
          </div>
          {stop.addr && <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>📍 {stop.addr}</p>}
          {stop.note && <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6, marginBottom: 12 }}>{stop.note}</p>}
          <div style={{ display: "flex", gap: 10 }}>
            <a href={mu(stop.lat, stop.lng)} target="_blank" rel="noopener noreferrer" aria-label={`Open ${stop.n} in Google Maps`} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0", borderRadius: 10, background: "rgba(91,141,239,0.15)", color: "#5B8DEF", fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(91,141,239,0.25)" }}>
              📍 Open in Maps
            </a>
            {stop.web && (
              <a href={stop.web} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${stop.n} website`} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0", borderRadius: 10, background: "rgba(52,211,153,0.12)", color: "#34D399", fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(52,211,153,0.2)" }}>
                🌐 Website
              </a>
            )}
          </div>
          <p style={{ textAlign: "center", marginTop: 12, fontSize: 10, color: "#64748b" }}>← swipe to navigate · swipe up for full schedule</p>
        </div>
      </div>
    );
  }

  // ── Collapsed card (default) ───────────────────────────────────────────────
  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 1000, background: "linear-gradient(180deg, transparent 0%, rgba(11,11,20,0.85) 30%, rgba(11,11,20,0.98) 100%)", padding: "40px 16px 24px" }}>
      {/* Progress dots — clickable */}
      <div role="tablist" aria-label="Stop navigation" style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 10 }}>
        {stops.map((s, i) => (
          <button key={i} role="tab" aria-label={`Go to stop ${i + 1}: ${s.n}`} aria-selected={i === si} onClick={() => { setSi(i); setDetailOpen(false); }} style={{ width: i === si ? 16 : 5, height: 5, borderRadius: 3, background: i === si ? color : "rgba(255,255,255,0.3)", transition: "all 0.2s", border: "none", padding: 0, cursor: "pointer" }} />
        ))}
      </div>

      {/* Card — tap opens detail, swipe navigates */}
      <button onClick={() => setDetailOpen(true)} aria-label={`View details for ${stop?.n}. Tap to expand.`} aria-expanded={detailOpen} style={{ display: "block", width: "100%", background: "rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", textAlign: "left", cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 20 }} role="img" aria-hidden="true">{stop?.ic}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>{stop?.n}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
              {stop?.t && <span style={{ fontSize: 11, color, fontWeight: 600 }}>{stop.t}</span>}
              {stop?.dur && <span style={{ fontSize: 11, color: "#94a3b8" }}>⏱ {stop.dur}</span>}
              {stop?.cost && <span style={{ fontSize: 11, color: "#94a3b8" }}>💰 {stop.cost}</span>}
            </div>
          </div>
          <span aria-hidden="true" style={{ fontSize: 11, color: "#94a3b8", background: "rgba(255,255,255,0.08)", borderRadius: 6, padding: "3px 8px", fontWeight: 600 }}>tap ↑</span>
        </div>
        {stop?.note && <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, lineHeight: 1.5 }}>{stop.note}</p>}
        <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
          {stop && (
            <a href={mu(stop.lat, stop.lng)} target="_blank" rel="noopener noreferrer" aria-label={`Open ${stop?.n} in Maps`} onClick={e => e.stopPropagation()} style={{ fontSize: 11, fontWeight: 600, color: "#5B8DEF", textDecoration: "none" }}>
              📍 Maps →
            </a>
          )}
          {stop?.web && (
            <a href={stop.web} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${stop?.n} website`} onClick={e => e.stopPropagation()} style={{ fontSize: 11, fontWeight: 600, color: "#34D399", textDecoration: "none" }}>
              🌐 Website →
            </a>
          )}
        </div>
        <p style={{ textAlign: "center", marginTop: 8, fontSize: 10, color: "#64748b" }}>← swipe · tap for details · swipe up for schedule</p>
      </button>
    </div>
  );
}
