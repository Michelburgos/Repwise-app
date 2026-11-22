import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { barbellOutline, cameraOutline, footstepsOutline, pulseOutline } from "ionicons/icons";
import { Redirect, Route } from "react-router-dom";
import Routines from "../pages/Routines";
import RoutineDetail from "../pages/RoutineDetail";
import Form from "../pages/Form";
import Run from "../pages/Run";
import Progress from "../pages/Progress";

const UserRoutes = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route exact path="/app/routines">
        <Routines />
      </Route>
      <Route exact path="/app/routines/:id">
        <RoutineDetail />
      </Route>
      <Route exact path="/app/form">
        <Form />
      </Route>
      <Route exact path="/app/run">
        <Run />
      </Route>
      <Route exact path="/app/progress">
        <Progress />
      </Route>
      <Route exact path="/app">
        <Redirect to="/app/routines" />
      </Route>
    </IonRouterOutlet>

    <IonTabBar slot="bottom">
      <IonTabButton tab="routines" href="/app/routines">
        <IonIcon icon={barbellOutline} />
        <IonLabel>Rutinas</IonLabel>
      </IonTabButton>
      <IonTabButton tab="form" href="/app/form">
        <IonIcon icon={pulseOutline} />
        <IonLabel>Técnica</IonLabel>
      </IonTabButton>
      <IonTabButton tab="run" href="/app/run">
        <IonIcon icon={footstepsOutline} />
        <IonLabel>Correr</IonLabel>
      </IonTabButton>
      <IonTabButton tab="progress" href="/app/progress">
        <IonIcon icon={cameraOutline} />
        <IonLabel>Progreso</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

export default UserRoutes;