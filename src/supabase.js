import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://uynonzgxhcyfxtymrzmz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_zNPOT4_jhkPXozipd4NGNA_YQLGFtqQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
