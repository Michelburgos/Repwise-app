import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { mensajeError } from "../helpers/errors";

export const useSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");

  const cargar = async () => {
    try {
      const { data, error: loadError } = await supabase
        .from("workout_sessions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (loadError) {
        console.error(loadError);
        setError(mensajeError(loadError));
        return;
      }

      setError("");
      setSessions(data ?? []);
    } catch (err) {
      console.error(err);
      setError(mensajeError(err));
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  useEffect(() => {
    const recargar = () => cargar();
    window.addEventListener("repwise:sessions-changed", recargar);
    return () => window.removeEventListener("repwise:sessions-changed", recargar);
  }, []);

  return { sessions, cargar, error };
};
