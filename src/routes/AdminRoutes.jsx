import { Route } from "react-router-dom";
import AdminDashboard from "../pages/admin/AdminDashboard";

// Rutas del panel administrativo. AppRoutes solo las monta para isAdmin.
const AdminRoutes = [
  <Route key="admin" path="/admin" element={<AdminDashboard />} />,
];

export default AdminRoutes;
