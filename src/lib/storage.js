"use client";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app, firebaseSetupMessage, isFirebaseConfigured } from "./firebase";

export const storage = isFirebaseConfigured ? getStorage(app) : null;

export async function uploadPortfolioFile(file, folder = "portfolio") {
  if (!storage) throw new Error(firebaseSetupMessage);
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const fileRef = ref(storage, `${folder}/${Date.now()}-${safeName}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}
