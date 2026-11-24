import styles from "./SectionHeader.module.css";

function SectionHeader({ title, action }) {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>{title}</h2>
      {action}
    </div>
  );
}

export default SectionHeader;
