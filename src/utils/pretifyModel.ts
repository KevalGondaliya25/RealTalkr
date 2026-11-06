export function prettifyModelIdToName(id: string): string {
  if (!id) return id;

  // Drop region suffix like ":eastus"
  let core = id.split(":")[0];

  // Normalize separators (treat "/" and "_" as "-")
  core = core.replace(/[/_]/g, "-");

  const parts = core.split("-");
  const last = parts[parts.length - 1];
  const isCompactDate = /^\d{8}$/.test(last);
  const isYMDTriplet =
    parts.length >= 3 &&
    /^\d{4}$/.test(parts[parts.length - 3]) &&
    /^\d{2}$/.test(parts[parts.length - 2]) &&
    /^\d{2}$/.test(parts[parts.length - 1]);

  let tokens = parts.slice();
  if (isCompactDate) tokens = tokens.slice(0, -1);
  else if (isYMDTriplet) tokens = tokens.slice(0, -3);

  const vendor = (tokens[0] || "").toLowerCase();

  if (vendor === "claude" && tokens.length >= 3 && /^\d+$/.test(tokens[1]) && /^\d+$/.test(tokens[2])) {
    tokens = [tokens[0], `${tokens[1]}.${tokens[2]}`, ...tokens.slice(3)];
  }

  const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  const mapToken = (t: string, idx: number) => {
    const low = t.toLowerCase();

    if (/^\d+(\.\d+)?$/.test(t)) return t; // numbers like 4.1

    if (idx === 0) {
      if (low === "gpt") return "GPT";
      if (low === "openai") return "OpenAI";
      if (low === "claude") return "Claude";
      if (low === "llama") return "Llama";
      if (low === "mistral") return "Mistral";
      if (low === "mixtral") return "Mixtral";
      if (low === "groq") return "Groq";
      if (low === "xai") return "xAI";
      return titleCase(t);
    }

    if (["mini", "nano", "small", "medium", "large", "sonnet", "opus", "haiku"].includes(low)) {
      return titleCase(low);
    }

    if (/^\d+[a-z]$/i.test(t)) return t; // e.g., 20b, 8b, 4o

    return titleCase(t);
  };

  const pretty = tokens.map(mapToken).join(" ").trim();
  return pretty || id;
}
import type { ModelPayload, Provider, Model } from "@/types/models";

function prettifyProviderModels(p: Provider): Provider {
  const models: Model[] = (p.models || []).map((m) => ({
    ...m,
    // Force prettify from id (backend currently sets name := id)
    name: prettifyModelIdToName(m.id),
  }));
  console.log("Prettified models for provider", p.id, models.map((m) => m.name));
  return { ...p, models };
}

export function prettifyPayload(payload: ModelPayload): ModelPayload {
  return {
    model: (payload.model || []).map(prettifyProviderModels),
    transcriber: (payload.transcriber || []).map(prettifyProviderModels),
    voice: (payload.voice || []).map(prettifyProviderModels),
  };
}