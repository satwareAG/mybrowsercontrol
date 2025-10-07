/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  
  // Multi-project configuration for different test types
  projects: [
    {
      displayName: 'unit',
      preset: 'ts-jest',
      testMatch: ['<rootDir>/tests/unit/**/*.test.ts'],
      testEnvironment: 'node',
      transform: {
        '^.+\\.ts$': ['ts-jest', {
          tsconfig: 'tsconfig.test.json',
          useESM: false,
          isolatedModules: true,
        }],
      },
      moduleNameMapper: {
        '^(.+)\\.js$': '$1',
      },
      modulePaths: ['<rootDir>'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
      coverageThreshold: {
        global: {
          branches: 95,
          functions: 95,
          lines: 95,
          statements: 95,
        },
      },
    },
    {
      displayName: 'application',
      preset: 'ts-jest',
      testMatch: ['<rootDir>/tests/application/**/*.test.ts'],
      testEnvironment: 'node',
      globals: {
        'ts-jest': {
          tsconfig: 'tsconfig.test.json',
        },
      },
      moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
      },
      coverageThreshold: {
        global: {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
      },
    },
    {
      displayName: 'integration',
      preset: 'ts-jest',
      testMatch: ['<rootDir>/tests/integration/**/*.test.ts'],
      testEnvironment: 'node',
      globals: {
        'ts-jest': {
          tsconfig: 'tsconfig.test.json',
        },
      },
      moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
      },
      testTimeout: 60000,
      coverageThreshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    {
      displayName: 'acceptance',
      preset: 'ts-jest',
      testMatch: ['<rootDir>/tests/acceptance/**/*.test.ts'],
      testEnvironment: 'node',
      globals: {
        'ts-jest': {
          tsconfig: 'tsconfig.test.json',
        },
      },
      moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
      },
      testTimeout: 120000,
      // No coverage threshold for acceptance tests (focus on scenarios, not %)
    },
  ],
  
  // Overall coverage threshold for all tests combined
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};
