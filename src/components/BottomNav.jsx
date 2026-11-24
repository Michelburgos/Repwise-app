import { IonIcon } from "@ionic/react";
import { barbellOutline, footstepsOutline, pulseOutline, statsChartOutline } from "ionicons/icons";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./BottomNav.module.css";

const tabs = [
  {
    to: "/app/routines",
    label: "Rutinas",
    icon: barbellOutline,
    match: ["/app/routines", "/app/history"],
  },
  { to: "/app/form", label: "Técnica", icon: pulseOutline, match: ["/app/form"] },
  { to: "/app/run", label: "Correr", icon: footstepsOutline, match: ["/app/run"] },
  { to: "/app/progress", label: "Progreso", icon: statsChartOutline, match: ["/app/progress"] },
];

function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className={styles.nav} aria-label="Navegación principal">
      <ul className={styles.list}>
        {tabs.map(({ to, label, icon, match }) => {
          const active = match.some((path) => pathname.startsWith(path));
          return (
            <li key={to} className={styles.item}>
              <button
                type="button"
                className={`${styles.tab} ${active ? styles.active : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={() => navigate(to)}
              >
                <span className={styles.icon}>
                  <IonIcon icon={icon} />
                </span>
                <span className={styles.label}>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default BottomNav;
