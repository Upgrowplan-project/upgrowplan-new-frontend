"use client";

import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_MONITORING_API_URL || 'http://localhost:8000';

export const useEmails = (limit = 50, offset = 0) => {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/monitoring/emails?limit=${limit}&offset=${offset}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setEmails(json.items || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching emails:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [limit, offset]);

  return { emails, loading, error, refresh: fetchEmails };
};
