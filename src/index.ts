/**
 * Main Entry Point
 * Task Tracker CLI Application
 */
import { App } from './presentation';
import { Logger } from './presentation/cli/utils';

async function main(): Promise<void> {
  try {
    const app = new App();
    await app.initialize();
    await app.run();
  } catch (error) {
    if (error instanceof Error) {
      Logger.debug(error.stack ?? error.message);
    }
    process.exit(1);
  }
}

void main();
