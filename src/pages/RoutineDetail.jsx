import { useEffect, useState } from "react";
import { IonContent, IonIcon, IonPage } from "@ionic/react";
import { listOutline, scanOutline } from "ionicons/icons";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { formatDate, parseExerciseLine } from "../helpers/helpers";
import PageHeader from "../components/PageHeader";
import Pill from "../components/Pill";
import EmptyState from "../components/EmptyState";
import styles from "./RoutineDetail.module.css";

function RoutineDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("routines")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setRoutine(data);
        setLoading(false);
      })
      .catch(() => {
        setRoutine(null);
        setLoading(false);
      });
  }, [id]);

  const exercises = routine?.exercises ?? [];
  const total = exercises.length;

  if (loading) {
    return (
      <IonPage>
        <IonContent>
          <div className="rw-page rw-page--tabs">
            <PageHeader title="Rutina" back="/app/routines" />
            <div className="rw-main">
              <p className="rw-muted">Cargando…</p>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!routine) {
    return (
      <IonPage>
        <IonContent>
          <div className="rw-page rw-page--tabs">
            <PageHeader title="Rutina" back="/app/routines" />
            <div className="rw-main">
              <EmptyState
                icon={<IonIcon icon={listOutline} />}
                title="Rutina no encontrada"
                description="Puede que la hayas eliminado."
              />
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent>
        <div className="rw-page rw-page--tabs">
          <PageHeader
            title={routine.name}
            eyebrow={`${total} ${total === 1 ? "ejercicio" : "ejercicios"} · ${formatDate(
              routine.created_at
            )}`}
            back="/app/routines"
          />

          <div className="rw-main">
            <ol className={styles.list}>
              {exercises.map((exercise, index) => {
                const parsed = parseExerciseLine(exercise);
                return (
                  <li key={`${exercise}-${index}`}>
                    <button
                      type="button"
                      className={styles.item}
                      onClick={() =>
                        navigate(`/app/form?name=${encodeURIComponent(parsed.name)}`)
                      }
                    >
                      <span className={styles.number}>{index + 1}</span>
                      <span className={styles.name}>{parsed.name}</span>
                      <Pill tone="purple" className={styles.sets}>
                        {parsed.sets}x{parsed.reps}
                      </Pill>
                    </button>
                  </li>
                );
              })}
            </ol>

            <button
              type="button"
              className="rw-btn rw-btn--primary rw-btn--xl"
              onClick={() =>
                navigate(`/app/form?name=${encodeURIComponent(routine.name)}`)
              }
            >
              <IonIcon icon={scanOutline} />
              Practicar técnica
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default RoutineDetail;
