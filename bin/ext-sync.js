#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import packageJson from '../package.json' with { type: 'json' };


const program = new Command();

program
    .name('ext-sync')
    .description(chalk.blue('Extension sync tool for sharing editor setups'))
    .version(packageJson.version)
    .action(async () => {
        const { start } = await import('../src/commands/start.js');
        await start();
    });

program
    .command('start')
    .description('Start the interactive menu')
    .action(async () => {
        const { start } = await import('../src/commands/start.js');
        await start();
    });

program.parse(process.argv);
