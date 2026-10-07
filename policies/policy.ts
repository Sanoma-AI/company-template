import { allow, definePolicy } from "@sanoma/workflows";

/**
 * Checked before every operation call a workflow makes. Return `allow()`, `deny(reason)`
 * (the run fails) or `approve(who)` (the run waits until that person approves).
 *
 * This one allows everything. To have a person sign off on anything that publishes or
 * sends, import `approve` too and use:
 *
 *   export default definePolicy(({ effect, run }) => {
 *     if (effect !== "publish" && effect !== "send") return allow();
 *     const approved = run.approvals.some((a) => a.status === "approved" && a.decidedBy === "marketing-lead");
 *     return approved ? allow() : approve("marketing-lead");
 *   });
 *
 * A policy must decide the same way every time from the call alone (no clock, randomness
 * or network), because runs are replayed after a restart. `pnpm test` lints this file for that.
 */
export default definePolicy(() => allow());
