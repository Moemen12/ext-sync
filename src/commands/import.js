import chalk from 'chalk';
import { saveConfig } from '../utils/config.js';
import { listExtensions, getActiveEditor, detectEditors } from '../utils/editor.js';
import { select } from '@inquirer/prompts';

export async function importExtensions() {
  console.log(chalk.blue('Importing installed extensions... 📥'));

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

  const editorNames = {
    'code': 'VS Code',
    'cursor': 'Cursor',
    'antigravity': 'Antigravity'
  };

  console.log(chalk.green(`\n📍 Importing from: ${editorNames[targetEditor] || targetEditor}`));

  try {
    const extensions = await listExtensions(targetEditor);
    
    if (extensions.length === 0) {
      console.log(chalk.yellow('No extensions found to import.'));
      return;
    }

    console.log(chalk.blue(`\nFound ${extensions.length} extensions.`));

    // Save to config
    const config = {
      editor: targetEditor,
      extensions: {
        node: extensions
      }
    };

    saveConfig(config);
    console.log(chalk.green(`\n💾 Imported ${extensions.length} extensions to ${chalk.bold('ext-sync.json')}`));

  } catch (error) {
    console.log(chalk.red(`\n❌ Error importing extensions: ${error.message}`));
  }
}
