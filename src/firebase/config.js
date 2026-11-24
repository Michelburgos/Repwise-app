import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Configuración pública del proyecto Firebase (la API key web no es secreta).
const firebaseConfig = {
  apiKey: "AIzaSyCd2t5NLiIWtDM6Mjs0cINoH2uH4dj5f78",
  authDomain: "proyecto1-moviles.firebaseapp.com",
  databaseURL: "https://proyecto1-moviles-default-rtdb.firebaseio.com",
  projectId: "proyecto1-moviles",
  storageBucket: "proyecto1-moviles.firebasestorage.app",
  messagingSenderId: "374292539392",
  appId: "1:374292539392:web:eb5ce83c219634a7f9d0e5",
  measurementId: "G-0B1CDBLPR3",
};

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;
