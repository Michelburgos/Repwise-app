import { useEffect, useRef, useState } from "react";
import { IonButton, IonText } from "@ionic/react";
import { useAccelerometer } from "../hooks/useAccelerometer";
import { useHaptics } from "../hooks/useHaptics";
import styles from "./RepCounter.module.scss";

const THRESHOLD = 6; // ajústalo según qué tan fuerte sea el movimiento

const RepCounter = () => {
  const { magnitude } = useAccelerometer({ interval: 50 });
  const { impact, vibrate } = useHaptics();

  const [active, setActive] = useState(false);
  const [reps, setReps] = useState(0);
  const [feedback, setFeedback] = useState("Sujeta el teléfono o fíjalo a tu brazo");
  const lastRep = useRef(0);

  useEffect(() => {
    if (!active) return;
    const now = Date.now();

    if (magnitude > THRESHOLD && now - lastRep.current > 500) {
      const elapsed = lastRep.current ? now - lastRep.current : null;
      lastRep.current = now;
      setReps((r) => r + 1);
      impact("light");

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

  const start = () => {
    setReps(0);
    lastRep.current = 0;
    setFeedback("Empieza tu serie");
    setActive(true);
  };

  return (
    <div className={styles.box}>
      <div className={styles.reps}>{reps}</div>
      <IonText color="medium">repeticiones</IonText>
      <p className={styles.feedback}>{feedback}</p>
      {active ? (
        <IonButton color="danger" expand="block" onClick={() => setActive(false)}>
          Terminar serie
        </IonButton>
      ) : (
        <IonButton expand="block" onClick={start}>
          Iniciar serie
        </IonButton>
      )}
    </div>
  );
};

export default RepCounter;