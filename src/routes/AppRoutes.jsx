import { useContext, useEffect } from "react";
import { IonRouterOutlet } from "@ionic/react";
import { Navigate, Route, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import BottomNav from "../components/BottomNav";

const AppRoutes = () => {
  const { user, isAdmin, loading } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Al iniciar sesión, cada rol va a su zona.
  useEffect(() => {
    if (
      !loading &&
      user &&
      (location.pathname === "/login" || location.pathname === "/register")
    ) {
      navigate(isAdmin ? "/admin" : "/app/routines", { replace: true });
    }
  }, [loading, user, isAdmin, location.pathname, navigate]);

  // Sin sesión no se puede entrar a rutas privadas ni al panel.
  useEffect(() => {
    if (
      !loading &&
      !user &&
      (location.pathname.startsWith("/app") || location.pathname.startsWith("/admin"))
    ) {
      navigate("/login", { replace: true });
    }
  }, [loading, user, location.pathname, navigate]);

  const enApp = user && location.pathname.startsWith("/app");

  const rutas = [
    <Route key="login" path="/login" element={<Login />} />,
    <Route key="register" path="/register" element={<Register />} />,
    ...(user ? UserRoutes : []),
    ...(isAdmin ? AdminRoutes : []),
    ...(isAdmin
      ? []
      : [
          <Route
            key="admin-guard"
            path="/admin"
            element={
              <Navigate to={user ? "/app/routines" : "/login"} replace />
            }
          />,
        ]),
    <Route
      key="app"
      path="/app"
      element={
        user ? <Navigate to="/app/routines" replace /> : <Navigate to="/login" replace />
      }
    />,
    <Route key="root" path="/" element={<Navigate to="/app/routines" replace />} />,
  ];

  return (
    <>
      <IonRouterOutlet>{rutas}</IonRouterOutlet>

      {enApp && <BottomNav />}

      {loading && (
        <div className="rw-splash">
          <span className="rw-spinner" aria-hidden />
          <span>Cargando…</span>
        </div>
      )}
    </>
  );
};

export default AppRoutes;
