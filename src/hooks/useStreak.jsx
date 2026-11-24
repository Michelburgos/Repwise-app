import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { dayKey } from "../helpers/helpers";
import { mensajeError } from "../helpers/errors";

const DAY = 86400000;
const LABELS = ["L", "M", "X", "J", "V", "S", "D"];
const toTime = (key) => new Date(key + "T00:00:00").getTime();

const calcular = (rows) => {
  const set = new Set(rows.map((r) => dayKey(r.created_at)));
  const today = dayKey(new Date());

  // Racha actual: si hoy aún no entrenas, la racha sigue viva desde ayer
  let current = 0;
  let cursor = toTime(today);
  if (!set.has(today)) cursor -= DAY;
  while (set.has(dayKey(cursor))) {
    current++;
    cursor -= DAY;
  }

  // Mejor racha
  let best = 0;
  let run = 0;
  let prev = null;
  [...set].sort().forEach((k) => {
    const t = toTime(k);
    run = prev !== null && Math.round((t - prev) / DAY) === 1 ? run + 1 : 1;
    prev = t;
    best = Math.max(best, run);
  });

  // Semana actual (lunes a domingo)
  const now = new Date();
  const lunes = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
  const week = LABELS.map((label, i) => {
    const d = new Date(lunes.getFullYear(), lunes.getMonth(), lunes.getDate() + i);
    const key = dayKey(d);
    return { label, done: set.has(key), today: key === today };
  });

  return { current, best, week };
};

export const useStreak = () => {
  const [streak, setStreak] = useState({ current: 0, best: 0, week: [] });
  const [error, setError] = useState("");

  const refrescar = async () => {
    try {
      const [runs, sessions] = await Promise.all([
        supabase.from("runs").select("created_at"),
        supabase.from("workout_sessions").select("created_at"),
      ]);

      const loadError = runs.error || sessions.error;
      if (loadError) {
        console.error(loadError);
        setError(mensajeError(loadError));
        return 0;
      }

      setError("");
      const result = calcular([...(runs.data ?? []), ...(sessions.data ?? [])]);
      setStreak(result);
      return result.current;
    } catch (err) {
      console.error(err);
      setError(mensajeError(err));
      return 0;
    }
  };

  useEffect(() => {
    refrescar();
  }, []);

  useEffect(() => {
    const recargar = () => refrescar();
    window.addEventListener("repwise:sessions-changed", recargar);
    window.addEventListener("repwise:runs-changed", recargar);
    return () => {
      window.removeEventListener("repwise:sessions-changed", recargar);
      window.removeEventListener("repwise:runs-changed", recargar);
    };
  }, []);

  return { ...streak, refrescar, error };
};