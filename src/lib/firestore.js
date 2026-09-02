"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";
import { app, firebaseSetupMessage, isFirebaseConfigured } from "./firebase";
import { portfolioIdentityKey } from "./utils";

export const db = isFirebaseConfigured ? getFirestore(app) : null;

function requireDb() {
  if (!db) throw new Error(firebaseSetupMessage);
  return db;
}

export async function getCollection(collectionName, options = {}) {
  const database = requireDb();
  const clauses = [];
  if (options.where) clauses.push(where(...options.where));
  clauses.push(orderBy(options.orderBy || "order", options.direction || "asc"));
  if (options.limit) clauses.push(limit(options.limit));
  const snapshot = await getDocs(query(collection(database, collectionName), ...clauses));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function getProjectBySlug(slug) {
  const database = requireDb();
  const snapshot = await getDocs(query(collection(database, "projects"), where("slug", "==", slug), limit(1)));
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}

export function createDocument(collectionName, data) {
  const database = requireDb();
  return addDoc(collection(database, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export function updateDocument(collectionName, id, data) {
  const database = requireDb();
  return updateDoc(doc(database, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp()
  });
}

export function deleteDocument(collectionName, id) {
  const database = requireDb();
  return deleteDoc(doc(database, collectionName, id));
}

export function createContactMessage(data) {
  const database = requireDb();
  return addDoc(collection(database, "contactMessages"), {
    ...data,
    isRead: false,
    createdAt: serverTimestamp()
  });
}

export async function seedCollection(collectionName, rows) {
  const database = requireDb();
  const existingRows = await getCollection(collectionName);
  const existingKeys = new Set(existingRows.map(portfolioIdentityKey).filter(Boolean));
  const rowsToCreate = rows.filter((row) => {
    const key = portfolioIdentityKey(row);
    if (!key) return true;
    if (existingKeys.has(key)) return false;
    existingKeys.add(key);
    return true;
  });

  await Promise.all(
    rowsToCreate.map((row) => addDoc(collection(database, collectionName), { ...row, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }))
  );

  return {
    created: rowsToCreate.length,
    skipped: rows.length - rowsToCreate.length
  };
}

function nonEmptySeedFields(row) {
  const result = {};
  Object.entries(row).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === "string" && value.trim() === "") return;
    if (Array.isArray(value) && value.length === 0) return;
    result[key] = value;
  });
  return result;
}

export async function syncCollectionFromSeed(collectionName, rows) {
  const existingRows = await getCollection(collectionName);
  const existingByKey = new Map();
  existingRows.forEach((row) => {
    const key = portfolioIdentityKey(row);
    if (key && !existingByKey.has(key)) existingByKey.set(key, row);
  });

  let created = 0;
  let updated = 0;

  await Promise.all(rows.map(async (row) => {
    const key = portfolioIdentityKey(row);
    if (!key) return;
    const existing = existingByKey.get(key);
    if (!existing) {
      await createDocument(collectionName, row);
      created += 1;
      return;
    }
    const incoming = nonEmptySeedFields(row);
    const changedFields = Object.entries(incoming).filter(([field, value]) => JSON.stringify(existing[field]) !== JSON.stringify(value));
    if (changedFields.length > 0) {
      await updateDocument(collectionName, existing.id, Object.fromEntries(changedFields));
      updated += 1;
    }
  }));

  return { created, updated };
}

export function markMessageRead(id, isRead = true) {
  const database = requireDb();
  return setDoc(doc(database, "contactMessages", id), { isRead, updatedAt: serverTimestamp() }, { merge: true });
}

export async function deleteDuplicateDocuments(collectionName) {
  const rows = await getCollection(collectionName);
  const seen = new Set();
  const duplicates = [];

  rows.forEach((row) => {
    const key = portfolioIdentityKey(row);
    if (!key) return;
    if (seen.has(key)) duplicates.push(row);
    else seen.add(key);
  });

  await Promise.all(duplicates.map((row) => deleteDocument(collectionName, row.id)));
  return duplicates.length;
}
