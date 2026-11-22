import { IonButton, IonIcon, IonItem, IonLabel } from "@ionic/react";
import { trashOutline } from "ionicons/icons";
import { formatDate } from "../helpers/helpers";

const RoutineCard = ({ routine, onDelete }) => {
  return (
    <IonItem routerLink={`/app/routines/${routine.id}`} routerDirection="forward" detail>
      <IonLabel>
        <h2>{routine.name}</h2>
        <p>
          {routine.exercises.length} ejercicios · {formatDate(routine.created_at)}
        </p>
      </IonLabel>
      <IonButton
        slot="end"
        fill="clear"
        color="danger"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(routine.id);
        }}
      >
        <IonIcon icon={trashOutline} />
      </IonButton>
    </IonItem>
  );
};

export default RoutineCard;