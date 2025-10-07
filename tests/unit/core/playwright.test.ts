import { PlaywrightCore } from '../../../src/core/playwright.js';
import { BrowserMode } from '../../../src/config/types.js';
import type { Browser, BrowserContext, Page } from 'playwright';

// Mock playwright
jest.mock('playwright', () => ({
  chromium: {
    launch: jest.fn(),
  },
  firefox: {
    launch: jest.fn(),
  },
  webkit: {
    launch: jest.fn(),
  },
}));

describe('PlaywrightCore', () => {
  let playwright: PlaywrightCore;
  let mockBrowser: jest.Mocked<Browser>;
  let mockContext: jest.Mocked<BrowserContext>;
  let mockPage: jest.Mocked<Page>;

  beforeEach(() => {
    // Create mock objects
    mockPage = {
      goto: jest.fn(),
      screenshot: jest.fn(),
      content: jest.fn(),
      close: jest.fn(),
    } as any;

    mockContext = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    } as any;

    mockBrowser = {
      newContext: jest.fn().mockResolvedValue(mockContext),
      close: jest.fn(),
      isConnected: jest.fn().mockReturnValue(true),
    } as any;

    // Reset all mocks
    jest.clearAllMocks();

    // Create instance with default config
    playwright = new PlaywrightCore({
      mode: BrowserMode.NATIVE,
      headless: true,
      timeout: 30000,
    });
  });

  describe('Constructor', () => {
    it('should create PlaywrightCore instance with config', () => {
      expect(playwright).toBeInstanceOf(PlaywrightCore);
    });

    it('should initialize with browser not running', () => {
      expect(playwright.isRunning()).toBe(false);
    });
  });

  describe('launch()', () => {
    beforeEach(() => {
      const { chromium } = require('playwright');
      chromium.launch.mockResolvedValue(mockBrowser);
    });

    it('should launch chromium browser by default', async () => {
      const { chromium } = require('playwright');
      
      await playwright.launch();

      expect(chromium.launch).toHaveBeenCalledWith({
        headless: true,
        timeout: 30000,
      });
      expect(playwright.isRunning()).toBe(true);
    });

    it('should launch firefox browser when specified', async () => {
      const { firefox } = require('playwright');
      firefox.launch.mockResolvedValue(mockBrowser);

      await playwright.launch('firefox');

      expect(firefox.launch).toHaveBeenCalledWith({
        headless: true,
        timeout: 30000,
      });
      expect(playwright.isRunning()).toBe(true);
    });

    it('should launch webkit browser when specified', async () => {
      const { webkit } = require('playwright');
      webkit.launch.mockResolvedValue(mockBrowser);

      await playwright.launch('webkit');

      expect(webkit.launch).toHaveBeenCalledWith({
        headless: true,
        timeout: 30000,
      });
      expect(playwright.isRunning()).toBe(true);
    });

    it('should create browser context and page', async () => {
      const { chromium } = require('playwright');

      await playwright.launch();

      expect(mockBrowser.newContext).toHaveBeenCalled();
      expect(mockContext.newPage).toHaveBeenCalled();
    });
  });

  describe('navigate()', () => {
    beforeEach(async () => {
      const { chromium } = require('playwright');
      chromium.launch.mockResolvedValue(mockBrowser);
      await playwright.launch();
    });

    it('should navigate to URL', async () => {
      const url = 'https://example.com';
      mockPage.goto.mockResolvedValue(null as any);

      await playwright.navigate(url);

      expect(mockPage.goto).toHaveBeenCalledWith(url, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });
    });

    it('should throw error if browser not running', async () => {
      await playwright.close();

      await expect(playwright.navigate('https://example.com')).rejects.toThrow(
        'Browser not launched. Call launch() first.'
      );
    });
  });

  describe('screenshot()', () => {
    beforeEach(async () => {
      const { chromium } = require('playwright');
      chromium.launch.mockResolvedValue(mockBrowser);
      await playwright.launch();
    });

    it('should take screenshot with default options', async () => {
      const mockBuffer = Buffer.from('screenshot');
      mockPage.screenshot.mockResolvedValue(mockBuffer);

      const result = await playwright.screenshot();

      expect(mockPage.screenshot).toHaveBeenCalledWith({
        type: 'png',
        fullPage: false,
      });
      expect(result).toBe(mockBuffer);
    });

    it('should take full page screenshot when specified', async () => {
      const mockBuffer = Buffer.from('full-screenshot');
      mockPage.screenshot.mockResolvedValue(mockBuffer);

      const result = await playwright.screenshot({ fullPage: true });

      expect(mockPage.screenshot).toHaveBeenCalledWith({
        type: 'png',
        fullPage: true,
      });
      expect(result).toBe(mockBuffer);
    });

    it('should throw error if browser not running', async () => {
      await playwright.close();

      await expect(playwright.screenshot()).rejects.toThrow(
        'Browser not launched. Call launch() first.'
      );
    });
  });

  describe('getContent()', () => {
    beforeEach(async () => {
      const { chromium } = require('playwright');
      chromium.launch.mockResolvedValue(mockBrowser);
      await playwright.launch();
    });

    it('should get page content', async () => {
      const mockHtml = '<html><body>Test</body></html>';
      mockPage.content.mockResolvedValue(mockHtml);

      const result = await playwright.getContent();

      expect(mockPage.content).toHaveBeenCalled();
      expect(result).toBe(mockHtml);
    });

    it('should throw error if browser not running', async () => {
      await playwright.close();

      await expect(playwright.getContent()).rejects.toThrow(
        'Browser not launched. Call launch() first.'
      );
    });
  });

  describe('close()', () => {
    beforeEach(async () => {
      const { chromium } = require('playwright');
      chromium.launch.mockResolvedValue(mockBrowser);
      await playwright.launch();
    });

    it('should close browser, context, and page', async () => {
      await playwright.close();

      expect(mockBrowser.close).toHaveBeenCalled();
      expect(playwright.isRunning()).toBe(false);
    });

    it('should handle close when browser not running', async () => {
      await playwright.close();
      
      // Should not throw
      await expect(playwright.close()).resolves.toBeUndefined();
    });

    it('should handle errors during close by throwing', async () => {
      mockBrowser.close.mockRejectedValue(new Error('Close failed'));

      // Should throw the error since there's no error handling
      await expect(playwright.close()).rejects.toThrow('Close failed');
    });
  });

  describe('isRunning()', () => {
    it('should return false when browser not launched', () => {
      expect(playwright.isRunning()).toBe(false);
    });

    it('should return true when browser is running', async () => {
      const { chromium } = require('playwright');
      chromium.launch.mockResolvedValue(mockBrowser);

      await playwright.launch();

      expect(playwright.isRunning()).toBe(true);
    });

    it('should return false after close', async () => {
      const { chromium } = require('playwright');
      chromium.launch.mockResolvedValue(mockBrowser);

      await playwright.launch();
      await playwright.close();

      expect(playwright.isRunning()).toBe(false);
    });
  });
});
