"use client";

import { useState } from "react";
import { useWebhook } from "@/hooks/useWebhook";

/**
 * ContactForm
 * Drop-in contact form that fires your n8n webhook on submit.
 * Styled to match the dark/cyberpunk aesthetic of raypanganiban8.vercel.app
 */
export default function ContactForm() {
  const { trigger, loading, success, error } = useWebhook();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await trigger({
      event: "contact_form",
      name: formData.name,
      email: formData.email,
      message: formData.message,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-lg">
      <input
        name="name"
        type="text"
        placeholder="Identify Yourself / Entity"
        value={formData.name}
        onChange={handleChange}
        required
        className="bg-transparent border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition"
      />
      <input
        name="email"
        type="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        required
        className="bg-transparent border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition"
      />
      <textarea
        name="message"
        placeholder="Message Payload"
        value={formData.message}
        onChange={handleChange}
        required
        rows={5}
        className="bg-transparent border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition resize-none"
      />

      <button
        type="submit"
        disabled={loading}
        className="border border-white/40 px-6 py-3 text-white uppercase tracking-widest hover:bg-white hover:text-black transition disabled:opacity-50"
      >
        {loading ? "Transmitting..." : "Transmit Signal"}
      </button>

      {success && (
        <p className="text-green-400 text-sm tracking-wide">
          ✅ Signal transmitted successfully.
        </p>
      )}
      {error && (
        <p className="text-red-400 text-sm tracking-wide">
          ❌ Transmission failed. Please try again.
        </p>
      )}
    </form>
  );
}
