import { useEffect, useState } from "react";
import { IonContent, IonIcon, IonPage } from "@ionic/react";
import { footstepsOutline, trashOutline } from "ionicons/icons";
import { useNavigate, useParams } from "react-router-dom";
import RunMap from "../components/RunMap";
import PageHeader from "../components/PageHeader";
import StatGrid from "../components/StatGrid";
import EmptyState from "../components/EmptyState";
import { supabase } from "../lib/supabase";
import { formatDate, formatDuration, formatPace } from "../helpers/helpers";
import { mensajeError } from "../helpers/errors";
import styles from "./RunDetail.module.css";

function RunDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmar, setConfirmar] = useState(false);

  useEffect(() => {
    supabase
      .from("runs")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setRun(data);
        setLoading(false);
      })
      .catch(() => {
        setRun(null);
        setLoading(false);
      });
  }, [id]);

  const eliminar = async () => {
    try {
      const { error } = await supabase.from("runs").delete().eq("id", id);
      if (error) {
        alert(mensajeError(error));
        return;
      }
      setConfirmar(false);
      navigate(-1);
    } catch (err) {
      alert(mensajeError(err));
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent>
          <div className="rw-page rw-page--tabs">
            <PageHeader title="Carrera" back="/app/run" />
            <div className="rw-main">
              <p className="rw-muted">Cargando…</p>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!run) {
    return (
      <IonPage>
        <IonContent>
          <div className="rw-page rw-page--tabs">
            <PageHeader title="Carrera" back="/app/run" />
            <div className="rw-main">
              <EmptyState
                icon={<IonIcon icon={footstepsOutline} />}
                title="Carrera no encontrada"
                description="Puede que la hayas eliminado."
              />
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const start = run.path?.[0];

  return (
    <IonPage>
      <IonContent>
        <div className="rw-page rw-page--tabs">
          <PageHeader
            title={`${(run.distance_m / 1000).toFixed(2)} km`}
            eyebrow={formatDate(run.created_at)}
            back="/app/run"
          />

          <div className="rw-main">
            <RunMap
              position={start ? { latitude: start[0], longitude: start[1] } : null}
              path={run.path ?? []}
            />

            <StatGrid
              stats={[
                { label: "km", value: (run.distance_m / 1000).toFixed(2), unit: "km" },
                { label: "tiempo", value: formatDuration(run.duration_s), unit: "tiempo" },
                {
                  label: "ritmo",
                  value: formatPace(run.distance_m, run.duration_s).replace(" /km", ""),
                  unit: "ritmo /km",
                },
              ]}
            />

            <button
              type="button"
              className="rw-btn rw-btn--destructive-outline rw-btn--xl"
              onClick={() => setConfirmar(true)}
            >
              <IonIcon icon={trashOutline} />
              Eliminar carrera
            </button>
          </div>
        </div>

        {confirmar && (
          <div className="rw-overlay rw-overlay--center" onClick={() => setConfirmar(false)}>
            <div className="rw-dialog" onClick={(e) => e.stopPropagation()}>
              <h2 className={styles.dialogTitle}>¿Eliminar esta carrera?</h2>
              <p className={styles.dialogText}>
                Se borrarán el recorrido y las estadísticas. No se puede deshacer.
              </p>
              <div className={styles.dialogActions}>
                <button
                  type="button"
                  className="rw-btn rw-btn--outline"
                  onClick={() => setConfirmar(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="rw-btn rw-btn--destructive"
                  onClick={eliminar}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
}

export default RunDetail;
