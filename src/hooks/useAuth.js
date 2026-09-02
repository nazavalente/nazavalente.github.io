"use client";

import { useEffect, useState } from "react";
import { isAdminUser, watchAuth } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return watchAuth(async (nextUser) => {
      setUser(nextUser);
      setIsAdmin(await isAdminUser(nextUser));
      setLoading(false);
    });
  }, []);

  return { user, isAdmin, loading };
}
