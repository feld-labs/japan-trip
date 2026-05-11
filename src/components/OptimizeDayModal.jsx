import { useState, useMemo } from "react";
import { supabase } from "../supabase";
import { DAYS } from "../data";

// Haversine distance in km
function dist(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

// Nearest-neighbor TSP
function optimizeRoute(stops) {
  if (stops.length <= 2) return stops;
  const remaining = [...stops.slice(1)];
  const route = [stops[0]];
  while (remaining.length) {
    const cur = route[route.length - 1];
    const nearest = remaining.reduce((best, s) =>
      dist(cur, s) < dist(cur, best) ? s : best
    );
    route.push(nearest);
    remaining.splice(remaining.indexOf(nearest), 1);
  }
  return route;
}

export default function OptimizeDayModal({ allPlaces, onClose, onSaved }) {
  const [targetDate, setTargetDate] = useState(DAYS[0].key);
  const [selected, setSelected] = useState(new Set());
  const [cityFilter, setCityFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [optimized, setOptimized] = useState(null);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState("select"); // "select" | "preview"

  // All unscheduled places from DB (never localStorage)
  const unscheduled = useMemo(
    () => allPlaces.filter((p) => p.s === "unsched" || !p.dt),
    [allPlaces]
  );

  const cities = ["All", ...Array.from(new Set(unscheduled.map((p) => p.city).filter(Boolean)))];

  const filtered = unscheduled.filter((p) => {
    const matchCity = cityFilter === "All" || p.city === cityFilter;
    const matchSearch =
      !search || p.n.toLowerCase().includes(search.toLowerCase());
    return matchCity && matchSearch;
  });

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleOptimize = () => {
    const picks = unscheduled.filter((p) => selected.has(p.id));
    if (picks.length < 2) return;
    const route = optimizeRoute(picks);
    setOptimized(route);
    setStep("preview");
  };

  const handleSave = async () => {
    if (!optimized) return;
    setSaving(true);
    // Save each stop to Supabase with dt = targetDate, s = "sched", sort_order
    const updates = optimized.map((stop, i) =>
      supabase
        .from("places")
        .update({ dt: targetDate, s: "sched", sort_order: i })
        .eq("id", stop.id)
    );
    await Promise.all(updates);
    setSaving(false);
    onSaved(targetDate);
    onClose();
  };

  const totalDist = useMemo(() => {
    if (!optimized || optimized.length < 2) return 0;
    let d = 0;
    for (let i = 1; i < optimized.length; i++) d += dist(optimized[i - 1], optimized[i]);
    return d.toFixed(1);
  }, [optimized]);

  const dayLabel = DAYS.find((d) => d.key === targetDate)?.d || targetDate;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Optimize day route"
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "flex-end",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        width: "100%", maxHeight: "92vh",
        background: "#fff", borderRadius: "20px 20px 0 0",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 16px 12px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          {step === "preview" && (
            <button
              onClick={() => setStep("select")}
              style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#374151", padding: "0 4px" }}
              aria-label="Back to selection"
            >←</button>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
              {step === "select" ? "🗺️ Optimize My Day" : "✅ Optimized Route"}
            </div>
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>
              {step === "select"
                ? `${selected.size} place${selected.size !== 1 ? "s" : ""} selected`
                : `${optimized?.length} stops · ~${totalDist} km total`}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: "rgba(0,0,0,0.06)", border: "none", borderRadius: "50%", width: 32, height: 32, fontSize: 18, cursor: "pointer", color: "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}
          >×</button>
        </div>

        {step === "select" ? (
          <>
            {/* Date picker */}
            <div style={{ padding: "10px 16px 0", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", flexShrink: 0 }}>Add to:</span>
              <select
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                style={{ flex: 1, padding: "6px 10px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, fontFamily: "'Outfit', sans-serif", color: "#111827", background: "#fff" }}
              >
                {DAYS.map((d) => (
                  <option key={d.key} value={d.key}>{d.d} — {d.title}</option>
                ))}
              </select>
            </div>

            {/* City filter + search */}
            <div style={{ padding: "8px 16px 0", display: "flex", gap: 6 }}>
              <input
                type="text"
                placeholder="Search places…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1, padding: "7px 10px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, fontFamily: "'Outfit', sans-serif" }}
              />
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                style={{ padding: "7px 8px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, fontFamily: "'Outfit', sans-serif", color: "#374151" }}
              >
                {cities.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Place list */}
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 0" }}>
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", color: "#9ca3af", fontSize: 13, padding: "24px 0" }}>
                  No unscheduled places found
                </div>
              )}
              {filtered.map((p) => {
                const sel = selected.has(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleSelect(p.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      width: "100%", padding: "10px 12px", marginBottom: 6,
                      borderRadius: 10, border: `1.5px solid ${sel ? "#2563eb" : "#e5e7eb"}`,
                      background: sel ? "#eff6ff" : "#fff",
                      cursor: "pointer", textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{p.ic || "📍"}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.n}</div>
                      <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>
                        {p.city}{p.best ? ` · Best: ${p.best}` : ""}{p.cost ? ` · ${p.cost}` : ""}
                      </div>
                    </div>
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                      border: `2px solid ${sel ? "#2563eb" : "#d1d5db"}`,
                      background: sel ? "#2563eb" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {sel && <span style={{ color: "#fff", fontSize: 12, lineHeight: 1 }}>✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Optimize button */}
            <div style={{ padding: "12px 16px 24px" }}>
              <button
                onClick={handleOptimize}
                disabled={selected.size < 2}
                style={{
                  width: "100%", padding: "14px", borderRadius: 12, border: "none",
                  background: selected.size >= 2 ? "#2563eb" : "#e5e7eb",
                  color: selected.size >= 2 ? "#fff" : "#9ca3af",
                  fontSize: 15, fontWeight: 700, cursor: selected.size >= 2 ? "pointer" : "not-allowed",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {selected.size < 2 ? "Select at least 2 places" : `✨ Optimize Route for ${selected.size} Places`}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Optimized route preview */}
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 0" }}>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8, fontWeight: 600 }}>
                Optimized order for {dayLabel} — walk/transit ~{totalDist} km
              </div>
              {optimized.map((stop, i) => (
                <div key={stop.id} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", marginBottom: 6,
                  borderRadius: 10, background: "#f8fafc",
                  border: "1px solid #e5e7eb",
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: "#2563eb", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700,
                  }}>{i + 1}</div>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{stop.ic || "📍"}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{stop.n}</div>
                    <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>
                      {stop.city}{stop.best ? ` · Best: ${stop.best}` : ""}
                      {i > 0 ? ` · ${dist(optimized[i - 1], stop).toFixed(1)} km from prev` : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Save button */}
            <div style={{ padding: "12px 16px 24px" }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  width: "100%", padding: "14px", borderRadius: 12, border: "none",
                  background: saving ? "#e5e7eb" : "#059669",
                  color: saving ? "#9ca3af" : "#fff",
                  fontSize: 15, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {saving ? "Saving to database…" : `💾 Save Route to ${dayLabel}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
