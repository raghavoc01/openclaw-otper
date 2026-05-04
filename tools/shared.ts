import { OtperClient, DEFAULT_BASE_URL } from "@ssntpl/otper-cli";

export interface PluginConfig {
  token?: string;
  baseUrl?: string;
}

/**
 * Build an OtperClient from the openclaw plugin config, falling back to
 * the same env vars the otper-cli uses (OTPER_TOKEN, OTPER_BASE_URL).
 * Throws a clear, agent-readable error if no token can be resolved.
 */
export function clientFor(config: PluginConfig | undefined): OtperClient {
  const token = config?.token ?? process.env.OTPER_TOKEN;
  const baseUrl = config?.baseUrl ?? process.env.OTPER_BASE_URL ?? DEFAULT_BASE_URL;
  if (!token) {
    throw new Error(
      "Otper is not configured. Set the plugin's `token` config or the OTPER_TOKEN environment variable.",
    );
  }
  return new OtperClient({ baseUrl, token });
}

export type TextContent = { type: "text"; text: string };
export type ToolResult = { content: TextContent[] };

/** Wrap a string in the openclaw tool result envelope. */
export function text(s: string): ToolResult {
  return { content: [{ type: "text", text: s }] };
}

/** Render any value as JSON-in-a-tool-result for the LLM to parse. */
export function json(value: unknown): ToolResult {
  return text(JSON.stringify(value, null, 2));
}

/** Format ISO date-times into a compact, locale-neutral form for the LLM. */
export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return iso.replace("T", " ").replace(/\.\d+Z?$/, "").replace(/Z$/, " UTC");
}

/** Today's date as YYYY-MM-DD HH:MM:SS, used as default `assigned_at`. */
export function nowIso(): string {
  return new Date().toISOString();
}
