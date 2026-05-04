import { boards, labels } from "@ssntpl/otper-cli";
import { clientFor, json, PluginConfig, text } from "./shared.ts";

export function labelTools(config: PluginConfig) {
  return [
    {
      name: "otper_list_labels",
      label: "Otper: list labels on a board",
      description: "Return all labels defined on a board with id, name, color, and description.",
      parameters: {
        type: "object",
        properties: {
          boardId: { type: "string" },
        },
        required: ["boardId"],
      },
      execute: async (_id: string, p: { boardId: string }) => {
        const client = clientFor(config);
        const board = await boards.getBoard(client, p.boardId);
        if (!board) return text(`Board ${p.boardId} not found.`);
        return json(board.labels ?? []);
      },
    },
    {
      name: "otper_create_label",
      label: "Otper: create label",
      description: "Create a new label on a board.",
      parameters: {
        type: "object",
        properties: {
          boardId: { type: "string" },
          name: { type: "string" },
          description: { type: "string", default: "" },
          color: { type: "string", description: "Hex color (e.g. #ff5722)." },
        },
        required: ["boardId", "name"],
      },
      execute: async (
        _id: string,
        p: { boardId: string; name: string; description?: string; color?: string },
      ) => {
        const client = clientFor(config);
        return json(
          await labels.createLabel(client, {
            name: p.name,
            description: p.description ?? "",
            color: p.color,
            board: { connect: p.boardId },
          }),
        );
      },
    },
    {
      name: "otper_update_label",
      label: "Otper: update label",
      description: "Update a label's name, description, or color.",
      parameters: {
        type: "object",
        properties: {
          labelId: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          color: { type: "string" },
        },
        required: ["labelId"],
      },
      execute: async (
        _id: string,
        p: { labelId: string; name?: string; description?: string; color?: string },
      ) => {
        const client = clientFor(config);
        return json(
          await labels.updateLabel(client, {
            id: p.labelId,
            name: p.name,
            description: p.description,
            color: p.color,
          }),
        );
      },
    },
  ];
}
