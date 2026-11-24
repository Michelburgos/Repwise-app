import { IonIcon } from "@ionic/react";
import { footstepsOutline } from "ionicons/icons";
import styles from "./RouteThumb.module.css";

const RouteThumb = ({ path = [] }) => {
  if (!path || path.length < 2) {
    return (
      <span className={`${styles.thumb} ${styles.empty} rw-map-grid`}>
        <IonIcon icon={footstepsOutline} />
      </span>
    );
  }

  const lats = path.map((p) => p[0]);
  const lngs = path.map((p) => p[1]);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const spanX = maxLng - minLng || 1;
  const spanY = maxLat - minLat || 1;
  const scale = 76 / Math.max(spanX, spanY);
  const offsetX = (100 - spanX * scale) / 2;
  const offsetY = (100 - spanY * scale) / 2;

  const points = path
    .map(
      ([lat, lng]) =>
        `${offsetX + (lng - minLng) * scale},${offsetY + (maxLat - lat) * scale}`
    )
    .join(" ");

  return (
    <span className={`${styles.thumb} rw-map-grid`}>
      <svg viewBox="0 0 100 100" aria-hidden>
        <polyline
          points={points}
          fill="none"
          stroke="var(--rw-ink)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
};

export default RouteThumb;
