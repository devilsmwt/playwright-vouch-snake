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
    // URL tempat game berjalan secara lokal
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
    // Tunggu sebentar untuk memastikan status jeda diterapkan
    await this.page.waitForTimeout(100);
    const beforePauseScreenshot = await this.gameBoard.screenshot();
    await this.page.waitForTimeout(200); // Waktu untuk beberapa frame game jika tidak dijeda
    const afterPauseScreenshot = await this.gameBoard.screenshot();
    expect(afterPauseScreenshot).toEqual(beforePauseScreenshot);
  }

  async verifyGameIsResumed() {
    // Tunggu sebentar untuk memastikan status lanjut diterapkan
    await this.page.waitForTimeout(100);
    const beforeResumeScreenshot = await this.gameBoard.screenshot();
    await this.page.waitForTimeout(200); // Waktu yang cukup untuk ular bergerak
    const afterResumeScreenshot = await this.gameBoard.screenshot();
    expect(afterResumeScreenshot).not.toEqual(beforeResumeScreenshot);
  }

  async forceGameOver() {
    // Tekan panah kanan berkali-kali untuk menabrak dinding
    for (let i = 0; i < 25; i++) {
      await this.page.keyboard.press('ArrowRight');
      // Beri sedikit jeda agar game bisa memproses gerakan
      await this.page.waitForTimeout(50);
    }
    // Pastikan game over popup muncul dan tombol start aktif lagi, menandakan game over
    await expect(this.gameOverPopup).toBeVisible();
    await expect(this.startGameButton).toBeEnabled();
  }

  async verifyNewGameStarted() {
    // Di game baru, skor harus kembali ke 0
    await expect(this.scoreDisplay).toHaveText('0');
    // Dan tombol pause harus terlihat
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
    // Dapatkan posisi kepala ular
    const snakeHead = await this.page.evaluate(() => (window as any).snake[0]);

    // Pindahkan makanan ke satu kotak di sebelah kanan kepala ular
    await this.teleportFood(snakeHead.x + 10, snakeHead.y);

    // Gerakkan ular ke kanan untuk memakan makanan
    await this.page.keyboard.press('ArrowRight');

    // Beri sedikit waktu agar game dapat memproses skor baru
    await this.page.waitForTimeout(200);
  }

  async navigateToWall() {
    // Arahkan ular ke kanan hingga menabrak dinding
    for (let i = 0; i < 50; i++) {
      await this.page.keyboard.press('ArrowRight');
      await this.page.waitForTimeout(50);
      // Jika tombol start kembali aktif, berarti sudah game over
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
    // Beri waktu game untuk memproses input
    await this.page.waitForTimeout(100);
  }

  async isSnakeVisible(): Promise<boolean> {
    // Jika 'snake' tidak ada di window, berarti tidak terlihat
    return this.page.evaluate(() => (window as any).snake !== undefined);
  }
}
