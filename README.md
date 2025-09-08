# Vouch Snake Game Test Automation Project

This project contains a suite of automated tests to verify the core functionality and edge cases of a web-based Snake Game application. The tests are built using Playwright and Cucumber, applying BDD (Behavior-Driven Development) and POM (Page Object Model) design patterns for maximum readability and maintainability.

## Project Structure

-   `features/`: Contains functional test scenarios in Gherkin format (`.feature`), describing the application's behavior from a user's perspective.
-   `features/step_definitions/`: Contains the implementation code (glue) that connects the Gherkin steps to Playwright automation actions.
-   `pages/`: Contains Page Object Classes. Each class is responsible for encapsulating the locators and interaction methods for a specific page or component, separating test logic from UI implementation details.
-   `cucumber.js`: The configuration file for Cucumber, including settings for timeouts and report formatting.

## How to Run the Tests

1.  **Install Dependencies:**
    Ensure Node.js and npm are installed. Run the following command in the project root:
    ```bash
    npm install
    ```

2.  **Run the Game Locally:**
    This project is designed to test a locally running Snake Game application. Ensure the game is accessible at `http://localhost:3456`.

3.  **Run the Test Suite:**
    Execute all test scenarios with the command:
    ```bash
    npm test
    ```

    Upon completion, a user-friendly HTML test report will be automatically generated at `cucumber-report.html`.

## Testing Strategy and Scope

The testing strategy focuses on validating the entire game lifecycle, from initialization to end conditions, as well as handling invalid user inputs. This approach ensures application reliability and a smooth user experience.

### Scenarios Covered:

1.  **Basic Verification & State Transitions:**
    -   `Successfully go to the game page`: Ensures the application loads correctly.
    -   `Successfully start the game`: Tests the start button functionality and game initialization.
    -   `Pausing and resuming the game`: Validates the most common user interaction flow.
    -   `Restarting the game after game over`: Ensures the game loop can be correctly repeated after completion.

2.  **End Conditions:**
    -   `Game ends when the snake hits a wall`: Verifies the most critical fundamental game rule.

3.  **Edge Cases:**
    -   `Pressing movement keys before the game starts`: Ensures the game does not react to input before it has started, preventing invalid states.

## Technical Challenges & Solutions

Testing `<canvas>`-based applications is traditionally difficult because the elements within it (the snake, food) do not exist in the DOM. This project overcomes these challenges with the following solutions:

-   **Behavior-Based Visual Verification:** To verify hard-to-measure states like "paused" or "resumed," a screenshot comparison technique was implemented. By taking images of the `<canvas>` at two close points in time, we can objectively determine if the game is in motion (different screenshots) or static (identical screenshots). This is a powerful way to test a highly dynamic application without relying on internal implementation details.

-   **UI State-Based Verification:** For conditions like "Game Over," the test does not attempt to read the internal game state. Instead, it verifies user-observable behavior: the appearance of a "Game Over" pop-up and the re-enabling of the "Start" button. This is a reliable, black-box approach.

-   **Game Instrumentation (Optional):** During development, we explored using `page.evaluate()` to manipulate the internal game state (e.g., moving the food). Although this approach was not used in the final test suite, it demonstrates the capability to perform deeper, white-box testing if required, providing flexibility for future test scenarios.

## Potential Enhancements

-   **Cross-Browser Testing:** Run the same test suite across different browsers (Firefox, WebKit) to ensure compatibility.
-   **Score Validation:** Re-implement the scenario to verify that the score increases when food is eaten.
-   **Other Edge Cases:** Add tests to validate that the snake cannot immediately reverse direction (e.g., pressing 'up' while moving 'down').
