# System Patterns: MyBrowserControl

## System Architecture

### Overview
MyBrowserControl implements a **4-layer architecture** using AgentDesk AI's browser-tools-mcp solution. Each layer has distinct responsibilities and communicates through well-defined protocols.

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1: AI Interface (IntelliJ IDEA on mw-manjaro)       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Cline AI Assistant                                   │  │
│  │  - Natural language processing                        │  │
│  │  - MCP protocol client                                │  │
│  │  - Tool invocation                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│                    [MCP Protocol]                            │
│                  (JSON-RPC over stdio)                       │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  LAYER 2: MCP Server (mw-manjaro)                           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  @agentdeskai/browser-tools-mcp                       │  │
│  │  - MCP tool definitions                               │  │
│  │  - Command translation                                │  │
│  │  - Result formatting                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│                    [HTTP REST API]                           │
│              (GET/POST to localhost:3025)                    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  LAYER 3: Middleware Server (mw-manjaro or remote)          │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  @agentdeskai/browser-tools-server:3025               │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  HTTP API Server                                │  │  │
│  │  │  - /console-logs, /console-errors               │  │  │
│  │  │  - /network-errors, /network-success            │  │  │
│  │  │  - /screenshot, /selected-element               │  │  │
│  │  │  - /accessibility-audit, /performance-audit     │  │  │
│  │  │  - /seo-audit, /best-practices-audit            │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Puppeteer Service                              │  │  │
│  │  │  - Headless browser automation                  │  │  │
│  │  │  - Lighthouse integration                       │  │  │
│  │  │  - Screenshot capture                           │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  WebSocket Server                               │  │  │
│  │  │  - Real-time browser communication              │  │  │
│  │  │  - Event streaming                              │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Log Storage                                    │  │  │
│  │  │  - Console logs (in-memory)                     │  │  │
│  │  │  - Network requests (in-memory)                 │  │  │
│  │  │  - Selected element cache                       │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│                    [WebSocket + HTTP]                        │
│                    (localhost or LAN)                        │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  LAYER 4: Browser Integration (mw-manjaro or remote)        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  BrowserTools Chrome Extension v1.2.0                 │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  background.js (Service Worker)                 │  │  │
│  │  │  - Tab URL tracking                             │  │  │
│  │  │  - Screenshot capture orchestration             │  │  │
│  │  │  - Server identity validation                   │  │  │
│  │  │  - Connection management                        │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  devtools.js + panel.js (DevTools Panel)        │  │  │
│  │  │  - UI for connection status                     │  │  │
│  │  │  - Server configuration (host/port)             │  │  │
│  │  │  - Auto-discovery mechanism                     │  │  │
│  │  │  - Screenshot settings                          │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Content Scripts                                │  │  │
│  │  │  - Console API interception                     │  │  │
│  │  │  - Network monitoring (XHR/Fetch)               │  │  │
│  │  │  - DOM element tracking                         │  │  │
│  │  │  - Event capture and forwarding                 │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│                    [Chrome APIs]                             │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Chromium Browser (mw-manjaro or remote)                    │
│  - Renders web pages                                        │
│  - Executes JavaScript                                      │
│  - Manages cookies and sessions                             │
│  - Uses existing user profile                               │
└─────────────────────────────────────────────────────────────┘
```

## Key Technical Decisions

### 1. Why 3 Components Instead of 2?

**Decision:** Use middleware server between MCP and browser extension

**Rationale:**
- **Separation of Concerns**: MCP server handles protocol, middleware handles browser logic
- **Flexibility**: Middleware can run on different host than MCP server
- **Advanced Features**: Puppeteer/Lighthouse require server-side execution
- **State Management**: Centralized log storage and caching
- **Multiple Clients**: One middleware can serve multiple MCP server instances

**Alternative Considered:** Direct MCP-to-extension communication (like BrowserMCP.io)
**Why Rejected:** No way to run Lighthouse audits, limited to basic automation

### 2. Port 3025 for Middleware

**Decision:** Default middleware port is 3025

**Rationale:**
- **Avoids conflicts**: Common ports (3000, 8080) often in use
- **Above privileged range**: No root/admin required
- **Consistent**: Documented in all AgentDesk AI materials

**Configuration:**
```javascript
// Stored in chrome.storage.local
{
  browserConnectorSettings: {
    serverHost: "localhost",  // or remote IP
    serverPort: 3025
  }
}
```

### 3. Server Identity Validation

**Decision:** Validate server identity before communication

**Rationale:**
- **Security**: Ensure extension only talks to legitimate server
- **Error Prevention**: Detect misconfigurations early
- **Trust**: User confidence in system integrity

**Implementation:**
```javascript
// Extension validates via signature endpoint
GET http://localhost:3025/.identity

Response:
{
  "signature": "mcp-browser-connector-24x7",
  "version": "1.2.0"
}
```

### 4. In-Memory Log Storage

**Decision:** Store logs in middleware server memory, not disk

**Rationale:**
- **Privacy**: Logs never written to permanent storage
- **Performance**: Fast access, no I/O overhead
- **Simplicity**: No database or file management needed
- **Cleanup**: Logs cleared on server restart

**Limits:**
- Configurable via extension settings
- Smart truncation for AI consumption
- Recent logs prioritized

### 5. Lighthouse via Puppeteer

**Decision:** Run Lighthouse in headless browser via Puppeteer

**Rationale:**
- **Isolation**: Audits don't interfere with user's browser
- **Accuracy**: Consistent environment for testing
- **Features**: Full Lighthouse capabilities available
- **Automation**: Programmatic control over browser

**Configuration:**
- Headless browser instance timeout: 60 seconds
- Singleton pattern: One browser instance reused
- Graceful cleanup: Auto-closes after inactivity

## Design Patterns

### 1. Chain of Responsibility
**Where:** Request processing through layers
**Why:** Each layer handles specific concerns, passes to next

```
User Request
  → Cline (natural language → MCP tool)
  → MCP Server (MCP tool → HTTP request)
  → Middleware (HTTP request → browser action)
  → Extension (browser action → Chrome API)
  → Browser (Chrome API → result)
Result flows back through chain
```

### 2. Observer Pattern
**Where:** Extension monitoring browser events
**Why:** React to browser changes without polling

```javascript
// Extension observes:
- Console API calls
- Network requests
- DOM mutations
- Tab navigation
- Element selection

// Notifies middleware when events occur
```

### 3. Adapter Pattern
**Where:** Middleware adapts protocols
**Why:** Bridge incompatible interfaces

```
MCP Protocol ←→ HTTP REST API ←→ WebSocket ←→ Chrome Extension API
```

### 4. Singleton Pattern
**Where:** Puppeteer browser instance
**Why:** Expensive resource, reuse for multiple audits

```javascript
// One headless browser instance
// Shared across all audit requests
// 60-second timeout after last use
// Automatically cleaned up
```

### 5. Facade Pattern
**Where:** MCP tools simplify complex operations
**Why:** Hide complexity from AI/user

```
Simple: "Run accessibility audit"
Complex: Launch Puppeteer → Configure Lighthouse → 
         Run audit → Parse results → Apply smart limits →
         Format for AI → Return structured data
```

### 6. Command Pattern
**Where:** Browser actions as commands
**Why:** Encapsulate requests, enable retry/undo

```javascript
// Commands
- NavigateCommand(url)
- ClickCommand(selector)
- TypeCommand(selector, text)
- ScreenshotCommand(path)
- AuditCommand(type, options)
```

## Component Relationships

### MCP Server ↔ Middleware Server

**Protocol:** HTTP REST API
**Direction:** Bidirectional
**Endpoints:**

```
GET  /console-logs        → Recent console output
GET  /console-errors      → Recent errors
GET  /network-errors      → Failed requests
GET  /network-success     → Successful requests
GET  /all-xhr             → All network requests
GET  /selected-element    → Current DOM element

POST /screenshot          → Trigger screenshot capture
POST /selected-element    → Update selected element
POST /wipelogs            → Clear all stored logs
POST /accessibility-audit → Run WCAG audit
POST /performance-audit   → Run performance audit
POST /seo-audit          → Run SEO audit
POST /best-practices-audit → Run best practices audit
POST /current-url        → Update current page URL
```

**Data Flow:**
```
MCP Tool Invocation
  → HTTP Request (JSON payload)
  → Middleware processes
  → Returns JSON response
  → MCP formats for Cline
  → Cline presents to user
```

### Middleware Server ↔ Chrome Extension

**Protocol:** WebSocket + HTTP
**Direction:** Bidirectional

**WebSocket (Real-time):**
```javascript
// Extension → Middleware
{
  type: "console",
  level: "error",
  message: "ReferenceError: x is not defined",
  timestamp: 1704658800000
}

{
  type: "network",
  method: "POST",
  url: "/api/user",
  status: 404,
  timestamp: 1704658800000
}

// Middleware → Extension
{
  type: "screenshot_request",
  path: "/tmp/screenshot.png"
}
```

**HTTP (Configuration):**
```javascript
// Extension queries server identity
GET /.identity

// Extension sends current URL
POST /current-url
{
  "url": "https://example.com",
  "tabId": 123,
  "timestamp": 1704658800000
}
```

### Extension ↔ Browser

**Protocol:** Chrome Extension APIs
**Direction:** Bidirectional

**APIs Used:**
```javascript
// Monitoring
chrome.webRequest.*      // Network traffic
console.* interception   // Console logs

// Control
chrome.tabs.captureVisibleTab()  // Screenshots
chrome.tabs.get()                // Tab info
chrome.tabs.query()              // Find tabs

// Storage
chrome.storage.local.*   // Settings persistence

// Messaging
chrome.runtime.sendMessage()     // Internal communication
```

## Critical Implementation Paths

### Path 1: Screenshot Capture

```
1. User: "Take a screenshot"
2. Cline invokes MCP tool: capture_screenshot
3. MCP Server → POST http://localhost:3025/screenshot
4. Middleware:
   a. Validates server identity
   b. Gets tab information
   c. Sends WebSocket message to extension
5. Extension (background.js):
   a. Receives WebSocket message
   b. Calls chrome.tabs.captureVisibleTab()
   c. Converts to data URL
   d. POSTs to middleware /screenshot endpoint
6. Middleware:
   a. Receives base64 image data
   b. Saves to filesystem
   c. Returns file path
7. MCP Server formats response
8. Cline shows user: "Screenshot saved to /path/to/screenshot.png"
```

### Path 2: Accessibility Audit

```
1. User: "Run accessibility audit"
2. Cline invokes MCP tool: runAccessibilityAudit
3. MCP Server → POST http://localhost:3025/accessibility-audit
4. Middleware (Puppeteer Service):
   a. Gets current page URL from extension
   b. Launches headless Chrome (if not running)
   c. Navigates to URL
   d. Runs Lighthouse accessibility category
   e. Parses results
   f. Applies smart limits:
      - Critical: No limit
      - Serious: Max 15 items
      - Moderate: Max 10 items
      - Minor: Max 3 items
   g. Structures for AI consumption
   h. Returns JSON response
5. MCP Server formats results
6. Cline analyzes and presents:
   "Accessibility Score: 88/100
    Critical Issues:
    - Meta viewport disables zooming
    Recommendations:
    - Remove user-scalable=no from viewport tag"
```

### Path 3: Console Error Monitoring

```
1. Browser executes JavaScript
2. Error occurs: ReferenceError
3. Extension (content script):
   a. Intercepts console.error call
   b. Captures stack trace, message, timestamp
   c. Sends via WebSocket to middleware
4. Middleware:
   a. Stores in /console-errors queue
   b. Applies truncation limits
   c. Maintains recent 100 errors
5. User asks Cline: "Are there any console errors?"
6. Cline invokes MCP tool: get_console_errors
7. MCP Server → GET http://localhost:3025/console-errors
8. Middleware returns error array
9. Cline analyzes and presents:
   "Found 3 console errors:
    1. ReferenceError: variable is not defined (line 45)"
```

### Path 4: Network Request Analysis

```
1. Browser makes XHR request
2. Extension (background.js):
   a. chrome.webRequest API intercepts
   b. Captures URL, method, status, headers, body
   c. Filters sensitive data (cookies, auth headers)
   d. Sends to middleware via WebSocket
3. Middleware:
   a. Categorizes as success/error
   b. Stores in appropriate queue
   c. Maintains recent 100 requests
4. User asks Cline: "Show failed network requests"
5. Cline → GET http://localhost:3025/network-errors
6. Middleware returns failed request array
7. Cline presents: "2 failed requests:
   POST /api/user → 404 Not Found"
```

## Deployment Architectures

### Architecture 1: All Local (Recommended)

**Use Case:** Single developer machine
**Setup Complexity:** Low
**Performance:** Fastest (no network latency)

```
┌─────────────────────────────────────────┐
│  mw-manjaro (192.168.1.50)              │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  IntelliJ IDEA + Cline          │   │
│  └─────────────────────────────────┘   │
│                 ↓ (MCP)                 │
│  ┌─────────────────────────────────┐   │
│  │  @agentdeskai/browser-tools-mcp │   │
│  └─────────────────────────────────┘   │
│                 ↓ (localhost:3025)      │
│  ┌─────────────────────────────────┐   │
│  │  browser-tools-server:3025      │   │
│  └─────────────────────────────────┘   │
│                 ↓ (localhost)           │
│  ┌─────────────────────────────────┐   │
│  │  Chrome Extension               │   │
│  │  (serverHost: localhost)        │   │
│  │  (serverPort: 3025)             │   │
│  └─────────────────────────────────┘   │
│                 ↓                       │
│  ┌─────────────────────────────────┐   │
│  │  Chromium Browser               │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Configuration:**
```json
// .cline/mcp_servers.json
{
  "mcpServers": {
    "browser-tools": {
      "command": "npx",
      "args": ["@agentdeskai/browser-tools-mcp@latest"]
    }
  }
}
```

```bash
# Terminal 1
npx @agentdeskai/browser-tools-server@latest
# Listening on http://localhost:3025
```

```javascript
// Extension settings (chrome.storage.local)
{
  serverHost: "localhost",
  serverPort: 3025
}
```

### Architecture 2: Remote Browser (Advanced)

**Use Case:** Browser on different machine (testing, isolation, headless)
**Setup Complexity:** Medium
**Performance:** Good (LAN latency only)

```
┌─────────────────────────────────────────┐
│  mw-manjaro (192.168.1.50)              │
│  Developer Machine                      │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  IntelliJ IDEA + Cline          │   │
│  └─────────────────────────────────┘   │
│                 ↓ (MCP - local)         │
│  ┌─────────────────────────────────┐   │
│  │  @agentdeskai/browser-tools-mcp │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
                 ↓
      (HTTP over LAN: 192.168.1.100:3025)
                 ↓
┌─────────────────────────────────────────┐
│  browser-host (192.168.1.100)           │
│  Browser Machine                        │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  browser-tools-server:3025      │   │
│  │  (bind to 0.0.0.0)              │   │
│  └─────────────────────────────────┘   │
│                 ↓ (localhost)           │
│  ┌─────────────────────────────────┐   │
│  │  Chrome Extension               │   │
│  │  (serverHost: 192.168.1.100)    │   │
│  │  (serverPort: 3025)             │   │
│  └─────────────────────────────────┘   │
│                 ↓                       │
│  ┌─────────────────────────────────┐   │
│  │  Chromium Browser               │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Configuration:**

On browser-host (192.168.1.100):
```bash
# Start server bound to all interfaces
npx @agentdeskai/browser-tools-server@latest
# Server listens on 0.0.0.0:3025

# Configure firewall
sudo ufw allow 3025/tcp
```

Extension settings (on browser-host):
```javascript
{
  serverHost: "192.168.1.100",  // or "localhost"
  serverPort: 3025
}
```

MCP Server (on mw-manjaro) - may require custom configuration:
```javascript
// Might need environment variable or config file
BROWSER_TOOLS_SERVER_URL=http://192.168.1.100:3025
```

**Network Requirements:**
- Both machines on same LAN or routable network
- Port 3025 accessible (firewall rules)
- Static IP or hostname for browser-host
- Low latency (<50ms recommended)

## Error Handling

### Connection Failures

**Extension → Middleware:**
```javascript
// Extension retries with exponential backoff
// 3 attempts with 500ms delay
// Auto-discovery kicks in if all fail
// User notified via DevTools panel
```

**MCP Server → Middleware:**
```javascript
// MCP server returns error to Cline
// Cline presents: "Cannot connect to browser tools server"
// User checks: Is middleware running? Correct host/port?
```

### Audit Failures

```javascript
// Middleware catches Puppeteer errors
// Returns structured error response
// Includes diagnostic information
// Cline suggests: "Check if URL is accessible"
```

### Invalid Server

```javascript
// Extension validates server signature
// Rejects if signature doesn't match
// Initiates auto-discovery for valid server
// Prevents connection to wrong services
```

## Performance Optimization

### 1. Singleton Browser Instance
- One headless browser shared across audits
- 60-second idle timeout
- Reduces startup overhead

### 2. Smart Result Limits
- Critical issues: Unlimited
- Serious: Max 15 items
- Moderate: Max 10 items
- Minor: Max 3 items
- Prevents token overflow

### 3. In-Memory Caching
- Recent logs cached (100 items)
- Current URL cached per tab
- No disk I/O for reads

### 4. Efficient WebSocket
- Binary frames for large data
- Compression enabled
- Heartbeat for connection health

## Security Patterns

### 1. Server Identity Validation
```javascript
// Every connection validates:
GET /.identity → { signature: "mcp-browser-connector-24x7" }
// Prevents connection to wrong services
```

### 2. Sensitive Data Filtering
```javascript
// Middleware removes before sending to AI:
- Cookie headers
- Authorization headers
- API keys
- Session tokens
```

### 3. Local-Only by Default
```javascript
// Middleware binds to localhost unless configured
// No external access without explicit setup
// All data stays on local machine
```

### 4. No Persistence
```javascript
// Logs stored in memory only
// Cleared on server restart
// No permanent storage of user data
```

Last updated: 2025-01-07
