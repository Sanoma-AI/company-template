# Scenarios

A scenario says how a workflow should go against the vendors' fakes: what already exists at the vendors, what the workflow is started with, who approves what, and which operations it must and must not call. Scenarios live here as Gherkin `.feature` files, one directory per workflow, and are read by the app (the Test button on a workflow's page) and by `describeScenarios` from `@sanoma/testing/scenarios`. A Test run uses the `fakes` from `sanoma.config.ts` instead of the drivers; the policy, approvals and ledger are the same as in a live run, and sleeps are recorded but not waited.

```gherkin
Feature: announce
  Scenario: Launch on time
    Given a post titled "Hello from Sanoma" exists
    When announce runs with
      """
      { "title": "Sanoma is live", "body": "<p>We are live.</p>", "launchAt": "2030-01-01T09:00:00Z", "audience": "newsletter" }
      """
    And "Review launch copy" is approved by marketing-lead with note "ship it"
    Then a post titled "Sanoma is live" is created
    And resend.broadcast.create was called with
      | audience | newsletter     |
      | subject  | Sanoma is live |
    And the run succeeds
```

## Steps

Operations are named by their id (`ghost.post.create`); `And` and `But` continue the step before them. A field left out of a `Given` or `When` is filled with generated data, the same for a scenario of the same name every time.

| Step                                                                                  | Means                                                                                                |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `Given <op> was called with` + a JSON doc string or a two-column table                | the fake already holds the result of that call                                                       |
| `Given <op> fails once` / `is rate limited once` / `loses its reply once`             | the fake's next call fails that way, so the run must retry                                           |
| `Given <phrase>` the connector defines, such as `a post titled "X" exists`            | the same as the matching `was called with`                                                           |
| `When <workflow> runs with` + a doc string or table, or `When <workflow> runs`        | the workflow's input                                                                                 |
| `"<approval title>" is approved by <who>` [`with note "…"`] / `rejected by <who>`     | how the approval is decided: in tests by the scenario, in the app by whoever decides it in the inbox |
| `Then <op> was called with` + a doc string or table / `was called` / `was not called` | a check on the ledger; `with` matches the fields it names                                            |
| `Then <phrase>` the connector defines, such as `post "post_0002" is published`        | the same as the matching `was called with`                                                           |
| `Then the run succeeds` / `the run fails` [`with "<error code>"`]                     | the run's outcome                                                                                    |

A step that matches no rule fails at load time with its file and line and the steps the config knows, including each connector's phrases.

## Running them as tests

```ts
// test/scenarios.test.ts
import { describeScenarios } from "@sanoma/testing/scenarios";
import config from "../sanoma.config.ts";

describeScenarios(config);
```

One test per scenario, in a describe per feature file; a file that does not load is one failing test naming the line.
