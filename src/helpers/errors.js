const SIN_CONEXION =
  "Sin conexión a internet. Revisa tu red y vuelve a conectarte.";

export const mensajeError = (error) => {
  const raw =
    typeof error === "string" ? error : error?.message ?? error?.toString?.() ?? "";
  const msg = raw.toLowerCase();
  const code = (error?.code ?? "").toLowerCase();

  if (code === "auth/network-request-failed") {
    return SIN_CONEXION;
  }

  if (
    code === "auth/invalid-credential" ||
    code === "auth/wrong-password" ||
    code === "auth/user-not-found" ||
    msg.includes("invalid login credentials")
  ) {
    return "Correo o contraseña incorrectos.";
  }

  if (code === "auth/email-already-in-use" || msg.includes("already registered")) {
    return "Ese correo ya está registrado. Inicia sesión.";
  }

  if (code === "auth/weak-password") {
    return "La contraseña debe tener al menos 6 caracteres.";
  }

  if (code === "auth/too-many-requests") {
    return "Demasiados intentos. Espera un momento e inténtalo de nuevo.";
  }

  if (msg.includes("email not confirmed")) {
    return "Debes confirmar tu correo antes de iniciar sesión.";
  }

  if (
    msg.includes("failed to fetch") ||
    msg.includes("networkerror") ||
    msg.includes("network request failed") ||
    msg.includes("load failed") ||
    msg.includes("fetch failed") ||
    msg.includes("offline")
  ) {
    return SIN_CONEXION;
  }

  if (
    msg.includes("permission denied") ||
    msg.includes("row-level security") ||
    msg.includes("42501")
  ) {
    return "No tienes permiso para esta acción. Revisa las políticas de Supabase.";
  }

  if (msg.includes("jwt") || msg.includes("session") || msg.includes("sesión")) {
    return "Tu sesión expiró. Vuelve a iniciar sesión.";
  }

  return raw || "Ocurrió un error inesperado. Inténtalo de nuevo.";
};

export { SIN_CONEXION };
