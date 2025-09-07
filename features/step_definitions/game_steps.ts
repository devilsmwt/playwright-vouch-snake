import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { chromium, Browser, Page, expect } from '@playwright/test';
import { GamePage } from '../../pages/GamePage';

let browser: Browser;
let page: Page;
let gamePage: GamePage;
let initialScore: number;

Before(async () => {
    browser = await chromium.launch({ headless: false }); // set headless: true to run in background
    page = await browser.newPage();
    gamePage = new GamePage(page);
});

After(async () => {
  await browser.close();
});

Given('I am on the Snake game page', async () => {
  await gamePage.goto();
});

Then('I can see the game titles', async () => {
    await gamePage.verifyGameTitle();
  });

When('I press the start button', async () => { 
  await gamePage.startGame();
});

Then('the start button is disabled', async () => {
    await gamePage.startGameDisabled();
  });

Then('I can see the pause button', async () => {
    await gamePage.pauseGameVisible();
  });

When('I click the pause button', async () => {
    await gamePage.pauseGame();
  });

Then('the game should begin', async () => {
  await expect(gamePage.gameBoard).toBeVisible();
});

Given('I have started a game', async () => {
  await gamePage.goto();
  await gamePage.startGame();
});

When('I press the pause button', async () => {
  await gamePage.pauseGame();
});

When('I press the pause button again', async () => {
  await gamePage.resumeGame();
});

Then('the game should be paused', async () => {
  await gamePage.verifyGameIsPaused();
});

Then('the game should resume', async () => {
  await gamePage.verifyGameIsResumed();
});

Given('I have noted the current score', async () => {
  initialScore = await gamePage.getScore();
});

When('the snake eats food', async () => {
  await gamePage.eatFood();
});

Then('the score should increase', async () => {
  const newScore = await gamePage.getScore();
  expect(newScore).toBeGreaterThan(initialScore);
});

When('I navigate the snake into a wall', async () => {
  await gamePage.navigateToWall();
});

Given('the game is over', async () => {
  await gamePage.goto();
  await gamePage.startGame();
  await gamePage.forceGameOver();
});

Then('a new game should begin', async () => {
  await gamePage.verifyNewGameStarted();
});

Then('the game should be over', async () => {
  await gamePage.isGameOver();
});

Given('I am moving the snake down', async () => {
  await gamePage.goto();
  await gamePage.startGame();
  await gamePage.pressKey('ArrowDown');
});

When('I press the {string} key', async (keyName: string) => {
    const keyMap: { [key: string]: string } = {
      'up arrow': 'ArrowUp',
      'down arrow': 'ArrowDown',
      'left arrow': 'ArrowLeft',
      'right arrow': 'ArrowRight',
    };
    const playwrightKey = keyMap[keyName];
    if (!playwrightKey) {
      throw new Error(`Key "${keyName}" is not defined in the key map.`);
    }
    await gamePage.pressKey(playwrightKey);
  });

Then('the snake should continue moving down', async () => {
  const initialPosition = await gamePage.getSnakePosition();
  await gamePage.pressKey('ArrowDown'); // Tekan lagi untuk melihat pergerakan
  const newPosition = await gamePage.getSnakePosition();
  expect(newPosition.y).toBeGreaterThan(initialPosition.y);
  expect(newPosition.x).toEqual(initialPosition.x);
});

Then('the snake should not appear or move', async () => {
  const isVisible = await gamePage.isSnakeVisible();
  expect(isVisible).toBe(false);
});
