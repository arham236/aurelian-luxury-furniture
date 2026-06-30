"use client";

import dynamic from "next/dynamic";

/**
 * Lazy-loads the AI assistant widget on the client only. Keeping this in its
 * own "use client" module (rather than calling next/dynamic with
 * ssr:false directly in the server-rendered root layout) lets the chat
 * widget's code split out of the initial homepage bundle entirely — it's
 * only fetched once this component mounts in the browser.
 */
const AiAssistantWidget = dynamic(
  () => import("@/components/ai-assistant/ai-assistant-widget"),
  { ssr: false }
);

export default function AiAssistantLoader() {
  return <AiAssistantWidget />;
}
