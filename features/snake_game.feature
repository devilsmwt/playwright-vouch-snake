Feature: Snake Game Functionality

  As a player
  I want to be able to start and play the snake game
  So that I can have fun

  Scenario: Successfully go to the game page 
    Given I am on the Snake game page
    Then I can see the game titles

  Scenario: Successfully start the game
    Given I am on the Snake game page
    When I press the start button
    Then a new game should begin

  Scenario: Pausing and resuming the game
    Given I have started a game
    When I press the pause button
    Then the game should be paused
    When I press the pause button again
    Then the game should resume

  Scenario: Game ends when the snake hits a wall
    Given I have started a game
    When I navigate the snake into a wall
    Then the game should be over

  Scenario: Restarting the game after game over
    Given the game is over
    When I press the start button
    Then a new game should begin

  Scenario: Pressing movement keys before the game starts
    Given I am on the Snake game page
    When I press the 'right arrow' key
    Then the snake should not appear or move
