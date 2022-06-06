import {Account, api, BudgetSummary, SaveTransaction, TransactionDetail,} from 'ynab';
import {createAdjustmentTx} from '../ynab/createAdjustmentTx';
import {formatYnabAmount} from './formatYnabAmount';
import {formatTransactionLine, getStatusText, printTransactions} from './printTransactions';
import inquirer from "inquirer";
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
        const input = await inquireAboutAdjustmentProcess(unreconciledTransactions, remainingDifference);
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
            console.info(`Marked transaction ${flipTxIndex + 1} as ${getStatusText(flippedTransaction.cleared)}`);
        } else if (unreconciledTransactions.length > 0) {
            console.error(`Invalid input. Enter a number between 0 and ${unreconciledTransactions.length - 1}, 'f' or 'a'.`);
        } else {
            console.error('Invalid input. Enter \'f\' or \'a\'.');
        }
    }

    const clearedTransactionIds = unreconciledTransactions
        .filter((tx) => tx.cleared === ClearedEnum.Cleared)
        .map((tx) => tx.id);

    return {clearedTransactionIds, adjustmentTx};
}

async function inquireAboutAdjustmentProcess(unreconciledTransactions: TransactionDetail[],
                                             remainingDifference: number): Promise<string> {
    const answers = await inquirer.prompt([{
        type: 'list',
        loop: false,
        name: 'option',
        message: remainingDifference === 0
            ? 'No difference remaining, new balance matches the cleared transactions. Choose a tx to (un)clear:'
            : `Remaining difference: ${formatYnabAmount(remainingDifference)}. Choose a tx to (un)clear:`,
        choices: [...unreconciledTransactions.map((tx, index) => ({
            value: `${index}`,
            name: formatTransactionLine(tx, true),
            short: `${tx.cleared === ClearedEnum.Uncleared ? 'Clear' : 'Unclear'} transaction ${index + 1}`
        })), {
            value: 'f',
            name: `${remainingDifference !== 0
                ? '✅ Create adjustment transaction and finish reconciliation'
                : '✅ Finish reconciliation'}`,
            short: `${remainingDifference !== 0
                ? 'Create adjustment tx and finish'
                : 'Finish'}`
        }, {
            value: 'a',
            name: '❌ Abort reconciliation',
            short: 'Abort reconciliation'
        }],
    }]);
    return answers.option as string;
}
