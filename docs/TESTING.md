# Testing Guide for MyBrowserControl

This document outlines the comprehensive testing strategy for MyBrowserControl MCP server, including unit tests, application tests, integration tests, and acceptance tests.

## Testing Philosophy

MyBrowserControl follows Test-Driven Design (TDD) principles:

1. **Write tests first** - Tests define expected behavior
2. **Red-Green-Refactor** - Write failing test, make it pass, improve code
3. **High coverage targets** - Aim for 85%+ overall coverage
4. **Multiple test levels** - Unit, application, integration, and acceptance tests

## Test Types Overview

| Test Type | Purpose | Scope | Speed | Dependencies |
|-----------|---------|-------|-------|--------------|
| **Unit** | Test individual components in isolation | Single function/class | Fast (ms) | Mocked |
| **Application** | Test MCP protocol flow and tool execution | MCP server tools | Medium (100-500ms) | Mocked browser |
| **Integration** | Test real browser automation | Full stack | Slow (1-5s) | Real browser |
| **Acceptance** | Test complete user scenarios end-to-end | Full system | Slowest (5-30s) | Real browser + network |

## Coverage Targets

```javascript
// jest.config.js coverage thresholds
{
  unit: {
    branches: 95,
    functions: 95,
    lines: 95,
    statements: 95
  },
  application: {
    branches: 90,
    functions: 90,
    lines: 90,
    statements: 90
  },
  integration: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  },
  overall: {
    branches: 85,
    functions: 85,
    lines: 85,
    statements: 85
  }
}
```

## 1. Unit Tests

**Location**: `tests/unit/`

**Current Status**: ✅ **46 tests passing**

### What We Test

Unit tests verify individual components in complete isolation using mocks:

- **index.ts** (6 tests) - CLI argument parsing
- **server.ts** (5 tests) - MCP server initialization
- **core/playwright.ts** (20 tests) - Browser lifecycle management
- **config/types.ts** (16 tests) - Configuration types and defaults

### Running Unit Tests

```bash
# Run all unit tests
npm run test:unit

# Run with coverage
npm run test:unit -- --coverage

# Watch mode for TDD
npm run test:watch -- --selectProjects unit

# Run specific test file
npm run test:unit -- tests/unit/server.test.ts
```

### Example Unit Test

```typescript
// tests/unit/core/playwright.test.ts
describe('PlaywrightCore', () => {
  it('should launch chromium browser by default', async () => {
    const { chromium } = require('playwright');
    chromium.launch.mockResolvedValue(mockBrowser);
    
    await playwright.launch();

    expect(chromium.launch).toHaveBeenCalledWith({
      headless: true,
      timeout: 30000,
    });
    expect(playwright.isRunning()).toBe(true);
  });
});
```

### Writing New Unit Tests

1. Create test file: `tests/unit/<module>/<file>.test.ts`
2. Import module to test
3. Mock all dependencies using `jest.mock()`
4. Write focused tests for each function/method
5. Assert behavior, not implementation

## 2. Application Tests

**Location**: `tests/application/`

**Status**: 🚧 **To be implemented**

### What We Test

Application tests verify MCP protocol interactions and tool execution without real browsers:

- MCP tool listing (`ListToolsRequest`)
- MCP tool execution (`CallToolRequest`)
- Request/response format validation
- Error handling and edge cases
- Tool schema validation

### Planned Application Tests

```typescript
// tests/application/mcp-tools.test.ts
describe('MCP Tool Protocol', () => {
  it('should list all available tools', async () => {
    const server = new MyBrowserControlServer();
    const tools = await server.listTools();
    
    expect(tools).toHaveLength(4);
    expect(tools.map(t => t.name)).toEqual([
      'browser_navigate',
      'browser_screenshot',
      'browser_content',
      'browser_close'
    ]);
  });

  it('should execute browser_navigate tool', async () => {
    const server = new MyBrowserControlServer();
    const result = await server.callTool('browser_navigate', {
      url: 'https://example.com'
    });
    
    expect(result.content[0].text).toContain('Navigated');
  });
});
```

### Running Application Tests

```bash
# Run all application tests (when implemented)
npm run test:app

# Watch mode
npm run test:watch -- --selectProjects application
```

## 3. Integration Tests

**Location**: `tests/integration/`

**Status**: 🚧 **To be implemented**

### What We Test

Integration tests use real Playwright browsers to verify actual browser automation:

- Real browser launching (Chromium, Firefox, WebKit)
- Actual page navigation
- Real screenshot capture
- Actual HTML content retrieval
- Browser lifecycle management

### Planned Integration Tests

```typescript
// tests/integration/browser-automation.test.ts
describe('Browser Automation Integration', () => {
  let playwright: PlaywrightCore;

  beforeEach(() => {
    playwright = new PlaywrightCore({
      mode: BrowserMode.NATIVE,
      headless: true,
      timeout: 30000
    });
  });

  afterEach(async () => {
    await playwright.close();
  });

  it('should navigate to real website', async () => {
    await playwright.launch();
    await playwright.navigate('https://example.com');
    
    const content = await playwright.getContent();
    expect(content).toContain('Example Domain');
  });

  it('should capture real screenshot', async () => {
    await playwright.launch();
    await playwright.navigate('https://example.com');
    
    const screenshot = await playwright.screenshot();
    expect(screenshot).toBeInstanceOf(Buffer);
    expect(screenshot.length).toBeGreaterThan(1000);
  });
});
```

### Running Integration Tests

```bash
# Run all integration tests (when implemented)
npm run test:integration

# Run with specific browser
npm run test:integration -- --browser=firefox
```

### Integration Test Best Practices

1. **Use real browsers** - No mocks for browser objects
2. **Test simple pages first** - Use example.com, httpbin.org
3. **Longer timeouts** - Browser operations are slow (5-30 seconds)
4. **Cleanup after each test** - Always close browsers
5. **Skip in CI if needed** - Can be slow/flaky

## 4. Acceptance Tests

**Location**: `tests/acceptance/`

**Status**: 🚧 **To be implemented**

### What We Test

Acceptance tests verify complete user scenarios end-to-end:

- Complete MCP protocol flow from client to browser
- Real-world user scenarios
- Multi-step tool sequences
- Error recovery
- Performance benchmarks

### Planned Acceptance Tests

```typescript
// tests/acceptance/user-scenarios.test.ts
describe('User Scenarios', () => {
  it('should complete full browsing workflow', async () => {
    // 1. Start server
    const server = new MyBrowserControlServer();
    await server.start();

    // 2. Navigate to page
    const navResult = await server.callTool('browser_navigate', {
      url: 'https://example.com'
    });
    expect(navResult.content[0].text).toContain('Navigated');

    // 3. Capture screenshot
    const screenshot = await server.callTool('browser_screenshot', {
      fullPage: false
    });
    expect(screenshot.content[0].type).toBe('image');

    // 4. Get content
    const content = await server.callTool('browser_content', {});
    expect(content.content[0].text).toContain('<!DOCTYPE');

    // 5. Close browser
    const close = await server.callTool('browser_close', {});
    expect(close.content[0].text).toContain('closed');
  });

  it('should handle error recovery', async () => {
    const server = new MyBrowserControlServer();
    await server.start();

    // Try to screenshot without navigating - should fail gracefully
    await expect(
      server.callTool('browser_screenshot', {})
    ).rejects.toThrow('Browser not launched');

    // Should still be able to navigate after error
    const result = await server.callTool('browser_navigate', {
      url: 'https://example.com'
    });
    expect(result.content[0].text).toContain('Navigated');
  });
});
```

### Running Acceptance Tests

```bash
# Run all acceptance tests (when implemented)
npm run test:acceptance

# Run with verbose output
npm run test:acceptance -- --verbose
```

## Manual Testing with MCP Inspector

In addition to automated tests, use the MCP Inspector for manual testing:

```bash
# Launch Inspector
npx @modelcontextprotocol/inspector node dist/index.js
```

See [INSPECTOR.md](./INSPECTOR.md) for detailed Inspector usage guide.

## Test-Driven Development Workflow

### Adding New Features

1. **Write failing test first**:
   ```bash
   npm run test:watch -- --selectProjects unit
   ```

2. **Implement feature** to make test pass

3. **Refactor** while keeping tests green

4. **Add integration test** to verify with real dependencies

5. **Test with Inspector** for manual validation

6. **Add acceptance test** for complete scenario

### Example: Adding New Tool

```typescript
// 1. Write unit test (RED)
it('should execute new_tool', async () => {
  const result = await server.callTool('new_tool', { param: 'value' });
  expect(result).toBeDefined();
});

// 2. Implement tool (GREEN)
// ... add tool to server.ts ...

// 3. Add application test
it('should validate new_tool schema', async () => {
  const tools = await server.listTools();
  const newTool = tools.find(t => t.name === 'new_tool');
  expect(newTool.inputSchema).toBeDefined();
});

// 4. Add integration test
it('should execute new_tool with real browser', async () => {
  // ... test with real Playwright ...
});

// 5. Test with Inspector
// Manual verification in browser UI

// 6. Add acceptance test
it('should use new_tool in complete workflow', async () => {
  // ... end-to-end scenario ...
});
```

## Continuous Integration

### Pre-commit Checks

```bash
# Before every commit
npm run build        # Ensure TypeScript compiles
npm run lint         # Check code style
npm run test:unit    # Fast unit tests must pass
```

### CI Pipeline

```yaml
# .github/workflows/test.yml (future)
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - run: npm run lint
      - run: npm run test:unit
      - run: npm run test:app
      - run: npm run test:integration
      - run: npm run test:all -- --coverage
      - run: npx playwright install chromium
```

## Debugging Tests

### Running Single Test

```bash
# Run specific test file
npm test -- tests/unit/server.test.ts

# Run specific test by name
npm test -- -t "should create instance"

# Run with debugging
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Common Test Issues

**Issue**: Tests timeout
- Increase jest timeout: `jest.setTimeout(30000)`
- Check for unresolved promises
- Ensure proper cleanup in `afterEach`

**Issue**: Tests pass individually but fail together
- Shared state between tests
- Missing cleanup in `afterEach`
- Test pollution - use `jest.resetModules()`

**Issue**: Flaky integration tests
- Network issues - use local test servers
- Timing issues - add proper waits
- Browser not ready - increase timeouts

## Test Coverage Reports

### Generating Coverage

```bash
# Generate HTML coverage report
npm run test:all -- --coverage

# Open coverage report
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
```

### Coverage Metrics

- **Statements**: % of executable statements run
- **Branches**: % of if/else branches tested
- **Functions**: % of functions called
- **Lines**: % of lines executed

### Improving Coverage

1. Identify uncovered lines in report
2. Add tests for missing paths
3. Test error conditions
4. Test edge cases
5. Remove dead code

## Performance Testing

### Benchmarking Tools

```typescript
// tests/performance/benchmarks.test.ts
it('should navigate within 3 seconds', async () => {
  const start = Date.now();
  await playwright.navigate('https://example.com');
  const duration = Date.now() - start;
  
  expect(duration).toBeLessThan(3000);
});

it('should handle 10 screenshots in < 30s', async () => {
  const start = Date.now();
  
  for (let i = 0; i < 10; i++) {
    await playwright.screenshot();
  }
  
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(30000);
});
```

## Best Practices

### DO

✅ Write tests before code (TDD)
✅ Keep tests focused and small
✅ Use descriptive test names
✅ Mock external dependencies
✅ Test error cases
✅ Clean up resources in `afterEach`
✅ Use appropriate test type for scenario
✅ Maintain high coverage

### DON'T

❌ Test implementation details
❌ Share state between tests
❌ Use real network calls in unit tests
❌ Skip cleanup
❌ Ignore flaky tests
❌ Test multiple things in one test
❌ Use `any` type in tests
❌ Commit failing tests

## Future Enhancements

- [ ] Implement application tests (MCP protocol)
- [ ] Implement integration tests (real browsers)
- [ ] Implement acceptance tests (end-to-end)
- [ ] Add visual regression testing
- [ ] Add performance benchmarks
- [ ] Set up CI/CD pipeline
- [ ] Add mutation testing
- [ ] Generate test documentation
- [ ] Add security testing
- [ ] Add accessibility testing

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Playwright Testing](https://playwright.dev/docs/test-intro)
- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [Testing Best Practices](https://testingjavascript.com/)
- [TDD Guide](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)

## Current Test Status

```
Unit Tests:        46 passing ✅
Application Tests:  0 (pending) 🚧
Integration Tests:  0 (pending) 🚧
Acceptance Tests:   0 (pending) 🚧

Total Coverage:    ~60% (unit only)
Target Coverage:   85% (all tests)
```

Updated: 2025-01-07
