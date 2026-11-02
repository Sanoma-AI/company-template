// Never put credentials in this file or anywhere in this repo. The drivers read theirs from the
// environment or from the app's connector pages (see .env.example). The workflows are found:
// every file of workflows/ and of each app's apps/<app>/workflows/.
import { github } from "@sanoma-ai/connector-github";
import { resend } from "@sanoma-ai/connector-resend";
import { cloud } from "@sanoma-ai/connector-sanoma-cloud";
import { defineConfig } from "sanoma";

export default defineConfig({
  // Resend sends email; GitHub holds this repository and Sanoma Cloud the database and the host
  // (resources/sanoma/infra.ts, which sign-up writes).
  connectors: [resend, github, cloud],
  secrets: {
    bindings: {
      // The host delivers these bootstrap keys at start; they are never stored in the database.
      SANOMA_SIGNING_KEY: { bootstrap: "SANOMA_SIGNING_KEY" },
      SANOMA_SECRETS_KEY: { bootstrap: "SANOMA_SECRETS_KEY" },
    },
  },
  // Sign-in codes go out through Resend (the built-in `login-code` workflow, as the runtime's agent
  // `login`): Sanoma's sender on a Sanoma Cloud host; on a laptop, a Resend key of your own, or none.
  login: { sender: resend.emails.send },
});
