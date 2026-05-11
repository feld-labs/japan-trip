import { useState, useEffect } from "react";
import { DAYS, TH, ACTIVITIES } from "./data";
import { supabase } from "./supabase";
import MapView from "./components/MapView";
import TopBar from "./components/TopBar";
import BottomSheet from "./components/BottomSheet";
import MenuOverlay from "./components/MenuOverlay";
import AddPlaceModal from "./components/AddPlaceModal";
import OptimizeDayModal from "./components/OptimizeDayModal";
import "./App.css";

export default function App() {
  const [selDay, setSelDay] = useState("5/6");
  const [si, setSi] = useState(0);
  const [listOpen, setListOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mv, setMv] = useState(null);
  const [mapMode, setMapMode] = useState("today");
  const [addOpen, setAddOpen] = useState(false);
  const [optimizeOpen, setOptimizeOpen] = useState(false);
  const [dbPlaces, setDbPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);

  // Load ALL places from Supabase on mount — no localStorage ever
  useEffect(() => {
    fetchAllPlaces();
  }, []);

  async function fetchAllPlaces() {
    setLoadingPlaces(true);
    const { data, error } = await supabase
      .from("places")
      .select("*")
      .order("sort_order", { ascending: true, nullsFirst: false });
    if (!error && data) setDbPlaces(data);
    setLoadingPlaces(false);
  }

  // Merge static data.js activities with Supabase places
  // DB places take precedence (they may override static ones via same id)
  const staticIds = new Set(ACTIVITIES.map((a) => a.id));
  const dbOnlyPlaces = dbPlaces.filter((p) => !staticIds.has(p.id));
  const allActivities = [...ACTIVITIES, ...dbOnlyPlaces];

  const day = DAYS.find((d) => d.key === selDay) || DAYS[0];
  const th = TH[day.th];

  // Scheduled stops for the selected day — include DB stops assigned to this date
  const stops = allActivities.filter((a) => a.dt === selDay);

  // Unscheduled = no date assigned, status = "unsched" or no dt
  const unsched = allActivities.filter((a) => a.s === "unsched" || (!a.dt && a.s !== "sched"));

  const pickDay = (k) => {
    setSelDay(k);
    setSi(0);
    setListOpen(false);
    setMenuOpen(false);
    setMapMode("today");
  };
  const onMarkerClick = (i) => { setSi(i); setListOpen(false); };
  const onMenuView = (k) => { setMv(k); };
  const closeMenu = () => { setMv(null); setMenuOpen(false); };

  // Save a new place — always to Supabase, never localStorage
  async function handleAddPlace(newPlace) {
    const { data, error } = await supabase
      .from("places")
      .insert([newPlace])
      .select()
      .single();
    if (error) {
      console.error("Failed to save place:", error.message);
      alert("Failed to save place to database: " + error.message);
      return;
    }
    setDbPlaces((prev) => [...prev, data]);
    setMapMode("unsched");
  }

  // After route optimization saves to DB, reload and jump to that day
  async function handleOptimizeSaved(date) {
    await fetchAllPlaces();
    setSelDay(date);
    setSi(0);
    setMapMode("today");
  }

  if (mv) {
    return <MenuOverlay view={mv} onClose={closeMenu} activities={allActivities} />;
  }

  return (
    <div className="app">
      <TopBar
        selDay={selDay}
        onPickDay={pickDay}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onMenuView={onMenuView}
        unschedCount={unsched.length}
        onAddPlace={() => setAddOpen(true)}
        onOptimize={() => setOptimizeOpen(true)}
      />
      <MapView
        stops={stops}
        unschedStops={unsched}
        activeIdx={si}
        color={th.c}
        listOpen={listOpen}
        onMarkerClick={onMarkerClick}
        mapMode={mapMode}
        setMapMode={setMapMode}
      />
      <BottomSheet
        stops={stops}
        si={si}
        setSi={setSi}
        listOpen={listOpen}
        setListOpen={setListOpen}
        color={th.c}
        onBrowseBacklog={() => { setMenuOpen(true); setMv("backlog"); }}
      />

      {loadingPlaces && (
        <div style={{
          position: "fixed", bottom: 120, left: "50%", transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.7)", color: "#fff", borderRadius: 20,
          padding: "6px 16px", fontSize: 12, zIndex: 5000, pointerEvents: "none"
        }}>
          Loading saved places…
        </div>
      )}

      {addOpen && (
        <AddPlaceModal
          onSave={handleAddPlace}
          onClose={() => setAddOpen(false)}
        />
      )}

      {optimizeOpen && (
        <OptimizeDayModal
          allPlaces={allActivities}
          onClose={() => setOptimizeOpen(false)}
          onSaved={handleOptimizeSaved}
        />
      )}
    </div>
  );
}
