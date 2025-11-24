import chalk from 'chalk';
import { saveConfig, configExists, loadConfig } from '../utils/config.js';
import { listExtensions, getActiveEditor, detectEditors } from '../utils/editor.js';
import { select } from '@inquirer/prompts';
import { CONFIG_FILENAME, EDITOR_NAMES } from '../utils/constants.js';

export async function importExtensions() {
  console.log(chalk.blue('Importing installed extensions... 📥'));

  let existingConfig = null;
  let merge = false;

  if (configExists()) {
    const action = await select({
      message: `Configuration file (${CONFIG_FILENAME}) already exists. What do you want to do?`,
      choices: [
        { name: 'Merge (Append to existing list)', value: 'merge' },
        { name: 'Overwrite completely', value: 'overwrite' },
        { name: 'Cancel', value: 'cancel' }
      ]
    });

    if (action === 'cancel') {
      console.log(chalk.yellow('Import cancelled.'));
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

  if (!targetEditor) {
    console.log(chalk.yellow('\n⚠️  Not running inside an editor terminal.'));
    const editors = await detectEditors();
    
    if (editors.length === 0) {
      console.log(chalk.red('❌ No supported editors detected.'));
      return;
    }

    targetEditor = await select({
      message: 'Which editor do you want to import from?',
      choices: editors,
    });
  }

  console.log(chalk.green(`\n📍 Importing from: ${EDITOR_NAMES[targetEditor] || targetEditor}`));

  try {
    const extensions = await listExtensions(targetEditor);
    
    if (extensions.length === 0) {
      console.log(chalk.yellow('No extensions found to import.'));
      return;
    }

    console.log(chalk.blue(`\nFound ${extensions.length} extensions.`));

    // Prepare config
    let config = { extensions: [] };
    
    if (merge && existingConfig && Array.isArray(existingConfig.extensions)) {
      // Start with existing extensions
      config.extensions = [...existingConfig.extensions];
      
      // Add new ones if not already present
      const newExts = extensions.filter(ext => !config.extensions.includes(ext));
      config.extensions.push(...newExts);
      
      console.log(chalk.blue(`\n➕ Added ${newExts.length} new extensions to the list.`));
    } else {
      config.extensions = extensions;
    }

    // Sort for neatness
    config.extensions.sort();

    saveConfig(config);
    console.log(chalk.green(`\n💾 Saved ${config.extensions.length} extensions to ${chalk.bold(CONFIG_FILENAME)}`));

  } catch (error) {
    console.log(chalk.red(`\n❌ Error importing extensions: ${error.message}`));
  }
}
