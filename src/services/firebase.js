import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';

/**
 * Firebase Client Configuration
 * Keys are loaded from environment variables (.env)
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

/**
 * Check if all required Firebase environment variables are provided
 */
export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY' &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  );
};

// Initialize Firebase App gracefully
let app;
let auth;
let googleProvider;

if (isFirebaseConfigured()) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
} else {
  console.warn(
    '[ResuMate AI] Firebase environment variables are missing or unconfigured. ' +
    'Please configure your .env file using .env.example.'
  );
  auth = null;
  googleProvider = null;
}

export {
  app,
  auth,
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
};
