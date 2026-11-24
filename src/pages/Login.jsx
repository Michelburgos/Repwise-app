import { useState, useContext } from "react";
import { IonContent, IonIcon, IonPage } from "@ionic/react";
import { arrowForward } from "ionicons/icons";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Logo from "../components/Logo";
import styles from "./Login.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useContext(AuthContext);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const { error: authError } = await login(email, password);
    setSubmitting(false);
    // La redirección la hace AppRoutes cuando detecta la sesión iniciada.
    if (authError) return setError(authError.message);
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

          <form className={styles.card} onSubmit={handleLogin}>
            <h1 className={styles.cardTitle}>Inicia sesión</h1>

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
                autoComplete="current-password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {error && <p className={styles.error}>{error}</p>}

            <button
              type="submit"
              className={`${styles.submit} rw-btn rw-btn--primary rw-btn--xl`}
              disabled={submitting}
            >
              {submitting ? "Entrando…" : "Entrar"}
              {!submitting && <IonIcon icon={arrowForward} />}
            </button>
          </form>

          <p className={styles.footer}>
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </p>
        </main>
      </IonContent>
    </IonPage>
  );
}

export default Login;
