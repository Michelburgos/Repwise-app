import styles from "./StatGrid.module.css";

function StatGrid({ stats, className = "" }) {
  return (
    <div className={`${styles.grid} ${className}`}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.cell}>
          <p className={styles.value}>{stat.value}</p>
          <p className={styles.unit}>{stat.unit ?? stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export default StatGrid;
