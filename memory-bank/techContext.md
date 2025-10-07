# Technical Context: MyBrowserControl

## Technology Stack

### Core Components

#### 1. MCP Server
**Package:** `@agentdeskai/browser-tools-mcp`
**Version:** Latest (1.2.0+)
**Language:** TypeScript/JavaScript
**Runtime:** Node.js 14+
**Purpose:** MCP protocol server for Cline integration

**Key Dependencies:**
- `@modelcontextprotocol/sdk` v1.8.0+ - MCP protocol implementation
- `commander` v13.1.0+ - CLI argument parsing
- `ws` v8.18.1+ - WebSocket client for middleware communication
- `zod` v3.24.2+ - Schema validation
- `zod-to-json-schema` v3.24.3+ - Schema conversion for MCP

#### 2. Middleware Server
**Package:** `@agentdeskai/browser-tools-server`
**Version:** Latest (1.2.0+)
**Language:** TypeScript/JavaScript
**Runtime:** Node.js 14+
**Default Port:** 3025
**Purpose:** Middleware between MCP and browser extension

**Key Dependencies:**
- `puppeteer` - Headless browser automation
- `lighthouse` v11.7.1+ - Web page auditing
- `ws` v8.18+ - WebSocket server for extension
- `express` or similar - HTTP server framework
- Chrome/Chromium launcher utilities

#### 3. Chrome Extension
**Package:** BrowserTools Chrome Extension
**Version:** 1.2.0
**Manifest Version:** 3
**Languages:** JavaScript (ES6+), HTML, CSS
**Purpose:** Browser integration and event capture

**Key Files:**
- `manifest.json` - Extension configuration
- `background.js` - Service worker (tab tracking, screenshots, server validation)
- `devtools.js` - DevTools panel initialization
- `panel.js` - DevTools panel UI and logic
- `panel.html` - DevTools panel interface

#### 4. IDE Integration
**IDE:** IntelliJ IDEA
**Plugin:** Cline AI Assistant
**Configuration:** `.cline/mcp_servers.json`
**Purpose:** AI coding assistant with MCP support

### Supporting Technologies

#### Node.js & npm
**Version Required:** 14.0.0+
**Recommended:** 18.0.0+ or 20.0.0+
**Package Manager:** npm (comes with Node.js)

**Installation Check:**
```bash
node --version  # Should be v14+
npm --version   # Should be 6+
```

#### Chromium-Based Browser
**Supported Browsers:**
- Google Chrome (recommended)
- Microsoft Edge
- Brave Browser
- Chromium

**Version Required:** Latest stable
**Purpose:** Run extension and user browsing

#### Puppeteer
**Purpose:** Headless browser automation for audits
**Browser:** Downloads own Chromium version
**Configuration:** Cross-platform browser detection
**Features:**
- Screenshot capture
- Page navigation
- DOM manipulation
- Network interception

#### Lighthouse
**Version:** 11.7.1+
**Purpose:** Web page auditing
**Categories:**
- Accessibility (WCAG compliance)
- Performance (Core Web Vitals)
- SEO (search optimization)
- Best Practices (web standards)

**Configuration:**
- Device emulation (desktop/mobile)
- Network throttling (optional)
- Smart result limits for AI consumption

## Development Setup

### System Requirements

**Operating System:**
- Linux (mw-manjaro) ✓
- macOS (supported)
- Windows (supported)

**Hardware:**
- CPU: 2+ cores recommended
- RAM: 4GB minimum, 8GB recommended
- Disk: 500MB for Node modules + Chrome
- Network: LAN access (for remote deployment)

### Initial Setup Process

#### Step 1: Verify Node.js Installation
```bash
# Check if Node.js is installed
node --version

# If not installed, on mw-manjaro (Arch-based):
sudo pacman -S nodejs npm

# Or download from https://nodejs.org
```

#### Step 2: Install Chrome Extension
```bash
# Download extension v1.2.0
wget https://github.com/AgentDeskAI/browser-tools-mcp/releases/download/v1.2.0/BrowserTools-1.2.0-extension.zip

# Extract
unzip BrowserTools-1.2.0-extension.zip -d ~/Downloads/BrowserTools-Extension

# Manual installation in Chrome:
# 1. Open chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select ~/Downloads/BrowserTools-Extension directory
```

#### Step 3: Configure Cline MCP Server
```bash
# Create Cline MCP configuration directory
mkdir -p ~/.cline

# Create MCP servers configuration
cat > ~/.cline/mcp_servers.json << 'EOF'
{
  "mcpServers": {
    "browser-tools": {
      "command": "npx",
      "args": ["@agentdeskai/browser-tools-mcp@latest"]
    }
  }
}
EOF
```

**Alternative location:** `/home/mw/Projects/mybrowsercontrol/.cline/mcp_servers.json`

#### Step 4: Start Middleware Server
```bash
# Terminal window - keep running
npx @agentdeskai/browser-tools-server@latest

# Expected output:
# Browser Tools Server v1.2.0
# Listening on http://localhost:3025
# Server identity: mcp-browser-connector-24x7
```

#### Step 5: Configure Extension
```bash
# In Chrome:
# 1. Open Developer Tools (F12)
# 2. Click "BrowserToolsMCP" panel
# 3. Verify connection status
# 4. Configure if needed:
#    - Server Host: localhost (default)
#    - Server Port: 3025 (default)
```

#### Step 6: Restart Cline
```bash
# In IntelliJ IDEA:
# 1. Close and reopen IDE, or
# 2. Restart Cline extension
# 3. Verify MCP tools loaded:
#    - Ask Cline: "What browser tools do you have?"
```

## Configuration Files

### .cline/mcp_servers.json
**Location:** `~/.cline/mcp_servers.json` or `{project}/.cline/mcp_servers.json`
**Format:** JSON
**Purpose:** Configure MCP servers for Cline

**Standard Configuration:**
```json
{
  "mcpServers": {
    "browser-tools": {
      "command": "npx",
      "args": ["@agentdeskai/browser-tools-mcp@latest"]
    }
  }
}
```

**Advanced Configuration (if needed):**
```json
{
  "mcpServers": {
    "browser-tools": {
      "command": "npx",
      "args": ["@agentdeskai/browser-tools-mcp@latest"],
      "env": {
        "BROWSER_TOOLS_SERVER_HOST": "localhost",
        "BROWSER_TOOLS_SERVER_PORT": "3025"
      }
    }
  }
}
```

**For Remote Deployment:**
```json
{
  "mcpServers": {
    "browser-tools": {
      "command": "npx",
      "args": ["@agentdeskai/browser-tools-mcp@latest"],
      "env": {
        "BROWSER_TOOLS_SERVER_HOST": "192.168.1.100",
        "BROWSER_TOOLS_SERVER_PORT": "3025"
      }
    }
  }
}
```

### Chrome Extension Storage
**Storage Type:** chrome.storage.local
**Purpose:** Persist extension configuration
**Access:** Via DevTools panel UI

**Default Settings:**
```javascript
{
  browserConnectorSettings: {
    serverHost: "localhost",
    serverPort: 3025
  }
}
```

**Remote Server Settings:**
```javascript
{
  browserConnectorSettings: {
    serverHost: "192.168.1.100",  // Remote middleware server
    serverPort: 3025
  }
}
```

### Extension manifest.json
**Location:** Extension directory
**Purpose:** Chrome extension configuration
**Key Permissions:**
- `tabs` - Tab access and manipulation
- `activeTab` - Current tab interaction
- `webRequest` - Network monitoring
- `storage` - Settings persistence
- `devtools` - DevTools panel integration

**Excerpt:**
```json
{
  "manifest_version": 3,
  "name": "BrowserTools MCP",
  "version": "1.2.0",
  "permissions": [
    "tabs",
    "activeTab", 
    "webRequest",
    "storage"
  ],
  "devtools_page": "devtools.html",
  "background": {
    "service_worker": "background.js"
  }
}
```

## Environment Variables

### Middleware Server
```bash
# Default configuration (usually not needed)
export BROWSER_TOOLS_SERVER_PORT=3025
export BROWSER_TOOLS_SERVER_HOST=0.0.0.0  # For remote access

# Run server with custom config
BROWSER_TOOLS_SERVER_PORT=3030 npx @agentdeskai/browser-tools-server@latest
```

### MCP Server
```bash
# Remote middleware server (if needed)
export BROWSER_TOOLS_SERVER_URL=http://192.168.1.100:3025
```

### Node.js Settings
```bash
# Increase memory limit for large Lighthouse audits
export NODE_OPTIONS="--max-old-space-size=4096"
```

## Dependencies Management

### Installing Components

**MCP Server (automatic via npx):**
```bash
# Cline automatically runs this when configured:
npx @agentdeskai/browser-tools-mcp@latest

# Manual test:
npx @agentdeskai/browser-tools-mcp@latest --version
```

**Middleware Server:**
```bash
# Run directly with npx (recommended):
npx @agentdeskai/browser-tools-server@latest

# Or install globally:
npm install -g @agentdeskai/browser-tools-server
browser-tools-server

# Or install locally in project:
cd /home/mw/Projects/mybrowsercontrol
npm install @agentdeskai/browser-tools-server
npx browser-tools-server
```

### Updating Components

```bash
# Update MCP server (npx always fetches latest)
# Just restart Cline - it will auto-update

# Update middleware server
npx @agentdeskai/browser-tools-server@latest  # Always gets latest

# Or if installed globally:
npm update -g @agentdeskai/browser-tools-server

# Check versions
npm view @agentdeskai/browser-tools-mcp version
npm view @agentdeskai/browser-tools-server version
```

### Troubleshooting Dependencies

```bash
# Clear npx cache
npm cache clean --force

# Check Node.js modules
npm list -g --depth=0  # Global packages
npm list --depth=0     # Local packages

# Reinstall if issues
rm -rf node_modules package-lock.json
npm install
```

## Tool Usage Patterns

### Running Middleware Server

**Standard Usage:**
```bash
# Terminal 1 - Keep running during development
npx @agentdeskai/browser-tools-server@latest

# Expected output:
# ╔══════════════════════════════════════════════╗
# ║  Browser Tools Server v1.2.0                 ║
# ║  Listening on http://localhost:3025          ║
# ║  Server identity: mcp-browser-connector-24x7 ║
# ╚══════════════════════════════════════════════╝
```

**With Custom Port:**
```bash
BROWSER_TOOLS_SERVER_PORT=3030 npx @agentdeskai/browser-tools-server@latest
```

**Binding to All Interfaces (for remote access):**
```bash
BROWSER_TOOLS_SERVER_HOST=0.0.0.0 npx @agentdeskai/browser-tools-server@latest
```

**Background Process (Linux):**
```bash
# Start in background
nohup npx @agentdeskai/browser-tools-server@latest > /tmp/browser-tools.log 2>&1 &

# Check if running
ps aux | grep browser-tools-server

# View logs
tail -f /tmp/browser-tools.log

# Stop
pkill -f browser-tools-server
```

### Testing Server Connection

```bash
# Test server identity endpoint
curl http://localhost:3025/.identity

# Expected response:
# {"signature":"mcp-browser-connector-24x7","version":"1.2.0"}

# Test health (if available)
curl http://localhost:3025/health

# Test console logs endpoint
curl http://localhost:3025/console-logs

# Test with Cline via MCP tools
# In Cline: "Get console logs from the browser"
```

### Extension Management

**Loading Extension:**
1. Chrome → `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select extension directory
5. Pin to toolbar for easy access

**Updating Extension:**
1. Download new version
2. Extract to same location (overwrite)
3. Chrome → Extensions → Click reload icon

**Verifying Extension:**
1. Open DevTools (F12)
2. Check for "BrowserToolsMCP" panel
3. Click panel to see connection status
4. Should show "Connected" if middleware running

### MCP Tools Available to Cline

Once configured, Cline has access to these tools:

**Console Monitoring:**
- `get_console_logs` - Get recent console output
- `get_console_errors` - Get recent errors

**Network Analysis:**
- `get_network_errors` - Get failed requests
- `get_network_success` - Get successful requests
- `get_all_xhr` - Get all network requests

**Browser Control:**
- `capture_screenshot` - Take browser screenshot
- `get_selected_element` - Get current DOM element
- `wipe_logs` - Clear all stored logs

**Lighthouse Audits:**
- `runAccessibilityAudit` - WCAG compliance check
- `runPerformanceAudit` - Core Web Vitals analysis
- `runSEOAudit` - Search optimization check
- `runBestPracticesAudit` - Web standards validation
- `runNextJSAudit` - NextJS-specific analysis

**Automation Modes:**
- `runAuditMode` - Run all audits in sequence
- `runDebuggerMode` - Run all debugging tools

## Technical Constraints

### Network Requirements

**Local Deployment:**
- Localhost communication only
- No external network needed
- No firewall configuration required

**Remote Deployment:**
- LAN connectivity required
- Port 3025 must be accessible
- Firewall rules may be needed
- Static IP or hostname for server
- Low latency recommended (<50ms)

### Port Requirements

**Port 3025 (Middleware Server):**
- Must not conflict with other services
- Default can be changed via environment variable
- Must be accessible from extension (localhost or LAN)

**Common Conflicts:**
- Port 3000: Create React App, Next.js dev servers
- Port 8080: Common development servers
- Port 3025: Usually available (not a standard port)

### Browser Requirements

**Supported:**
- Chrome 80+ (recommended)
- Edge 80+
- Brave (Chromium-based)
- Chromium 80+

**Not Supported:**
- Firefox (different extension API)
- Safari (different extension API)
- Internet Explorer (obsolete)

### File System Requirements

**Extension Directory:**
- Read access to extension files
- Location: `~/Downloads/BrowserTools-Extension` (or custom)

**Screenshot Storage:**
- Write access to configured screenshot directory
- Default: `/tmp` or system temp directory
- Configurable via extension settings

**Logs:**
- In-memory only (no disk storage)
- Cleared on middleware server restart

### Memory Requirements

**MCP Server:**
- ~20-50MB RAM
- Minimal CPU usage
- Runs continuously while Cline active

**Middleware Server:**
- ~50-100MB RAM (idle)
- ~200-400MB RAM (during Lighthouse audit)
- CPU spikes during audits
- Puppeteer headless browser ~100-200MB

**Chrome Extension:**
- ~10-30MB RAM
- Minimal CPU usage
- Increases with console/network activity

### Performance Considerations

**Lighthouse Audits:**
- 10-30 seconds for accessibility
- 20-60 seconds for performance
- 5-15 seconds for SEO
- 5-10 seconds for best practices
- Timeout: 60 seconds (configurable)

**Console Log Capture:**
- Real-time (< 100ms latency)
- Limited to recent 100 entries
- Automatic truncation

**Network Monitoring:**
- Real-time (< 100ms latency)
- Limited to recent 100 requests
- Sensitive headers filtered

**Screenshot Capture:**
- 1-3 seconds for full page
- Depends on page complexity
- Size limit: ~5MB per screenshot

## CLI Commands Reference

### Server Management

```bash
# Start middleware server
npx @agentdeskai/browser-tools-server@latest

# Start with custom port
BROWSER_TOOLS_SERVER_PORT=3030 npx @agentdeskai/browser-tools-server@latest

# Start with all interfaces (remote access)
BROWSER_TOOLS_SERVER_HOST=0.0.0.0 npx @agentdeskai/browser-tools-server@latest

# Stop (Ctrl+C in terminal or):
pkill -f browser-tools-server

# Check if running
ps aux | grep browser-tools-server
lsof -i :3025  # Check port 3025
```

### Testing

```bash
# Test server identity
curl http://localhost:3025/.identity

# Test console logs endpoint
curl http://localhost:3025/console-logs

# Test with POST
curl -X POST http://localhost:3025/wipelogs

# Test Lighthouse audit
curl -X POST http://localhost:3025/accessibility-audit \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

### Extension Management

```bash
# Download extension
wget https://github.com/AgentDeskAI/browser-tools-mcp/releases/download/v1.2.0/BrowserTools-1.2.0-extension.zip

# Extract
unzip BrowserTools-1.2.0-extension.zip -d ~/BrowserTools-Extension

# List extension directory
ls -la ~/BrowserTools-Extension/
```

### Node.js Utilities

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Clear npm cache
npm cache clean --force

# List global packages
npm list -g --depth=0

# Update npm itself
npm install -g npm@latest
```

## Common Issues and Solutions

### Issue: Port 3025 Already in Use

```bash
# Check what's using port 3025
lsof -i :3025

# Kill the process
kill -9 <PID>

# Or use different port
BROWSER_TOOLS_SERVER_PORT=3030 npx @agentdeskai/browser-tools-server@latest
```

### Issue: Extension Can't Connect

**Solution 1: Verify server running**
```bash
curl http://localhost:3025/.identity
```

**Solution 2: Check extension settings**
- Open DevTools → BrowserToolsMCP panel
- Verify serverHost: localhost
- Verify serverPort: 3025
- Click "Connect" button

**Solution 3: Reload extension**
- Chrome → Extensions
- Click reload icon on BrowserTools

### Issue: Cline Can't Find MCP Tools

**Solution:** Check MCP configuration
```bash
# Verify config file exists
cat ~/.cline/mcp_servers.json

# Or project-specific
cat .cline/mcp_servers.json

# Restart Cline/IntelliJ IDEA
```

### Issue: Lighthouse Audits Timeout

**Solution:** Increase memory/timeout
```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npx @agentdeskai/browser-tools-server@latest
```

### Issue: Screenshots Not Saving

**Solution:** Check permissions
```bash
# Verify screenshot directory writable
ls -la /tmp

# Or configure custom directory in extension settings
```

## Version Compatibility

### Tested Configurations

**Recommended:**
- Node.js: 20.x LTS
- Chrome: Latest stable
- Extension: 1.2.0
- @agentdeskai/browser-tools-mcp: 1.2.0+
- @agentdeskai/browser-tools-server: 1.2.0+

**Minimum:**
- Node.js: 14.0.0
- Chrome: 80+
- Extension: 1.0.0+
- @agentdeskai/browser-tools-*: 1.0.0+

### Updating Strategy

1. **Always update extension first**
2. Then update middleware server
3. Finally update MCP server (via npx auto-update)
4. Test after each update
5. Keep Node.js updated to LTS version

Last updated: 2025-01-07
