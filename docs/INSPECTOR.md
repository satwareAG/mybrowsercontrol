# MCP Inspector Debugging Guide

## Overview

The MCP Inspector is an official debugging tool from the Model Context Protocol team that allows you to test and debug MCP servers without connecting to a full client like Cline.

**Repository**: https://github.com/modelcontextprotocol/inspector

## Installation

The Inspector is available via npx - no installation required:

```bash
npx @modelcontextprotocol/inspector
```

## Configuration

We've created `inspector-config.json` in the project root with the following configuration:

```json
{
  "mcpServers": {
    "mybrowsercontrol": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {}
    }
  }
}
```

This configures the Inspector to launch our compiled MyBrowserControl MCP server.

## Prerequisites

Before using the Inspector, ensure:

1. **Project is built**: Run `npm run build` to compile TypeScript to JavaScript
2. **Dependencies installed**: Run `npm install` if you haven't already
3. **Port 6274 available**: Inspector runs on http://localhost:6274

## Launching the Inspector

### Method 1: Direct Launch (Recommended for Testing)

```bash
# From project root
npx @modelcontextprotocol/inspector node dist/index.js
```

This launches the Inspector and automatically connects to your MCP server.

### Method 2: With Configuration File

```bash
# From project root  
npx @modelcontextprotocol/inspector inspector-config.json
```

This uses the pre-configured setup from `inspector-config.json`.

## Using the Inspector UI

Once launched, the Inspector will:

1. Start a proxy server on `localhost:6277`
2. Open your browser to `http://localhost:6274/` with an auth token
3. Display the MCP Inspector web interface

### Inspector Interface Features

The Inspector UI provides:

- **Server Status**: Connection state and health
- **Tools List**: All available MCP tools
- **Tool Testing**: Interactive forms to call tools with parameters
- **Response Viewer**: JSON-formatted tool responses
- **Logs**: Real-time MCP protocol messages

## Testing MyBrowserControl Tools

MyBrowserControl provides 4 core tools. Here's how to test each:

### 1. browser_navigate

**Purpose**: Navigate browser to a URL

**Test Steps**:
1. Click on `browser_navigate` in the tools list
2. Fill in the `url` parameter: `https://example.com`
3. Click "Execute"
4. Verify response shows successful navigation

**Expected Response**:
```json
{
  "content": [
    {
      "type": "text",
      "text": "Navigated to https://example.com"
    }
  ]
}
```

### 2. browser_screenshot

**Purpose**: Capture screenshot of current page

**Prerequisites**: Must call `browser_navigate` first

**Test Steps**:
1. First navigate to a page using `browser_navigate`
2. Click on `browser_screenshot` in the tools list
3. Optionally set `fullPage` to `true` for full-page screenshot
4. Click "Execute"
5. Verify response contains base64-encoded image data

**Expected Response**:
```json
{
  "content": [
    {
      "type": "image",
      "data": "<base64-encoded-png-data>",
      "mimeType": "image/png"
    }
  ]
}
```

### 3. browser_content

**Purpose**: Get HTML content of current page

**Prerequisites**: Must call `browser_navigate` first

**Test Steps**:
1. First navigate to a page using `browser_navigate`
2. Click on `browser_content` in the tools list
3. Click "Execute"
4. Verify response contains HTML content

**Expected Response**:
```json
{
  "content": [
    {
      "type": "text",
      "text": "<!DOCTYPE html><html>...</html>"
    }
  ]
}
```

### 4. browser_close

**Purpose**: Close browser instance

**Test Steps**:
1. Click on `browser_close` in the tools list
2. Click "Execute"
3. Verify response shows browser closed
4. Subsequent tool calls (except navigate) should fail

**Expected Response**:
```json
{
  "content": [
    {
      "type": "text",
      "text": "Browser closed"
    }
  ]
}
```

## Complete Test Workflow

Here's a complete test sequence to verify all functionality:

1. **Start Inspector**:
   ```bash
   npx @modelcontextprotocol/inspector node dist/index.js
   ```

2. **Navigate to Example Page**:
   - Tool: `browser_navigate`
   - Parameter: `url` = `https://example.com`
   - Expected: Success message

3. **Capture Screenshot**:
   - Tool: `browser_screenshot`
   - Parameter: `fullPage` = `false`
   - Expected: Base64 PNG data

4. **Get Page Content**:
   - Tool: `browser_content`
   - Expected: HTML content of example.com

5. **Take Full Page Screenshot**:
   - Tool: `browser_screenshot`
   - Parameter: `fullPage` = `true`
   - Expected: Base64 PNG data (larger than before)

6. **Close Browser**:
   - Tool: `browser_close`
   - Expected: Success message

7. **Verify Browser Closed**:
   - Tool: `browser_content` (should fail)
   - Expected: Error message about browser not running

## Debugging Tips

### Common Issues

**Issue**: "Server not responding"
- **Solution**: Ensure `npm run build` was run successfully
- **Solution**: Check that `dist/index.js` exists
- **Solution**: Verify no other process is using port 6277 or 6274

**Issue**: "Browser not launched" errors
- **Solution**: Always call `browser_navigate` before other tools
- **Solution**: Ensure Playwright browsers are installed: `npx playwright install`

**Issue**: Screenshot returns empty/black image
- **Solution**: Increase timeout in tool parameters
- **Solution**: Ensure page has fully loaded before screenshot
- **Solution**: Check that the URL is accessible

**Issue**: Tools return "Unexpected token" or JSON errors
- **Solution**: Rebuild the project: `npm run build`
- **Solution**: Check TypeScript compilation completed without errors

### Viewing MCP Protocol Messages

The Inspector shows real-time MCP protocol messages:

1. Open browser developer console (F12)
2. Look for JSON-RPC messages in the network tab
3. Check request/response format matches MCP spec

### Testing Error Handling

Test error scenarios:

1. **Invalid URL**:
   - Navigate to: `not-a-url`
   - Should return error message

2. **Tool Without Browser**:
   - Close browser, then try `browser_content`
   - Should return "Browser not running" error

3. **Invalid Parameters**:
   - Call `browser_screenshot` with `fullPage` = `"invalid"`
   - Should return parameter validation error

## Integration with Development Workflow

### TDD Workflow with Inspector

1. **Write failing test** in Jest
2. **Run test suite**: `npm run test:unit`
3. **Implement feature** in source code
4. **Test with Inspector** to verify behavior
5. **Re-run tests** to confirm fix
6. **Commit** passing code

### Pre-Commit Validation

Before committing changes:

```bash
# 1. Build project
npm run build

# 2. Run all tests
npm test

# 3. Test with Inspector
npx @modelcontextprotocol/inspector node dist/index.js

# 4. Verify all 4 tools work correctly
```

## Advanced Inspector Features

### Custom Environment Variables

Pass environment variables to your server:

```bash
npx @modelcontextprotocol/inspector \
  node dist/index.js \
  --env "DEBUG=true" \
  --env "TIMEOUT=60000"
```

### Multiple Server Testing

Create `inspector-config.json` with multiple servers:

```json
{
  "mcpServers": {
    "mybrowsercontrol-native": {
      "command": "node",
      "args": ["dist/index.js", "--mode", "native"],
      "env": {}
    },
    "mybrowsercontrol-lighthouse": {
      "command": "node",
      "args": ["dist/index.js", "--mode", "lighthouse"],
      "env": {}
    }
  }
}
```

Then test both configurations from the same Inspector instance.

### Saving Test Sessions

The Inspector allows exporting test sessions:

1. Execute a series of tool calls
2. Click "Export Session" in the UI
3. Save JSON file with all requests/responses
4. Use for regression testing or documentation

## Troubleshooting

### Server Won't Start

Check these in order:

1. TypeScript compiled successfully: `npm run build`
2. No syntax errors in dist/: Check console output
3. Dependencies installed: `npm install`
4. Playwright browsers: `npx playwright install chromium`

### Connection Issues

If Inspector can't connect:

1. Kill any existing Inspector processes: `pkill -f inspector`
2. Check port availability: `lsof -i :6274` and `lsof -i :6277`
3. Clear browser cache and restart Inspector
4. Try incognito/private browsing mode

### Performance Issues

If tools are slow:

1. Reduce page complexity (test with simple pages first)
2. Disable headless mode for debugging: `--headed` flag
3. Increase timeout values
4. Check system resources (CPU, memory)

## Next Steps

After validating with Inspector:

1. **Write application tests** that simulate MCP protocol flow
2. **Create integration tests** with real browser automation
3. **Implement acceptance tests** for end-to-end scenarios
4. **Document findings** in TESTING.md
5. **Update memory bank** with insights

## Resources

- MCP Inspector Repo: https://github.com/modelcontextprotocol/inspector
- MCP Specification: https://spec.modelcontextprotocol.io/
- Playwright Docs: https://playwright.dev/
- MyBrowserControl README: ../README.md
