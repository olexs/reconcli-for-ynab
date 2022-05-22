import {Account, api, BudgetSummary, SaveTransaction, TransactionDetail, UpdateTransaction, utils} from "ynab";
import {getStatusText, printTransactions} from "./printTransactions";
import {formatYnabAmount} from "./formatYnabAmount";
import {question} from "./readline";
import ClearedEnum = TransactionDetail.ClearedEnum;

export async function reconcileTransactions(ynabApi: api,
                                            budget: BudgetSummary,
                                            account: Account,
                                            clearedBalance: number,
                                            inputBalance: number):
    Promise<{ updatedTransactions: Array<UpdateTransaction>, adjustmentTransaction?: SaveTransaction }> {

    const transactionsResponse = await ynabApi.transactions.getTransactionsByAccount(budget.id, account.id);
    const transactions = transactionsResponse.data.transactions;

    let clearedTransactionIds: string[];
    let adjustmentTransaction: SaveTransaction | undefined = undefined;

    if (clearedBalance === inputBalance) {
        clearedTransactionIds = processNoAdjustmentNeeded(transactions);
    } else {
        const result = await processAdjustment(transactions, inputBalance, clearedBalance, account);
        clearedTransactionIds = result.clearedTransactionIds;
        adjustmentTransaction = result.adjustmentTx;
    }

    return {
        updatedTransactions: clearedTransactionIds
            .map(id => transactions.find(tx => tx.id === id) as TransactionDetail)
            .map(tx => ({
                id: tx.id,
                account_id: account.id,
                cleared: ClearedEnum.Reconciled,
                date: tx.date,
                amount: tx.amount
            })),
        adjustmentTransaction
    };
}

function processNoAdjustmentNeeded(transactions: TransactionDetail[]): string[] {
    const clearedTransactions = transactions.filter(tx => tx.cleared === ClearedEnum.Cleared);
    const unclearedTransactions = transactions.filter(tx => tx.cleared === ClearedEnum.Uncleared);

    console.info(`New balance matches the cleared balance, no adjustment necessary.`);
    if (clearedTransactions.length > 0) {
        console.info(`Marking ${clearedTransactions.length} cleared transactions as reconciled:`);
        printTransactions(clearedTransactions, false);
    } else {
        console.info(`No cleared transactions to mark as reconciled.`);
    }

    if (unclearedTransactions.length > 0) {
        console.info(`Leaving ${unclearedTransactions.length} uncleared transactions untouched.`);
    }

    return clearedTransactions.map(tx => tx.id);
}

async function processAdjustment(transactions: Array<TransactionDetail>,
                                 inputBalance: number,
                                 clearedBalance: number,
                                 account: Account):
    Promise<{ clearedTransactionIds: string[], adjustmentTx?: SaveTransaction }> {

    console.info(`New balance differs from the current cleared balance, need to adjust.`);

    const unreconciledTransactions = transactions.filter(tx => tx.cleared !== ClearedEnum.Reconciled);

    let finishedReconciling = false;
    let remainingDifference = inputBalance - clearedBalance;
    let adjustmentTx: SaveTransaction | undefined = undefined;

    while (!finishedReconciling) {
        const promptText = printAdjustmentPrompt(unreconciledTransactions, remainingDifference);
        const input = await question(promptText);
        const flipTxIndex = parseInt(input);

        if (input.trim() === "a") {
            console.info('Reconciliation aborted. Thank you for using ReconCLI for YNAB!')
            process.exit(0);
        } else if (input.trim() === "f") {
            if (remainingDifference !== 0) {
                adjustmentTx = createAdjustmentTx(account, remainingDifference);
                console.info(`Created an adjustment transaction of ${formatYnabAmount(remainingDifference)}.`)
            }
            finishedReconciling = true;
        } else if (!isNaN(flipTxIndex) && flipTxIndex >= 0 && flipTxIndex < unreconciledTransactions.length) {
            const flippedTransaction = unreconciledTransactions[flipTxIndex];
            flippedTransaction.cleared = flippedTransaction.cleared === ClearedEnum.Uncleared ? ClearedEnum.Cleared : ClearedEnum.Uncleared;
            remainingDifference -= flippedTransaction.amount;
            console.info(`Marked transaction ${flipTxIndex} as ${getStatusText(flippedTransaction.cleared)}`);
        } else {
            if (unreconciledTransactions.length > 0) {
                console.error(`Invalid input. Enter a number between 0 and ${unreconciledTransactions.length - 1}, 'f' or 'a'.`);
            } else {
                console.error(`Invalid input. Enter 'f' or 'a'.`);
            }
        }
    }

    const clearedTransactionIds = unreconciledTransactions
        .filter(tx => tx.cleared === ClearedEnum.Cleared)
        .map(tx => tx.id);

    return { clearedTransactionIds, adjustmentTx };
}

function printAdjustmentPrompt(unreconciledTransactions: TransactionDetail[], remainingDifference: number) {
    console.info("----------");
    if (unreconciledTransactions.length > 0) {
        console.info("Following transactions are not yet reconciled:");
        printTransactions(unreconciledTransactions, true);

        let promptText: string;
        if (remainingDifference === 0) {
            console.info("No difference remaining, new balance matches the cleared transactions.");
            promptText = "Enter a transaction index to clear or unclear it, 'f' to finish reconciliation, or 'a' to abort: ";
        } else {
            console.info(`Remaining difference: ${formatYnabAmount(remainingDifference)}`);
            promptText = "Enter a transaction index to clear or unclear it, 'f' to create an adjustment transaction and finish, or 'a' to abort: ";
        }
        return promptText;
    } else {
        console.info("There are no unreconciled transactions.");

        let promptText: string;
        if (remainingDifference === 0) {
            console.info("No difference remaining, new balance matches the current cleared balance.");
            promptText = "Enter 'f' to finish reconciliation, or 'a' to abort: ";
        } else {
            console.info(`Remaining difference: ${formatYnabAmount(remainingDifference)}.`);
            promptText = "Enter 'f' to create an adjustment transaction and finish reconciliation, or 'a' to abort: ";
        }
        return promptText;
    }
}

function createAdjustmentTx(account: Account, remainingDifference: number): SaveTransaction {
    return {
        account_id: account.id,
        date: utils.getCurrentDateInISOFormat(),
        amount: remainingDifference,
        payee_name: "ReconCLI for YNAB: Adjustment",
        memo: "Entered automatically by ReconCLI for YNAB",
        cleared: ClearedEnum.Reconciled,
        // TODO: get inflow category
    };
}