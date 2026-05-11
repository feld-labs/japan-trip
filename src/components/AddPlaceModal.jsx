import { useState, useRef } from "react";

const EMOJI_OPTIONS = [
  "🍜","🍣","🍱","🍛","🍲","🍤","🥩","🍖","🥗","🍰","☕","🍺","🍶","🍵",
  "⛩️","🏯","🏛️","🌳","🗼","🏔️","🌊","🌸","🎭","🎨","🛍️","🏪","🚶",
  "🚲","🚅","🏨","🎌","📍","🌟"
];

const CITY_OPTIONS = ["Tokyo","Kyoto","Osaka","Hiroshima","Onomichi","Hakone","Other"];

// Map OSM tags → emoji
function guessEmoji(tags = {}) {
  const t = tags;
  if (t.amenity === "restaurant" || t.amenity === "fast_food") return "🍜";
  if (t.amenity === "cafe") return "☕";
  if (t.amenity === "bar" || t.amenity === "pub") return "🍺";
  if (t.amenity === "ice_cream") return "🍦";
  if (t.shop === "bakery") return "🥐";
  if (t.tourism === "museum") return "🏛️";
  if (t.tourism === "hotel" || t.tourism === "hostel") return "🏨";
  if (t.historic === "castle") return "🏯";
  if (t.religion || t.amenity === "place_of_worship") return "⛩️";
  if (t.leisure === "park" || t.leisure === "garden") return "🌳";
  if (t.shop) return "🛍️";
  if (t.natural) return "🌊";
  return "📍";
}

// Map OSM tags → cost guess
function guessCost(tags = {}) {
  if (tags.fee === "no" || tags.access === "yes") return "Free";
  if (tags.amenity === "restaurant" || tags.amenity === "fast_food") return "¥1,000–2,000";
  if (tags.amenity === "cafe") return "¥500–1,000";
  if (tags.tourism === "museum") return "¥500–1,500";
  return "";
}

export default function AddPlaceModal({ onSave, onClose }) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef();

  // Step 1: Search Nominatim
  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setResults(null);
    setSelected(null);
    setForm(null);
    setError("");
    try {
      const q = encodeURIComponent(query + " Japan");
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=6&addressdetails=1&extratags=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      if (!data.length) setError("No results found. Try a more specific name.");
      else setResults(data);
    } catch {
      setError("Search failed. Check your connection and try again.");
    }
    setSearching(false);
  }

  // Step 2: Pick a result → fetch OSM details and pre-fill form
  async function handlePick(place) {
    setSelected(place);
    setResults(null);

    const tags = place.extratags || {};
    const addr = place.address || {};
    const city = addr.city || addr.town || addr.village || addr.county || "";

    // Detect city
    const cityGuess = CITY_OPTIONS.find(c =>
      city.toLowerCase().includes(c.toLowerCase()) ||
      (place.display_name || "").toLowerCase().includes(c.toLowerCase())
    ) || "Other";

    // Try to fetch extra OSM details via Overpass if we have an osm_id
    let extraTags = { ...tags };
    if (place.osm_id && place.osm_type) {
      try {
        const osmType = place.osm_type === "node" ? "node" : place.osm_type === "way" ? "way" : "relation";
        const overpassQ = `[out:json];${osmType}(${place.osm_id});out tags;`;
        const ovRes = await fetch(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQ)}`
        );
        const ovData = await ovRes.json();
        if (ovData.elements && ovData.elements[0]) {
          extraTags = { ...extraTags, ...ovData.elements[0].tags };
        }
      } catch { /* silent — use what we have */ }
    }

    const name = extraTags.name || extraTags["name:en"] || place.display_name.split(",")[0];
    const website = extraTags.website || extraTags["contact:website"] || extraTags.url || "";
    const hours = extraTags.opening_hours || "";
    const phone = extraTags.phone || extraTags["contact:phone"] || "";
    const emoji = guessEmoji(extraTags);
    const cost = guessCost(extraTags);

    // Build short address
    const addrParts = [addr.road, addr.suburb, addr.city || addr.town].filter(Boolean);
    const shortAddr = addrParts.join(", ");

    setForm({
      n: name,
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
      ic: emoji,
      city: cityGuess,
      addr: shortAddr,
      cost,
      dur: "",
      best: "",
      note: hours ? `Hours: ${hours}` : "",
      web: website,
      phone,
    });
  }

  function updateForm(key, val) {
    setForm(f => ({ ...f, [key]: val }));
  }

  // Step 3: Save
  function handleSave() {
    if (!form.n.trim()) { setError("Name is required."); return; }
    if (!form.lat || !form.lng) { setError("Location coordinates are missing."); return; }
    setSaving(true);
    const newPlace = {
      id: "u_" + Date.now(),
      n: form.n.trim(),
      dt: null,
      t: "",
      dur: form.dur,
      cost: form.cost,
      tr: "",
      addr: form.addr,
      note: form.note,
      lat: form.lat,
      lng: form.lng,
      ic: form.ic,
      s: "unsched",
      city: form.city,
      best: form.best,
      web: form.web,
    };
    onSave(newPlace);
    setSaving(false);
    onClose();
  }

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.headerTitle}>Add a Place</span>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Step 1: Search */}
        {!form && (
          <>
            <form onSubmit={handleSearch} style={styles.searchRow}>
              <input
                ref={inputRef}
                style={styles.searchInput}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for a place in Japan…"
                autoFocus
                aria-label="Search for a place"
              />
              <button style={styles.searchBtn} type="submit" disabled={searching}>
                {searching ? "…" : "Search"}
              </button>
            </form>

            {error && <p style={styles.error}>{error}</p>}

            {results && (
              <ul style={styles.resultList}>
                {results.map(r => (
                  <li key={r.place_id} style={styles.resultItem} onClick={() => handlePick(r)}>
                    <span style={styles.resultName}>{r.display_name.split(",")[0]}</span>
                    <span style={styles.resultSub}>{r.display_name.split(",").slice(1, 3).join(",").trim()}</span>
                  </li>
                ))}
              </ul>
            )}

            {searching && (
              <div style={styles.loading}>Looking up places…</div>
            )}
          </>
        )}

        {/* Step 2: Edit & confirm form */}
        {form && (
          <div style={styles.formScroll}>
            {error && <p style={styles.error}>{error}</p>}

            {/* Emoji picker */}
            <label style={styles.label}>Category Icon</label>
            <div style={styles.emojiGrid}>
              {EMOJI_OPTIONS.map(e => (
                <button
                  key={e}
                  style={{ ...styles.emojiBtn, ...(form.ic === e ? styles.emojiBtnActive : {}) }}
                  onClick={() => updateForm("ic", e)}
                  aria-label={e}
                  type="button"
                >
                  {e}
                </button>
              ))}
            </div>

            <label style={styles.label}>Name</label>
            <input style={styles.input} value={form.n} onChange={e => updateForm("n", e.target.value)} />

            <div style={styles.row2}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>City</label>
                <select style={styles.select} value={form.city} onChange={e => updateForm("city", e.target.value)}>
                  {CITY_OPTIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Cost</label>
                <input style={styles.input} value={form.cost} onChange={e => updateForm("cost", e.target.value)} placeholder="e.g. ¥500 or Free" />
              </div>
            </div>

            <div style={styles.row2}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Duration</label>
                <input style={styles.input} value={form.dur} onChange={e => updateForm("dur", e.target.value)} placeholder="e.g. 1 hr" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Best Time / Day</label>
                <input style={styles.input} value={form.best} onChange={e => updateForm("best", e.target.value)} placeholder="e.g. 5/15, Evening" />
              </div>
            </div>

            <label style={styles.label}>Address</label>
            <input style={styles.input} value={form.addr} onChange={e => updateForm("addr", e.target.value)} />

            <label style={styles.label}>Notes / Hours</label>
            <textarea style={styles.textarea} value={form.note} onChange={e => updateForm("note", e.target.value)} rows={2} />

            <label style={styles.label}>Website</label>
            <input style={styles.input} value={form.web} onChange={e => updateForm("web", e.target.value)} placeholder="https://…" />

            <div style={styles.coords}>
              📍 {form.lat.toFixed(5)}, {form.lng.toFixed(5)}
              <button style={styles.backBtn} onClick={() => { setForm(null); setSelected(null); }} type="button">← Change</button>
            </div>

            <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save to Backlog"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
    zIndex: 9999, display: "flex", alignItems: "flex-end", justifyContent: "center",
  },
  modal: {
    background: "#1a1a2e", borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 480,
    maxHeight: "90vh", display: "flex", flexDirection: "column",
    boxShadow: "0 -4px 40px rgba(0,0,0,0.5)",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  headerTitle: { color: "#fff", fontWeight: 700, fontSize: 17 },
  closeBtn: {
    background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
    borderRadius: "50%", width: 30, height: 30, cursor: "pointer", fontSize: 14,
  },
  searchRow: { display: "flex", gap: 8, padding: "14px 16px 8px" },
  searchInput: {
    flex: 1, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 15, outline: "none",
  },
  searchBtn: {
    background: "#f59e0b", border: "none", borderRadius: 10, padding: "10px 16px",
    color: "#000", fontWeight: 700, fontSize: 14, cursor: "pointer",
  },
  error: { color: "#f87171", fontSize: 13, margin: "4px 16px 8px", textAlign: "center" },
  loading: { color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "20px", fontSize: 14 },
  resultList: { listStyle: "none", margin: 0, padding: "0 8px 12px", overflowY: "auto", maxHeight: 260 },
  resultItem: {
    padding: "12px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 4,
    background: "rgba(255,255,255,0.06)", transition: "background 0.15s",
    display: "flex", flexDirection: "column", gap: 2,
  },
  resultName: { color: "#fff", fontWeight: 600, fontSize: 14 },
  resultSub: { color: "rgba(255,255,255,0.45)", fontSize: 12 },
  formScroll: { overflowY: "auto", padding: "12px 16px 24px", flex: 1 },
  label: { display: "block", color: "rgba(255,255,255,0.55)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4, marginTop: 12 },
  input: {
    width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8, padding: "9px 12px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box",
  },
  textarea: {
    width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8, padding: "9px 12px", color: "#fff", fontSize: 14, outline: "none",
    resize: "vertical", boxSizing: "border-box", fontFamily: "inherit",
  },
  select: {
    width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8, padding: "9px 12px", color: "#fff", fontSize: 14, outline: "none",
  },
  row2: { display: "flex", gap: 10 },
  emojiGrid: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 },
  emojiBtn: {
    background: "rgba(255,255,255,0.07)", border: "1.5px solid transparent",
    borderRadius: 8, width: 36, height: 36, fontSize: 18, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  emojiBtnActive: { border: "1.5px solid #f59e0b", background: "rgba(245,158,11,0.18)" },
  coords: {
    color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 14,
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  backBtn: {
    background: "none", border: "none", color: "#f59e0b", fontSize: 12,
    cursor: "pointer", padding: 0, fontWeight: 600,
  },
  saveBtn: {
    width: "100%", marginTop: 18, background: "#f59e0b", border: "none",
    borderRadius: 12, padding: "14px", color: "#000", fontWeight: 700,
    fontSize: 16, cursor: "pointer", letterSpacing: "0.02em",
  },
};
