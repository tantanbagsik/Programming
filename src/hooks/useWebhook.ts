import { useState } from "react";

export function useWebhook() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function trigger(data: Record<string, unknown>) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      setSuccess(true);
      return await response.json();
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { trigger, loading, success, error };
}
