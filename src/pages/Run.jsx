import { useEffect, useRef, useState } from "react";
import { IonContent, IonIcon, IonPage, useIonViewWillEnter } from "@ionic/react";
import { footstepsOutline, navigateOutline, play, square } from "ionicons/icons";
import { useGeolocation } from "../hooks/useGeolocation";
import { useHaptics } from "../hooks/useHaptics";
import { useRuns } from "../hooks/useRuns";
import RunMap from "../components/RunMap";
import RunCard from "../components/RunCard";
import PageHeader from "../components/PageHeader";
import Pill from "../components/Pill";
import StatGrid from "../components/StatGrid";
import SectionHeader from "../components/SectionHeader";
import EmptyState from "../components/EmptyState";
import { supabase } from "../lib/supabase";
import { formatDuration, formatPace, totalDistance } from "../helpers/helpers";
import { mensajeError } from "../helpers/errors";

function Run() {
  const { position, getCurrentLocation, startTracking, stopTracking } = useGeolocation();
  const { vibrate } = useHaptics();
  const { runs, cargar } = useRuns();

  const [path, setPath] = useState([]);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timer = useRef(null);

  useIonViewWillEnter(() => {
    cargar();
  });

  useEffect(() => {
    getCurrentLocation();
    return () => clearInterval(timer.current);
  }, []);

  useEffect(() => {
    if (position && running) {
      setPath((prev) => [...prev, [position.latitude, position.longitude]]);
    }
  }, [position]);

  const iniciar = async () => {
    setPath([]);
    setSeconds(0);
    setRunning(true);
    vibrate(200);
    timer.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    await startTracking();
  };

  const terminar = async () => {
    clearInterval(timer.current);
    await stopTracking();
    setRunning(false);

    if (path.length > 1) {
      try {
        const { error } = await supabase.from("runs").insert({
          distance_m: Math.round(totalDistance(path)),
          duration_s: seconds,
          path,
        });
        if (error) {
          alert(mensajeError(error));
        } else {
          window.dispatchEvent(new CustomEvent("repwise:runs-changed"));
          cargar();
        }
      } catch (err) {
        alert(mensajeError(err));
      }
    }
  };

  const distance = totalDistance(path);

  return (
    <IonPage>
      <IonContent>
        <div className="rw-page rw-page--tabs">
          <PageHeader
            title="Correr"
            eyebrow="GPS"
            action={
              <Pill tone={running ? "ink" : "tint"}>
                <IonIcon icon={navigateOutline} />
                {running ? "Grabando" : "GPS listo"}
              </Pill>
            }
          />

          <div className="rw-main">
            <RunMap position={position} path={path} />

            <StatGrid
              stats={[
                { label: "km", value: (distance / 1000).toFixed(2), unit: "km" },
                { label: "tiempo", value: formatDuration(seconds), unit: "tiempo" },
                { label: "ritmo", value: formatPace(distance, seconds).replace(" /km", ""), unit: "ritmo /km" },
              ]}
            />

            {running ? (
              <button
                type="button"
                className="rw-btn rw-btn--destructive rw-btn--xl"
                onClick={terminar}
              >
                <IonIcon icon={square} />
                Terminar y guardar
              </button>
            ) : (
              <button type="button" className="rw-btn rw-btn--primary rw-btn--xl" onClick={iniciar}>
                <IonIcon icon={play} />
                Iniciar carrera
              </button>
            )}

            <section className="rw-section" style={{ paddingTop: 8 }}>
              <SectionHeader title="Carreras recientes" />
              {runs.length === 0 ? (
                <EmptyState
                  icon={<IonIcon icon={footstepsOutline} />}
                  title="Aún no has corrido"
                  description="Pulsa Iniciar carrera y tu recorrido aparecerá aquí."
                />
              ) : (
                <div className="rw-stack">
                  {runs.slice(0, 5).map((run) => (
                    <RunCard key={run.id} run={run} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default Run;
