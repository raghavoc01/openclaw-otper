import { teams } from "@ssntpl/otper-cli";
import { clientFor, json, PluginConfig, text } from "./shared.ts";

export function teamTools(config: PluginConfig) {
  return [
    {
      name: "otper_show_team",
      label: "Otper: show team",
      description:
        "Return a team by id, including its members and visible boards.",
      parameters: {
        type: "object",
        properties: {
          teamId: { type: "string" },
        },
        required: ["teamId"],
      },
      execute: async (_id: string, p: { teamId: string }) => {
        const client = clientFor(config);
        const team = await teams.getTeam(client, p.teamId);
        if (!team) return text(`Team ${p.teamId} not found.`);
        return json(team);
      },
    },
    {
      name: "otper_list_team_users",
      label: "Otper: list team members",
      description: "Return the users on a team.",
      parameters: {
        type: "object",
        properties: {
          teamId: { type: "string" },
        },
        required: ["teamId"],
      },
      execute: async (_id: string, p: { teamId: string }) => {
        const client = clientFor(config);
        const team = await teams.getTeam(client, p.teamId);
        if (!team) return text(`Team ${p.teamId} not found.`);
        return json(team.users ?? []);
      },
    },
  ];
}
