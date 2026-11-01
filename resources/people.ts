// Who may use this company's app, the agents that act in it, and the groups: resources like any
// other, loaded as any data file is. Only a declared person signs in (on a host by an email code
// to their `email` or an invite link; on this machine by `id`), and acts in the groups that list
// them; an agent is in the group `agents` besides. Policies (policies/*.cedar) and approvals name
// people by id and groups by name.
import { sanoma } from "sanoma/resources";

/** Who owns the company: Sanoma Cloud's sign-up writes their email here. */
export const owner = sanoma.person({ id: "owner" });

/** Whoever sends or publishes without a review, and reviews everyone else's (policies/policy.cedar). */
export const admin = sanoma.group({ name: "admin", members: [owner] });
