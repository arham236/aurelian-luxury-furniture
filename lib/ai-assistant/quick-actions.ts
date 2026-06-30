export type QuickAction = {
  label: string;
  prompt: string;
};

export const quickActions: QuickAction[] = [
  { label: "Living Room", prompt: "Show me Living Room furniture" },
  { label: "Bedroom", prompt: "Show me Bedroom furniture" },
  { label: "Dining", prompt: "Show me Dining furniture" },
  { label: "Recommendations", prompt: "Recommend some furniture for me" },
  { label: "Delivery", prompt: "Tell me about delivery" },
  { label: "Warranty", prompt: "What warranty do you provide?" },
  { label: "Returns", prompt: "What is your return policy?" },
];
