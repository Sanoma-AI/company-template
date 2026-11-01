Feature: Send an update
  The email goes out once admin has reviewed it, unless someone in admin started the run. A
  scenario runs as the agent `scenarios` unless it says who is acting.

  Scenario: Admin approves
    When send-update runs with
      | to      | sam@example.com          |
      | subject | This week                |
      | text    | We shipped the new site. |
    And "Review before it goes out" is approved by owner
    Then resend.emails.send was held for group "admin"
    And a Resend email to "sam@example.com" is sent
    And step "Send the email" ran 1 time
    And the run succeeds

  Scenario: Admin rejects
    When send-update runs with
      | to      | sam@example.com          |
      | subject | This week                |
      | text    | We shipped the new site. |
    And "Review before it goes out" is rejected by owner
    Then resend.emails.send was not called
    And the run fails with "approval_rejected"

  Scenario: Admin sends without a review
    Given owner is acting
    When send-update runs with
      | to      | sam@example.com          |
      | subject | This week                |
      | text    | We shipped the new site. |
    Then resend.emails.send was called
    And the run succeeds
