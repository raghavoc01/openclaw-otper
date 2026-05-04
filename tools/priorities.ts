import { priorities, users } from "@ssntpl/otper-cli";
import { clientFor, json, PluginConfig } from "./shared.ts";

export function priorityTools(config: PluginConfig) {
  return [
    {
      name: "otper_my_priorities",
      label: "Otper: today's priorities",
      description:
        "Return today's priority cards for a user (defaults to the authenticated user). Each card includes priority bucket, due date, and the board/list it belongs to.",
      parameters: {
        type: "object",
        properties: {
          userId: {
            type: "integer",
            description:
              "Otper user id. Omit to use the authenticated user from the configured token.",
          },
        },
        required: [],
      },
      execute: async (_id: string, p: { userId?: number }) => {
        const client = clientFor(config);
        const userId = p.userId ?? Number((await users.me(client)).id);
        return json(await priorities.todaysPriorities(client, userId));
      },
    },
  ];
}
