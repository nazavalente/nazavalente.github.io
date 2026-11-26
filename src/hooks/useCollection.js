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

// Older admin edits stored `order` as a string, and Firestore sorts all numbers
// before all strings, so re-sort numerically. Blank or invalid values go last.
function orderValue(item) {
  const raw = item.order;
  if (typeof raw === "number") return raw;
  const text = String(raw ?? "").trim();
  const value = Number(text);
  return text === "" || Number.isNaN(value) ? 999 : value;
}

function sortByOrder(items) {
  return [...items].sort((a, b) => orderValue(a) - orderValue(b));
}

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
      const fetched = await getCollection(collectionName, options);
      const nextItems = !options.orderBy || options.orderBy === "order" ? sortByOrder(fetched) : fetched;
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
