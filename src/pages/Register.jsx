import { useState, useContext } from "react";
import { IonContent, IonIcon, IonPage } from "@ionic/react";
import { arrowForward } from "ionicons/icons";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Logo from "../components/Logo";
import styles from "./Login.module.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useContext(AuthContext);

  const registrar = async (event) => {
    event.preventDefault();
    setError("");
    setInfo("");
    setSubmitting(true);
    const { error: authError, confirmation } = await register(email, password);
    setSubmitting(false);

    if (authError) return setError(authError.message);
    if (confirmation) {
      setInfo("Revisa tu correo para confirmar la cuenta");
    }
  };

  return (
    <IonPage>
      <IonContent>
        <main className={styles.page}>
          <div className={styles.hero}>
            <div className={styles.glow} aria-hidden />
            <div className={styles.brand}>
              <Logo size="lg" />
              <p className={styles.tagline}>
                Entrena
                <br />
                con cabeza.
              </p>
            </div>
          </div>

          <form className={styles.card} onSubmit={registrar}>
            <h1 className={styles.cardTitle}>Crea tu cuenta</h1>

            <label className="rw-field">
              <span className="rw-label">Email</span>
              <input
                className="rw-input"
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="rw-field">
              <span className="rw-label">Contraseña</span>
              <input
                className="rw-input"
                type="password"
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {error && <p className={styles.error}>{error}</p>}
            {info && <p className={styles.info}>{info}</p>}

            <button
              type="submit"
              className={`${styles.submit} rw-btn rw-btn--primary rw-btn--xl`}
              disabled={submitting}
            >
              {submitting ? "Creando…" : "Crear cuenta"}
              {!submitting && <IonIcon icon={arrowForward} />}
            </button>
          </form>

          <p className={styles.footer}>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </main>
      </IonContent>
    </IonPage>
  );
}

export default Register;
