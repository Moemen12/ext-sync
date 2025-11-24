import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import { extensions } from '../data/extensions.js';
import { installExtensions, getActiveEditor, detectEditors, listExtensions } from '../utils/editor.js';
import { saveConfig, configExists, loadConfig } from '../utils/config.js';
import { CONFIG_FILENAME, EDITOR_NAMES, STACKS } from '../utils/constants.js';

export async function init() {
  let existingConfig = null;
  let merge = false;

  if (configExists()) {
    const action = await select({
      message: `Configuration file (${CONFIG_FILENAME}) already exists. What do you want to do?`,
      choices: [
        { name: 'Merge (Add recommended extensions to list)', value: 'merge' },
        { name: 'Overwrite completely', value: 'overwrite' },
        { name: 'Cancel', value: 'cancel' }
      ]
    });

    if (action === 'cancel') {
      console.log(chalk.yellow('Initialization cancelled.'));
      return;
    }

    if (action === 'merge') {
      try {
        existingConfig = loadConfig();
        merge = true;
      } catch (error) {
        console.log(chalk.red(`Error loading existing config: ${error.message}`));
        return;
      }
    }
  }

  let targetEditor = getActiveEditor();
  let selectedEditor;

  if (targetEditor) {
    console.log(chalk.green(`\n📍 Detected active editor: ${EDITOR_NAMES[targetEditor] || targetEditor}`));
    selectedEditor = targetEditor;
  } else {
    console.log(chalk.yellow('\n⚠️  Not running inside an editor terminal.'));
    const editors = await detectEditors();
    
    if (editors.length === 0) {
      console.log(chalk.red('❌ No supported editors (VS Code, Cursor, or Antigravity) detected in your PATH.'));
      return;
    }

    selectedEditor = await select({
      message: 'Which editor do you want to configure?',
      choices: editors,
    });
  }

  // Prompt for stack selection (to know what to add)
  const stack = await select({
    message: 'What are you working with? (We will add recommended extensions)',
    choices: STACKS
  });

  console.log(chalk.blue(`\n🔍 Checking for already installed extensions...`));
  
  // Get currently installed extensions
  const installed = await listExtensions(selectedEditor);
  
  // Filter out already-installed extensions
  const toInstall = extensions[stack].filter(extId => !installed.includes(extId));

  if (toInstall.length === 0) {
    console.log(chalk.green(`\n✅ All ${stack} extensions are already installed!`));
  } else {
    console.log(chalk.blue(`\n📦 Installing ${toInstall.length} new extension(s)...`));
    await installExtensions(toInstall, selectedEditor);
  }

  // Prepare config
  let config = { extensions: [] };
  
  if (merge && existingConfig && Array.isArray(existingConfig.extensions)) {
    config.extensions = [...existingConfig.extensions];
  }

  // Add the recommended extensions for this stack to the config
  // We add ALL of them (even if installed) so they are tracked in the config
  const stackExtensions = extensions[stack];
  const newExts = stackExtensions.filter(ext => !config.extensions.includes(ext));
  
  if (newExts.length > 0) {
    config.extensions.push(...newExts);
    config.extensions.sort();
  }

  try {
    saveConfig(config);
    console.log(chalk.green(`\n💾 Configuration saved to ${chalk.bold(CONFIG_FILENAME)}`));
  } catch (error) {
    console.log(chalk.yellow(`\n⚠️  Warning: Could not save config: ${error.message}`));
  }
}
