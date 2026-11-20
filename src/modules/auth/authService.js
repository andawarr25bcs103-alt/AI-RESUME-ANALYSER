/**
 * RESUMATE AI - Auth Service Layer
 * Direct interface for Firebase Authentication operations.
 */

import {
  auth,
  googleProvider,
  isFirebaseConfigured,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from '../../services/firebase';
import { getAuthErrorMessage } from './authUtils';

/**
 * Register a user account in Firebase Auth
 * @param {string} email
 * @param {string} password
 * @param {string} displayName
 * @returns {Promise<import('firebase/auth').User>}
 */
export const registerUser = async (email, password, displayName) => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error('Firebase Authentication is not configured. Please add your credentials to the .env file.');
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName: displayName.trim() });
  }
  return userCredential.user;
};

/**
 * Sign in a user with email and password
 * @param {string} email
 * @param {string} password
 * @param {boolean} [rememberMe=true]
 * @returns {Promise<import('firebase/auth').User>}
 */
export const loginUser = async (email, password, rememberMe = true) => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error('Firebase Authentication is not configured. Please add your credentials to the .env file.');
  }

  if (setPersistence && browserLocalPersistence && browserSessionPersistence) {
    await setPersistence(
      auth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence
    );
  }

  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return userCredential.user;
};

/**
 * Sign in with Google provider popup
 * @returns {Promise<import('firebase/auth').User>}
 */
export const signInWithGoogle = async () => {
  if (!isFirebaseConfigured() || !auth || !googleProvider) {
    throw new Error('Firebase Authentication or Google Sign-In is not configured.');
  }

  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

/**
 * Send password reset email
 * @param {string} email
 * @returns {Promise<void>}
 */
export const resetUserPassword = async (email) => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error('Firebase Authentication is not configured. Please add your credentials to the .env file.');
  }

  await sendPasswordResetEmail(auth, email.trim());
};

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  if (!isFirebaseConfigured() || !auth) return;
  await signOut(auth);
};

/**
 * Subscribe to auth state changes
 * @param {(user: import('firebase/auth').User|null) => void} callback
 * @returns {import('firebase/auth').Unsubscribe}
 */
export const onAuthStateChange = (callback) => {
  if (!isFirebaseConfigured() || !auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

export { getAuthErrorMessage };
