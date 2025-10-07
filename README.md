# MyBrowserControl MCP Server

> **Advanced browser automation MCP server built on Microsoft Playwright MCP foundation**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![MCP](https://img.shields.io/badge/MCP-1.0-green.svg)](https://modelcontextprotocol.io/)
[![Playwright](https://img.shields.io/badge/Playwright-Latest-orange.svg)](https://github.com/microsoft/playwright-mcp)

## Overview

MyBrowserControl is a Model Context Protocol (MCP) server that provides advanced browser automation capabilities for AI assistants like Cline, Claude Desktop, and other MCP-compatible applications.

Built on the foundation of [Microsoft's Playwright MCP](https://github.com/microsoft/playwright-mcp), MyBrowserControl extends it with:

- 🎯 **Accessibility-First Architecture** - No vision models needed
- 🔒 **Stealth Mode Capabilities** - Evade bot detection
- 📊 **Lighthouse Integration** - Automated QA audits
- 🖼️ **Smart Screenshot Management** - Token-optimized compression
- 💾 **Session State Preservation** - Multi-tab support and save/restore

## Features

### Core Capabilities (Powered by Playwright MCP)
- ✅ Multi-browser support (Chrome, Firefox, WebKit)
- ✅ 25+ built-in automation tools
- ✅ Structured accessibility tree navigation
- ✅ Deterministic tool application
- ✅ Enterprise-grade reliability (96% issue resolution rate)

### MyBrowserControl Extensions
- 🚀 **Three Deployment Modes**
  - **Native Mode**: Fast, Playwright-only automation
  - **Lighthouse Mode**: QA audits and performance testing
  - **Extension Mode**: Connect to existing browser sessions
- 🎨 **Token Optimization**: Smart screenshot compression and auto-paste
- 🔄 **Session Management**: Save/restore browser state across sessions
- 🕵️ **Stealth Features**: Advanced bot detection evasion

## Installation

### Prerequisites
- Node.js 18+ or Docker
- MCP-compatible application (Cline, Claude Desktop, etc.)

### Quick Start with Docker (Recommended)

```bash
# Pull the Docker image (when available)
docker pull ghcr.io/satwareag/mybrowsercontrol:latest

# Add to your MCP configuration
```

### Install from npm (Coming Soon)

```bash
npm install -g @mybrowsercontrol/mcp
```

## Configuration

### For Cline (IntelliJ IDEA Plugin)

Add to `~/.cline/data/settings/cline_mcp_settings.json`:

```json
{
  "mcpServers": {
    "mybrowsercontrol": {
      "disabled": false,
      "timeout": 60,
      "type": "stdio",
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "ghcr.io/satwareag/mybrowsercontrol"
      ]
    }
  }
}
```

### For Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mybrowsercontrol": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "ghcr.io/satwareag/mybrowsercontrol"]
    }
  }
}
```

## Usage

Once configured, MyBrowserControl tools will be available in your MCP client:

```
# Example: Launch browser and navigate
> Launch browser and go to https://example.com

# Example: Run Lighthouse audit
> Run a Lighthouse audit on the current page

# Example: Take optimized screenshot
> Take a screenshot and compress it for token efficiency
```

## Development Roadmap

### Phase 1-2: Foundation & Extensions (Months 1-3)
- [x] Project setup and structure
- [ ] Playwright MCP integration
- [ ] Mode system implementation (Native, Lighthouse, Extension)
- [ ] Basic tool extensions

### Phase 3: Advanced Features (Month 4)
- [ ] Session management system
- [ ] Stealth mode implementation
- [ ] Token optimization engine

### Phase 4: Polish & Release (Months 5-6)
- [ ] Documentation completion
- [ ] Performance optimization
- [ ] v1.0 release

See [FINAL_INTEGRATION_PLAN.md](./docs/FINAL_INTEGRATION_PLAN.md) for complete roadmap.

## Architecture

MyBrowserControl uses a layered architecture:

```
Cline/Claude → MyBrowserControl MCP Server
  ├── Core: @playwright/mcp (Microsoft Foundation)
  ├── Extensions:
  │   ├── Lighthouse (QA Audits)
  │   ├── Stealth Mode (Bot Evasion)
  │   ├── Smart Screenshots (Token Optimization)
  │   └── Session Manager (State Persistence)
  └── Modes:
      ├── Native (Fast Playwright automation)
      ├── Lighthouse (Performance testing)
      └── Extension (Existing browser sessions)
```

## Documentation

- [Getting Started](./docs/getting-started.md) - Installation and setup guide
- [Modes](./docs/modes.md) - Understanding deployment modes
- [Tools](./docs/tools.md) - Complete tools reference
- [Integration Plan](./docs/FINAL_INTEGRATION_PLAN.md) - Development roadmap
- [Architecture](./docs/architecture.md) - Technical architecture details

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

Apache License 2.0 - See [LICENSE](./LICENSE) for details.

## Acknowledgments

- Built on [Microsoft Playwright MCP](https://github.com/microsoft/playwright-mcp)
- Inspired by [BrowserMCP](https://github.com/BrowserMCP/mcp) stealth techniques
- Lighthouse integration patterns from [AgentDesk AI](https://github.com/AgentDeskAI/browser-tools-mcp)

## Project Status

**Current Status:** 🚧 Active Development (Pre-Alpha)

- Repository: https://github.com/satwareAG/mybrowsercontrol
- Maintained by: [satware AG](https://satware.ai)
- Contact: ja@satware.ai

---

**Note:** This project is in early development. Features and APIs are subject to change.
