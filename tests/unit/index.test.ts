import { BrowserMode } from '../../src/config/types';

// Mock the server module
jest.mock('../../src/server', () => ({
  MyBrowserControlServer: jest.fn().mockImplementation(() => ({
    start: jest.fn().mockResolvedValue(undefined),
  })),
}));

describe('CLI Entry Point', () => {
  let originalArgv: string[];
  let originalExit: typeof process.exit;
  let mockExit: jest.Mock;

  beforeEach(() => {
    // Save original values
    originalArgv = process.argv;
    originalExit = process.exit;
    
    // Mock process.exit
    mockExit = jest.fn() as any;
    process.exit = mockExit;
    
    // Clear module cache to reload index.ts with new argv
    jest.resetModules();
  });

  afterEach(() => {
    // Restore original values
    process.argv = originalArgv;
    process.exit = originalExit;
  });

  describe('argument parsing', () => {
    it('should parse --mode native', async () => {
      process.argv = ['node', 'index.js', '--mode', 'native'];
      
      const { MyBrowserControlServer } = require('../../src/server');
      await import('../../src/index');
      
      expect(MyBrowserControlServer).toHaveBeenCalledWith(
        expect.objectContaining({ mode: BrowserMode.NATIVE })
      );
    });

    it('should parse --mode lighthouse', async () => {
      process.argv = ['node', 'index.js', '--mode', 'lighthouse'];
      
      const { MyBrowserControlServer } = require('../../src/server');
      await import('../../src/index');
      
      expect(MyBrowserControlServer).toHaveBeenCalledWith(
        expect.objectContaining({ mode: BrowserMode.LIGHTHOUSE })
      );
    });

    it('should parse --headless flag', async () => {
      process.argv = ['node', 'index.js', '--headless'];
      
      const { MyBrowserControlServer } = require('../../src/server');
      await import('../../src/index');
      
      expect(MyBrowserControlServer).toHaveBeenCalledWith(
        expect.objectContaining({ headless: true })
      );
    });

    it('should parse --headed flag', async () => {
      process.argv = ['node', 'index.js', '--headed'];
      
      const { MyBrowserControlServer } = require('../../src/server');
      await import('../../src/index');
      
      expect(MyBrowserControlServer).toHaveBeenCalledWith(
        expect.objectContaining({ headless: false })
      );
    });

    it('should use default config when no arguments provided', async () => {
      process.argv = ['node', 'index.js'];
      
      const { MyBrowserControlServer } = require('../../src/server');
      await import('../../src/index');
      
      expect(MyBrowserControlServer).toHaveBeenCalledWith({});
    });
  });

  describe('server initialization', () => {
    it('should start the server successfully', async () => {
      process.argv = ['node', 'index.js'];
      
      const { MyBrowserControlServer } = require('../../src/server');
      await import('../../src/index');
      
      const serverInstance = MyBrowserControlServer.mock.results[0].value;
      expect(serverInstance.start).toHaveBeenCalled();
    });
  });
});
