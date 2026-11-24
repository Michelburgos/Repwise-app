import styles from "./Pill.module.css";

function Pill({ children, tone = "tint", className = "" }) {
  return <span className={`${styles.pill} ${styles[tone]} ${className}`}>{children}</span>;
}

export default Pill;
