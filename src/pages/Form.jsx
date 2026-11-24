import { IonContent, IonPage } from "@ionic/react";
import { useLocation } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import RepCounter from "../components/RepCounter";

function Form() {
  const { search } = useLocation();
  const name = new URLSearchParams(search).get("name") ?? "";

  return (
    <IonPage>
      <IonContent>
        <div className="rw-page rw-page--tabs">
          <PageHeader title={name || "Modo técnica"} eyebrow="Modo técnica" />
          <RepCounter exerciseName={name} />
        </div>
      </IonContent>
    </IonPage>
  );
}

export default Form;
