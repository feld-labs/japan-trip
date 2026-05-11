import { DAYS, TH, FLIGHTS, LODGING, MEALS } from "../data";

export default function TopBar({ selDay, onPickDay, menuOpen, setMenuOpen, onMenuView, unschedCount, onAddPlace, onOptimize }) {
  const day = DAYS.find(d => d.key === selDay) || DAYS[0];

  return (
    <div
      role="banner"
      style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 1000,
        background: "rgba(11,11,20,0.97)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(14px)",
        padding: "12px 12px 10px"
      }}
    >
      {/* Title row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
        >
          <span style={{ fontSize: 16, color: "#e2e8f0" }} aria-hidden="true">☰</span>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>{day.title}</div>
          <div style={{ fontSize: 10, color: "#94a3b8" }}>{day.d} · {day.region}</div>
        </div>
        {/* Action buttons */}
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button
            onClick={onOptimize}
            aria-label="Optimize day route"
            style={{
              background: "#2563eb", border: "none", borderRadius: 20,
              padding: "6px 12px", cursor: "pointer", display: "flex",
              alignItems: "center", gap: 4,
            }}
          >
            <span style={{ fontSize: 13, lineHeight: 1 }}>✨</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>Optimize</span>
          </button>
          <button
            onClick={onAddPlace}
            aria-label="Add a new place"
            style={{
              background: "#f59e0b", border: "none", borderRadius: 20,
              padding: "6px 12px", cursor: "pointer", display: "flex",
              alignItems: "center", gap: 4,
            }}
          >
            <span style={{ fontSize: 14, lineHeight: 1, fontWeight: 700, color: "#000" }}>+</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#000" }}>Add</span>
          </button>
        </div>
      </div>

      {/* Menu dropdown */}
      {menuOpen && (
        <nav aria-label="Trip sections" style={{ background: "rgba(18,18,31,0.98)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", padding: 4, marginBottom: 8 }}>
          {[
            { k: "travel",  l: "✈️  Flights",          c: FLIGHTS.length },
            { k: "lodging", l: "🏨  Hotels",            c: LODGING.length },
            { k: "meals",   l: "🍽️  Meals",             c: MEALS.length },
            { k: "backlog", l: "📋  Activity Backlog",  c: unschedCount },
          ].map(item => (
            <button
              key={item.k}
              onClick={() => onMenuView(item.k)}
              aria-label={`${item.l} — ${item.c} items`}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "12px 14px", background: "none", border: "none", color: "#e2e8f0", fontSize: 14, fontWeight: 500, cursor: "pointer", borderRadius: 8, fontFamily: "'Outfit', sans-serif", textAlign: "left" }}
            >
              {item.l}
              <span style={{ fontSize: 11, color: "#94a3b8", background: "rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: 10 }}>{item.c}</span>
            </button>
          ))}
        </nav>
      )}

      {/* Day strip */}
      <div
        role="tablist"
        aria-label="Select day"
        style={{ display: "flex", gap: 4, overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {DAYS.map(d => {
          const active = selDay === d.key;
          const t = TH[d.th];
          return (
            <button
              key={d.key}
              role="tab"
              aria-selected={active}
              aria-label={`${d.dow} ${d.key} — ${d.title}`}
              onClick={() => onPickDay(d.key)}
              style={{
                flexShrink: 0,
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: "4px 8px", borderRadius: 8, cursor: "pointer", minWidth: 38,
                border: "none",
                background: active ? `${t.c}28` : "rgba(255,255,255,0.05)",
                borderBottom: active ? `2px solid ${t.c}` : "2px solid transparent",
                transition: "background 0.15s"
              }}
            >
              <span style={{ fontSize: 8, color: active ? "#cbd5e1" : "#94a3b8", fontWeight: 600 }}>{d.dow}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: active ? t.c : "#cbd5e1" }}>{d.key.split("/")[1]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
