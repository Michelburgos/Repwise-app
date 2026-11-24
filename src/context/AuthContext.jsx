import { createContext, useEffect, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { supabase } from "../lib/supabase";
import { mensajeError } from "../helpers/errors";

export const AuthContext = createContext();

const normalizar = (error) =>
  error ? { ...error, message: mensajeError(error) } : null;

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const esAdmin = async (firebaseUser) => {
  if (!firebaseUser) return false;
  if (ADMIN_EMAILS.includes((firebaseUser.email ?? "").toLowerCase())) {
    return true;
  }
  try {
    const token = await firebaseUser.getIdTokenResult();
    return token.claims.admin === true || token.claims.role === "admin";
  } catch {
    return false;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const busyRef = useRef(false);

  // Firebase es la fuente de verdad de la sesión.
  useEffect(() => {
    let montado = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!montado || busyRef.current) return;

      if (!firebaseUser) {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // La sesión de Supabase es la que permite leer/escribir los datos con RLS.
      try {
        const { data } = await supabase.auth.getSession();
        if (!montado) return;

        const mismaCuenta =
          data.session?.user?.email?.toLowerCase() ===
          firebaseUser.email?.toLowerCase();

        if (!data.session || !mismaCuenta) {
          await firebaseSignOut(auth);
          await supabase.auth.signOut().catch(() => {});
          if (!montado) return;
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const admin = await esAdmin(firebaseUser);
        setUser(firebaseUser);
        setIsAdmin(admin);
        setLoading(false);
      } catch {
        if (!montado) return;
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => {
      montado = false;
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    busyRef.current = true;

    try {
      let firebaseUser = null;
      let firebaseError = null;

      try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        firebaseUser = credential.user;
      } catch (err) {
        firebaseError = err;
      }

      if (!firebaseUser) {
        // Puede ser un usuario que ya existía solo en Supabase.
        const { error: supabaseError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (supabaseError) {
          return { error: normalizar(firebaseError) };
        }

        try {
          const credential = await createUserWithEmailAndPassword(auth, email, password);
          firebaseUser = credential.user;
        } catch (err) {
          await supabase.auth.signOut();
          return { error: normalizar(err) };
        }
      } else {
        // Firebase ya lo validó; aseguramos la sesión de datos en Supabase.
        const { error: supabaseError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (supabaseError) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });

          if (signUpError || !signUpData?.session) {
            await firebaseSignOut(auth);
            await supabase.auth.signOut();

            const sinIdentidad = signUpData?.user?.identities?.length === 0;
            return {
              error: {
                message: sinIdentidad
                  ? "La contraseña no coincide con la cuenta de datos."
                  : normalizar(signUpError)?.message ??
                    "Cuenta creada. Confirma tu correo y vuelve a iniciar sesión.",
              },
            };
          }
        }
      }

      const admin = await esAdmin(firebaseUser);
      setUser(firebaseUser);
      setIsAdmin(admin);
      setLoading(false);
      return { error: null };
    } catch (err) {
      return { error: normalizar(err) };
    } finally {
      busyRef.current = false;
    }
  };

  const register = async (email, password) => {
    busyRef.current = true;

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);

      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        // Si ya existía en Supabase, intentamos enlazar con la misma contraseña.
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          await firebaseSignOut(auth);
          return { error: normalizar(error) };
        }
      } else if (!data.session) {
        // Supabase exige confirmar el correo: no dejamos una sesión a medias.
        await firebaseSignOut(auth);
        return { error: null, confirmation: true };
      }

      const admin = await esAdmin(credential.user);
      setUser(credential.user);
      setIsAdmin(admin);
      setLoading(false);
      return { error: null, confirmation: false };
    } catch (err) {
      return { error: normalizar(err) };
    } finally {
      busyRef.current = false;
    }
  };

  const logout = async () => {
    busyRef.current = true;
    setUser(null);
    setIsAdmin(false);

    try {
      await firebaseSignOut(auth);
    } catch {
      // Sin conexión: Firebase limpiará la sesión local igualmente.
    }

    try {
      await supabase.auth.signOut();
    } catch {
      try {
        await supabase.auth.signOut({ scope: "local" });
      } catch {
        // La UI ya quedó sin usuario.
      }
    } finally {
      setLoading(false);
      busyRef.current = false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
