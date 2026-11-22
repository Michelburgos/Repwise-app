import { useEffect } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./RunMap.module.scss";

const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    map.setView([position?.latitude ?? 0, position?.longitude ?? 0]);
  }, [position]);
  return null;
};

const RunMap = ({ position, path }) => {
  return position ? (
    <MapContainer
      center={[position.latitude, position.longitude]}
      zoom={18}
      className={styles.map}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <RecenterMap position={position} />
      <Marker position={[position.latitude, position.longitude]} />
      <Polyline positions={path} />
    </MapContainer>
  ) : (
    <div
      className={styles.map}
      style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <p>Obteniendo ubicación...</p>
    </div>
  );
};

export default RunMap;