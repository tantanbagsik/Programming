import { useState } from "react";
import { triggerWebhook } from "@/lib/webhook";

/**
 * useWebhook
 * A reusable React hook to trigger n8n webhook events.
 *
 * Usage example:
 *   const { trigger, loading, success, error } = useWebhook();
 *
 *   await trigger({
 *     event: "contact_form",
 *     name: "Ray",
 *     email: "ray@example.com",
 *     message: "Hello!"
 *   });
 */
export function useWebhook() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function trigger(payload: Record<string, unknown>) {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await triggerWebhook(payload);
      setSuccess(true);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return { trigger, loading, success, error };
}
