import { IonIcon } from "@ionic/react";
import { trashOutline } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../helpers/helpers";
import styles from "./RoutineCard.module.css";

const RoutineCard = ({ routine, onDelete }) => {
  const navigate = useNavigate();
  const total = routine.exercises?.length ?? 0;

  return (
    <div className={styles.card}>
      <button
        type="button"
        className={styles.main}
        onClick={() => navigate(`/app/routines/${routine.id}`)}
      >
        <span className={styles.initial}>{routine.name.charAt(0).toUpperCase()}</span>
        <span className={styles.info}>
          <span className={styles.name}>{routine.name}</span>
          <span className={styles.meta}>
            {total} {total === 1 ? "ejercicio" : "ejercicios"} · {formatDate(routine.created_at)}
          </span>
        </span>
      </button>

      <button
        type="button"
        className={styles.delete}
        aria-label={`Eliminar ${routine.name}`}
        onClick={() => onDelete(routine.id)}
      >
        <IonIcon icon={trashOutline} />
      </button>
    </div>
  );
};

export default RoutineCard;
