"use client";

import { useEffect, useState } from "react";
import { getCollection } from "@/lib/firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import { uniqueByPortfolioIdentity } from "@/lib/utils";

const DEDUPED_COLLECTIONS = new Set([
  "projects",
  "githubRepositories",
  "achievements",
  "skills",
  "experiences",
  "certificates"
]);

export function useCollection(collectionName, options = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    if (!isFirebaseConfigured) {
      setItems([]);
      setError("");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const nextItems = await getCollection(collectionName, options);
      setItems(DEDUPED_COLLECTIONS.has(collectionName) ? uniqueByPortfolioIdentity(nextItems) : nextItems);
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // `options` is intentionally excluded: callers (e.g. CollectionManager) pass a
    // new object literal each render, so including it would refetch every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName]);

  return { items, loading, error, reload: load };
}
