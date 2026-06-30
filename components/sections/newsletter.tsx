"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import Reveal from "@/components/ui/reveal";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section className="bg-surface-container-low px-margin-mobile py-20 text-center md:px-margin-desktop md:py-32">
      <Reveal
        variant="scale"
        className="mx-auto max-w-2xl rounded-[32px] border border-white/20 bg-surface-container-lowest p-10 shadow-level-2 md:p-16"
      >
        <Mail size={28} strokeWidth={1.5} className="mx-auto mb-6 text-secondary" />
        <h2 className="mb-4 text-display-md text-primary md:text-headline-lg">
          Join the Atelier
        </h2>
        <p className="mx-auto mb-8 max-w-md text-on-surface-variant">
          Subscribe to receive early access to new collections and editorial
          insights on modern living.
        </p>

        {submitted ? (
          <p className="text-label-caps text-secondary">
            Welcome to the Atelier. Check your inbox shortly.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-grow border-0 border-b border-outline bg-transparent px-0 py-3 text-primary placeholder:text-on-surface-variant/50 focus:border-secondary focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              className="whitespace-nowrap rounded-[24px] bg-primary px-6 py-3 text-label-caps text-on-primary transition-opacity hover:opacity-90"
            >
              Subscribe
            </button>
          </form>
        )}
      </Reveal>
    </section>
  );
}
