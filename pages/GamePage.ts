import { Page, Locator, expect } from '@playwright/test';

export class GamePage {
  readonly page: Page;
  readonly gameTitle: Locator;
  readonly startGameButton: Locator;
  readonly pauseGameButton: Locator;
  readonly resumeGameButton: Locator;
  readonly gameBoard: Locator;
  readonly scoreDisplay: Locator;
  readonly gameOverPopup: Locator;

  constructor(page: Page) {
    this.page = page;
    this.gameTitle = page.getByText('Snake Game');
    this.startGameButton = page.locator('#startBtn');
    this.pauseGameButton = page.locator('#pauseBtn');
    this.resumeGameButton = page.locator('#resumeBtn');
    this.gameBoard = page.locator('#gameCanvas');
    this.scoreDisplay = page.locator('#score');
    this.gameOverPopup = page.locator('#gameOver');
  }

  async goto() {
    // URL where the game is running locally
    await this.page.goto('http://localhost:3456'); 
  }

  async verifyGameTitle() {
    await expect(this.gameTitle).toBeVisible();
  }

  async startGame() {
    await this.startGameButton.click();
  }

  async startGameDisabled() {
    await expect(this.startGameButton).toBeDisabled();
  }

  async pauseGame() {
    await this.pauseGameButton.click();
  }

  async pauseGameVisible() {
    await expect(this.pauseGameButton).toBeVisible();
  }

  async pauseGameDisabled() {
    await expect(this.pauseGameButton).toBeDisabled();
  }

  async resumeGame() {
    await this.pauseGameButton.click();
  }

  async resumeGameVisible() {
    await expect(this.pauseGameButton).toBeVisible();
  }

  async verifyGameIsPaused() {
    // Wait a moment to ensure the paused state is applied
    await this.page.waitForTimeout(100);
    const beforePauseScreenshot = await this.gameBoard.screenshot();
    await this.page.waitForTimeout(200); // Time for a few game frames if not paused
    const afterPauseScreenshot = await this.gameBoard.screenshot();
    expect(afterPauseScreenshot).toEqual(beforePauseScreenshot);
  }

  async verifyGameIsResumed() {
    // Wait a moment to ensure the resumed state is applied
    await this.page.waitForTimeout(100);
    const beforeResumeScreenshot = await this.gameBoard.screenshot();
    await this.page.waitForTimeout(200); // Enough time for the snake to move
    const afterResumeScreenshot = await this.gameBoard.screenshot();
    expect(afterResumeScreenshot).not.toEqual(beforeResumeScreenshot);
  }

  async forceGameOver() {
    // Press the right arrow repeatedly to hit the wall
    for (let i = 0; i < 25; i++) {
      await this.page.keyboard.press('ArrowRight');
      // Add a short delay for the game to process the movement
      await this.page.waitForTimeout(50);
    }
    // Ensure the game over popup appears and the start button is enabled again, indicating game over
    await expect(this.gameOverPopup).toBeVisible();
    await expect(this.startGameButton).toBeEnabled();
  }

  async verifyNewGameStarted() {
    // In a new game, the score should reset to 0
    await expect(this.scoreDisplay).toHaveText('0');
    // And the pause button should be visible
    await expect(this.pauseGameButton).toBeVisible();
  }

  async getScore(): Promise<number> {
    const scoreText = await this.scoreDisplay.innerText();
    return parseInt(scoreText, 10);
  }

  async teleportFood(x: number, y: number) {
    await this.page.evaluate(([fx, fy]) => {
      (window as any).foodX = fx;
      (window as any).foodY = fy;
    }, [x, y]);
  }

  async eatFood() {
    // Get the snake head's position
    const snakeHead = await this.page.evaluate(() => (window as any).snake[0]);

    // Move the food to one square to the right of the snake's head
    await this.teleportFood(snakeHead.x + 10, snakeHead.y);

    // Move the snake to the right to eat the food
    await this.page.keyboard.press('ArrowRight');

    // Allow some time for the game to process the new score
    await this.page.waitForTimeout(200);
  }

  async navigateToWall() {
    // Direct the snake to the right until it hits a wall
    for (let i = 0; i < 50; i++) {
      await this.page.keyboard.press('ArrowRight');
      await this.page.waitForTimeout(50);
      // If the start button becomes enabled again, it means game over
      if (await this.startGameButton.isEnabled()) {
        return;
      }
    }
    throw new Error('Game did not end after hitting the wall.');
  }

  async isGameOver() {
    await expect(this.gameOverPopup).toBeVisible();
    await expect(this.startGameButton).toBeEnabled();
  }

  async getSnakePosition(): Promise<{x: number, y: number}> {
    await this.page.waitForFunction(() => (window as any).snake !== undefined);
    return this.page.evaluate(() => (window as any).snake[0]);
  }

  async pressKey(key: string) {
    await this.page.keyboard.press(key);
    // Allow time for the game to process the input
    await this.page.waitForTimeout(100);
  }

  async isSnakeVisible(): Promise<boolean> {
    // If 'snake' is not on the window object, it's not visible
    return this.page.evaluate(() => (window as any).snake !== undefined);
  }
}
