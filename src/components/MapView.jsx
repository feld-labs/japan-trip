import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Numbered circle marker for scheduled stops
function createScheduledIcon(number, color, isActive) {
  const size = isActive ? 34 : 26;
  const bg = isActive ? color : "#fff";
  const border = isActive ? "#fff" : color;
  const textColor = isActive ? "#fff" : color;
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${bg};border:2.5px solid ${border};display:flex;align-items:center;justify-content:center;font-family:'Outfit',sans-serif;font-size:11px;font-weight:700;color:${textColor};box-shadow:0 2px 10px rgba(0,0,0,0.25);">${number}</div>`,
  });
}

// Emoji pin for unscheduled activities
function createUnschedIcon(emoji, isActive) {
  const size = isActive ? 36 : 28;
  return L.divIcon({
    className: "",
    iconSize: [size, size + 8],
    iconAnchor: [size / 2, size + 8],
    html: `<div style="display:flex;flex-direction:column;align-items:center;">
      <div style="width:${size}px;height:${size}px;border-radius:50%;background:${isActive ? "#fff" : "rgba(255,255,255,0.95)"};border:2px solid ${isActive ? "#f59e0b" : "rgba(0,0,0,0.18)"};display:flex;align-items:center;justify-content:center;font-size:${isActive ? 18 : 14}px;box-shadow:0 2px 8px rgba(0,0,0,0.18);">${emoji}</div>
      <div style="width:2px;height:6px;background:rgba(0,0,0,0.2);border-radius:1px;"></div>
    </div>`,
  });
}

function MapController({ stops, activeIdx, listOpen, mapMode }) {
  const map = useMap();
  useEffect(() => {
    if (!stops.length) return;
    if (listOpen || mapMode === "unsched" || mapMode === "all") {
      const bounds = L.latLngBounds(stops.map(s => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    } else {
      const active = stops[activeIdx] || stops[0];
      map.setView([active.lat, active.lng], 15, { animate: true });
    }
  }, [stops, activeIdx, listOpen, mapMode, map]);
  return null;
}

export default function MapView({ stops, unschedStops, activeIdx, color, listOpen, onMarkerClick, mapMode, setMapMode }) {
  const [activeUnsched, setActiveUnsched] = useState(null);

  const displayStops = mapMode === "today" ? stops
    : mapMode === "unsched" ? unschedStops
    : [...stops, ...unschedStops];

  const hasStops = displayStops.length > 0;
  const center = hasStops ? [displayStops[0].lat, displayStops[0].lng] : [35.6762, 139.6503];
  const mu = (lat, lng) => `https://maps.google.com/?q=${lat},${lng}`;

  return (
    <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column" }}>
      {/* Filter pills */}
      <div style={{
        position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)",
        zIndex: 900, display: "flex", gap: 4, background: "rgba(255,255,255,0.97)",
        borderRadius: 24, padding: "4px 6px", boxShadow: "0 2px 14px rgba(0,0,0,0.14)",
        whiteSpace: "nowrap"
      }}>
        {[
          { key: "today", label: "Today's Stops", count: stops.length },
          { key: "unsched", label: "Unscheduled", count: unschedStops.length },
          { key: "all", label: "All", count: stops.length + unschedStops.length },
        ].map(f => (
          <button key={f.key} onClick={() => { setMapMode(f.key); setActiveUnsched(null); }} style={{
            padding: "5px 11px", borderRadius: 18, border: "none", cursor: "pointer",
            background: mapMode === f.key ? color : "transparent",
            color: mapMode === f.key ? "#fff" : "#374151",
            fontSize: 12, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
            transition: "all 0.15s", display: "flex", alignItems: "center", gap: 5
          }}>
            {f.label}
            <span style={{
              fontSize: 10, fontWeight: 700,
              background: mapMode === f.key ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.07)",
              color: mapMode === f.key ? "#fff" : "#6b7280",
              borderRadius: 10, padding: "1px 5px"
            }}>{f.count}</span>
          </button>
        ))}
      </div>

      {!hasStops ? (
        <div style={{ flex: 1, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 13 }}>
          No locations for this view
        </div>
      ) : (
        <MapContainer
          center={center}
          zoom={13}
          style={{ flex: 1, width: "100%", zIndex: 1 }}
          zoomControl={false}
          attributionControl={false}
        >
          {/* Light Voyager tiles — navigation-style, full colour */}
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

          <MapController stops={displayStops} activeIdx={activeIdx} listOpen={listOpen} mapMode={mapMode} />

          {/* Scheduled route line */}
          {(mapMode === "today" || mapMode === "all") && stops.length > 1 && (
            <Polyline
              positions={stops.map(s => [s.lat, s.lng])}
              pathOptions={{ color, weight: 3.5, opacity: 0.7, dashArray: "7 5" }}
            />
          )}

          {/* Scheduled stop markers */}
          {(mapMode === "today" || mapMode === "all") && stops.map((s, i) => (
            <Marker
              key={`sched-${s.id}`}
              position={[s.lat, s.lng]}
              icon={createScheduledIcon(i + 1, color, i === activeIdx)}
              eventHandlers={{ click: () => { onMarkerClick(i); setActiveUnsched(null); } }}
            />
          ))}

          {/* Unscheduled markers */}
          {(mapMode === "unsched" || mapMode === "all") && unschedStops.map((s, i) => (
            <Marker
              key={`unsched-${s.id}`}
              position={[s.lat, s.lng]}
              icon={createUnschedIcon(s.ic || "📍", activeUnsched === i)}
              eventHandlers={{ click: () => setActiveUnsched(activeUnsched === i ? null : i) }}
            />
          ))}
        </MapContainer>
      )}

      {/* Unscheduled popup card */}
      {(mapMode === "unsched" || mapMode === "all") && activeUnsched !== null && unschedStops[activeUnsched] && (() => {
        const s = unschedStops[activeUnsched];
        return (
          <div style={{
            position: "absolute", bottom: 90, left: 12, right: 12, zIndex: 1100,
            background: "#fff", borderRadius: 14, padding: "14px 16px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.16)", border: "1px solid rgba(0,0,0,0.06)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 22 }}>{s.ic}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>{s.addr}</div>
                </div>
              </div>
              <button onClick={() => setActiveUnsched(null)} style={{ background: "none", border: "none", fontSize: 20, color: "#9ca3af", cursor: "pointer", lineHeight: 1, padding: "0 2px" }}>×</button>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              {s.cost && <span style={{ fontSize: 11, background: "#f3f4f6", color: "#374151", borderRadius: 6, padding: "2px 8px", fontWeight: 600 }}>💰 {s.cost}</span>}
              {s.dur && <span style={{ fontSize: 11, background: "#f3f4f6", color: "#374151", borderRadius: 6, padding: "2px 8px", fontWeight: 600 }}>⏱ {s.dur}</span>}
              {s.best && <span style={{ fontSize: 11, background: "#fef3c7", color: "#92400e", borderRadius: 6, padding: "2px 8px", fontWeight: 600 }}>Best: {s.best}</span>}
            </div>
            {s.note && <p style={{ fontSize: 11, color: "#6b7280", marginTop: 6, lineHeight: 1.5 }}>{s.note}</p>}
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <a href={mu(s.lat, s.lng)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", textDecoration: "none" }}>📍 Open in Maps →</a>
              {s.web && <a href={s.web} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 600, color: "#059669", textDecoration: "none" }}>🌐 Website →</a>}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
