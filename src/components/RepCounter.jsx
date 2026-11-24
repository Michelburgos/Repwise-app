import { useEffect, useRef, useState } from "react";
import { IonIcon } from "@ionic/react";
import {
  alertCircle,
  checkmarkCircle,
  flame,
  flashOutline,
  hourglassOutline,
  play,
  pulseOutline,
  scanOutline,
  square,
} from "ionicons/icons";
import { useAccelerometer } from "../hooks/useAccelerometer";
import { useHaptics } from "../hooks/useHaptics";
import { useStreak } from "../hooks/useStreak";
import { supabase } from "../lib/supabase";
import { formatDuration, tempoLabel } from "../helpers/helpers";
import { mensajeError } from "../helpers/errors";
import IconTile from "./IconTile";
import StatGrid from "./StatGrid";
import styles from "./RepCounter.module.css";

const THRESHOLD = 6; // ajústalo según qué tan fuerte sea el movimiento

const RepCounter = ({ exerciseName = "" }) => {
  const { magnitude } = useAccelerometer({ interval: 50 });
  const { impact, vibrate } = useHaptics();
  const { refrescar } = useStreak();

  const [name, setName] = useState(exerciseName);
  const [active, setActive] = useState(false);
  const [reps, setReps] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [feedback, setFeedback] = useState("Sujeta el teléfono o fíjalo a tu brazo");
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState({ reps: 0, duration: 0, avg: null });
  const [toast, setToast] = useState("");
  const [saveState, setSaveState] = useState("idle");
  const [saveError, setSaveError] = useState("");

  const lastRep = useRef(0);
  const startTime = useRef(0);
  const sum = useRef(0);
  const count = useRef(0);

  useEffect(() => {
    if (exerciseName) setName(exerciseName);
  }, [exerciseName]);

  // Cronómetro en vivo
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setElapsed((Date.now() - startTime.current) / 1000);
    }, 250);
    return () => clearInterval(interval);
  }, [active]);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!active) return;
    const now = Date.now();

    if (magnitude > THRESHOLD && now - lastRep.current > 500) {
      const interval = lastRep.current ? now - lastRep.current : null;
      lastRep.current = now;
      setReps((r) => r + 1);
      impact("light");

      if (interval) {
        sum.current += interval;
        count.current += 1;
      }

      if (interval && interval < 1000) {
        setFeedback("Muy rápido: controla el movimiento");
        vibrate(200);
      } else if (interval && interval > 4000) {
        setFeedback("Muy lento: mantén un ritmo constante");
      } else if (interval) {
        setFeedback("Buen ritmo");
      }
    }
  }, [magnitude]);

  const iniciar = () => {
    setReps(0);
    setElapsed(0);
    lastRep.current = 0;
    sum.current = 0;
    count.current = 0;
    startTime.current = Date.now();
    setFeedback("Empieza tu serie");
    setActive(true);
  };

  const persistir = async (snapshot) => {
    setSaveState("saving");
    setSaveError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setSaveState("error");
        setSaveError("No hay una sesión activa. Vuelve a iniciar sesión.");
        return;
      }

      const { error } = await supabase
        .from("workout_sessions")
        .insert({
          user_id: user.id,
          name: name.trim() || "Ejercicio libre",
          reps: snapshot.reps,
          duration_s: snapshot.duration,
          avg_tempo_s: snapshot.avg,
          feedback: tempoLabel(snapshot.avg),
        })
        .select()
        .single();

      if (error) {
        setSaveState("error");
        setSaveError(mensajeError(error));
        return;
      }

      // Avisa a la lista de entrenamientos y a la racha aunque sigan montadas.
      window.dispatchEvent(new CustomEvent("repwise:sessions-changed"));

      const racha = await refrescar();
      setSaveState("saved");
      setToast(`¡Serie guardada! Racha de ${racha} ${racha === 1 ? "día" : "días"}`);
    } catch (err) {
      setSaveState("error");
      setSaveError(mensajeError(err));
    }
  };

  const terminar = async () => {
    setActive(false);

    if (reps === 0) {
      setOpen(false);
      setToast("No se detectaron repeticiones. Intenta de nuevo.");
      return;
    }

    const duration = Math.round((Date.now() - startTime.current) / 1000);
    const avg = count.current ? sum.current / count.current / 1000 : null;
    const snapshot = { reps, duration, avg };

    setElapsed(duration);
    setResult(snapshot);
    setOpen(true);
    setActive(false);
    await persistir(snapshot);
  };

  const cerrar = () => {
    setOpen(false);
    setReps(0);
    setElapsed(0);
    setResult({ reps: 0, duration: 0, avg: null });
    setSaveState("idle");
    setSaveError("");
  };

  const secondsPerRep = reps > 0 ? (elapsed / reps).toFixed(1) : null;

  let view = {
    title: active ? "Analizando…" : "Listo para empezar",
    hint: active ? feedback : "Sujeta el teléfono o fíjalo a tu brazo y pulsa Iniciar serie.",
    tone: "tint",
    icon: scanOutline,
    good: false,
  };

  if (feedback.startsWith("Muy rápido")) {
    view = {
      title: "Muy rápido",
      hint: "Baja más despacio y controla el peso.",
      tone: "ink",
      icon: flashOutline,
      good: false,
    };
  } else if (feedback.startsWith("Muy lento")) {
    view = {
      title: "Muy lento",
      hint: "Sube con más energía, sin pausas largas.",
      tone: "ink",
      icon: hourglassOutline,
      good: false,
    };
  } else if (feedback === "Buen ritmo") {
    view = {
      title: "Buen ritmo",
      hint: "Mantén este tempo en cada repetición.",
      tone: "purple",
      icon: checkmarkCircle,
      good: true,
    };
  } else if (feedback === "Empieza tu serie") {
    view = {
      title: "En marcha",
      hint: "Empieza tu serie cuando estés listo.",
      tone: "tint",
      icon: pulseOutline,
      good: false,
    };
  }

  return (
    <div className={styles.box}>
      <label className="rw-field">
        <span className="rw-label">Ejercicio</span>
        <input
          className="rw-input"
          placeholder="Ejercicio (ej. Sentadilla)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <div className={styles.ringWrap}>
        <div className={`${styles.ring} ${active ? "rw-animate-pulse" : ""}`}>
          <div className={styles.ringInner}>
            <p key={reps} className={`${styles.reps} rw-animate-rep`}>
              {reps}
            </p>
            <p className={styles.repLabel}>repeticiones</p>
          </div>
        </div>

        <div className={styles.pills}>
          <span className={styles.pill}>{formatDuration(elapsed)}</span>
          <span className={styles.pill}>
            {secondsPerRep ? `${secondsPerRep} s/rep` : "-- s/rep"}
          </span>
        </div>
      </div>

      <div
        aria-live="polite"
        className={`${styles.feedback} ${view.good ? styles.feedbackGood : ""}`}
      >
        <IconTile tone={view.tone} size="lg">
          <IonIcon icon={view.icon} />
        </IconTile>
        <div>
          <p className={styles.feedbackTitle}>{view.title}</p>
          <p className={styles.feedbackHint}>{view.hint}</p>
        </div>
      </div>

      {active ? (
        <button type="button" className="rw-btn rw-btn--destructive rw-btn--xl" onClick={terminar}>
          <IonIcon icon={square} />
          Terminar serie
        </button>
      ) : (
        <button type="button" className="rw-btn rw-btn--primary rw-btn--xl" onClick={iniciar}>
          <IonIcon icon={play} />
          Iniciar serie
        </button>
      )}

      {open && (
        <div
          className="rw-overlay"
          onClick={() => saveState !== "saving" && cerrar()}
        >
          <div className="rw-sheet" onClick={(e) => e.stopPropagation()}>
            <div
              className={`${styles.badge} ${
                saveState === "error" ? styles.badgeError : ""
              }`}
            >
              <IonIcon icon={saveState === "error" ? alertCircle : flame} />
              <span>
                {saveState === "saved"
                  ? "¡Racha +1!"
                  : saveState === "error"
                    ? "Error al guardar"
                    : "Guardando serie"}
              </span>
            </div>

            <h2 className={styles.sheetTitle}>
              {saveState === "saved"
                ? "Serie guardada"
                : saveState === "error"
                  ? "No se pudo guardar"
                  : "Serie completada"}
            </h2>
            <p className={styles.sheetSub}>
              {name.trim() || "Ejercicio libre"} · {result.reps} repeticiones
            </p>

            <div className={styles.stats}>
              <StatGrid
                stats={[
                  { label: "reps", value: String(result.reps), unit: "repeticiones" },
                  { label: "tiempo", value: formatDuration(result.duration), unit: "tiempo" },
                  {
                    label: "ritmo",
                    value: result.avg ? `${result.avg.toFixed(1)} s` : "--",
                    unit: "ritmo por rep",
                  },
                ]}
              />
            </div>

            {saveError && <p className={styles.error}>{saveError}</p>}

            {saveState === "saved" && (
              <button
                type="button"
                className={`${styles.save} rw-btn rw-btn--primary rw-btn--xl`}
                onClick={cerrar}
              >
                Listo
              </button>
            )}

            {saveState === "error" && (
              <div className={styles.actions}>
                <button
                  type="button"
                  className="rw-btn rw-btn--primary"
                  onClick={() => persistir(result)}
                >
                  Reintentar
                </button>
                <button
                  type="button"
                  className="rw-btn rw-btn--outline"
                  onClick={cerrar}
                >
                  Cerrar
                </button>
              </div>
            )}

            {saveState === "saving" && (
              <button
                type="button"
                className={`${styles.save} rw-btn rw-btn--primary rw-btn--xl`}
                disabled
              >
                Guardando…
              </button>
            )}
          </div>
        </div>
      )}

      {toast && <div className="rw-toast">{toast}</div>}
    </div>
  );
};

export default RepCounter;
