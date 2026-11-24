import { useEffect, useState } from "react";

function OfflineNotice() {
  const [offline, setOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    let timeout;

    const sinConexion = () => {
      setOffline(true);
      setRestored(false);
      clearTimeout(timeout);
    };

    const conectado = () => {
      setOffline(false);
      setRestored(true);
      timeout = setTimeout(() => setRestored(false), 3000);
    };

    window.addEventListener("offline", sinConexion);
    window.addEventListener("online", conectado);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("offline", sinConexion);
      window.removeEventListener("online", conectado);
    };
  }, []);

  if (!offline && !restored) return null;

  return (
    <div
      className={`rw-offline ${offline ? "" : "rw-offline--ok"}`}
      role="status"
      aria-live="polite"
    >
      {offline
        ? "Sin conexión a internet. Revisa tu red y vuelve a conectarte."
        : "Conexión restaurada"}
    </div>
  );
}

export default OfflineNotice;
