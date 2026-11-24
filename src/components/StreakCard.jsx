import { IonIcon } from "@ionic/react";
import { checkmark, flame } from "ionicons/icons";
import styles from "./StreakCard.module.css";

function StreakCard({ current, best, week = [] }) {
  const days = week.map((day) => ({
    ...day,
    status: day.done ? "done" : day.today ? "today" : "pending",
  }));

  return (
    <section className={styles.card}>
      <div className={styles.blob} aria-hidden />

      <div className={styles.top}>
        <div className={styles.flameWrap}>
          <IonIcon icon={flame} className={`${styles.flame} rw-animate-flame`} aria-hidden />
        </div>
        <div>
          <p className={styles.current}>{current}</p>
          <p className={styles.currentLabel}>días de racha</p>
        </div>
      </div>

      <ol className={styles.week} aria-label="Semana actual">
        {days.map((day, index) => (
          <li key={`${day.label}-${index}`} className={styles.day}>
            <span className={`${styles.dot} ${styles[day.status]}`}>
              {day.status === "done" && <IonIcon icon={checkmark} />}
            </span>
            <span className={`${styles.dayLabel} ${day.status === "today" ? styles.todayLabel : ""}`}>
              {day.label}
            </span>
          </li>
        ))}
      </ol>

      <p className={styles.best}>
        Mejor racha: <span>{best} días</span>
      </p>
    </section>
  );
}

export default StreakCard;
