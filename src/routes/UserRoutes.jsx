import { Route } from "react-router-dom";
import Routines from "../pages/Routines";
import RoutineDetail from "../pages/RoutineDetail";
import Form from "../pages/Form";
import Run from "../pages/Run";
import RunDetail from "../pages/RunDetail";
import Progress from "../pages/Progress";
import HistoryDetail from "../pages/HistoryDetail";

// Rutas privadas de la app. AppRoutes solo las monta cuando hay sesión.
const UserRoutes = [
  <Route key="routines" path="/app/routines" element={<Routines />} />,
  <Route key="routine-detail" path="/app/routines/:id" element={<RoutineDetail />} />,
  <Route key="form" path="/app/form" element={<Form />} />,
  <Route key="run" path="/app/run" element={<Run />} />,
  <Route key="run-detail" path="/app/run/:id" element={<RunDetail />} />,
  <Route key="progress" path="/app/progress" element={<Progress />} />,
  <Route key="history-detail" path="/app/history/:id" element={<HistoryDetail />} />,
];

export default UserRoutes;
