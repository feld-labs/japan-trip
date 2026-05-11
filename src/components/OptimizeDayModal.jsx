import { useState, useMemo } from "react";
import { supabase } from "../supabase";
import { DAYS } from "../data";

// ── Haversine distance in km ──────────────────────────────────────────────────
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

// ── Nearest-neighbor TSP (keeps first stop fixed as anchor) ──────────────────
function optimizeRoute(stops, keepFirstFixed = false) {
  if (stops.length <= 2) return stops;
  const fixed = keepFirstFixed ? [stops[0]] : [];
  const pool = keepFirstFixed ? stops.slice(1) : stops;
  const remaining = [...pool];
  const route = keepFirstFixed ? [stops[0]] : [remaining.shift()];
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

function totalKm(stops) {
  if (!stops || stops.length < 2) return 0;
  let d = 0;
  for (let i = 1; i < stops.length; i++) d += dist(stops[i - 1], stops[i]);
  return d.toFixed(1);
}

// ── Shared sub-components ─────────────────────────────────────────────────────
function StopCard({ stop, index, prevStop }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 12px", marginBottom: 6,
      borderRadius: 10, background: "#f8fafc", border: "1px solid #e5e7eb",
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
        background: "#2563eb", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 700,
      }}>{index + 1}</div>
      <span style={{ fontSize: 20, flexShrink: 0 }}>{stop.ic || "📍"}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{stop.n}</div>
        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>
          {stop.city}
          {stop.best ? ` · ${stop.best}` : ""}
          {prevStop ? ` · ${dist(prevStop, stop).toFixed(1)} km from prev` : ""}
        </div>
      </div>
    </div>
  );
}

function PlaceRow({ place, selected, onToggle }) {
  const sel = selected;
  return (
    <button
      onClick={onToggle}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        width: "100%", padding: "10px 12px", marginBottom: 6,
        borderRadius: 10, border: `1.5px solid ${sel ? "#2563eb" : "#e5e7eb"}`,
        background: sel ? "#eff6ff" : "#fff",
        cursor: "pointer", textAlign: "left",
      }}
    >
      <span style={{ fontSize: 22, flexShrink: 0 }}>{place.ic || "📍"}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{place.n}</div>
        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>
          {place.city}{place.best ? ` · ${place.best}` : ""}{place.cost ? ` · ${place.cost}` : ""}
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
}

// ── Mode 1: Re-optimize an existing scheduled day ────────────────────────────
function ReOptimizeMode({ allPlaces, onClose, onSaved }) {
  const [selDay, setSelDay] = useState(DAYS[0].key);
  const [optimized, setOptimized] = useState(null);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState("pick"); // "pick" | "preview"

  const dayStops = useMemo(
    () => allPlaces.filter((p) => p.dt === selDay && p.s === "sched"),
    [allPlaces, selDay]
  );

  const dayLabel = DAYS.find((d) => d.key === selDay)?.d || selDay;

  const handleOptimize = () => {
    if (dayStops.length < 2) return;
    setOptimized(optimizeRoute(dayStops, true)); // keep first stop fixed
    setStep("preview");
  };

  const handleSave = async () => {
    if (!optimized) return;
    setSaving(true);
    await Promise.all(
      optimized.map((stop, i) =>
        supabase.from("places").update({ sort_order: i }).eq("id", stop.id)
      )
    );
    setSaving(false);
    onSaved(selDay);
    onClose();
  };

  return (
    <>
      {/* Day selector */}
      <div style={{ padding: "12px 16px 0" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
          Which day do you want to re-optimize?
        </div>
        <select
          value={selDay}
          onChange={(e) => { setSelDay(e.target.value); setOptimized(null); setStep("pick"); }}
          style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, fontFamily: "'Outfit', sans-serif", color: "#111827", background: "#fff" }}
        >
          {DAYS.map((d) => (
            <option key={d.key} value={d.key}>{d.d} — {d.title}</option>
          ))}
        </select>

        {/* Current stops preview */}
        {step === "pick" && (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6, fontWeight: 600 }}>
              {dayStops.length} scheduled stops on {dayLabel}
            </div>
            {dayStops.length === 0 && (
              <div style={{ color: "#9ca3af", fontSize: 13, textAlign: "center", padding: "16px 0" }}>
                No scheduled stops for this day yet
              </div>
            )}
            {dayStops.map((s, i) => (
              <StopCard key={s.id} stop={s} index={i} prevStop={i > 0 ? dayStops[i - 1] : null} />
            ))}
          </div>
        )}

        {/* Optimized preview */}
        {step === "preview" && optimized && (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 11, color: "#059669", marginBottom: 6, fontWeight: 600 }}>
              ✅ Optimized — ~{totalKm(optimized)} km total (was ~{totalKm(dayStops)} km)
            </div>
            {optimized.map((s, i) => (
              <StopCard key={s.id} stop={s} index={i} prevStop={i > 0 ? optimized[i - 1] : null} />
            ))}
          </div>
        )}
      </div>

      {/* Action button */}
      <div style={{ padding: "12px 16px 24px", marginTop: "auto" }}>
        {step === "pick" ? (
          <button
            onClick={handleOptimize}
            disabled={dayStops.length < 2}
            style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none",
              background: dayStops.length >= 2 ? "#2563eb" : "#e5e7eb",
              color: dayStops.length >= 2 ? "#fff" : "#9ca3af",
              fontSize: 15, fontWeight: 700,
              cursor: dayStops.length >= 2 ? "pointer" : "not-allowed",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {dayStops.length < 2 ? "Need at least 2 stops" : `✨ Optimize ${dayStops.length} Stops`}
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setStep("pick")}
              style={{ flex: 1, padding: "14px", borderRadius: 12, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}
            >← Back</button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ flex: 2, padding: "14px", borderRadius: 12, border: "none", background: saving ? "#e5e7eb" : "#059669", color: saving ? "#9ca3af" : "#fff", fontSize: 15, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "'Outfit', sans-serif" }}
            >
              {saving ? "Saving…" : `💾 Save to ${dayLabel}`}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ── Mode 2: Build a brand-new day route ───────────────────────────────────────
function BuildDayMode({ allPlaces, onClose, onSaved }) {
  const [targetDate, setTargetDate] = useState(DAYS[0].key);
  const [cityFilter, setCityFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [optimized, setOptimized] = useState(null);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState("select"); // "select" | "preview"

  const unscheduled = useMemo(
    () => allPlaces.filter((p) => p.s === "unsched" || !p.dt),
    [allPlaces]
  );

  const cities = ["All", ...Array.from(new Set(unscheduled.map((p) => p.city).filter(Boolean))).sort()];

  const filtered = unscheduled.filter((p) => {
    const matchCity = cityFilter === "All" || p.city === cityFilter;
    const matchSearch = !search || p.n.toLowerCase().includes(search.toLowerCase());
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
    setOptimized(optimizeRoute(picks, false));
    setStep("preview");
  };

  const handleSave = async () => {
    if (!optimized) return;
    setSaving(true);
    await Promise.all(
      optimized.map((stop, i) =>
        supabase.from("places").update({ dt: targetDate, s: "sched", sort_order: i }).eq("id", stop.id)
      )
    );
    setSaving(false);
    onSaved(targetDate);
    onClose();
  };

  const dayLabel = DAYS.find((d) => d.key === targetDate)?.d || targetDate;

  return (
    <>
      {step === "select" ? (
        <>
          {/* Date + city row */}
          <div style={{ padding: "10px 16px 0", display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Save to date</div>
              <select
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 12, fontFamily: "'Outfit', sans-serif", color: "#111827", background: "#fff" }}
              >
                {DAYS.map((d) => (
                  <option key={d.key} value={d.key}>{d.d} — {d.title}</option>
                ))}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 4 }}>City</div>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                style={{ padding: "7px 10px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 12, fontFamily: "'Outfit', sans-serif", color: "#374151", background: "#fff" }}
              >
                {cities.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Search */}
          <div style={{ padding: "8px 16px 0" }}>
            <input
              type="text"
              placeholder="Search places…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, fontFamily: "'Outfit', sans-serif", boxSizing: "border-box" }}
            />
          </div>

          {/* Selection count badge */}
          {selected.size > 0 && (
            <div style={{ padding: "6px 16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#2563eb" }}>{selected.size} selected</span>
              <button onClick={() => setSelected(new Set())} style={{ fontSize: 11, color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Clear all</button>
            </div>
          )}

          {/* Place list */}
          <div style={{ flex: 1, overflowY: "auto", padding: "6px 16px 0" }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", color: "#9ca3af", fontSize: 13, padding: "24px 0" }}>No places found</div>
            )}
            {filtered.map((p) => (
              <PlaceRow key={p.id} place={p} selected={selected.has(p.id)} onToggle={() => toggleSelect(p.id)} />
            ))}
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
                fontSize: 15, fontWeight: 700,
                cursor: selected.size >= 2 ? "pointer" : "not-allowed",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {selected.size < 2 ? "Select at least 2 places" : `✨ Optimize Route — ${selected.size} Places`}
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Preview */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 0" }}>
            <div style={{ fontSize: 12, color: "#059669", marginBottom: 8, fontWeight: 600 }}>
              Optimized order · ~{totalKm(optimized)} km total · saving to {dayLabel}
            </div>
            {optimized.map((s, i) => (
              <StopCard key={s.id} stop={s} index={i} prevStop={i > 0 ? optimized[i - 1] : null} />
            ))}
          </div>

          <div style={{ padding: "12px 16px 24px", display: "flex", gap: 8 }}>
            <button
              onClick={() => setStep("select")}
              style={{ flex: 1, padding: "14px", borderRadius: 12, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}
            >← Back</button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ flex: 2, padding: "14px", borderRadius: 12, border: "none", background: saving ? "#e5e7eb" : "#059669", color: saving ? "#9ca3af" : "#fff", fontSize: 15, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "'Outfit', sans-serif" }}
            >
              {saving ? "Saving…" : `💾 Save Route to ${dayLabel}`}
            </button>
          </div>
        </>
      )}
    </>
  );
}

// ── Main modal shell ──────────────────────────────────────────────────────────
export default function OptimizeDayModal({ allPlaces, onClose, onSaved }) {
  const [mode, setMode] = useState(null); // null | "reoptimize" | "build"

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Route planner"
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
          display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
        }}>
          {mode && (
            <button
              onClick={() => setMode(null)}
              style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#374151", padding: "0 4px" }}
              aria-label="Back"
            >←</button>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
              {!mode && "✨ Route Planner"}
              {mode === "reoptimize" && "🔄 Re-Optimize Existing Day"}
              {mode === "build" && "🗺️ Build New Day Route"}
            </div>
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>
              {!mode && "Choose what you'd like to do"}
              {mode === "reoptimize" && "Reorder stops on an existing day for the best route"}
              {mode === "build" && "Pick activities and create an optimized day from scratch"}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: "rgba(0,0,0,0.06)", border: "none", borderRadius: "50%", width: 32, height: 32, fontSize: 18, cursor: "pointer", color: "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}
          >×</button>
        </div>

        {/* Mode picker */}
        {!mode && (
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
            <button
              onClick={() => setMode("reoptimize")}
              style={{
                padding: "18px 16px", borderRadius: 14, border: "1.5px solid #e5e7eb",
                background: "#fff", cursor: "pointer", textAlign: "left",
                display: "flex", alignItems: "center", gap: 14,
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🔄</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Re-Optimize Existing Day</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3, lineHeight: 1.4 }}>
                  Already have stops scheduled? Reorder them so the route is geographically efficient with minimal backtracking.
                </div>
              </div>
            </button>

            <button
              onClick={() => setMode("build")}
              style={{
                padding: "18px 16px", borderRadius: 14, border: "1.5px solid #e5e7eb",
                background: "#fff", cursor: "pointer", textAlign: "left",
                display: "flex", alignItems: "center", gap: 14,
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🗺️</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Build New Day Route</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3, lineHeight: 1.4 }}>
                  Start fresh — pick a city, select activities from your full list, and get an optimized route saved to any date.
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Mode content */}
        {mode === "reoptimize" && (
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
            <ReOptimizeMode allPlaces={allPlaces} onClose={onClose} onSaved={onSaved} />
          </div>
        )}
        {mode === "build" && (
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
            <BuildDayMode allPlaces={allPlaces} onClose={onClose} onSaved={onSaved} />
          </div>
        )}
      </div>
    </div>
  );
}
