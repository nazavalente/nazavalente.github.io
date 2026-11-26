"use client";

import { useEffect, useState } from "react";
import { isAdminUser, watchAuth } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let latestCheck = 0;
    return watchAuth(async (nextUser) => {
      const check = ++latestCheck;
      let nextIsAdmin = false;
      try {
        nextIsAdmin = await isAdminUser(nextUser);
      } catch (err) {
        // e.g. offline while refreshing the ID token: treat as non-admin instead
        // of leaving the admin area stuck on "Checking admin session...".
        console.error("Could not read admin claim:", err);
      }
      // Ignore a slower check for a previous user that resolves after a newer one.
      if (check !== latestCheck) return;
      setUser(nextUser);
      setIsAdmin(nextIsAdmin);
      setLoading(false);
    });
  }, []);

  return { user, isAdmin, loading };
}
