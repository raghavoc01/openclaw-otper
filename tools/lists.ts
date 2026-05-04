import { boards, lists } from "@ssntpl/otper-cli";
import { clientFor, json, PluginConfig, text } from "./shared.ts";

export function listTools(config: PluginConfig) {
  return [
    {
      name: "otper_list_lists",
      label: "Otper: list a board's lists",
      description:
        "Return all lists on a board (Backlog, TODO, In Progress, Done, etc.) with id, name, position, and limits.",
      parameters: {
        type: "object",
        properties: {
          boardId: { type: "string", description: "The board id." },
        },
        required: ["boardId"],
      },
      execute: async (_id: string, p: { boardId: string }) => {
        const client = clientFor(config);
        const board = await boards.getBoard(client, p.boardId);
        if (!board) return text(`Board ${p.boardId} not found.`);
        return json(board.lists ?? []);
      },
    },
    {
      name: "otper_show_list",
      label: "Otper: show list (with cards)",
      description:
        "Return a list and the first page of its cards (25 per page). Supports the same search syntax as the Otper UI: free text, or 'labels:bug;assignee:harsh;status:not completed;due date:overdue' style filters, or '#KEY123' card-number lookup.",
      parameters: {
        type: "object",
        properties: {
          listId: { type: "string", description: "The list id." },
          page: {
            type: "integer",
            description: "Page number (1-based). Default 1.",
            default: 1,
          },
          search: {
            type: "string",
            description:
              "Optional filter (e.g. 'labels:bug;assignee:alice' or free text).",
          },
        },
        required: ["listId"],
      },
      execute: async (
        _id: string,
        p: { listId: string; page?: number; search?: string },
      ) => {
        const client = clientFor(config);
        const list = await lists.getListWithCards(
          client,
          p.listId,
          p.page ?? 1,
          p.search,
        );
        if (!list) return text(`List ${p.listId} not found.`);
        return json(list);
      },
    },
    {
      name: "otper_create_list",
      label: "Otper: create list",
      description: "Create a new list on a board.",
      parameters: {
        type: "object",
        properties: {
          boardId: { type: "string", description: "Board id to create the list on." },
          name: { type: "string", description: "List name." },
          description: { type: "string", description: "Optional description.", default: "" },
          color: { type: "string", description: "Optional hex color (e.g. #ff5722)." },
          pos: { type: "string", description: "Optional position string." },
          preferred: {
            type: "boolean",
            description: "Mark as a preferred list (TODO/In Progress family).",
            default: false,
          },
        },
        required: ["boardId", "name"],
      },
      execute: async (
        _id: string,
        p: {
          boardId: string;
          name: string;
          description?: string;
          color?: string;
          pos?: string;
          preferred?: boolean;
        },
      ) => {
        const client = clientFor(config);
        return json(
          await lists.createList(client, {
            name: p.name,
            description: p.description ?? "",
            color: p.color,
            pos: p.pos,
            preferred: p.preferred ?? false,
            board: { connect: p.boardId },
          }),
        );
      },
    },
    {
      name: "otper_rename_list",
      label: "Otper: rename / restyle list",
      description:
        "Update a list's name, description, color, soft/hard card limits, or preferred flag.",
      parameters: {
        type: "object",
        properties: {
          listId: { type: "string", description: "The list id." },
          name: { type: "string" },
          description: { type: "string" },
          color: { type: "string" },
          softCardLimit: { type: "integer" },
          hardCardLimit: { type: "integer" },
          preferred: { type: "boolean" },
        },
        required: ["listId"],
      },
      execute: async (
        _id: string,
        p: {
          listId: string;
          name?: string;
          description?: string;
          color?: string;
          softCardLimit?: number;
          hardCardLimit?: number;
          preferred?: boolean;
        },
      ) => {
        const client = clientFor(config);
        return json(
          await lists.updateList(client, {
            id: p.listId,
            name: p.name,
            description: p.description,
            color: p.color,
            soft_card_limit: p.softCardLimit,
            hard_card_limit: p.hardCardLimit,
            preferred: p.preferred,
          }),
        );
      },
    },
    {
      name: "otper_reorder_list",
      label: "Otper: reorder list",
      description:
        "Move a list to be placed relative to another list on the same board.",
      parameters: {
        type: "object",
        properties: {
          listId: { type: "string", description: "List being moved." },
          relativeToListId: { type: "string", description: "Target list to position next to." },
        },
        required: ["listId", "relativeToListId"],
      },
      execute: async (
        _id: string,
        p: { listId: string; relativeToListId: string },
      ) => {
        const client = clientFor(config);
        return json(await lists.reorderLists(client, p.listId, p.relativeToListId));
      },
    },
  ];
}
