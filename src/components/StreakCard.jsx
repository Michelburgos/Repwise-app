import { IonIcon } from "@ionic/react";
import { checkmark, flame } from "ionicons/icons";
import styles from "./StreakCard.module.scss";

const plural = (n) => (n === 1 ? "día" : "días");

const StreakCard = ({ current, best, week }) => (
  <div className={styles.card}>
    <div className={styles.top}>
      <IonIcon icon={flame} className={styles.flame} />
      <div>
        <div className={styles.days}>
          {current} {plural(current)} de racha
        </div>
        <div className={styles.best}>
          Mejor racha: {best} {plural(best)}
        </div>
      </div>
    </div>

    <div className={styles.week}>
      {week.map((d, i) => (
        <div key={i} className={styles.day}>
          <span>{d.label}</span>
          <div
            className={`${styles.dot} ${d.done ? styles.done : ""} ${d.today ? styles.today : ""}`}
          >
            {d.done && <IonIcon icon={checkmark} />}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default StreakCard;