import { allow, definePolicy } from "@sanoma/workflows";

/**
 * Checked before every operation call a workflow makes. Return `allow()`, `deny(reason)`
 * (the run fails) or `approve(who)` (the run waits until that person approves).
 *
 * This one allows everything. To have a person sign off on anything that publishes or
 * sends, import `approve` and `approvedFor` too and use:
 *
 *   export default definePolicy(({ op, effect, run }) => {
 *     if (effect !== "publish" && effect !== "send") return allow();
 *     return approvedFor(run.approvals, op.id, "marketing-lead") ? allow() : approve("marketing-lead");
 *   });
 *
 * `approvedFor` passes a call when an approval in the run was approved, covers this
 * operation, and was addressed to the marketing lead. A workflow that asks the lead up front
 * with `ctx.approval(title, { approver: "marketing-lead", covers: [...] })` gets the covered
 * calls through on that one sign-off; any other call is held until the lead approves it.
 *
 * A policy must decide the same way every time from the call alone (no clock, randomness
 * or network), because runs are replayed after a restart. `pnpm test` lints this file for that.
 */
export default definePolicy(() => allow());
