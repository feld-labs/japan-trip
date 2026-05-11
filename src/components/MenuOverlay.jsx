import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FLIGHTS, LODGING, MEALS, mu } from "../data";

// ── Category config ────────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: "all",     label: "All",      emoji: "🗺️" },
  { key: "food",    label: "Food",     emoji: "🍜" },
  { key: "cafe",    label: "Cafes",    emoji: "☕" },
  { key: "sight",   label: "Sights",   emoji: "⛩️" },
  { key: "shop",    label: "Shopping", emoji: "🛍️" },
  { key: "culture", label: "Culture",  emoji: "🎭" },
  { key: "nature",  label: "Nature",   emoji: "🌿" },
];

const CAFE_EMOJIS  = ["☕","🧋","🍵","🫖","🧃","🥤"];
const FOOD_EMOJIS  = ["🍜","🍣","🍱","🥩","🍕","🍢","🥞","🦀","🦞","🍮","🎂","🍤","🥪","🍄","🍛","🍙","🍘","🍥","🍡","🍧","🍨","🍦","🧁","🍰","🍭","🍬","🍫","🍿","🍩","🍪","🌰","🥜","🍯","🧂","🥚","🍳","🥘","🍲","🫕","🥗","🥙","🧆","🌮","🌯","🫔","🥫","🧇","🧈","🍞","🥐","🥖","🫓","🥨","🥯","🧀","🥓","🥩","🍗","🍖","🌭","🍔","🍟"];
const SIGHT_EMOJIS = ["⛩️","🏯","🗼","🏛️","🕌","🕍","⛪","🛕","🗽","🗿","🏟️","🏰","🌉","🌃","🌆","🌇","🌁"];
const SHOP_EMOJIS  = ["🛍️","🏬","🏪","👗","👠","👒","💍","💎","🧴","🪞"];
const CULTURE_EMOJIS = ["🎭","🎨","🎬","🎤","🎵","🎶","🎸","🎹","🎺","🎻","🥁","🎷","🎪","🎠","🎡","🎢","🎯","🎳","🎮","🕹️","🎲","🃏","🀄","🎴","🖼️"];
const NATURE_EMOJIS = ["🌿","🌸","🌺","🌻","🌹","🌷","🌱","🌲","🌳","🌴","🌵","🎋","🎍","🍀","🍁","🍂","🍃","🌾","🌊","🏔️","⛰️","🗻","🏕️","🏖️","🏜️","🏝️","🏞️","🌅","🌄","🌠","🎑","🌌","🌈"];

function getCat(place) {
  const ic = place.ic || "";
  if (CAFE_EMOJIS.includes(ic)) return "cafe";
  if (FOOD_EMOJIS.includes(ic)) return "food";
  if (SIGHT_EMOJIS.includes(ic)) return "sight";
  if (SHOP_EMOJIS.includes(ic)) return "shop";
  if (CULTURE_EMOJIS.includes(ic)) return "culture";
  if (NATURE_EMOJIS.includes(ic)) return "nature";
  const n = (place.n || "").toLowerCase();
  if (/cafe|coffee|tea|matcha|brew|roast/.test(n)) return "cafe";
  if (/ramen|sushi|pizza|okonomiyaki|takoyaki|restaurant|dining|food|eat|bistro/.test(n)) return "food";
  if (/shrine|temple|castle|tower|museum|gallery|park|garden/.test(n)) return "sight";
  if (/shop|market|mall|store|arcade/.test(n)) return "shop";
  return "sight";
}

function createSavedIcon(emoji) {
  return L.divIcon({
    className: "",
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    html: `<div style="display:flex;flex-direction:column;align-items:center;">
      <div style="width:36px;height:36px;border-radius:50%;background:#fff;border:2px solid rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 10px rgba(0,0,0,0.2);">${emoji}</div>
      <div style="width:2px;height:6px;background:rgba(0,0,0,0.2);border-radius:1px;"></div>
    </div>`,
  });
}

function SavedPlacesMap({ places }) {
  const valid = places.filter(p => p.lat && p.lng);
  const center = valid.length > 0 ? [valid[0].lat, valid[0].lng] : [35.0116, 135.7681];
  return (
    <div style={{ flex: 1, minHeight: 0, margin: "0 16px 16px", borderRadius: 16, overflow: "hidden", border: "1px solid #e5e7eb" }}>
      <MapContainer center={center} zoom={11} style={{ height: "100%", width: "100%" }} zoomControl={false} scrollWheelZoom={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution='&copy; <a href="https://carto.com/">CARTO</a>' />
        {valid.map(p => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={createSavedIcon(p.ic || "📍")}>
            <Popup>
              <div style={{ fontFamily: "'Outfit', sans-serif", minWidth: 140 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{p.n}</div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{p.city}</div>
                {p.cost && <div style={{ fontSize: 11, marginTop: 2 }}>💰 {p.cost}</div>}
                <a href={mu(p.lat, p.lng)} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: 6, fontSize: 11, fontWeight: 600, color: "#2563eb", textDecoration: "none" }}>📍 Open in Maps →</a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

function PlaceCard({ a }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "14px 16px", border: "1px solid #f0f0f0", marginBottom: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: "#f8fafc", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{a.ic || "📍"}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", lineHeight: 1.3 }}>{a.n}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "#6b7280" }}>📍 {a.city}</span>
            {a.cost && <span style={{ fontSize: 11, color: "#6b7280" }}>· 💰 {a.cost}</span>}
            {a.dur && <span style={{ fontSize: 11, color: "#6b7280" }}>· ⏱ {a.dur}</span>}
          </div>
        </div>
      </div>
      {a.note && <p style={{ fontSize: 12, color: "#6b7280", marginTop: 8, lineHeight: 1.5, paddingLeft: 52 }}>{a.note}</p>}
      {a.best && <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, paddingLeft: 52 }}>Best: {a.best}</p>}
      <div style={{ display: "flex", gap: 10, marginTop: 10, paddingLeft: 52 }}>
        <a href={mu(a.lat, a.lng)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", textDecoration: "none" }}>📍 Maps</a>
        {a.web && <a href={a.web} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 600, color: "#059669", textDecoration: "none" }}>🌐 Website</a>}
      </div>
    </div>
  );
}

export default function MenuOverlay({ view, onClose, activities }) {
  // Map "backlog" and "travel" to new tab keys for backward compat
  const initView = view === "backlog" ? "saved" : view === "travel" ? "flights" : (view || "saved");
  const [activeView, setActiveView] = useState(initView);
  const [cityFilter, setCityFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [showMap, setShowMap] = useState(false);

  const unscheduled = useMemo(
    () => (activities || []).filter(a => a.s === "unsched" || (!a.dt && a.s !== "sched")),
    [activities]
  );

  const cities = ["all", ...Array.from(new Set(unscheduled.map(a => a.city).filter(Boolean))).sort()];

  const filtered = useMemo(() => unscheduled.filter(a => {
    const matchCity = cityFilter === "all" || a.city === cityFilter;
    const matchCat = catFilter === "all" || getCat(a) === catFilter;
    return matchCity && matchCat;
  }), [unscheduled, cityFilter, catFilter]);

  const NAV = [
    { key: "saved",   label: "Saved Places", icon: "🗺️" },
    { key: "flights", label: "Flights",       icon: "✈️" },
    { key: "lodging", label: "Lodging",       icon: "🏨" },
    { key: "meals",   label: "Meals",         icon: "🍽️" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 8000, background: "#f8fafc", display: "flex", flexDirection: "column", fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "16px 16px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", letterSpacing: "-0.5px" }}>Trip Details</div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>Japan · May 4–16, 2026</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: "#f3f4f6", cursor: "pointer", fontSize: 18, color: "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {NAV.map(item => (
            <button key={item.key} onClick={() => { setActiveView(item.key); setShowMap(false); }} style={{ flexShrink: 0, padding: "8px 14px", border: "none", cursor: "pointer", background: "transparent", borderBottom: activeView === item.key ? "2.5px solid #111827" : "2.5px solid transparent", color: activeView === item.key ? "#111827" : "#9ca3af", fontSize: 13, fontWeight: activeView === item.key ? 700 : 500, fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", gap: 5, transition: "all 0.15s" }}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Saved Places ── */}
      {activeView === "saved" && (
        <>
          <div style={{ background: "#fff", padding: "10px 16px 8px", borderBottom: "1px solid #f0f0f0", flexShrink: 0 }}>
            {/* City + Map toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 6, flex: 1, overflowX: "auto" }}>
                {cities.map(c => (
                  <button key={c} onClick={() => setCityFilter(c)} style={{ flexShrink: 0, padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer", background: cityFilter === c ? "#111827" : "#f3f4f6", color: cityFilter === c ? "#fff" : "#374151", fontSize: 12, fontWeight: 600, fontFamily: "'Outfit', sans-serif", transition: "all 0.15s" }}>
                    {c === "all" ? "All Cities" : c}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowMap(m => !m)} style={{ flexShrink: 0, padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer", background: showMap ? "#2563eb" : "#f3f4f6", color: showMap ? "#fff" : "#374151", fontSize: 12, fontWeight: 600, fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
                🗺️ {showMap ? "List" : "Map"}
              </button>
            </div>
            {/* Category filters */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
              {CATEGORIES.map(cat => (
                <button key={cat.key} onClick={() => setCatFilter(cat.key)} style={{ flexShrink: 0, padding: "4px 11px", borderRadius: 20, border: "none", cursor: "pointer", background: catFilter === cat.key ? "#f59e0b" : "#f3f4f6", color: catFilter === cat.key ? "#fff" : "#374151", fontSize: 12, fontWeight: 600, fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", gap: 4, transition: "all 0.15s" }}>
                  <span>{cat.emoji}</span> {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: "6px 16px 2px", flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>{filtered.length} place{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          {showMap ? (
            <SavedPlacesMap places={filtered} />
          ) : (
            <div style={{ flex: 1, overflowY: "auto", padding: "4px 16px 32px", WebkitOverflowScrolling: "touch", minHeight: 0 }}>
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", color: "#9ca3af", fontSize: 14, padding: "40px 0" }}>No places match these filters</div>
              )}
              {filtered.map(a => <PlaceCard key={a.id} a={a} />)}
            </div>
          )}
        </>
      )}

      {/* ── Flights ── */}
      {activeView === "flights" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px", WebkitOverflowScrolling: "touch", minHeight: 0 }}>
          {FLIGHTS.map(f => (
            <div key={f.id} style={{ background: "#fff", borderRadius: 16, padding: "16px", marginBottom: 12, border: "1px solid #f0f0f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: 0.8 }}>{f.dir}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{f.flight}</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 8 }}>{f.route}</div>
              <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#6b7280", flexWrap: "wrap" }}>
                <span>🛫 {f.depart}</span>
                <span>🛬 {f.arrive}</span>
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: "#9ca3af" }}>
                Confirmation: <span style={{ color: "#374151", fontWeight: 700 }}>{f.conf}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Lodging ── */}
      {activeView === "lodging" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px", WebkitOverflowScrolling: "touch", minHeight: 0 }}>
          <div style={{ background: "#f0fdf4", borderRadius: 12, padding: "10px 14px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>Total lodging</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#059669" }}>${LODGING.reduce((s, l) => s + (l.cost || 0), 0).toFixed(2)}</span>
          </div>
          {LODGING.map(l => (
            <div key={l.id} style={{ background: "#fff", borderRadius: 16, padding: "16px", marginBottom: 12, border: "1px solid #f0f0f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", flex: 1 }}>{l.name}</div>
                {l.cost && <span style={{ fontSize: 15, fontWeight: 800, color: "#059669", flexShrink: 0, marginLeft: 8 }}>${l.cost}</span>}
              </div>
              <div style={{ fontSize: 12, color: "#2563eb", fontWeight: 600, marginTop: 4 }}>{l.dates} · {l.nights} night{l.nights > 1 ? "s" : ""}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>📍 {l.addr}</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
                Check-in: {l.ci} · Check-out: {l.co}{l.res ? ` · Res: ${l.res}` : ""}{l.pin ? ` · PIN: ${l.pin}` : ""}
              </div>
              <a href={mu(l.lat, l.lng)} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 8, fontSize: 12, fontWeight: 600, color: "#2563eb", textDecoration: "none" }}>📍 Maps →</a>
            </div>
          ))}
        </div>
      )}

      {/* ── Meals ── */}
      {activeView === "meals" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px", WebkitOverflowScrolling: "touch", minHeight: 0 }}>
          {MEALS.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: "1px solid #f3f4f6", alignItems: "center" }}>
              <div style={{ width: 48, flexShrink: 0, textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{m.date}</div>
                <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 500, marginTop: 1 }}>{m.meal}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{m.spot}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
