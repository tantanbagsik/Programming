/**
 * triggerWebhook
 * Sends a POST request to the n8n webhook with a given payload.
 * Webhook URL is loaded from NEXT_PUBLIC_WEBHOOK_URL in .env.local
 */
export async function triggerWebhook(payload: Record<string, unknown>): Promise<void> {
  const url = process.env.NEXT_PUBLIC_WEBHOOK_URL;

  if (!url) {
    console.error("❌ NEXT_PUBLIC_WEBHOOK_URL is not defined.");
    return;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
        source: "raypanganiban8.vercel.app",
      }),
    });

    if (!res.ok) {
      console.error(`❌ Webhook failed with status: ${res.status}`);
    } else {
      console.log("✅ Webhook triggered successfully");
    }
  } catch (err) {
    console.error("❌ Webhook error:", err);
  }
}
