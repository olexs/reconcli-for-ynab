import { Account, api } from 'ynab';
import { CliOptions } from '../options';

export async function getAccount(ynabApi: api, options: CliOptions, budgetId: string) {
    const accountsResponse = await ynabApi.accounts.getAccounts(budgetId);
    let account: Account | null | undefined;

    const openAccounts = accountsResponse.data.accounts.filter((acc) => !acc.closed);
    if (options.account) {
        account = openAccounts.find((b) => b.name === options.account);
        if (!account) {
            console.error(`Account with the name ${options.account} (provided via -a/--account) could not be found, or it is closed. Aborting.`);
            process.exit(1);
        }
    } else {
        account = openAccounts.length === 1
            ? openAccounts[0]
            : null;
        if (!account) {
            const accountNames = openAccounts.map((b) => b.name);
            console.error(`There are multiple open accounts in the budget: ${accountNames.join(', ')}. Choose one via -a/--account.`);
            process.exit(1);
        }
    }
    return account;
}
