/**
 * MyBrowserControl MCP Server
 * Provides browser automation tools through Model Context Protocol
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { PlaywrightCore } from './core/playwright.js';
import { MyBrowserControlConfig, DEFAULT_CONFIG, BrowserMode } from './config/types.js';

/**
 * MyBrowserControl MCP Server class
 */
export class MyBrowserControlServer {
  private server: Server;
  private playwright: PlaywrightCore;
  private config: MyBrowserControlConfig;

  constructor(config: Partial<MyBrowserControlConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.playwright = new PlaywrightCore(this.config);
    
    this.server = new Server(
      {
        name: 'mybrowsercontrol',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  /**
   * Set up MCP protocol handlers
   */
  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'browser_navigate',
          description: 'Navigate to a URL in the browser',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: 'The URL to navigate to',
              },
            },
            required: ['url'],
          },
        },
        {
          name: 'browser_screenshot',
          description: 'Take a screenshot of the current page',
          inputSchema: {
            type: 'object',
            properties: {
              fullPage: {
                type: 'boolean',
                description: 'Capture full page screenshot',
                default: false,
              },
            },
          },
        },
        {
          name: 'browser_content',
          description: 'Get the HTML content of the current page',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'browser_close',
          description: 'Close the browser',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Launch browser if not running
        if (!this.playwright.isRunning() && name !== 'browser_close') {
          await this.playwright.launch('chromium');
        }

        switch (name) {
          case 'browser_navigate': {
            const { url } = args as { url: string };
            await this.playwright.navigate(url);
            return {
              content: [
                {
                  type: 'text',
                  text: `Navigated to ${url}`,
                },
              ],
            };
          }

          case 'browser_screenshot': {
            const { fullPage } = args as { fullPage?: boolean };
            const screenshot = await this.playwright.screenshot({ fullPage });
            return {
              content: [
                {
                  type: 'image',
                  data: screenshot.toString('base64'),
                  mimeType: 'image/png',
                },
              ],
            };
          }

          case 'browser_content': {
            const content = await this.playwright.getContent();
            return {
              content: [
                {
                  type: 'text',
                  text: content,
                },
              ],
            };
          }

          case 'browser_close': {
            await this.playwright.close();
            return {
              content: [
                {
                  type: 'text',
                  text: 'Browser closed',
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  /**
   * Start the MCP server
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    // Log startup info to stderr (stdout is reserved for MCP protocol)
    console.error(`MyBrowserControl MCP Server v0.1.0`);
    console.error(`Mode: ${this.config.mode}`);
    console.error(`Server running on stdio transport`);
  }

  /**
   * Get server instance
   */
  getServer(): Server {
    return this.server;
  }
}
