import { useState, useContext } from "react";
import { IonContent, IonIcon, IonPage, useIonViewWillEnter } from "@ionic/react";
import {
  add,
  barbellOutline,
  listOutline,
  logOutOutline,
  shieldCheckmarkOutline,
} from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { useRoutines } from "../hooks/useRoutines";
import { useSessions } from "../hooks/useSessions";
import { useStreak } from "../hooks/useStreak";
import { AuthContext } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";
import RoutineCard from "../components/RoutineCard";
import StreakCard from "../components/StreakCard";
import HistoryCard from "../components/HistoryCard";
import SectionHeader from "../components/SectionHeader";
import EmptyState from "../components/EmptyState";
import styles from "./Routines.module.css";

function Routines() {
  const { routines, crear, borrar, error: routinesError } = useRoutines();
  const { sessions, cargar, error: sessionsError } = useSessions();
  const { current, best, week, refrescar, error: streakError } = useStreak();
  const { user, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [formError, setFormError] = useState("");

  const errorCarga = routinesError || sessionsError || streakError;

  // Al volver a esta pestaña, actualiza historial y racha
  useIonViewWillEnter(() => {
    cargar();
    refrescar();
  });

  const guardar = async (event) => {
    event.preventDefault();
    const exercises = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (!name.trim() || exercises.length === 0) {
      setFormError("Ponle un nombre y al menos un ejercicio a la rutina.");
      return;
    }

    setFormError("");
    const { error } = await crear(name.trim(), exercises);
    if (error) {
      setFormError(`No se pudo guardar la rutina: ${error.message}`);
      return;
    }

    setName("");
    setText("");
  };

  const rawName = user?.email?.split("@")[0] ?? "";
  const nombre = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : "";

  return (
    <IonPage>
      <IonContent>
        <div className="rw-page rw-page--tabs">
          <PageHeader
            title="Mis rutinas"
            eyebrow={nombre ? `Hola, ${nombre}` : "Hola"}
            action={
              <div className={styles.actions}>
                {isAdmin && (
                  <button
                    type="button"
                    className="rw-btn rw-btn--outline rw-btn--icon rw-btn--round"
                    aria-label="Panel de administración"
                    title="Panel de administración"
                    onClick={() => navigate("/admin")}
                  >
                    <IonIcon icon={shieldCheckmarkOutline} />
                  </button>
                )}
                <button
                  type="button"
                  className="rw-btn rw-btn--outline rw-btn--sm rw-btn--round"
                  onClick={logout}
                >
                  <IonIcon icon={logOutOutline} />
                  Salir
                </button>
              </div>
            }
          />

          <div className="rw-main">
            <StreakCard current={current} best={best} week={week} />

            {errorCarga && (
              <div className={styles.alert}>
                No se pudieron cargar los datos: {errorCarga}
              </div>
            )}

            <form className={`${styles.form} rw-panel`} onSubmit={guardar}>
              <div className={styles.formTitle}>
                <span className={styles.plus}>
                  <IonIcon icon={add} />
                </span>
                <h2>Nueva rutina</h2>
              </div>

              <input
                className="rw-input"
                aria-label="Nombre de la rutina"
                placeholder="Nombre, p. ej. Pierna fuerte"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <textarea
                className="rw-textarea"
                aria-label="Ejercicios"
                placeholder={"Un ejercicio por línea\nSentadilla 4x10"}
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              {formError && <p className={styles.error}>{formError}</p>}

              <button type="submit" className="rw-btn rw-btn--primary rw-btn--xl">
                Guardar rutina
              </button>
            </form>

            <section className="rw-section">
              <SectionHeader title={`Rutinas (${routines.length})`} />
              {routines.length === 0 ? (
                <EmptyState
                  icon={<IonIcon icon={listOutline} />}
                  title="Aún no tienes rutinas"
                  description="Crea tu primera rutina arriba y empieza a sumar días de racha."
                />
              ) : (
                <div className="rw-stack">
                  {routines.map((routine) => (
                    <RoutineCard key={routine.id} routine={routine} onDelete={borrar} />
                  ))}
                </div>
              )}
            </section>

            <section className="rw-section">
              <SectionHeader title="Entrenamientos anteriores" />
              {sessions.length === 0 ? (
                <EmptyState
                  icon={<IonIcon icon={barbellOutline} />}
                  title="Sin entrenamientos"
                  description="Termina una serie en modo técnica y aparecerá aquí."
                />
              ) : (
                <div className="rw-stack">
                  {sessions.slice(0, 5).map((session) => (
                    <HistoryCard key={session.id} session={session} />
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

export default Routines;
