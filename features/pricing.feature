@pricing @smoke
Feature: Origin Energy Pricing Page
  As a customer
  I want to view energy plans for my address
  So that I can compare and select a suitable Gas plan

  Background:
    Given I am on the Origin Energy pricing page

  @gas-plan @critical
  Scenario: Verify Gas plan details and download PDF
    When I search for the gas plan address
    And I select the first address from the suggestions list
    Then I should see the plans list displayed
    When I uncheck the "Electricity" checkbox
    Then I should still see plans displayed
    When I click on a plan link in the "Plan BPID/EFS" column
    Then the plan details page should open in a new tab
    When I download the plan PDF
    Then the PDF should confirm the expected plan type
