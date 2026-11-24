import { IonIcon } from "@ionic/react";
import { barbellOutline, timeOutline } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../helpers/helpers";
import Pill from "./Pill";
import styles from "./HistoryCard.module.css";

const HistoryCard = ({ session }) => {
  const navigate = useNavigate();
  const minutes = Math.max(1, Math.round(session.duration_s / 60));

  return (
    <button
      type="button"
      className={styles.card}
      onClick={() => navigate(`/app/history/${session.id}`)}
    >
      <span className={styles.tile}>
        <IonIcon icon={barbellOutline} />
      </span>

      <span className={styles.info}>
        <span className={styles.top}>
          <span className={styles.name}>{session.name}</span>
          <span className={styles.date}>{formatDate(session.created_at)}</span>
        </span>
        <span className={styles.pills}>
          <Pill>
            <IonIcon icon={barbellOutline} />
            {session.reps} repeticiones
          </Pill>
          <Pill>
            <IonIcon icon={timeOutline} />
            {minutes} min
          </Pill>
        </span>
      </span>
    </button>
  );
};

export default HistoryCard;
