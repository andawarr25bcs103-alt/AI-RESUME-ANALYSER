import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  isFirebaseConfigured,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from '../services/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const isConfigured = isFirebaseConfigured();
  const [currentUser, setCurrentUser] = useState(null);
  // If Firebase is not configured, initial loading is already false
  const [loading, setLoading] = useState(() => isConfigured && Boolean(auth));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isConfigured || !auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);
        setLoading(false);
      },
      (err) => {
        console.error('Firebase Auth state change error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isConfigured]);

  /**
   * Register a new user with Email, Password and Display Name
   */
  const register = async (email, password, displayName) => {
    setError(null);
    if (!isConfigured || !auth) {
      throw new Error(
        'Firebase Authentication is not configured. Please add your credentials to the .env file.'
      );
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        setCurrentUser({ ...userCredential.user, displayName });
      }
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Sign in an existing user with Email and Password
   */
  const login = async (email, password) => {
    setError(null);
    if (!isConfigured || !auth) {
      throw new Error(
        'Firebase Authentication is not configured. Please add your credentials to the .env file.'
      );
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Sign out the currently logged in user
   */
  const logout = async () => {
    setError(null);
    if (!isConfigured || !auth) {
      setCurrentUser(null);
      return;
    }

    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Send a password reset email
   */
  const resetPassword = async (email) => {
    setError(null);
    if (!isConfigured || !auth) {
      throw new Error(
        'Firebase Authentication is not configured. Please add your credentials to the .env file.'
      );
    }

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    isConfigured,
    register,
    login,
    logout,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
