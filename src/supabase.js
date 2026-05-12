import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://uynonzgxhcyfxtymrzmz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5bm9uemd4aGN5Znh0eW1yem16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNTA3MjIsImV4cCI6MjA5MzkyNjcyMn0.3PvWqO2_KagMECQe3X8dcy-_JxdL5uun_cXdyBJFlOI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
