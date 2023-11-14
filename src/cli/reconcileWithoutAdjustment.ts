import {TransactionClearedStatus, TransactionDetail} from 'ynab';
import { printTransactions } from './printTransactions';

export function reconcileWithoutAdjustment(transactions: TransactionDetail[]): string[] {
    const clearedTransactions = transactions.filter((tx) => tx.cleared === TransactionClearedStatus.Cleared);
    const unclearedTransactions = transactions.filter((tx) => tx.cleared === TransactionClearedStatus.Uncleared);

    console.info('New balance matches the cleared balance, no adjustment necessary.');
    if (clearedTransactions.length > 0) {
        console.info(`Marking ${clearedTransactions.length} cleared transactions as reconciled:`);
        printTransactions(clearedTransactions, false);
    } else {
        console.info('No cleared transactions to mark as reconciled.');
    }

    if (unclearedTransactions.length > 0) {
        console.info(`Leaving ${unclearedTransactions.length} uncleared transactions untouched.`);
    }

    return clearedTransactions.map((tx) => tx.id);
}
