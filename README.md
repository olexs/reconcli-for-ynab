# ReconCLI for YNAB

[![Build Status](https://github.com/olexs/reconcli-for-ynab/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/olexs/reconcli-for-ynab/actions?query=workflow%3A%22npm-publish%22)
[![NPM Version](http://img.shields.io/npm/v/reconcli-for-ynab.svg?style=flat)](https://www.npmjs.org/package/reconcli-for-ynab)
[![NPM Downloads](https://img.shields.io/npm/dm/reconcli-for-ynab.svg?style=flat)](https://npmcharts.com/compare/reconcli-for-ynab?minimal=true)
[![Install Size](https://packagephobia.now.sh/badge?p=reconcli-for-ynab)](https://packagephobia.now.sh/result?p=reconcli-for-ynab)

ReconCLI for YNAB - a CLI for quickly reconciling YNAB accounts

[![Works with YNAB](https://api.youneedabudget.com/papi/works_with_ynab.svg)](https://api.youneedabudget.com/)

## Features

- Quickly reconcile your YNAB accounts from a terminal
- Clear pending transactions and create a reconciliation transaction for the remaining difference, matching the YNAB app reconciliation flow
- Fully local - your data stays between the YNAB API and your machine, no third party involved
- Securely log in with a [Personal Access Token](https://api.youneedabudget.com/#personal-access-tokens)
- Retrieve the token from a source of your choice:
  - Direct input via command line parameter 
  - Password managers:
    - [1Password CLI 2](https://developer.1password.com/docs/cli/get-started/)
- Coin counting: if you use a coin counter, input the counts and calculate the new account balance automatically

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) (versions ≥14 supported, lower may work but not guaranteed)
- [Personal Access Token](https://api.youneedabudget.com/#personal-access-tokens) for your YNAB account

### Installation

Use the Node.js package manager of your choice to install as global:
```shell
npm i -g reconcli-for-ynab
```

Or run directly with `npx`:
```shell
npx reconcli-for-ynab
```

## Usage

```
Usage: reconcli-for-ynab [options]

ReconCLI for YNAB - a CLI for quickly reconciling YNAB accounts

Options:
  -m, --token-mode <mode>         Token retrieval mode: direct input or 1Password CLI (choices: "direct", "1password", default: "direct")
  -t, --token <token>             YNAB Personal Access Token (for direct input mode)
  --op-item <item>                1Password: name of item (default: "YNAB")
  --op-field-label <field-label>  1Password: label of field containing the token (default: "personal access token")
  -b, --budget <budget>           Name of the YNAB budget (leave empty if there is only one budget in the account, or if the default budget is set)
  -a, --account <account>         Name of the YNAB account (ignored if there is only one account in the budget)
  -i, --input <mode>              Amount input mode: simple number, or coin counts for cash (choices: "number", "euro-coins", "usd-coins", "gbp-coins", default: "number")
  -h, --help                      display help for command
```

## Upcoming features

- Non-interactive mode for integrating into scripts
- Add missing transactions during reconciliation
- Support for more token retrieval methods:
  - Secure keyboard input
  - MacOS Keychain
  - ...

## Built with

- [YNAB API](https://api.youneedabudget.com/) (via the [JavaScript library](https://github.com/ynab/ynab-sdk-js))
- [Commander.js](https://github.com/olexs/reconcli-for-ynab)
- [TypeScript](https://www.typescriptlang.org/)

## Acknowledgements

Inspired by [Reconcile for YNAB](https://github.com/JesseEmond/reconcile-for-ynab).

## Contributing

Issues and pull requests are welcome.

### Local development

```shell
npm ci         # install dependencies
npm run start  # run with ts-node once
npm run watch  # run with ts-node and nodemon, restarting for *.ts file changes
npm run build  # build into /dist
npm run local  # builds and installs the package on the local machine, then runs the binary
npm test       # run tests (once we have some)
```