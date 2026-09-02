"use client";

import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { app, firebaseSetupMessage, isFirebaseConfigured } from "./firebase";

export const auth = typeof window === "undefined" || !isFirebaseConfigured ? null : getAuth(app);

export async function isAdminUser(user) {
  if (!user) return false;
  const tokenResult = await user.getIdTokenResult();
  return Boolean(tokenResult.claims.admin);
}

export function loginAdmin(email, password) {
  if (!isFirebaseConfigured) throw new Error(firebaseSetupMessage);
  if (!auth) throw new Error("Firebase Auth is only available in the browser.");
  return signInWithEmailAndPassword(auth, email, password);
}

export function logoutAdmin() {
  if (!isFirebaseConfigured) throw new Error(firebaseSetupMessage);
  if (!auth) throw new Error("Firebase Auth is only available in the browser.");
  return signOut(auth);
}

export function watchAuth(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

