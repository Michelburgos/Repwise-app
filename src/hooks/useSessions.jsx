import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const useSessions = () => {
  const [sessions, setSessions] = useState([]);

  const cargar = async () => {
    const { data, error } = await supabase
      .from("workout_sessions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) console.error(error);
    else setSessions(data);
  };

  useEffect(() => {
    cargar();
  }, []);

  return { sessions, cargar };
};