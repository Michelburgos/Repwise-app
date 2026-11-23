import { IonIcon, IonItem, IonLabel } from "@ionic/react";
import { chevronForward, trailSignOutline } from "ionicons/icons";
import { formatDate, formatDuration, formatPace } from "../helpers/helpers";
import styles from "./RunCard.module.scss";

const RunCard = ({ run }) => (
  <IonItem routerLink={`/app/run/${run.id}`} routerDirection="forward" lines="none" className={styles.card}>
    <div slot="start" className={styles.tile}>
      <IonIcon icon={trailSignOutline} />
    </div>
    <IonLabel>
      <p>{formatDate(run.created_at)}</p>
      <h2 className={styles.km}>{(run.distance_m / 1000).toFixed(2)} km</h2>
      <p>
        {formatDuration(run.duration_s)} · {formatPace(run.distance_m, run.duration_s)}
      </p>
    </IonLabel>
    <IonIcon slot="end" icon={chevronForward} />
  </IonItem>
);

export default RunCard;