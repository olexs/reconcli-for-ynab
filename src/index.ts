#!/usr/bin/env node

import { program, Option } from 'commander';
import { CliOptions } from './options';
import { main } from './main';

program
    .description('ReconCLI for YNAB - a CLI for quickly reconciling YNAB accounts')
    .addOption(new Option('-m, --token-mode <mode>', 'Token retrieval mode: direct input or 1Password CLI').choices(['direct', '1password']).default('direct'))
    .option('-t, --token <token>', 'YNAB Personal Access Token (for direct input mode)')
    .option('--op-item <item>', '1Password: name of item', 'YNAB')
    .option('--op-field-label <field-label>', '1Password: label of field containing the token', 'personal access token')
    .option('-b, --budget <budget>', 'Name of the YNAB budget (leave empty if there is only one budget in the account, or if the default budget is set)')
    .option('-a, --account <account>', 'Name of the YNAB account (ignored if there is only one account in the budget)')
    .addOption(new Option('-i, --input <mode>', 'Amount input mode: simple number, or coin counts for cash').choices(['number', 'euro-coins', 'usd-coins', 'gbp-coins']).default('number'))
    .parse(process.argv);

const options = program.opts<CliOptions>();

void main(options);
