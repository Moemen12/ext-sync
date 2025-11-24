import { execa } from 'execa';
import chalk from 'chalk';
import ora from 'ora';

export function getActiveEditor() {
    const env = process.env;

    // 1. Check for Cursor specific variable
    if (env.CURSOR_TRACE_ID) {
        return 'cursor';
    }

    // 2. Check for Antigravity specific variable
    // Based on user logs: VSCODE_GIT_ASKPASS_NODE=/usr/share/antigravity/antigravity
    if (env.VSCODE_GIT_ASKPASS_NODE && env.VSCODE_GIT_ASKPASS_NODE.includes('antigravity')) {
        return 'antigravity';
    }

    // 3. Check for VS Code (standard or snap)
    // TERM_PROGRAM is standard, but VSCODE_IPC_HOOK_CLI is also a strong indicator across platforms
    if (env.TERM_PROGRAM === 'vscode' || env.VSCODE_IPC_HOOK_CLI) {
        return 'code';
    }

    // 4. Fallback: If not running inside an editor terminal, return null
    return null;
}

export async function detectEditors() {
    const editors = [];

    try {
        await execa('code', ['--version']);
        editors.push({ name: 'VS Code', value: 'code' });
    } catch (e) {
        // VS Code not found
    }

    try {
        await execa('cursor', ['--version']);
        editors.push({ name: 'Cursor', value: 'cursor' });
    } catch (e) {
        // Cursor not found
    }

    try {
        await execa('antigravity', ['--version']);
        editors.push({ name: 'Antigravity', value: 'antigravity' });
    } catch (e) {
        // Antigravity not found
    }

    return editors;
}

export async function installExtension(extensionId, cmd) {
    const spinner = ora(`Installing ${extensionId} on ${cmd}...`).start();
    try {
        await execa(cmd, ['--install-extension', extensionId, '--force']);
        spinner.succeed(chalk.green(`Installed ${extensionId}`));
        return true;
    } catch (error) {
        spinner.fail(chalk.red(`Failed to install ${extensionId} on ${cmd}`));
        return false;
    }
}

export async function installExtensions(extensions, cmd) {
    console.log(chalk.blue(`\nInstalling ${extensions.length} extensions for ${cmd}...\n`));

    let successCount = 0;
    for (const ext of extensions) {
        // Handle both string IDs and objects with .id property
        const extId = typeof ext === 'string' ? ext : ext.id;
        const success = await installExtension(extId, cmd);
        if (success) successCount++;
    }

    console.log(chalk.green(`\n✅ Installed ${successCount}/${extensions.length} extensions.\n`));
}

export async function listExtensions(cmd) {
  try {
    const { stdout } = await execa(cmd, ['--list-extensions']);
    return stdout.split('\n').filter(Boolean);
  } catch (error) {
    throw new Error(`Failed to list extensions: ${error.message}`);
  }
}
