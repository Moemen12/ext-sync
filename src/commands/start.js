import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import { extensions } from '../data/extensions.js';
import { installExtensions, getActiveEditor, detectEditors, listExtensions } from '../utils/editor.js';
import { saveConfig, configExists, loadConfig } from '../utils/config.js';
import { sync } from './sync.js';
import { importExtensions } from './import.js';

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
            description: 'Install extensions from ext-sync.json'
          },
          {
            name: 'Import extensions',
            value: 'import',
            description: 'Save currently installed extensions to ext-sync.json'
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
        await runInit();
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

async function runInit() {
  let existingConfig = null;
  let merge = false;

  if (configExists()) {
    const action = await select({
      message: 'Configuration file (ext-sync.json) already exists. What do you want to do?',
      choices: [
        { name: 'Merge with existing config (Add new stack)', value: 'merge' },
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
    const editorNames = {
      'code': 'VS Code',
      'cursor': 'Cursor',
      'antigravity': 'Antigravity'
    };
    console.log(chalk.green(`\n📍 Detected active editor: ${editorNames[targetEditor] || targetEditor}`));
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

  // Prompt for stack selection
  const stack = await select({
    message: 'What are you working with?',
    choices: [
      { name: 'JavaScript', value: 'javascript' },
      { name: 'TypeScript', value: 'typescript' },
      { name: 'React', value: 'react' },
      { name: 'Vue.js', value: 'vue' },
      { name: 'Angular', value: 'angular' },
      { name: 'Svelte', value: 'svelte' },
      { name: 'Laravel (PHP)', value: 'laravel' },
      { name: 'NestJS', value: 'nestjs' },
      { name: 'Python', value: 'python' },
      { name: 'Java', value: 'java' },
      { name: 'Go', value: 'go' },
      { name: 'Rust', value: 'rust' },
      { name: 'C/C++', value: 'cpp' },
      { name: 'C# (.NET)', value: 'csharp' },
      { name: 'Flutter', value: 'flutter' },
      { name: 'React Native', value: 'react_native' },
      { name: 'Kotlin (Android)', value: 'kotlin' },
    ]
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
  let config;
  if (merge && existingConfig) {
    config = { ...existingConfig };

    // Ensure stacks array exists
    if (!config.stacks) config.stacks = [];
    if (config.stack && !config.stacks.includes(config.stack)) config.stacks.push(config.stack);

    // Add new stack if not present
    if (!config.stacks.includes(stack)) config.stacks.push(stack);

    // Merge extensions
    config.extensions = { ...config.extensions, [stack]: extensions[stack] };

    // Remove legacy single 'stack' property if moving to array
    delete config.stack;
  } else {
    config = {
      editor: selectedEditor,
      stacks: [stack],
      extensions: {
        [stack]: extensions[stack]
      }
    };
  }

  try {
    saveConfig(config);
    console.log(chalk.green(`\n💾 Configuration saved to ${chalk.bold('ext-sync.json')}`));
  } catch (error) {
    console.log(chalk.yellow(`\n⚠️  Warning: Could not save config: ${error.message}`));
  }
}
