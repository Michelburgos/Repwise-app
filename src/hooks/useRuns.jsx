import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const useRuns = () => {
  const [runs, setRuns] = useState([]);

  const cargar = async () => {
    const { data, error } = await supabase
      .from("runs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) console.error(error);
    else setRuns(data);
  };

  useEffect(() => {
    cargar();
  }, []);

  return { runs, cargar };
};