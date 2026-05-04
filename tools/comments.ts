import { comments } from "@ssntpl/otper-cli";
import { clientFor, json, PluginConfig } from "./shared.ts";

export function commentTools(config: PluginConfig) {
  return [
    {
      name: "otper_list_card_comments",
      label: "Otper: list comments on a card",
      description:
        "Return up to 50 comments on a card in chronological order (newest first), including reactions.",
      parameters: {
        type: "object",
        properties: {
          cardId: { type: "string" },
        },
        required: ["cardId"],
      },
      execute: async (_id: string, p: { cardId: string }) => {
        const client = clientFor(config);
        return json(await comments.listCardComments(client, p.cardId));
      },
    },
    {
      name: "otper_comment_on_card",
      label: "Otper: comment on a card",
      description:
        "Add a comment to a card. Optionally reply to an existing comment by passing replyToCommentId.",
      parameters: {
        type: "object",
        properties: {
          cardId: { type: "string" },
          comment: { type: "string", description: "Comment body (markdown supported)." },
          replyToCommentId: {
            type: "string",
            description: "Optional id of the comment to reply to.",
          },
        },
        required: ["cardId", "comment"],
      },
      execute: async (
        _id: string,
        p: { cardId: string; comment: string; replyToCommentId?: string },
      ) => {
        const client = clientFor(config);
        return json(
          await comments.createComment(client, {
            comment: p.comment,
            card: { connect: p.cardId },
            reply_to_comment_id: p.replyToCommentId,
          }),
        );
      },
    },
    {
      name: "otper_update_comment",
      label: "Otper: update comment",
      description: "Edit the text of an existing comment.",
      parameters: {
        type: "object",
        properties: {
          commentId: { type: "string" },
          comment: { type: "string", description: "New comment body." },
        },
        required: ["commentId", "comment"],
      },
      execute: async (
        _id: string,
        p: { commentId: string; comment: string },
      ) => {
        const client = clientFor(config);
        return json(await comments.updateComment(client, p.commentId, p.comment));
      },
    },
    {
      name: "otper_react_to_comment",
      label: "Otper: react to a comment",
      description:
        "Toggle a reaction on a comment. Use plain keywords (like, love, laugh, wow, sad, angry). Pass remove=true with no reaction to clear your reaction.",
      parameters: {
        type: "object",
        properties: {
          commentId: { type: "string" },
          reaction: {
            type: "string",
            description:
              "Reaction keyword: like, love, laugh, wow, sad, angry. Required unless remove is true.",
          },
          remove: { type: "boolean", default: false },
        },
        required: ["commentId"],
      },
      execute: async (
        _id: string,
        p: { commentId: string; reaction?: string; remove?: boolean },
      ) => {
        const client = clientFor(config);
        const reaction = p.remove ? null : (p.reaction ?? null);
        return json(await comments.reactToComment(client, p.commentId, reaction));
      },
    },
  ];
}
