import { useEffect, useState } from "react";
import { IonContent, IonIcon, IonPage } from "@ionic/react";
import { barbellOutline, repeat } from "ionicons/icons";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { formatDate, tempoLabel } from "../helpers/helpers";
import PageHeader from "../components/PageHeader";
import StatGrid from "../components/StatGrid";
import Pill from "../components/Pill";
import EmptyState from "../components/EmptyState";
import styles from "./HistoryDetail.module.css";

function HistoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("workout_sessions")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setSession(data);
        setLoading(false);
      })
      .catch(() => {
        setSession(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <IonPage>
        <IonContent>
          <div className="rw-page rw-page--tabs">
            <PageHeader title="Entrenamiento" back="/app/routines" />
            <div className="rw-main">
              <p className="rw-muted">Cargando…</p>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!session) {
    return (
      <IonPage>
        <IonContent>
          <div className="rw-page rw-page--tabs">
            <PageHeader title="Entrenamiento" back="/app/routines" />
            <div className="rw-main">
              <EmptyState
                icon={<IonIcon icon={barbellOutline} />}
                title="No encontrado"
                description="Este entrenamiento ya no existe."
              />
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const minutes = Math.max(1, Math.round(session.duration_s / 60));
  const rating = tempoLabel(session.avg_tempo_s);
  const good = rating === "Buen ritmo";

  return (
    <IonPage>
      <IonContent>
        <div className="rw-page rw-page--tabs">
          <PageHeader
            title={session.name ?? "Entrenamiento"}
            eyebrow={formatDate(session.created_at)}
            back="/app/routines"
          />

          <div className="rw-main">
            <StatGrid
              stats={[
                { label: "reps", value: String(session.reps), unit: "repeticiones" },
                { label: "min", value: String(minutes), unit: "minutos" },
                {
                  label: "ritmo",
                  value: session.avg_tempo_s ? `${Number(session.avg_tempo_s).toFixed(1)} s` : "--",
                  unit: "por repetición",
                },
              ]}
            />

            <div className="rw-panel">
              <div className={styles.row}>
                <span className={styles.label}>Fecha</span>
                <span className={styles.value}>{formatDate(session.created_at)}</span>
              </div>
              <hr className="rw-divider" />
              <div className={styles.row}>
                <span className={styles.label}>Ritmo promedio</span>
                <span className={styles.value}>
                  {session.avg_tempo_s
                    ? `${Number(session.avg_tempo_s).toFixed(1)} s por repetición`
                    : "--"}
                </span>
              </div>
              <hr className="rw-divider" />
              <div className={styles.row}>
                <span className={styles.label}>Valoración del ritmo</span>
                <Pill tone={good ? "purple" : "outline"}>{rating}</Pill>
              </div>
              {session.feedback && (
                <>
                  <hr className="rw-divider" />
                  <div className={styles.row}>
                    <span className={styles.label}>Feedback</span>
                    <span className={styles.value}>{session.feedback}</span>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              className="rw-btn rw-btn--primary rw-btn--xl"
              onClick={() =>
                navigate(`/app/form?name=${encodeURIComponent(session.name ?? "")}`)
              }
            >
              <IonIcon icon={repeat} />
              Repetir rutina
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default HistoryDetail;
