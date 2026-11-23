import { useEffect, useRef, useState } from "react";
import { IonButton, IonInput, IonModal, IonText, IonToast } from "@ionic/react";
import { useAccelerometer } from "../hooks/useAccelerometer";
import { useHaptics } from "../hooks/useHaptics";
import { useStreak } from "../hooks/useStreak";
import { supabase } from "../lib/supabase";
import { formatDuration, tempoLabel } from "../helpers/helpers";
import styles from "./RepCounter.module.scss";

const THRESHOLD = 6; // ajústalo según qué tan fuerte sea el movimiento

const RepCounter = ({ exerciseName = "" }) => {
  const { magnitude } = useAccelerometer({ interval: 50 });
  const { impact, vibrate } = useHaptics();
  const { refrescar } = useStreak();

  const [name, setName] = useState(exerciseName);
  const [active, setActive] = useState(false);
  const [reps, setReps] = useState(0);
  const [feedback, setFeedback] = useState("Sujeta el teléfono o fíjalo a tu brazo");
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState({ duration: 0, avg: null });
  const [toast, setToast] = useState("");

  const lastRep = useRef(0);
  const startTime = useRef(0);
  const sum = useRef(0);
  const count = useRef(0);

  useEffect(() => {
    if (exerciseName) setName(exerciseName);
  }, [exerciseName]);

  useEffect(() => {
    if (!active) return;
    const now = Date.now();

    if (magnitude > THRESHOLD && now - lastRep.current > 500) {
      const elapsed = lastRep.current ? now - lastRep.current : null;
      lastRep.current = now;
      setReps((r) => r + 1);
      impact("light");

      if (elapsed) {
        sum.current += elapsed;
        count.current += 1;
      }

      if (elapsed && elapsed < 1000) {
        setFeedback("Muy rápido: controla el movimiento");
        vibrate(200);
      } else if (elapsed && elapsed > 4000) {
        setFeedback("Muy lento: mantén un ritmo constante");
      } else if (elapsed) {
        setFeedback("Buen ritmo");
      }
    }
  }, [magnitude]);

  const iniciar = () => {
    setReps(0);
    lastRep.current = 0;
    sum.current = 0;
    count.current = 0;
    startTime.current = Date.now();
    setFeedback("Empieza tu serie");
    setActive(true);
  };

  const terminar = () => {
    setActive(false);
    const duration = Math.round((Date.now() - startTime.current) / 1000);
    const avg = count.current ? sum.current / count.current / 1000 : null;
    setResult({ duration, avg });
    setOpen(true);
  };

  const guardar = async () => {
    const { error } = await supabase.from("workout_sessions").insert({
      name: name.trim() || "Ejercicio libre",
      reps,
      duration_s: result.duration,
      avg_tempo_s: result.avg,
      feedback: tempoLabel(result.avg),
    });
    if (error) return alert(error.message);

    const racha = await refrescar();
    setOpen(false);
    setToast(`¡Serie guardada! Racha de ${racha} ${racha === 1 ? "día" : "días"}`);
  };

  return (
    <div className={styles.box}>
      <IonInput
        className={styles.input}
        placeholder="Ejercicio (ej. Sentadilla)"
        value={name}
        onIonInput={(e) => setName(e.detail.value)}
      />

      <div className={styles.reps}>{reps}</div>
      <IonText color="medium">repeticiones</IonText>
      <p className={styles.feedback}>{feedback}</p>

      {active ? (
        <IonButton color="dark" expand="block" onClick={terminar}>
          Terminar serie
        </IonButton>
      ) : (
        <IonButton expand="block" onClick={iniciar}>
          Iniciar serie
        </IonButton>
      )}

      <IonModal
        isOpen={open}
        initialBreakpoint={0.5}
        breakpoints={[0, 0.5]}
        onDidDismiss={() => setOpen(false)}
      >
        <div className={styles.sheet}>
          <h2>Serie terminada</h2>
          <div className={styles.stats}>
            <div>
              <strong>{reps}</strong>
              <span>repeticiones</span>
            </div>
            <div>
              <strong>{formatDuration(result.duration)}</strong>
              <span>tiempo</span>
            </div>
            <div>
              <strong>{result.avg ? `${result.avg.toFixed(1)} s` : "--"}</strong>
              <span>ritmo promedio</span>
            </div>
          </div>
          <IonButton expand="block" disabled={reps === 0} onClick={guardar}>
            Guardar
          </IonButton>
        </div>
      </IonModal>

      <IonToast
        isOpen={!!toast}
        message={toast}
        duration={2500}
        onDidDismiss={() => setToast("")}
      />
    </div>
  );
};

export default RepCounter;