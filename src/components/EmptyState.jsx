import IconTile from "./IconTile";
import styles from "./EmptyState.module.css";

function EmptyState({ icon, title, description }) {
  return (
    <div className={styles.empty}>
      <IconTile tone="tint" size="lg">
        {icon}
      </IconTile>
      <p className={styles.title}>{title}</p>
      <p className={styles.description}>{description}</p>
    </div>
  );
}

export default EmptyState;
