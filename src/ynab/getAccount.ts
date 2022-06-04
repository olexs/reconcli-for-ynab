import { Account, api } from 'ynab';
import {CliOptions, TokenMode} from '../options';
import inquirer from "inquirer";

export async function getAccount(ynabApi: api, options: CliOptions, budgetId: string) {
    const accountsResponse = await ynabApi.accounts.getAccounts(budgetId);
    let account: Account | null | undefined;

    const openAccounts = accountsResponse.data.accounts.filter((acc) => !acc.closed);
    if (options.account) {
        account = openAccounts.find((b) => b.name === options.account);
        if (!account) {
            console.error(`Account with the name ${options.account} could not be found, or it is closed. Aborting.`);
            process.exit(1);
        }
    } else {
        account = openAccounts.length === 1
            ? openAccounts[0]
            : await inquireAccountSelection(openAccounts);
    }
    return account;
}

async function inquireAccountSelection(accounts: Account[]): Promise<Account> {
    const answers = await inquirer.prompt([{
        type: 'list',
        name: 'account',
        message: 'Please choose an account to reconcile:',
        choices: accounts.map((acc) => ({
            value: acc,
            name: acc.name
        })),
    }]);
    return answers.account as Account;
}