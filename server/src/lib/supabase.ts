import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL não configurada no .env");
}

if (!supabaseAnonKey) {
  throw new Error("SUPABASE_ANON_KEY não configurada no .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);