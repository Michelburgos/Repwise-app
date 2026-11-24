import { useEffect } from "react";
import { IonIcon } from "@ionic/react";
import { locationOutline } from "ionicons/icons";
import { CircleMarker, MapContainer, Polyline, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./RunMap.module.css";

const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    map.setView([position?.latitude ?? 0, position?.longitude ?? 0]);
  }, [position]);
  return null;
};

const RunMap = ({ position, path }) => (
  <div className={styles.wrap}>
    {position ? (
      <MapContainer
        center={[position.latitude, position.longitude]}
        zoom={18}
        zoomControl={false}
        className={styles.map}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a>'
          maxZoom={19}
        />
        <RecenterMap position={position} />
        <CircleMarker
          center={[position.latitude, position.longitude]}
          radius={8}
          pathOptions={{ color: "#111111", weight: 3, fillColor: "#c4b5fd", fillOpacity: 1 }}
        />
        <Polyline
          positions={path}
          pathOptions={{ color: "#111111", weight: 5, opacity: 0.9 }}
        />
      </MapContainer>
    ) : (
      <div className={`${styles.map} ${styles.placeholder} rw-map-grid`}>
        <IonIcon icon={locationOutline} />
        <p>Obteniendo ubicación...</p>
      </div>
    )}
  </div>
);

export default RunMap;
