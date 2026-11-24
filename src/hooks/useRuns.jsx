import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { mensajeError } from "../helpers/errors";

export const useRuns = () => {
  const [runs, setRuns] = useState([]);
  const [error, setError] = useState("");

  const cargar = async () => {
    try {
      const { data, error: loadError } = await supabase
        .from("runs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (loadError) {
        console.error(loadError);
        setError(mensajeError(loadError));
        return;
      }

      setError("");
      setRuns(data ?? []);
    } catch (err) {
      console.error(err);
      setError(mensajeError(err));
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  return { runs, cargar, error };
};
