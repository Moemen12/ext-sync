import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import { sync } from './sync.js';
import { importExtensions } from './import.js';
import { init } from './init.js';
import { CONFIG_FILENAME } from '../utils/constants.js';

export async function start() {
  try {
    console.log(chalk.blue('Welcome to ext-sync! 🚀'));

    while (true) {
      const action = await select({
        message: 'What would you like to do?',
        choices: [
          {
            name: 'Initialize new setup',
            value: 'init',
            description: 'Install recommended extensions and create config'
          },
          {
            name: 'Sync extensions',
            value: 'sync',
            description: `Install extensions from ${CONFIG_FILENAME}`
          },
          {
            name: 'Import extensions',
            value: 'import',
            description: `Save currently installed extensions to ${CONFIG_FILENAME}`
          },
          {
            name: 'Exit',
            value: 'exit',
          },
        ],
      });

      if (action === 'exit') {
        console.log(chalk.blue('Bye! 👋'));
        break;
      }

      if (action === 'sync') {
        const success = await sync();
        if (success === false) break;
        console.log(chalk.blue('Bye! 👋'));
        break;
      }

      if (action === 'import') {
        await importExtensions();
        console.log(chalk.blue('Bye! 👋'));
        break;
      }

      if (action === 'init') {
        await init();
        console.log(chalk.blue('Bye! 👋'));
        break;
      }
    }
  } catch (error) {
    // Handle Ctrl+C gracefully
    if (error.name === 'ExitPromptError') {
      console.log(chalk.yellow('\n\nCancelled. Bye! 👋'));
      process.exit(0);
    }
    throw error;
  }
}
