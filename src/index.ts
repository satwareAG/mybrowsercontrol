#!/usr/bin/env node

/**
 * MyBrowserControl - Advanced browser automation MCP server
 * Built on Microsoft Playwright MCP foundation
 * 
 * @author satware AG
 * @license Apache-2.0
 */

import { MyBrowserControlServer } from './server.js';
import { BrowserMode } from './config/types.js';

/**
 * Parse command line arguments
 */
function parseArgs(): { mode?: BrowserMode; headless?: boolean } {
  const args = process.argv.slice(2);
  const config: { mode?: BrowserMode; headless?: boolean } = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--mode' && i + 1 < args.length) {
      const mode = args[i + 1];
      if (Object.values(BrowserMode).includes(mode as BrowserMode)) {
        config.mode = mode as BrowserMode;
      }
      i++;
    } else if (arg === '--headless') {
      config.headless = true;
    } else if (arg === '--headed') {
      config.headless = false;
    }
  }

  return config;
}

/**
 * Main entry point
 */
async function main() {
  try {
    const config = parseArgs();
    const server = new MyBrowserControlServer(config);
    await server.start();
  } catch (error) {
    console.error('Failed to start MyBrowserControl server:', error);
    process.exit(1);
  }
}

// Start the server
main();

// Export for programmatic use
export { MyBrowserControlServer };
export * from './config/types.js';
export * from './core/playwright.js';
