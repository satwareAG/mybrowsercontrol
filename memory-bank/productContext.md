# Product Context: MyBrowserControl

## Why This Project Exists

### The Problem
AI coding assistants like Cline in IntelliJ IDEA are powerful for code generation and analysis, but they lack the ability to:
- Interact with live web applications
- Test and validate UI implementations
- Perform accessibility and performance audits
- Debug browser-side issues
- Capture real-time browser state (console logs, network traffic, DOM)

Without browser integration, AI assistants are blind to the runtime behavior of web applications they help build.

### The Solution
MyBrowserControl bridges this gap by connecting Cline to a live browser through the Model Context Protocol (MCP), enabling the AI to:
- Control browser actions (navigate, click, type)
- Monitor browser state (console, network, DOM)
- Run comprehensive audits (accessibility, performance, SEO)
- Debug issues in real-time
- Validate implementations automatically

## How It Works

### Architecture Overview
The system uses a 3-layer architecture to connect Cline to the browser:

```
Layer 1: AI Interface
├── Cline in IntelliJ IDEA
├── MCP Protocol communication
└── Natural language commands

Layer 2: MCP Server
├── @agentdeskai/browser-tools-mcp
├── Translates MCP commands to HTTP requests
└── Communicates with middleware server

Layer 3: Middleware Server
├── @agentdeskai/browser-tools-server (port 3025)
├── Processes browser automation requests
├── Runs Lighthouse audits via Puppeteer
├── Manages WebSocket connections
└── Stores logs and state locally

Layer 4: Browser Integration
├── BrowserTools Chrome Extension
├── Captures browser events (console, network, DOM)
├── Executes automation commands
├── Takes screenshots
└── Sends data to middleware server
```

### Communication Flow

**User → AI → Browser:**
```
1. User: "Run an accessibility audit on this page"
2. Cline: Invokes MCP tool 'runAccessibilityAudit'
3. MCP Server: POST to http://localhost:3025/accessibility-audit
4. Middleware: Launches Puppeteer, runs Lighthouse audit
5. Middleware: Returns structured audit results
6. Cline: Analyzes results, suggests fixes to user
```

**Browser → AI:**
```
1. Browser: Console error occurs
2. Extension: Captures error, sends to middleware
3. Middleware: Stores in /console-errors endpoint
4. Cline: Can query endpoint for recent errors
5. Cline: Analyzes errors, suggests solutions
```

## User Experience Goals

### For Developers
**Primary Goal:** Enable seamless browser control from AI assistant without leaving the IDE.

**User Journey:**
1. **Setup** (one-time):
   - Install Chrome extension
   - Start middleware server
   - Configure Cline MCP settings
   - Open browser to page being worked on

2. **Development Flow**:
   - Write code in IntelliJ IDEA
   - Ask Cline to test in browser: "Navigate to localhost:3000"
   - Ask Cline for feedback: "Are there any console errors?"
   - Get instant results without switching windows

3. **Debugging**:
   - Browser shows error
   - Ask Cline: "What's causing this network error?"
   - Cline queries middleware, analyzes network logs
   - Provides diagnosis and fix suggestions

4. **Auditing**:
   - Implementing new feature
   - Ask Cline: "Run an accessibility audit"
   - Cline returns WCAG compliance issues
   - Developer fixes issues based on AI suggestions

### For QA Engineers
**Primary Goal:** Automate browser testing and audit workflows with AI assistance.

**User Journey:**
1. Open application in browser
2. Ask Cline: "Run all audits on this page"
3. Receive comprehensive report on accessibility, performance, SEO, best practices
4. Get prioritized recommendations
5. Validate fixes automatically

### For Web Developers
**Primary Goal:** Real-time performance and SEO optimization with AI insights.

**User Journey:**
1. Developing landing page
2. Ask Cline: "How's the performance?"
3. Get Core Web Vitals breakdown (LCP, FCP, CLS, TBT)
4. Receive specific optimization opportunities
5. Implement fixes, re-audit to verify

## Key Features

### 1. Browser Automation
**What:** Control browser programmatically through natural language
**How:** Extension executes commands via Chrome APIs
**Benefits:**
- No manual browser interaction needed
- Repeatable test scenarios
- AI can validate implementations

**Example Interactions:**
- "Navigate to https://example.com"
- "Click the login button"
- "Type 'test@example.com' into the email field"
- "Scroll to the footer"
- "Take a screenshot of the current page"

### 2. Console Monitoring
**What:** Real-time capture of browser console logs and errors
**How:** Extension intercepts console API, sends to middleware
**Benefits:**
- Immediate error detection
- AI can diagnose issues from logs
- No manual DevTools checking

**Example Interactions:**
- "Are there any console errors?"
- "Show me recent console logs"
- "What warnings are showing?"

### 3. Network Traffic Analysis
**What:** Capture and analyze HTTP requests/responses
**How:** Extension monitors XHR/Fetch, filters sensitive data
**Benefits:**
- Debug API failures
- Monitor performance bottlenecks
- Validate network behavior

**Example Interactions:**
- "Show me failed network requests"
- "What API calls were made?"
- "Are there any slow requests?"

### 4. Lighthouse Audits
**What:** Comprehensive page analysis across 4 categories
**How:** Middleware runs Puppeteer + Lighthouse, returns AI-optimized results
**Benefits:**
- Automated quality assurance
- Actionable recommendations
- Progress tracking over time

**Audit Categories:**

**A. Accessibility Audit**
- WCAG compliance checking
- Color contrast analysis
- ARIA attribute validation
- Keyboard navigation testing
- Screen reader compatibility

**Example Interaction:**
```
User: "Run an accessibility audit"
Cline Returns:
- Score: 88/100
- 2 critical issues found
- Issue: Meta viewport disables zooming
- Recommendation: Remove user-scalable=no from viewport tag
```

**B. Performance Audit**
- Core Web Vitals (LCP, FCP, CLS, TBT)
- Resource optimization opportunities
- Render-blocking analysis
- Image optimization suggestions

**Example Interaction:**
```
User: "Check page performance"
Cline Returns:
- LCP: 14.1s (failing)
- Element causing LCP: div.heading > span
- Opportunity: Reduce render-blocking CSS (saves 1.27s)
- Total page size: 2.19 MB
```

**C. SEO Audit**
- Meta tag validation
- Heading structure
- Mobile-friendliness
- Crawlability checks
- Sitemap validation

**Example Interaction:**
```
User: "How's the SEO?"
Cline Returns:
- Score: 91/100
- Critical: Page blocked from indexing (robots.txt)
- Recommendation: Review robots.txt configuration
```

**D. Best Practices Audit**
- Security vulnerability detection
- Deprecated API usage
- Browser console errors
- HTTPS enforcement
- Cookie security

**Example Interaction:**
```
User: "Run best practices audit"
Cline Returns:
- Score: 74/100
- Security: Using deprecated UnloadHandler API
- UX: 3 browser errors logged to console
```

### 5. DOM Element Inspection
**What:** Track and inspect selected DOM elements
**How:** Extension monitors element selection, sends to middleware
**Benefits:**
- Understand element structure
- Debug CSS issues
- Validate implementations

**Example Interactions:**
- "What element is currently selected?"
- "Show me the HTML for this element"

### 6. Screenshot Capture
**What:** Capture current browser view as image
**How:** Extension uses Chrome API, saves locally
**Benefits:**
- Visual validation
- Documentation
- Auto-paste to IDE (Cursor feature)

**Example Interactions:**
- "Take a screenshot"
- "Capture the current page"

### 7. NextJS-Specific Audits
**What:** Framework-specific SEO and performance analysis
**How:** Specialized prompts and checks for NextJS apps
**Benefits:**
- App Router vs Page Router optimizations
- NextJS-specific best practices
- Framework-aware recommendations

**Example Interaction:**
```
User: "Run NextJS audit, using app router"
Cline Returns:
- App Router specific recommendations
- Image optimization via next/image
- Font optimization suggestions
- Metadata API usage analysis
```

### 8. Automation Modes
**What:** Pre-configured sequences of tools for common workflows

**A. Audit Mode**
Runs all audits in sequence:
1. Accessibility audit
2. Performance audit
3. SEO audit
4. Best practices audit
5. NextJS audit (if framework detected)
6. Comprehensive analysis and recommendations

**B. Debugger Mode**
Runs all debugging tools:
1. Console logs and errors
2. Network traffic analysis
3. DOM element inspection
4. Screenshot capture
5. Diagnostic report generation

## User Workflows

### Workflow 1: Feature Development
```
1. Developer writes new React component
2. Saves code in IntelliJ IDEA
3. Asks Cline: "Test this component in the browser"
4. Cline navigates browser to localhost:3000
5. Takes screenshot
6. Checks console for errors
7. Reports: "Component renders correctly, no errors"
```

### Workflow 2: Accessibility Compliance
```
1. QA engineer needs WCAG report
2. Opens application in browser
3. Asks Cline: "Run accessibility audit"
4. Receives detailed WCAG compliance report
5. Gets prioritized list of issues with selectors
6. Implements fixes
7. Re-runs audit to verify compliance
```

### Workflow 3: Performance Optimization
```
1. Developer notices slow page load
2. Asks Cline: "Why is this page slow?"
3. Cline runs performance audit
4. Identifies: "LCP of 14.1s caused by large hero image"
5. Suggests: "Optimize image, add lazy loading, reduce size"
6. Developer implements fixes
7. Cline re-tests: "LCP improved to 2.3s"
```

### Workflow 4: SEO Validation
```
1. Content team launches new landing page
2. Asks Cline: "Check SEO for this page"
3. Cline audits and finds: "Missing meta description"
4. Team adds meta tags
5. Cline validates: "All SEO checks passing"
```

### Workflow 5: Debugging Production Issue
```
1. User reports error in production
2. Developer reproduces in browser
3. Asks Cline: "What errors are in the console?"
4. Cline shows: "ReferenceError: variable is not defined"
5. Asks Cline: "Show me failed network requests"
6. Cline identifies: "POST to /api/user returning 404"
7. Developer fixes API endpoint
8. Cline verifies: "No errors, all requests successful"
```

## Problems Solved

### 1. Context Switching
**Before:** Switch between IDE → Browser → DevTools → IDE
**After:** Ask AI questions, get answers without leaving IDE

### 2. Manual Testing
**Before:** Manually refresh, click, inspect every change
**After:** AI automates testing and validation

### 3. Audit Complexity
**Before:** Run Lighthouse manually, interpret results
**After:** AI runs audits, explains issues, suggests fixes

### 4. Error Discovery
**Before:** Check console after every change
**After:** AI monitors console, alerts to errors

### 5. Performance Blind Spots
**Before:** Ship slow pages, users complain
**After:** AI catches performance issues during development

### 6. Accessibility Gaps
**Before:** Miss WCAG violations until audit
**After:** AI validates accessibility continuously

## Privacy and Security

### Data Handling
- **All logs stored locally** on mw-manjaro
- **No cloud services** - everything runs on your machine
- **No data sent to external APIs** (except during development to LLM)
- **Sensitive headers filtered** before sending to AI

### Server Security
- **Server identity validation** via signature endpoint
- **Localhost binding by default** (0.0.0.0 only for remote scenarios)
- **No authentication required** (local-only security model)
- **Configurable ports** for network isolation

## Performance Characteristics

### Speed
- **Local execution**: No network latency
- **Headless browser**: 60s timeout for Lighthouse audits
- **Efficient caching**: Singleton browser instance
- **Smart limits**: AI-optimized result truncation

### Resource Usage
- **Middleware server**: ~50MB RAM
- **Headless browser**: ~100-200MB RAM during audits
- **Extension
