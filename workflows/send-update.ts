import { resend } from "@sanoma-ai/connector-resend";
import { defineWorkflow, z } from "sanoma";

/** Email an update to someone: the policy has admin review it first (policies/policy.cedar). */
export default defineWorkflow({
  name: "send-update",
  title: "Send an update",
  trigger: "manual",
  input: z.object({
    to: z.email(),
    subject: z.string().min(1),
    /** The message, as plain text. */
    text: z.string().min(1),
  }),
  uses: [resend.emails.send],
  run: async (ctx, { to, subject, text }) => {
    const sent = await ctx.resend.emails.send({ to, subject, text }, { name: "Send the email" });
    return { id: sent.id };
  },
});
