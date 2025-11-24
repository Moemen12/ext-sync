import chalk from 'chalk';
import { loadConfig, configExists } from '../utils/config.js';
import { installExtensions, getActiveEditor } from '../utils/editor.js';

export async function sync() {
  console.log(chalk.blue('Syncing extensions from ext-sync.json... 🔄'));

  // Check if config exists
  if (!configExists()) {
    console.log(chalk.red('\n❌ No ext-sync.json found in current directory.'));
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

  // Determine which editor to use
  const activeEditor = getActiveEditor();
  const targetEditor = activeEditor || config.editor;

  if (!targetEditor) {
    console.log(chalk.red('\n❌ Could not detect active editor and no editor specified in config.'));
    console.log(chalk.yellow('Please run this command from within an editor terminal.\n'));
    return;
  }

  const editorNames = {
    'code': 'VS Code',
    'cursor': 'Cursor',
    'antigravity': 'Antigravity'
  };

  console.log(chalk.green(`\n📍 Target editor: ${editorNames[targetEditor] || targetEditor}`));

  // Install extensions
  if (config.extensions) {
    const allExtensions = new Set();

    // Collect extensions from all stacks
    Object.values(config.extensions).forEach(stackExts => {
      if (Array.isArray(stackExts)) {
        stackExts.forEach(ext => allExtensions.add(ext));
      }
    });

    if (allExtensions.size > 0) {
      await installExtensions(Array.from(allExtensions), targetEditor);
    } else {
      console.log(chalk.yellow('\n⚠️  No extensions found in config.\n'));
    }
  } else {
    console.log(chalk.yellow('\n⚠️  No extensions found in config.\n'));
  }
}
