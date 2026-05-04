import { users } from "@ssntpl/otper-cli";
import { clientFor, json, PluginConfig } from "./shared.ts";

export function meTools(config: PluginConfig) {
  return [
    {
      name: "otper_me",
      label: "Otper: who am I",
      description:
        "Return the user profile that the configured Otper token authenticates as. Useful as a sanity check or to discover the user's id and current team.",
      parameters: { type: "object", properties: {}, required: [] },
      execute: async () => {
        const client = clientFor(config);
        return json(await users.me(client));
      },
    },
    {
      name: "otper_search_users",
      label: "Otper: search users",
      description:
        "Search Otper users by name, email, or username. Returns up to a few matching users with id, name, username and email.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Free-text search keyword." },
        },
        required: ["query"],
      },
      execute: async (_id: string, p: { query: string }) => {
        const client = clientFor(config);
        return json(await users.searchUsers(client, p.query));
      },
    },
  ];
}
