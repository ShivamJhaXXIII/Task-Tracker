/**
 * Environment configuration
 * Loads and validates environment variables for the application
 */

export interface EnvironmentConfig {
  nodeEnv: 'development' | 'production' | 'test';
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  dataDir?: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enableLogging: boolean;
}

/**
 * Get the current environment configuration
 */
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const nodeEnv = (process.env['NODE_ENV'] || 'development') as
    | 'development'
    | 'production'
    | 'test';

  const logLevel = (
    process.env['LOG_LEVEL'] || (nodeEnv === 'production' ? 'info' : 'debug')
  ) as 'debug' | 'info' | 'warn' | 'error';

  const enableLogging =
    process.env['ENABLE_LOGGING'] !== 'false' && nodeEnv !== 'test';

  return {
    nodeEnv,
    isDevelopment: nodeEnv === 'development',
    isProduction: nodeEnv === 'production',
    isTest: nodeEnv === 'test',
    dataDir: process.env['DATA_DIR'],
    logLevel,
    enableLogging,
  };
};

/**
 * Validate that all required environment variables are set
 * Throws an error if any required variables are missing
 */
export const validateEnvironment = (): void => {
  const requiredVars: Array<string> = [];

  if (requiredVars.length > 0) {
    const missing = requiredVars
      .filter((varName) => !process.env[varName])
      .join(', ');

    if (missing) {
      throw new Error(`Missing required environment variables: ${missing}`);
    }
  }
};

/**
 * Initialize environment configuration
 * Should be called once at application startup
 */
export const initializeEnvironment = (): EnvironmentConfig => {
  validateEnvironment();
  return getEnvironmentConfig();
};

// Export current configuration
export const env = getEnvironmentConfig();
