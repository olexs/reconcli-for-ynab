import {CliOptions} from "./options";
import {getToken} from "./token/getToken";
import * as ynab from "ynab";
import {getBudget} from "./ynab/getBudget";
import {getAccount} from "./ynab/getAccount";
import {getInputBalance} from "./cli/getInputBalance";
import {formatYnabAmount} from "./cli/formatYnabAmount";
import {reconcileTransactions} from "./cli/reconcileTransactions";

export async function main(options: CliOptions): Promise<void> {
    console.log("Welcome to ReconCLI for YNAB!");

    const token = await getToken(options);
    const ynabApi = new ynab.API(token);

    const budget = await getBudget(ynabApi, options);
    console.info(`Budget: ${budget.name}`);

    const account = await getAccount(ynabApi, options, budget.id);
    console.info(`Account: ${account.name}`);

    const clearedBalance = account.cleared_balance;
    console.info(`Current cleared balance: ${formatYnabAmount(clearedBalance)}`);

    const inputBalance = await getInputBalance(clearedBalance, options.input);
    const {updatedTransactions, adjustmentTransaction} = await reconcileTransactions(ynabApi, budget, account, clearedBalance, inputBalance);

    if (updatedTransactions.length > 0) {
        await ynabApi.transactions.updateTransactions(budget.id, {transactions: updatedTransactions});
        console.info(`Successfully saved ${updatedTransactions.length} cleared transactions as reconciled.`);
    }
    if (adjustmentTransaction) {
        await ynabApi.transactions.createTransaction(budget.id, {transaction: adjustmentTransaction});
        console.info(`Successfully saved the adjustment transaction.`);
    }

    console.info("Reconciliation complete. Thank you for using ReconCLI for YNAB!");
    process.exit(0);
}




