import { BrowserMode, DEFAULT_CONFIG } from '../../../src/config/types.js';
import type { MyBrowserControlConfig } from '../../../src/config/types.js';

describe('Config Types', () => {
  describe('BrowserMode enum', () => {
    it('should define NATIVE mode', () => {
      expect(BrowserMode.NATIVE).toBe('native');
    });

    it('should define LIGHTHOUSE mode', () => {
      expect(BrowserMode.LIGHTHOUSE).toBe('lighthouse');
    });

    it('should define EXTENSION mode', () => {
      expect(BrowserMode.EXTENSION).toBe('extension');
    });

    it('should have exactly 3 modes', () => {
      const modes = Object.values(BrowserMode);
      expect(modes).toHaveLength(3);
      expect(modes).toContain('native');
      expect(modes).toContain('lighthouse');
      expect(modes).toContain('extension');
    });
  });

  describe('DEFAULT_CONFIG', () => {
    it('should have NATIVE as default mode', () => {
      expect(DEFAULT_CONFIG.mode).toBe(BrowserMode.NATIVE);
    });

    it('should have headless enabled by default', () => {
      expect(DEFAULT_CONFIG.headless).toBe(true);
    });

    it('should have default timeout of 30000ms', () => {
      expect(DEFAULT_CONFIG.timeout).toBe(30000);
    });

    it('should have default viewport dimensions', () => {
      expect(DEFAULT_CONFIG.viewport).toEqual({
        width: 1280,
        height: 720,
      });
    });

    it('should have extensions config with defaults', () => {
      expect(DEFAULT_CONFIG.extensions).toBeDefined();
      expect(DEFAULT_CONFIG.extensions?.screenshot).toBeDefined();
      expect(DEFAULT_CONFIG.extensions?.session).toBeDefined();
    });

    it('should have undefined tools config by default', () => {
      expect(DEFAULT_CONFIG.tools).toBeUndefined();
    });

    it('should have optimization config with defaults', () => {
      expect(DEFAULT_CONFIG.optimization).toBeDefined();
      expect(DEFAULT_CONFIG.optimization?.smartLimits).toBe(true);
      expect(DEFAULT_CONFIG.optimization?.compressLargePages).toBe(true);
    });

    it('should be a valid MyBrowserControlConfig object', () => {
      const config: MyBrowserControlConfig = DEFAULT_CONFIG;
      expect(config).toBeDefined();
      expect(config.mode).toBeDefined();
      expect(config.headless).toBeDefined();
      expect(config.timeout).toBeDefined();
      expect(config.viewport).toBeDefined();
    });
  });

  describe('Config merging', () => {
    it('should allow partial config override', () => {
      const customConfig: Partial<MyBrowserControlConfig> = {
        mode: BrowserMode.LIGHTHOUSE,
        headless: false,
      };

      const merged = { ...DEFAULT_CONFIG, ...customConfig };

      expect(merged.mode).toBe(BrowserMode.LIGHTHOUSE);
      expect(merged.headless).toBe(false);
      expect(merged.timeout).toBe(30000); // Should keep default
      expect(merged.viewport).toEqual({ width: 1280, height: 720 }); // Should keep default
    });

    it('should allow complete config override', () => {
      const customConfig: MyBrowserControlConfig = {
        mode: BrowserMode.EXTENSION,
        headless: false,
        timeout: 60000,
        viewport: { width: 1920, height: 1080 },
        extensions: {
          lighthouse: { enabled: true, categories: ['performance', 'accessibility'] },
          screenshot: { compression: 'high', format: 'jpeg', quality: 90 },
          session: { persistence: 'disk', autoSave: true },
          stealth: { enabled: true, fingerprintRandomization: true },
        },
        tools: {
          enabled: ['browser_navigate', 'browser_screenshot'],
          disabled: ['browser_content'],
        },
        optimization: {
          maxSnapshotSize: 200000,
          compressLargePages: false,
          filterIrrelevantContent: false,
          smartLimits: false,
        },
      };

      const merged = { ...DEFAULT_CONFIG, ...customConfig };

      expect(merged.mode).toBe(BrowserMode.EXTENSION);
      expect(merged.headless).toBe(false);
      expect(merged.timeout).toBe(60000);
      expect(merged.viewport).toEqual({ width: 1920, height: 1080 });
      expect(merged.extensions).toBeDefined();
      expect(merged.extensions?.lighthouse?.enabled).toBe(true);
      expect(merged.extensions?.screenshot?.compression).toBe('high');
      expect(merged.tools).toBeDefined();
      expect(merged.tools?.enabled).toContain('browser_navigate');
      expect(merged.optimization).toBeDefined();
      expect(merged.optimization?.maxSnapshotSize).toBe(200000);
    });
  });

  describe('Type safety', () => {
    it('should enforce BrowserMode enum values', () => {
      const validModes = [
        BrowserMode.NATIVE,
        BrowserMode.LIGHTHOUSE,
        BrowserMode.EXTENSION,
      ];

      validModes.forEach((mode) => {
        const config: MyBrowserControlConfig = {
          ...DEFAULT_CONFIG,
          mode,
        };
        expect(config.mode).toBe(mode);
      });
    });

    it('should require all mandatory config fields', () => {
      // This test validates that the type system enforces required fields
      const config: MyBrowserControlConfig = {
        mode: BrowserMode.NATIVE,
        headless: true,
        timeout: 30000,
        viewport: { width: 1280, height: 720 },
      };

      expect(config.mode).toBeDefined();
      expect(config.headless).toBeDefined();
      expect(config.timeout).toBeDefined();
      expect(config.viewport).toBeDefined();
    });
  });
});
