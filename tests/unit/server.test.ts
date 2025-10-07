import { MyBrowserControlServer } from '../../src/server';
import { BrowserMode } from '../../src/config/types';
import { PlaywrightCore } from '../../src/core/playwright';

// Mock PlaywrightCore
jest.mock('../../src/core/playwright');

describe('MyBrowserControlServer', () => {
  let mockPlaywright: jest.Mocked<PlaywrightCore>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create mock Playwright instance
    mockPlaywright = {
      launch: jest.fn().mockResolvedValue(undefined),
      navigate: jest.fn().mockResolvedValue(undefined),
      screenshot: jest.fn().mockResolvedValue(Buffer.from('fake-screenshot')),
      getContent: jest.fn().mockResolvedValue('<html><body>Test</body></html>'),
      close: jest.fn().mockResolvedValue(undefined),
      isRunning: jest.fn().mockReturnValue(false),
    } as any;

    // Mock the constructor to return our mock
    (PlaywrightCore as jest.MockedClass<typeof PlaywrightCore>).mockImplementation(() => mockPlaywright);
  });

  describe('constructor', () => {
    it('should create instance with default config', () => {
      const server = new MyBrowserControlServer();
      expect(server).toBeInstanceOf(MyBrowserControlServer);
    });

    it('should create instance with custom config', () => {
      const customConfig = {
        mode: BrowserMode.LIGHTHOUSE,
        headless: false,
        timeout: 60000,
      };
      
      const server = new MyBrowserControlServer(customConfig);
      expect(server).toBeInstanceOf(MyBrowserControlServer);
    });

    it('should merge custom config with defaults', () => {
      const customConfig = { headless: false };
      const server = new MyBrowserControlServer(customConfig);
      expect(server).toBeInstanceOf(MyBrowserControlServer);
    });
  });

  describe('getServer', () => {
    it('should return MCP server instance', () => {
      const server = new MyBrowserControlServer();
      const mcpServer = server.getServer();
      expect(mcpServer).toBeDefined();
    });
  });

  describe('start', () => {
    it('should connect server successfully', async () => {
      const server = new MyBrowserControlServer();
      // Start should not throw
      await expect(server.start()).resolves.not.toThrow();
    });
  });
});
