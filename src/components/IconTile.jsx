import styles from "./IconTile.module.css";

function IconTile({ children, tone = "purple", size = "md", className = "" }) {
  return (
    <div className={`${styles.tile} ${styles[tone]} ${styles[size]} ${className}`}>{children}</div>
  );
}

export default IconTile;
