import { useContext } from "react";
import { IonContent, IonIcon, IonPage } from "@ionic/react";
import {
  logOutOutline,
  openOutline,
  peopleOutline,
  serverOutline,
} from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import PageHeader from "../../components/PageHeader";
import IconTile from "../../components/IconTile";
import styles from "./AdminDashboard.module.css";

const FIREBASE_USERS =
  "https://console.firebase.google.com/project/proyecto1-moviles/authentication/users";
const SUPABASE_DASHBOARD = "https://supabase.com/dashboard";

function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <IonPage>
      <IonContent>
        <div className="rw-page">
          <PageHeader
            title="Administración"
            eyebrow="Firebase Auth"
            action={
              <button
                type="button"
                className="rw-btn rw-btn--outline rw-btn--sm rw-btn--round"
                onClick={logout}
              >
                <IonIcon icon={logOutOutline} />
                Salir
              </button>
            }
          />

          <div className="rw-main">
            <section className="rw-panel">
              <div className={styles.profile}>
                <IconTile tone="purple" size="lg">
                  <IonIcon icon={peopleOutline} />
                </IconTile>
                <div>
                  <p className={styles.label}>Administrador</p>
                  <p className={styles.email}>{user?.email ?? "Sin correo"}</p>
                  <p className={styles.uid}>UID: {user?.uid ?? "--"}</p>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.title}>Accesos rápidos</h2>

              <a className={styles.link} href={FIREBASE_USERS} target="_blank" rel="noreferrer">
                <IconTile tone="tint" size="sm">
                  <IonIcon icon={peopleOutline} />
                </IconTile>
                <span>
                  <strong>Usuarios y roles</strong>
                  <small>Firebase Authentication</small>
                </span>
                <IonIcon icon={openOutline} className={styles.open} />
              </a>

              <a
                className={styles.link}
                href={SUPABASE_DASHBOARD}
                target="_blank"
                rel="noreferrer"
              >
                <IconTile tone="tint" size="sm">
                  <IonIcon icon={serverOutline} />
                </IconTile>
                <span>
                  <strong>Base de datos</strong>
                  <small>Supabase · Postgres, Storage y Realtime</small>
                </span>
                <IonIcon icon={openOutline} className={styles.open} />
              </a>
            </section>

            <div className={styles.note}>
              Los usuarios se crean y eliminan desde Firebase Console. Para dar
              acceso al panel, agrega el correo en <code>VITE_ADMIN_EMAILS</code> o
              asigna el custom claim <code>admin: true</code>.
            </div>

            <button
              type="button"
              className="rw-btn rw-btn--primary rw-btn--xl"
              onClick={() => navigate("/app/routines")}
            >
              Ir a la app
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default AdminDashboard;
