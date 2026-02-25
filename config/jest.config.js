/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/../tests', '<rootDir>/../src'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        // Relax some strict rules for tests
        noUnusedLocals: false,
        noUnusedParameters: false,
      }
    }]
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/**/*.interface.ts',
    '!src/**/index.ts'
  ],
  coverageDirectory: '../coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  moduleNameMapper: {
    '^@domain/(.*)$': '<rootDir>/../src/domain/$1',
    '^@application/(.*)$': '<rootDir>/../src/application/$1',
    '^@infrastructure/(.*)$': '<rootDir>/../src/infrastructure/$1',
    '^@presentation/(.*)$': '<rootDir>/../src/presentation/$1'
  },
  verbose: true,
  clearMocks: true,
  restoreMocks: true
};
