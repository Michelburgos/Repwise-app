import { IonIcon } from "@ionic/react";
import { chevronForward } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { formatDate, formatDuration, formatPace } from "../helpers/helpers";
import RouteThumb from "./RouteThumb";
import styles from "./RunCard.module.css";

const RunCard = ({ run }) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={styles.card}
      onClick={() => navigate(`/app/run/${run.id}`)}
    >
      <RouteThumb path={run.path} />

      <span className={styles.info}>
        <span className={styles.date}>{formatDate(run.created_at)}</span>
        <span className={styles.km}>{(run.distance_m / 1000).toFixed(2)} km</span>
        <span className={styles.meta}>
          {formatDuration(run.duration_s)} · {formatPace(run.distance_m, run.duration_s)}
        </span>
      </span>

      <IonIcon icon={chevronForward} className={styles.chevron} />
    </button>
  );
};

export default RunCard;
