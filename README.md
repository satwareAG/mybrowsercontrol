# MyBrowserControl

**Advanced browser automation MCP server built on Microsoft Playwright MCP foundation**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](package.json)

## 🎯 Overview

MyBrowserControl is a unified browser automation MCP (Model Context Protocol) server that combines the best features from multiple browser automation solutions:

- **Microsoft Playwright MCP** - Enterprise-grade foundation (21.4k stars, 96% issue resolution)
- **AgentDesk AI** - Lighthouse audits and advanced tooling
- **BrowserMCP** - Stealth mode and session management

### Three-Mode Architecture

1. **Native Mode** (Default) - Fast, direct Playwright automation
2. **Lighthouse Mode** - Performance audits and QA analysis
3. **Extension Mode** - Connect to existing browser sessions

## 🚀 Quick Start

### Installation

```bash
npm install -g @mybrowsercontrol/mcp
```

### Basic Usage

```bash
# Start server in native mode (default)
mybrowsercontrol

# Start in Lighthouse mode
mybrowsercontrol --mode lighthouse

# Start in headless mode
mybrowsercontrol --headless

# Start with headed mode (visible browser window)
mybrowsercontrol --headed

# Use system-installed browser instead of Playwright's bundled browser
mybrowsercontrol --executable-path /usr/bin/chromium

# Combined: headed mode with system browser
mybrowsercontrol --headed --executable-path /usr/bin/chromium
```

### MCP Configuration

Add to your `~/.cline/mcp_servers.json`:

```json
{
  "mcpServers": {
    "browser": {
      "command": "npx",
      "args": ["@mybrowsercontrol/mcp@latest"]
    }
  }
}
```

Or for local development:

```json
{
  "mcpServers": {
    "browser": {
      "command": "node",
      "args": ["/home/mw/Projects/mybrowsercontrol/dist/index.js"]
    }
  }
}
```

## 📚 Available Tools

### Core Tools (v0.1.0)

- `browser_navigate` - Navigate to a URL
- `browser_screenshot` - Capture page screenshot
- `browser_content` - Get page HTML content
- `browser_close` - Close the browser

### Coming Soon (Phase 2-3)

- `browser_lighthouse_audit` - Run Lighthouse performance audits
- `browser_session_save` - Save browser session state
- `browser_session_restore` - Restore saved session
- `browser_stealth_enable` - Enable anti-detection mode
- `browser_optimize_tokens` - AI-optimized result filtering

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│     AI Assistant (Cline/Claude)      │
└──────────────┬──────────────────────┘
               │ MCP Protocol
               ▼
┌─────────────────────────────────────┐
│   MyBrowserControl MCP Server        │
│                                      │
│  ┌────────────────────────────────┐ │
│  │  Core: Playwright Foundation   │ │
│  │  - 3 deployment modes          │ │
│  │  - Multi-browser support       │ │
│  │  - Accessibility-first         │ │
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │  Extensions (Coming Soon)      │ │
│  │  - Lighthouse integration      │ │
│  │  - Stealth mode                │ │
│  │  - Session management          │ │
│  │  - Screenshot optimization     │ │
│  └────────────────────────────────┘ │
└──────────────┬──────────────────────┘
               │ Playwright API
               ▼
        ┌──────────────┐
        │   Browser    │
        │ (Chrome/FF)  │
        └──────────────┘
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Setup

```bash
# Clone repository
git clone https://github.com/satwareAG/mybrowsercontrol.git
cd mybrowsercontrol

# Install dependencies
npm install

# Build
npm run build

# Run in development mode
npm run dev
```

### Project Structure

```
mybrowsercontrol/
├── src/
│   ├── index.ts              # Entry point
│   ├── server.ts             # MCP server implementation
│   ├── config/
│   │   └── types.ts          # Configuration types
│   ├── core/
│   │   └── playwright.ts     # Playwright wrapper
│   ├── extensions/           # Future extensions
│   │   ├── lighthouse/
│   │   ├── stealth/
│   │   ├── screenshot/
│   │   └── session/
│   └── tools/                # MCP tool implementations
├── dist/                     # Compiled output
├── docs/                     # Documentation
└── tests/                    # Test suite
```

## 🧪 Testing

MyBrowserControl follows Test-Driven Design (TDD) principles with comprehensive test coverage:

### Test Suite Status

- **Unit Tests**: ✅ 46 tests passing
- **Application Tests**: 🚧 Pending implementation
- **Integration Tests**: 🚧 Pending implementation  
- **Acceptance Tests**: 🚧 Pending implementation

### Running Tests

```bash
# Run all unit tests
npm run test:unit

# Run with coverage
npm run test:unit -- --coverage

# Watch mode for TDD
npm run test:watch

# Run all tests (when implemented)
npm test
```

### Manual Testing with MCP Inspector

Test tools interactively using the official MCP Inspector:

```bash
# Build project
npm run build

# Launch Inspector
npx @modelcontextprotocol/inspector node dist/index.js
```

The Inspector provides a web UI to:
- List all available MCP tools
- Execute tools with custom parameters
- View responses and debug issues
- Monitor MCP protocol messages

### Documentation

- **[Testing Guide](docs/TESTING.md)** - Comprehensive testing strategy
- **[Inspector Guide](docs/INSPECTOR.md)** - MCP Inspector usage and debugging

## 📖 Documentation

- [Getting Started](docs/getting-started.md) *(coming soon)*
- [Configuration Guide](docs/configuration.md) *(coming soon)*
- [API Reference](docs/api.md) *(coming soon)*
- [Integration Plan](docs/FINAL_INTEGRATION_PLAN.md)
- [Integration Analysis](docs/integration-analysis.md)
- [Testing Guide](docs/TESTING.md) ✅
- [Inspector Guide](docs/INSPECTOR.md) ✅

## 🗺️ Roadmap

### Phase 1: Foundation (Current - Months 1-2)
- [x] Project structure and TypeScript setup
- [x] Core Playwright wrapper
- [x] Basic MCP server implementation
- [x] Native mode with 4 core tools
- [ ] Testing framework
- [ ] CI/CD pipeline

### Phase 2: Extensions (Month 3)
- [ ] Lighthouse integration
- [ ] Screenshot optimization
- [ ] AI-optimized result filtering
- [ ] Extended tool set

### Phase 3: Advanced Features (Month 4)
- [ ] Multi-tab session management
- [ ] Stealth mode
- [ ] Session save/restore
- [ ] Selective tool loading

### Phase 4: Polish & Release (Months 5-6)
- [ ] Comprehensive testing
- [ ] Performance benchmarking
- [ ] Complete documentation
- [ ] v1.0.0 public release

## 🤝 Contributing

Contributions are welcome! This is an open-source project under the Apache 2.0 license.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

Apache License 2.0 - See [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built on the shoulders of giants:

- **Microsoft Playwright MCP** - Foundation and core architecture
- **AgentDesk AI** - Lighthouse integration inspiration
- **BrowserMCP** - Stealth mode techniques
- **Model Context Protocol** - MCP SDK and specification

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/satwareAG/mybrowsercontrol/issues)
- **Discussions**: [GitHub Discussions](https://github.com/satwareAG/mybrowsercontrol/discussions)
- **Email**: ja@satware.ai

## 🔗 Links

- [GitHub Repository](https://github.com/satwareAG/mybrowsercontrol)
- [npm Package](https://www.npmjs.com/package/@mybrowsercontrol/mcp) *(pending publication)*
- [Documentation](https://github.com/satwareAG/mybrowsercontrol/tree/main/docs)
- [Changelog](CHANGELOG.md) *(coming soon)*

---

**Status**: 🚧 Active Development (v0.1.0 - Phase 1)

**Made with ❤️ by satware AG**
