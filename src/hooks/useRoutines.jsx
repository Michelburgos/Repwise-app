import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { mensajeError } from "../helpers/errors";

export const useRoutines = () => {
  const [routines, setRoutines] = useState([]);
  const [error, setError] = useState("");

  const cargar = async () => {
    try {
      const { data, error: loadError } = await supabase
        .from("routines")
        .select("*")
        .order("created_at", { ascending: false });

      if (loadError) {
        console.error(loadError);
        setError(mensajeError(loadError));
        return;
      }

      setError("");
      setRoutines(data ?? []);
    } catch (err) {
      console.error(err);
      setError(mensajeError(err));
    }
  };

  const crear = async (name, exercises) => {
    try {
      const { data, error: insertError } = await supabase
        .from("routines")
        .insert({ name, exercises })
        .select()
        .single();

      if (insertError) {
        console.error(insertError);
        const message = mensajeError(insertError);
        setError(message);
        return { error: { message } };
      }

      setError("");
      setRoutines((prev) => [data, ...prev.filter((r) => r.id !== data.id)]);
      return { data, error: null };
    } catch (err) {
      console.error(err);
      const message = mensajeError(err);
      setError(message);
      return { error: { message } };
    }
  };

  const borrar = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from("routines")
        .delete()
        .eq("id", id);

      if (deleteError) {
        console.error(deleteError);
        setError(mensajeError(deleteError));
        return { error: deleteError };
      }

      setError("");
      setRoutines((prev) => prev.filter((r) => r.id !== id));
      return { error: null };
    } catch (err) {
      console.error(err);
      setError(mensajeError(err));
      return { error: { message: mensajeError(err) } };
    }
  };

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
          if (payload.eventType === "INSERT") {
            setRoutines((prev) =>
              prev.some((r) => r.id === payload.new.id)
                ? prev
                : [payload.new, ...prev]
            );
          }
          if (payload.eventType === "UPDATE") {
            setRoutines((prev) =>
              prev.map((x) => (x.id === payload.new.id ? payload.new : x))
            );
          }
          if (payload.eventType === "DELETE") {
            setRoutines((prev) => prev.filter((x) => x.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(canal);
  }, []);

  return { routines, crear, borrar, error, cargar };
};
