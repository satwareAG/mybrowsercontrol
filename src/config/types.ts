/**
 * Configuration types for MyBrowserControl
 * Defines the three-mode system and extension options
 */

/**
 * Deployment modes for MyBrowserControl
 */
export enum BrowserMode {
  /** Native Playwright automation - fastest, most direct */
  NATIVE = 'native',
  
  /** Playwright + Lighthouse audits - QA and optimization */
  LIGHTHOUSE = 'lighthouse',
  
  /** Playwright extension mode - connect to existing browser sessions */
  EXTENSION = 'extension'
}

/**
 * Lighthouse audit configuration
 */
export interface LighthouseConfig {
  enabled: boolean;
  categories?: Array<'performance' | 'accessibility' | 'seo' | 'best-practices'>;
  mobile?: boolean;
  throttling?: 'mobile' | 'desktop' | 'none';
}

/**
 * Stealth mode configuration
 */
export interface StealthConfig {
  enabled: boolean;
  fingerprintRandomization?: boolean;
  webRTC?: boolean;
  timezone?: string;
  locale?: string;
}

/**
 * Screenshot optimization configuration
 */
export interface ScreenshotConfig {
  compression: 'auto' | 'high' | 'medium' | 'low' | 'none';
  autoPaste?: boolean;
  maxTokens?: number;
  format?: 'png' | 'jpeg';
  quality?: number;
}

/**
 * Session management configuration
 */
export interface SessionConfig {
  persistence: 'memory' | 'disk' | 'none';
  autoSave?: boolean;
  storageDir?: string;
}

/**
 * Extension configurations
 */
export interface ExtensionsConfig {
  lighthouse?: LighthouseConfig;
  stealth?: StealthConfig;
  screenshot?: ScreenshotConfig;
  session?: SessionConfig;
}

/**
 * Tool selection configuration
 */
export interface ToolsConfig {
  enabled?: string[];
  disabled?: string[];
}

/**
 * Token optimization settings
 */
export interface OptimizationConfig {
  maxSnapshotSize?: number;
  compressLargePages?: boolean;
  filterIrrelevantContent?: boolean;
  smartLimits?: boolean;
}

/**
 * Main configuration interface
 */
export interface MyBrowserControlConfig {
  mode: BrowserMode;
  extensions?: ExtensionsConfig;
  tools?: ToolsConfig;
  optimization?: OptimizationConfig;
  
  // Playwright-specific options (passed through)
  headless?: boolean;
  timeout?: number;
  viewport?: {
    width: number;
    height: number;
  };
}

/**
 * Default configuration
 */
export const DEFAULT_CONFIG: MyBrowserControlConfig = {
  mode: BrowserMode.NATIVE,
  extensions: {
    screenshot: {
      compression: 'auto',
      autoPaste: false,
      format: 'png'
    },
    session: {
      persistence: 'none'
    }
  },
  optimization: {
    maxSnapshotSize: 100000,
    compressLargePages: true,
    filterIrrelevantContent: true,
    smartLimits: true
  },
  headless: true,
  timeout: 30000,
  viewport: {
    width: 1280,
    height: 720
  }
};
