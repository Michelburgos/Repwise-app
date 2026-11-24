import { createClient } from "@supabase/supabase-js";

// Acepta los nombres de Vite (VITE_*) y los de Next (NEXT_PUBLIC_*).
const url =
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;

const key =
  import.meta.env.VITE_SUPABASE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error(
    "Faltan las variables de Supabase. Crea un archivo .env en la raíz del proyecto con " +
      "NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (o VITE_SUPABASE_URL y VITE_SUPABASE_KEY)."
  );
}

export const supabase = createClient(url, key);
