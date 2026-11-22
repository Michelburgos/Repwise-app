import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const useRoutines = () => {
  const [routines, setRoutines] = useState([]);

  const cargar = async () => {
    const { data, error } = await supabase
      .from("routines")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else setRoutines(data);
  };

  const crear = (name, exercises) =>
    supabase.from("routines").insert({ name, exercises });

  const borrar = (id) => supabase.from("routines").delete().eq("id", id);

  useEffect(() => {
    cargar();
  }, []);

  useEffect(() => {
    const canal = supabase
      .channel("cambios-routines")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "routines" },
        (payload) => {
          if (payload.eventType === "INSERT")
            setRoutines((r) => [payload.new, ...r]);
          if (payload.eventType === "UPDATE")
            setRoutines((r) =>
              r.map((x) => (x.id === payload.new.id ? payload.new : x))
            );
          if (payload.eventType === "DELETE")
            setRoutines((r) => r.filter((x) => x.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => supabase.removeChannel(canal);
  }, []);

  return { routines, crear, borrar };
};