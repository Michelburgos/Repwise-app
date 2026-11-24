import { useEffect, useState } from "react";
import { IonContent, IonIcon, IonPage } from "@ionic/react";
import { cameraOutline, imagesOutline } from "ionicons/icons";
import { useCamera } from "../hooks/useCamera";
import { supabase } from "../lib/supabase";
import { formatDate, formatShortDate } from "../helpers/helpers";
import { mensajeError } from "../helpers/errors";
import PageHeader from "../components/PageHeader";
import SectionHeader from "../components/SectionHeader";
import EmptyState from "../components/EmptyState";
import styles from "./Progress.module.css";

const urlDe = (ruta) =>
  supabase.storage.from("progress").getPublicUrl(ruta).data.publicUrl;

const PhotoFrame = ({ photo, label }) => (
  <figure className={styles.frame}>
    {photo ? (
      <img src={urlDe(photo.path)} alt={label ?? formatDate(photo.created_at)} />
    ) : (
      <div className={`${styles.placeholder} rw-map-grid`}>
        <IonIcon icon={cameraOutline} />
        <span>Sin foto</span>
      </div>
    )}
    {label && <span className={styles.frameLabel}>{label}</span>}
    <figcaption className={styles.frameCaption}>
      {photo ? formatDate(photo.created_at) : "Sin foto"}
    </figcaption>
  </figure>
);

function Progress() {
  const { takePhoto } = useCamera();
  const [fotos, setFotos] = useState([]);
  const [error, setError] = useState("");

  const cargar = async () => {
    try {
      const { data, error: loadError } = await supabase
        .from("progress_photos")
        .select("*")
        .order("created_at", { ascending: true });

      if (loadError) {
        console.error(loadError);
        setError(mensajeError(loadError));
        return;
      }

      setError("");
      setFotos(data ?? []);
    } catch (err) {
      console.error(err);
      setError(mensajeError(err));
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const subirFoto = async () => {
    let webPath;

    try {
      webPath = await takePhoto();
    } catch (err) {
      const cancelado = (err?.message ?? "").toLowerCase().includes("cancel");
      if (!cancelado) setError(mensajeError(err));
      return;
    }

    try {
      const file = await (await fetch(webPath)).blob();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("No hay sesión activa. Vuelve a iniciar sesión.");
        return;
      }

      const ruta = `${user.id}/${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("progress")
        .upload(ruta, file, { contentType: "image/jpeg" });

      if (uploadError) {
        setError(`No se pudo subir la foto: ${mensajeError(uploadError)}`);
        return;
      }

      const { error: rowError } = await supabase
        .from("progress_photos")
        .insert({ user_id: user.id, path: ruta });

      if (rowError) {
        setError(`No se pudo guardar la foto: ${mensajeError(rowError)}`);
        return;
      }

      setError("");
      cargar();
    } catch (err) {
      setError(mensajeError(err));
    }
  };

  const primera = fotos[0];
  const ultima = fotos[fotos.length - 1];
  const antes = fotos.length > 1 ? primera : null;

  return (
    <IonPage>
      <IonContent>
        <div className="rw-page rw-page--tabs">
          <PageHeader title="Progreso" eyebrow={`${fotos.length} fotos`} />

          <div className="rw-main">
            {error && <div className={styles.alert}>{error}</div>}

            <button
              type="button"
              className="rw-btn rw-btn--primary rw-btn--xl"
              onClick={subirFoto}
            >
              <IonIcon icon={cameraOutline} />
              Tomar foto de hoy
            </button>

            <section className="rw-section">
              <div className="rw-grid-2">
                <PhotoFrame photo={antes} label="ANTES" />
                <PhotoFrame photo={ultima} label="AHORA" />
              </div>
            </section>

            <section className="rw-section">
              <SectionHeader title="Línea de tiempo" />
              {fotos.length === 0 ? (
                <EmptyState
                  icon={<IonIcon icon={imagesOutline} />}
                  title="Sin fotos todavía"
                  description="Toma tu primera foto hoy para ver tu progreso con el tiempo."
                />
              ) : (
                <div className={styles.timeline}>
                  {fotos.map((foto) => (
                    <figure key={foto.id} className={styles.thumb}>
                      <div className={styles.thumbImg}>
                        <img src={urlDe(foto.path)} alt={formatDate(foto.created_at)} />
                      </div>
                      <figcaption>{formatShortDate(foto.created_at)}</figcaption>
                    </figure>
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

export default Progress;
