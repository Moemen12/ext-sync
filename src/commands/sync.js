import chalk from 'chalk';
import { loadConfig, configExists } from '../utils/config.js';
import { installExtensions, getActiveEditor, detectEditors } from '../utils/editor.js';
import { select } from '@inquirer/prompts';
import { CONFIG_FILENAME, EDITOR_NAMES } from '../utils/constants.js';

export async function sync() {
  console.log(chalk.blue(`Syncing extensions from ${CONFIG_FILENAME}... 🔄`));

  // Check if config exists
  if (!configExists()) {
    console.log(chalk.red(`\n❌ No ${CONFIG_FILENAME} found in current directory.`));
    console.log(chalk.yellow('Please run "Initialize new setup" or "Import extensions" first.\n'));
    return false;
  }

  // Load config
  let config;
  try {
    config = loadConfig();
  } catch (error) {
    console.log(chalk.red(`\n❌ Error loading config: ${error.message}\n`));
    return;
  }

  if (!config.extensions || !Array.isArray(config.extensions) || config.extensions.length === 0) {
    console.log(chalk.yellow('\n⚠️  No extensions found in config.\n'));
    return;
  }

  // Determine which editor to use
  let targetEditor = getActiveEditor();

  if (!targetEditor) {
    console.log(chalk.yellow('\n⚠️  Not running inside an editor terminal.'));
    const editors = await detectEditors();
    
    if (editors.length === 0) {
      console.log(chalk.red('❌ No supported editors detected.'));
      return;
    }

    targetEditor = await select({
      message: 'Which editor do you want to sync to?',
      choices: editors,
    });
  }

  console.log(chalk.green(`\n📍 Target editor: ${EDITOR_NAMES[targetEditor] || targetEditor}`));

  // Install extensions
  await installExtensions(config.extensions, targetEditor);
}
