import styles from "./Logo.module.css";

function Logo({ size = "md" }) {
  const lg = size === "lg";
  return (
    <div className={styles.logo}>
      <div className={`${styles.mark} ${lg ? styles.markLg : ""}`}>
        <span className={`${styles.letter} ${lg ? styles.letterLg : ""}`}>R</span>
        <span className={`${styles.dot} ${lg ? styles.dotLg : ""}`} />
      </div>
      <span className={`${styles.wordmark} ${lg ? styles.wordmarkLg : ""}`}>Repwise</span>
    </div>
  );
}

export default Logo;
