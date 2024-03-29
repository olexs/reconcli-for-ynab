import * as ynab from 'ynab';
import { AccountType } from 'ynab';
import { CliOptions } from './options';
import { getToken } from './token/getToken';
import { getBudget } from './ynab/getBudget';
import { getAccount } from './ynab/getAccount';
import { getInputBalance } from './cli/getInputBalance';
import { formatYnabAmount } from './cli/formatYnabAmount';
import { reconcileTransactions } from './ynab/reconcileTransactions';
import { inquireCashInputMode } from './cli/inquireCashInputMode';

export async function main(options: CliOptions): Promise<void> {
    console.log('Welcome to ReconCLI for YNAB!');

    const token = await getToken(options);
    const ynabApi = new ynab.API(token);

    const budget = await getBudget(ynabApi, options);
    console.info(`Budget: ${budget.name}`);

    const account = await getAccount(ynabApi, options, budget.id);
    console.info(`Account: ${account.name}`);

    const inputMode = options.input || (account.type === AccountType.Cash ? await inquireCashInputMode() : 'number');

    const clearedBalance = account.cleared_balance;
    console.info(`Current cleared balance: ${formatYnabAmount(clearedBalance)}`);

    const inputBalance = await getInputBalance(clearedBalance, inputMode);
    const { updatedTransactions, adjustmentTx } = await reconcileTransactions(ynabApi, budget, account, clearedBalance, inputBalance);

    if (updatedTransactions.length > 0) {
        await ynabApi.transactions.updateTransactions(budget.id, { transactions: updatedTransactions });
        console.info(`Successfully saved ${updatedTransactions.length} cleared transactions as reconciled.`);
    }
    if (adjustmentTx) {
        await ynabApi.transactions.createTransaction(budget.id, { transaction: adjustmentTx });
        console.info('Successfully saved the adjustment transaction.');
    }

    console.info('Reconciliation complete. Thank you for using ReconCLI for YNAB!');
    process.exit(0);
}
