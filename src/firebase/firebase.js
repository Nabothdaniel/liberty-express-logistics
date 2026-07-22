import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const getEnv = (key) => {
  if (typeof process !== "undefined" && process.env) {
    if (process.env[`NEXT_PUBLIC_${key}`]) return process.env[`NEXT_PUBLIC_${key}`];
    if (process.env[`VITE_${key}`]) return process.env[`VITE_${key}`];
  }
  try {
    if (import.meta && import.meta.env) {
      if (import.meta.env[`VITE_${key}`]) return import.meta.env[`VITE_${key}`];
      if (import.meta.env[`NEXT_PUBLIC_${key}`]) return import.meta.env[`NEXT_PUBLIC_${key}`];
    }
  } catch (e) {
    // Ignore in non-Vite environments
  }
  return "";
};

const firebaseConfig = {
  apiKey: getEnv("FIREBASE_API_KEY") || "AIzaSyAF1r9f6cWDadvXviARe4mcrjUm21Qhem4",
  authDomain: getEnv("FIREBASE_AUTH_DOMAIN") || "liberty-express-logistics.firebaseapp.com",
  projectId: getEnv("FIREBASE_PROJECT_ID") || "liberty-express-logistics",
  storageBucket: getEnv("FIREBASE_STORAGE_BUCKET") || "liberty-express-logistics.firebasestorage.app",
  messagingSenderId: getEnv("FIREBASE_MESSAGING_SENDER_ID") || "818843037176",
  appId: getEnv("FIREBASE_APP_ID") || "1:818843037176:web:d45180ced5be4e6e91e513",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };