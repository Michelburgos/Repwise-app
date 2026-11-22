import { useContext } from "react";
import { IonRouterOutlet } from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UserRoutes from "./UserRoutes";

const AppRoutes = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Cargando...</p>;

  return (
    <IonRouterOutlet>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/register">
        <Register />
      </Route>
      <Route path="/app">
        {user ? <UserRoutes /> : <Redirect to="/login" />}
      </Route>
      <Route exact path="/">
        <Redirect to="/app/routines" />
      </Route>
    </IonRouterOutlet>
  );
};

export default AppRoutes;