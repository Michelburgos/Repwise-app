import { IonIcon } from "@ionic/react";
import { chevronBack } from "ionicons/icons";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./PageHeader.module.css";

function PageHeader({ title, eyebrow, action, back }) {
  const navigate = useNavigate();
  const location = useLocation();

  const volver = () => {
    if (location.key !== "default") navigate(-1);
    else if (back) navigate(back);
  };

  return (
    <header className={styles.header}>
      {back && (
        <button
          type="button"
          className={`${styles.back} rw-btn rw-btn--outline rw-btn--icon rw-btn--round`}
          aria-label="Volver"
          onClick={volver}
        >
          <IonIcon icon={chevronBack} />
        </button>
      )}

      <div className={styles.row}>
        <div className={styles.left}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h1 className={styles.title}>{title}</h1>
        </div>
        {action}
      </div>
    </header>
  );
}

export default PageHeader;
