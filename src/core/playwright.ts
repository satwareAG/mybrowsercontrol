/**
 * Core Playwright wrapper for MyBrowserControl
 * Integrates with Microsoft Playwright MCP foundation
 */

import { Browser, BrowserContext, Page, chromium, firefox, webkit } from 'playwright';
import { MyBrowserControlConfig, BrowserMode } from '../config/types.js';

/**
 * Supported browser types
 */
export type BrowserType = 'chromium' | 'firefox' | 'webkit';

/**
 * Core Playwright wrapper class
 * Manages browser lifecycle and provides base functionality
 */
export class PlaywrightCore {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private config: MyBrowserControlConfig;

  constructor(config: MyBrowserControlConfig) {
    this.config = config;
  }

  /**
   * Launch browser instance
   */
  async launch(browserType: BrowserType = 'chromium'): Promise<void> {
    const launchOptions: any = {
      headless: this.config.headless ?? true,
      timeout: this.config.timeout ?? 30000
    };

    // Add executablePath if specified (for using system browser)
    if (this.config.executablePath) {
      launchOptions.executablePath = this.config.executablePath;
    }

    // Select browser based on type
    switch (browserType) {
      case 'chromium':
        this.browser = await chromium.launch(launchOptions);
        break;
      case 'firefox':
        this.browser = await firefox.launch(launchOptions);
        break;
      case 'webkit':
        this.browser = await webkit.launch(launchOptions);
        break;
      default:
        throw new Error(`Unsupported browser type: ${browserType}`);
    }

    // Create browser context with viewport settings
    this.context = await this.browser.newContext({
      viewport: this.config.viewport
    });

    // Create initial page
    this.page = await this.context.newPage();
  }

  /**
   * Get current page instance
   */
  getPage(): Page {
    if (!this.page) {
      throw new Error('Browser not launched. Call launch() first.');
    }
    return this.page;
  }

  /**
   * Get browser context
   */
  getContext(): BrowserContext {
    if (!this.context) {
      throw new Error('Browser not launched. Call launch() first.');
    }
    return this.context;
  }

  /**
   * Get browser instance
   */
  getBrowser(): Browser {
    if (!this.browser) {
      throw new Error('Browser not launched. Call launch() first.');
    }
    return this.browser;
  }

  /**
   * Navigate to URL
   */
  async navigate(url: string): Promise<void> {
    const page = this.getPage();
    await page.goto(url, {
      timeout: this.config.timeout,
      waitUntil: 'domcontentloaded'
    });
  }

  /**
   * Take screenshot
   */
  async screenshot(options?: { fullPage?: boolean }): Promise<Buffer> {
    const page = this.getPage();
    return await page.screenshot({
      fullPage: options?.fullPage ?? false,
      type: this.config.extensions?.screenshot?.format ?? 'png'
    });
  }

  /**
   * Get page content
   */
  async getContent(): Promise<string> {
    const page = this.getPage();
    return await page.content();
  }

  /**
   * Close browser
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.context = null;
      this.page = null;
    }
  }

  /**
   * Check if browser is running
   */
  isRunning(): boolean {
    return this.browser !== null && this.browser.isConnected();
  }

  /**
   * Get current configuration
   */
  getConfig(): MyBrowserControlConfig {
    return { ...this.config };
  }

  /**
   * Get current mode
   */
  getMode(): BrowserMode {
    return this.config.mode;
  }
}
