import {
    Account, api, BudgetSummary, SaveTransaction, TransactionDetail,
} from 'ynab';
import { question } from './readline';
import { createAdjustmentTx } from '../ynab/createAdjustmentTx';
import { formatYnabAmount } from './formatYnabAmount';
import { getStatusText, printTransactions } from './printTransactions';
import ClearedEnum = TransactionDetail.ClearedEnum;

export async function reconcileWithAdjustment(
    ynabApi: api,
    transactions: Array<TransactionDetail>,
    inputBalance: number,
    clearedBalance: number,
    budget: BudgetSummary,
    account: Account,
):
    Promise<{ clearedTransactionIds: string[], adjustmentTx?: SaveTransaction }> {
    console.info('New balance differs from the current cleared balance, need to adjust.');

    const unreconciledTransactions = transactions
        .filter((tx) => tx.cleared !== ClearedEnum.Reconciled);

    let finishedReconciling = false;
    let remainingDifference = inputBalance - clearedBalance;
    let adjustmentTx: SaveTransaction | undefined;

    while (!finishedReconciling) {
        const promptText = printAdjustmentPrompt(unreconciledTransactions, remainingDifference);
        const input = await question(promptText);
        const flipTxIndex = parseInt(input, 10);

        if (input.trim() === 'a') {
            console.info('Reconciliation aborted. Thank you for using ReconCLI for YNAB!');
            process.exit(0);
        } else if (input.trim() === 'f') {
            adjustmentTx = await createAdjustmentTx(ynabApi, budget.id, account.id, remainingDifference);
            if (adjustmentTx) {
                console.info(`Created an adjustment transaction of ${formatYnabAmount(remainingDifference)}.`);
            }
            finishedReconciling = true;
        } else if (!Number.isNaN(flipTxIndex) && flipTxIndex >= 0 && flipTxIndex < unreconciledTransactions.length) {
            const flippedTransaction = unreconciledTransactions[flipTxIndex];
            flippedTransaction.cleared = flippedTransaction.cleared === ClearedEnum.Uncleared
                ? ClearedEnum.Cleared
                : ClearedEnum.Uncleared;
            remainingDifference -= flippedTransaction.amount;
            console.info(`Marked transaction ${flipTxIndex} as ${getStatusText(flippedTransaction.cleared)}`);
        } else if (unreconciledTransactions.length > 0) {
            console.error(`Invalid input. Enter a number between 0 and ${unreconciledTransactions.length - 1}, 'f' or 'a'.`);
        } else {
            console.error('Invalid input. Enter \'f\' or \'a\'.');
        }
    }

    const clearedTransactionIds = unreconciledTransactions
        .filter((tx) => tx.cleared === ClearedEnum.Cleared)
        .map((tx) => tx.id);

    return { clearedTransactionIds, adjustmentTx };
}

function printAdjustmentPrompt(unreconciledTransactions: TransactionDetail[], remainingDifference: number) {
    console.info('----------');
    if (unreconciledTransactions.length > 0) {
        console.info('Following transactions are not yet reconciled:');
        printTransactions(unreconciledTransactions, true);

        let promptText: string;
        if (remainingDifference === 0) {
            console.info('No difference remaining, new balance matches the cleared transactions.');
            promptText = "Enter a tx index to clear or unclear it, 'f' to finish reconciliation, or 'a' to abort: ";
        } else {
            console.info(`Remaining difference: ${formatYnabAmount(remainingDifference)}`);
            promptText = "Enter a tx index to clear or unclear it, 'f' to create an adjustment tx and finish, or 'a' to abort: ";
        }
        return promptText;
    }
    console.info('There are no unreconciled transactions.');

    let promptText: string;
    if (remainingDifference === 0) {
        console.info('No difference remaining, new balance matches the current cleared balance.');
        promptText = "Enter 'f' to finish reconciliation, or 'a' to abort: ";
    } else {
        console.info(`Remaining difference: ${formatYnabAmount(remainingDifference)}.`);
        promptText = "Enter 'f' to create an adjustment transaction and finish reconciliation, or 'a' to abort: ";
    }
    return promptText;
}
