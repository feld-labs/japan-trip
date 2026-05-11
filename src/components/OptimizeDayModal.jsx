import { useState, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

function totalKm(stops) {
  if (!stops || stops.length < 2) return "0";
  let d = 0;
  for (let i = 1; i < stops.length; i++) d += dist(stops[i - 1], stops[i]);
  return d.toFixed(1);
}

// ── Nearest-neighbor TSP ──────────────────────────────────────────────────────
function optimizeRoute(stops, keepFirstFixed = false) {
  if (stops.length <= 2) return stops;
  const route = keepFirstFixed ? [stops[0]] : [];
  const remaining = keepFirstFixed ? [...stops.slice(1)] : [...stops];
  if (!keepFirstFixed) route.push(remaining.shift());
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

// ── Draggable stop row ────────────────────────────────────────────────────────
function SortableStopRow({ stop, index, prevStop }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 12px", marginBottom: 6,
        borderRadius: 10,
        background: isDragging ? "#eff6ff" : "#f8fafc",
        border: `1.5px solid ${isDragging ? "#2563eb" : "#e5e7eb"}`,
        boxShadow: isDragging ? "0 4px 16px rgba(37,99,235,0.18)" : "none",
        userSelect: "none",
      }}>
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          style={{
            cursor: "grab", padding: "4px 2px", color: "#9ca3af",
            fontSize: 16, lineHeight: 1, flexShrink: 0, touchAction: "none",
          }}
          aria-label="Drag to reorder"
        >
          ⠿
        </div>

        {/* Number badge */}
        <div style={{
          width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
          background: "#2563eb", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700,
        }}>{index + 1}</div>

        <span style={{ fontSize: 20, flexShrink: 0 }}>{stop.ic || "📍"}</span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {stop.n}
          </div>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>
            {stop.city}
            {stop.best ? ` · ${stop.best}` : ""}
            {prevStop ? ` · ${dist(prevStop, stop).toFixed(1)} km` : ""}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Reorderable route preview (shared by both modes) ─────────────────────────
function RoutePreview({ route, setRoute, dayLabel, onBack, onSave, saving }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIdx = route.findIndex((s) => s.id === active.id);
    const newIdx = route.findIndex((s) => s.id === over.id);
    setRoute(arrayMove(route, oldIdx, newIdx));
  };

  return (
    <>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 0" }}>
        {/* Summary bar */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 10, padding: "8px 12px",
          background: "#f0fdf4", borderRadius: 10, border: "1px solid #bbf7d0",
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#059669" }}>
            ✅ {route.length} stops · ~{totalKm(route)} km total
          </span>
          <span style={{ fontSize: 11, color: "#6b7280" }}>Drag ⠿ to reorder</span>
        </div>

        {/* Sortable list */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={route.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            {route.map((stop, i) => (
              <SortableStopRow
                key={stop.id}
                stop={stop}
                index={i}
                prevStop={i > 0 ? route[i - 1] : null}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Footer buttons */}
      <div style={{ padding: "12px 16px 24px", display: "flex", gap: 8, flexShrink: 0 }}>
        <button
          onClick={onBack}
          style={{ flex: 1, padding: "14px", borderRadius: 12, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}
        >← Back</button>
        <button
          onClick={onSave}
          disabled={saving}
          style={{ flex: 2, padding: "14px", borderRadius: 12, border: "none", background: saving ? "#e5e7eb" : "#059669", color: saving ? "#9ca3af" : "#fff", fontSize: 15, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "'Outfit', sans-serif" }}
        >
          {saving ? "Saving…" : `💾 Save Route to ${dayLabel}`}
        </button>
      </div>
    </>
  );
}

// ── Selectable place row ──────────────────────────────────────────────────────
function PlaceRow({ place, selected, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        width: "100%", padding: "10px 12px", marginBottom: 6,
        borderRadius: 10, border: `1.5px solid ${selected ? "#2563eb" : "#e5e7eb"}`,
        background: selected ? "#eff6ff" : "#fff",
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
        border: `2px solid ${selected ? "#2563eb" : "#d1d5db"}`,
        background: selected ? "#2563eb" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {selected && <span style={{ color: "#fff", fontSize: 12, lineHeight: 1 }}>✓</span>}
      </div>
    </button>
  );
}

// ── Mode 1: Re-optimize an existing scheduled day ────────────────────────────
function ReOptimizeMode({ allPlaces, onClose, onSaved }) {
  const [selDay, setSelDay] = useState(DAYS[0].key);
  const [route, setRoute] = useState(null);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState("pick");

  const dayStops = useMemo(
    () => allPlaces.filter((p) => p.dt === selDay && p.s === "sched"),
    [allPlaces, selDay]
  );
  const dayLabel = DAYS.find((d) => d.key === selDay)?.d || selDay;

  const handleOptimize = () => {
    if (dayStops.length < 2) return;
    setRoute(optimizeRoute(dayStops, true));
    setStep("preview");
  };

  const handleSave = async () => {
    setSaving(true);
    await Promise.all(
      route.map((stop, i) =>
        supabase.from("places").update({ sort_order: i }).eq("id", stop.id)
      )
    );
    setSaving(false);
    onSaved(selDay);
    onClose();
  };

  if (step === "preview") {
    return (
      <RoutePreview
        route={route}
        setRoute={setRoute}
        dayLabel={dayLabel}
        onBack={() => setStep("pick")}
        onSave={handleSave}
        saving={saving}
      />
    );
  }

  return (
    <>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 0" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
          Which day do you want to re-optimize?
        </div>
        <select
          value={selDay}
          onChange={(e) => { setSelDay(e.target.value); setRoute(null); }}
          style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, fontFamily: "'Outfit', sans-serif", color: "#111827", background: "#fff", marginBottom: 12 }}
        >
          {DAYS.map((d) => (
            <option key={d.key} value={d.key}>{d.d} — {d.title}</option>
          ))}
        </select>

        <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 8, fontWeight: 600 }}>
          {dayStops.length} scheduled stops on {dayLabel} · ~{totalKm(dayStops)} km current
        </div>
        {dayStops.length === 0 && (
          <div style={{ color: "#9ca3af", fontSize: 13, textAlign: "center", padding: "16px 0" }}>
            No scheduled stops for this day yet
          </div>
        )}
        {dayStops.map((s, i) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", marginBottom: 6, borderRadius: 10, background: "#f8fafc", border: "1px solid #e5e7eb" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#94a3b8", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{s.ic || "📍"}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.n}</div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>{s.city}{i > 0 ? ` · ${dist(dayStops[i - 1], s).toFixed(1)} km` : ""}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "12px 16px 24px", flexShrink: 0 }}>
        <button
          onClick={handleOptimize}
          disabled={dayStops.length < 2}
          style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: dayStops.length >= 2 ? "#2563eb" : "#e5e7eb", color: dayStops.length >= 2 ? "#fff" : "#9ca3af", fontSize: 15, fontWeight: 700, cursor: dayStops.length >= 2 ? "pointer" : "not-allowed", fontFamily: "'Outfit', sans-serif" }}
        >
          {dayStops.length < 2 ? "Need at least 2 stops" : `✨ Optimize ${dayStops.length} Stops`}
        </button>
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
  const [route, setRoute] = useState(null);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState("select");

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
    setRoute(optimizeRoute(picks, false));
    setStep("preview");
  };

  const handleSave = async () => {
    setSaving(true);
    await Promise.all(
      route.map((stop, i) =>
        supabase.from("places").update({ dt: targetDate, s: "sched", sort_order: i }).eq("id", stop.id)
      )
    );
    setSaving(false);
    onSaved(targetDate);
    onClose();
  };

  const dayLabel = DAYS.find((d) => d.key === targetDate)?.d || targetDate;

  if (step === "preview") {
    return (
      <RoutePreview
        route={route}
        setRoute={setRoute}
        dayLabel={dayLabel}
        onBack={() => setStep("select")}
        onSave={handleSave}
        saving={saving}
      />
    );
  }

  return (
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
            {DAYS.map((d) => <option key={d.key} value={d.key}>{d.d} — {d.title}</option>)}
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

      {selected.size > 0 && (
        <div style={{ padding: "6px 16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#2563eb" }}>{selected.size} selected</span>
          <button onClick={() => setSelected(new Set())} style={{ fontSize: 11, color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Clear all</button>
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", padding: "6px 16px 0" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: "#9ca3af", fontSize: 13, padding: "24px 0" }}>No places found</div>
        )}
        {filtered.map((p) => (
          <PlaceRow key={p.id} place={p} selected={selected.has(p.id)} onToggle={() => toggleSelect(p.id)} />
        ))}
      </div>

      <div style={{ padding: "12px 16px 24px", flexShrink: 0 }}>
        <button
          onClick={handleOptimize}
          disabled={selected.size < 2}
          style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: selected.size >= 2 ? "#2563eb" : "#e5e7eb", color: selected.size >= 2 ? "#fff" : "#9ca3af", fontSize: 15, fontWeight: 700, cursor: selected.size >= 2 ? "pointer" : "not-allowed", fontFamily: "'Outfit', sans-serif" }}
        >
          {selected.size < 2 ? "Select at least 2 places" : `✨ Optimize Route — ${selected.size} Places`}
        </button>
      </div>
    </>
  );
}

// ── Main modal shell ──────────────────────────────────────────────────────────
export default function OptimizeDayModal({ allPlaces, onClose, onSaved }) {
  const [mode, setMode] = useState(null);

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
              {mode === "reoptimize" && "Reorder stops to minimize backtracking"}
              {mode === "build" && "Pick activities and build an optimized day from scratch"}
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
              style={{ padding: "18px 16px", borderRadius: 14, border: "1.5px solid #e5e7eb", background: "#fff", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14 }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🔄</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Re-Optimize Existing Day</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3, lineHeight: 1.4 }}>
                  Reorder stops on an already-scheduled day to minimize backtracking. Then drag to fine-tune before saving.
                </div>
              </div>
            </button>

            <button
              onClick={() => setMode("build")}
              style={{ padding: "18px 16px", borderRadius: 14, border: "1.5px solid #e5e7eb", background: "#fff", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14 }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🗺️</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Build New Day Route</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3, lineHeight: 1.4 }}>
                  Pick a city, select activities from your full list, optimize the route, then drag to adjust before saving.
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
