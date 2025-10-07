# Project Brief: MyBrowserControl

## Project Overview
MyBrowserControl integrates AgentDesk AI's browser-tools-mcp with Cline (AI assistant in IntelliJ IDEA) to enable intelligent browser automation, monitoring, and auditing capabilities through the Model Context Protocol (MCP).

## Core Objectives
- Enable AI-driven browser automation via MCP protocol
- Provide comprehensive browser monitoring (console, network, DOM)
- Support Lighthouse-powered audits (accessibility, performance, SEO, best practices)
- Offer real-time debugging and inspection capabilities
- Support both local and remote/LAN deployment scenarios

## Solution Architecture
This project uses **AgentDesk AI's browser-tools-mcp** (v1.2.0), which consists of:
- `@agentdeskai/browser-tools-mcp` - MCP server for Cline integration
- `@agentdeskai/browser-tools-server` - Node.js middleware server
- BrowserTools Chrome Extension - Browser integration and monitoring

### Alternative Solution
**BrowserMCP.io** (`@browsermcp/mcp`) exists as a simpler 2-component alternative but lacks the advanced features (Lighthouse audits, debugging tools, network monitoring) that AgentDesk AI provides.

## Target Users
- AI assistant users (Cline, Cursor, Claude Desktop)
- Developers needing browser automation from IDEs
- QA engineers performing automated audits
- Web developers optimizing accessibility and performance

## Key Requirements
### Functional Requirements
- Browser automation (navigate, click, type, screenshot)
- Console log and error monitoring
- Network request/response capture
- DOM element inspection and selection
- Lighthouse audits (accessibility, performance, SEO, best practices)
- Screenshot capture with auto-paste to IDE
- Support for both local and remote browser control

### Technical Requirements
- Node.js runtime for MCP and middleware servers
- Chromium-based browser (Chrome, Edge, Brave)
- Chrome extension installed and configured
- IntelliJ IDEA with Cline extension
- Network accessibility (localhost or LAN for remote scenarios)

## Deployment Scenarios

### Scenario 1: Local Deployment (Recommended)
All components run on mw-manjaro:
```
IntelliJ IDEA (Cline)
    ↓
@agentdeskai/browser-tools-mcp
    ↓
@agentdeskai/browser-tools-server:3025
    ↓
Chrome Extension
    ↓
Chromium Browser
```

### Scenario 2: Remote/LAN Deployment (Advanced)
MCP on mw-manjaro, browser on remote host:
```
mw-manjaro: Cline + MCP Server
    ↓ (LAN)
remote-host: Middleware + Extension + Browser
```

## Success Criteria
- Cline can successfully control browser via MCP tools
- Lighthouse audits execute and return comprehensive results
- Console logs, network traffic, and screenshots accessible from Cline
- Browser automation works reliably without manual intervention
- Extension maintains stable connection to middleware server
- All features work in local deployment
- Remote deployment documented and testable (optional)

## Initial Scope
### Phase 1: Local Deployment
- Install and configure all three components
- Verify MCP server connection from Cline
- Test basic browser automation (navigate, screenshot)
- Validate Lighthouse audits (accessibility, performance, SEO)
- Test debugging tools (console, network, DOM inspection)

### Phase 2: Advanced Features (Optional)
- Explore remote/LAN deployment
- Custom browser automation workflows
- Integration with development workflow
- Performance optimization

## Out of Scope (Initially)
- Multi-browser parallel execution
- Custom Lighthouse audit configurations
- Production deployment at scale
- Commercial features or licensing
- Browser farm infrastructure

## Technology Constraints
- Must work on Linux environment (mw-manjaro)
- Chromium-based browser required
- Node.js version 14+ required
- IntelliJ IDEA development environment
- MCP protocol support required

## Key Features of AgentDesk AI Solution
- ⚡ **Fast**: Local automation, no cloud latency
- 🔒 **Private**: All data stays on your machine
- 📊 **AI-Optimized Audits**: Lighthouse integration with smart limits
- 🔍 **Advanced Debugging**: Console, network, DOM monitoring
- ⚛️ **Framework-Specific**: NextJS audit support
- 📸 **Screenshot Auto-Paste**: Direct paste to Cursor/Cline
- 🛠️ **Automation Modes**: Audit Mode, Debugger Mode sequences

## Security Considerations
- All logs stored locally (never sent to external services)
- Server identity validation via signature endpoint
- Configurable host/port for network isolation
- No cookies or sensitive headers sent to LLMs
- Localhost-only binding by default

## Notes
This document serves as the foundation for all other Memory Bank files and defines the core direction of the project. The AgentDesk AI solution was chosen over BrowserMCP.io due to its comprehensive feature set, active development, and strong community support (6.7k GitHub stars).

Last updated: 2025-01-07
