import { execa } from 'execa';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
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

async function checkEditor(name, cmd) {
    try {
        await execa(cmd, ['--version']);
        return { name, value: cmd };
    } catch (error) {
        // Command failed or not found - return null
        return null;
    }
}

export async function detectEditors() {
    const checks = [
        checkEditor('VS Code', 'code'),
        checkEditor('Cursor', 'cursor'),
        checkEditor('Antigravity', 'antigravity')
    ];

    const results = await Promise.all(checks);
    return results.filter(Boolean);
}

export async function installExtensions(extensions, cmd) {
    if (extensions.length === 0) return;

    console.log(chalk.blue(`\nInstalling ${extensions.length} extensions for ${cmd}...\n`));
    const spinner = ora(`Installing extensions...`).start();

    try {
        // Prepare arguments for batch installation
        const args = [];
        extensions.forEach(ext => {
            const extId = typeof ext === 'string' ? ext : ext.id;
            args.push('--install-extension', extId);
        });
        args.push('--force');

        // Execute single command
        await execa(cmd, args, { shell: true });
        
        spinner.succeed(chalk.green(`✅ Successfully installed ${extensions.length} extensions.`));
    } catch (error) {
        spinner.fail(chalk.red(`Failed to install extensions.`));
        console.log(chalk.dim(`   Error: ${error.message}`));
    }
}

export async function installExtension(extensionId, cmd) {
    const spinner = ora(`Installing ${extensionId}...`).start();
    try {
        await execa(cmd, ['--install-extension', extensionId, '--force'], { shell: true });
        spinner.succeed(chalk.green(`Installed ${extensionId}`));
        return true;
    } catch (error) {
        spinner.fail(chalk.red(`Failed to install ${extensionId}`));
        return false;
    }
}

export async function listExtensions(cmd) {
  try {
    // 1. Try standard execution
    let stdout = '';
    try {
      stdout = execSync(`${cmd} --list-extensions`, { 
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'] 
      });
    } catch (e) {
      // Ignore error, try fallback
    }
    
    let list = stdout.split('\n').filter(line => line.trim().length > 0);
    
    // 2. Fallback: Try interactive shell
    if (list.length === 0) {
      try {
        const shell = process.env.SHELL || '/bin/bash';
        stdout = execSync(`${shell} -i -c "${cmd} --list-extensions"`, {
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore']
        });
        list = stdout.split('\n').filter(line => line.trim().length > 0);
      } catch (e) {
        // Ignore
      }
    }

    // 3. Fallback: Filesystem check
    if (list.length === 0) {
      try {
        let extDir = null;
        
        if (cmd === 'code') {
          extDir = path.join(os.homedir(), '.vscode', 'extensions');
        } else if (cmd === 'cursor') {
          extDir = path.join(os.homedir(), '.cursor', 'extensions');
        }

        if (extDir && fs.existsSync(extDir)) {
          const dirs = fs.readdirSync(extDir);
          list = dirs
            .filter(dir => !dir.startsWith('.')) // Ignore hidden files
            .map(dir => {
              // Format: publisher.extension-version
              const parts = dir.split('-');
              if (parts.length > 1) {
                // Remove the version (last part)
                parts.pop();
                return parts.join('-');
              }
              return dir;
            })
            .filter(Boolean);
            
          if (list.length > 0) {
            console.log(chalk.dim(`   Using filesystem at: ${extDir}`));
          }
        }
      } catch (e) {
        console.log(chalk.dim(`   Filesystem check failed: ${e.message}`));
      }
    }

    if (list.length === 0) {
      console.log(chalk.yellow(`\n⚠️  Warning: Could not find any installed extensions for '${cmd}'.`));
    }
    
    return list;
  } catch (error) {
    throw new Error(`Failed to list extensions: ${error.message}`);
  }
}
