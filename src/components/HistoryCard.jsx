import { IonIcon, IonItem, IonLabel } from "@ionic/react";
import { barbellOutline, chevronForward } from "ionicons/icons";
import { formatDate } from "../helpers/helpers";
import styles from "./HistoryCard.module.scss";

const HistoryCard = ({ session }) => (
  <IonItem routerLink={`/app/history/${session.id}`} routerDirection="forward" lines="none" className={styles.card}>
    <div slot="start" className={styles.tile}>
      <IonIcon icon={barbellOutline} />
    </div>
    <IonLabel>
      <h2>{session.name}</h2>
      <p>{formatDate(session.created_at)}</p>
      <div className={styles.pills}>
        <span>{session.reps} repeticiones</span>
        <span>{Math.max(1, Math.round(session.duration_s / 60))} min</span>
      </div>
    </IonLabel>
    <IonIcon slot="end" icon={chevronForward} />
  </IonItem>
);

export default HistoryCard;