import { boards } from "@ssntpl/otper-cli";
import { clientFor, json, PluginConfig, text } from "./shared.ts";

export function boardTools(config: PluginConfig) {
  return [
    {
      name: "otper_search_boards",
      label: "Otper: search boards",
      description:
        "Find Otper boards by name. Returns matching boards with their id, slug, key (card-number prefix), name, and team.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "Search query. Empty string returns all boards the user can see.",
            default: "",
          },
        },
        required: [],
      },
      execute: async (_id: string, p: { query?: string }) => {
        const client = clientFor(config);
        return json(await boards.searchBoards(client, p.query ?? ""));
      },
    },
    {
      name: "otper_show_board",
      label: "Otper: show board",
      description:
        "Get a single Otper board by ID, including all of its lists and labels. Use this to discover list ids before listing cards.",
      parameters: {
        type: "object",
        properties: {
          boardId: {
            type: "string",
            description: "The Otper board id (numeric string).",
          },
        },
        required: ["boardId"],
      },
      execute: async (_id: string, p: { boardId: string }) => {
        const client = clientFor(config);
        const board = await boards.getBoard(client, p.boardId);
        if (!board) return text(`Board ${p.boardId} not found.`);
        return json(board);
      },
    },
    {
      name: "otper_show_board_by_slug",
      label: "Otper: show board by slug",
      description:
        "Get a board by its team-slug + board-slug pair. Useful when the user refers to a board by URL rather than id.",
      parameters: {
        type: "object",
        properties: {
          teamSlug: { type: "string", description: "Team slug." },
          boardSlug: { type: "string", description: "Board slug." },
        },
        required: ["teamSlug", "boardSlug"],
      },
      execute: async (
        _id: string,
        p: { teamSlug: string; boardSlug: string },
      ) => {
        const client = clientFor(config);
        const board = await boards.getBoardBySlug(client, p.teamSlug, p.boardSlug);
        if (!board) return text(`Board ${p.teamSlug}/${p.boardSlug} not found.`);
        return json(board);
      },
    },
  ];
}
