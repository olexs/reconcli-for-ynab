import { TransactionClearedStatus, TransactionDetail } from 'ynab';
import { formatYnabAmount } from './formatYnabAmount';

export function printTransactions(clearedTransactions: Partial<TransactionDetail>[],
                                  printClearedStatus: boolean) {
    clearedTransactions.forEach((tx) => {
        console.log(formatTransactionLine(tx, printClearedStatus));
    });
}

export function getStatusText(status?: TransactionClearedStatus): string {
    if (status === TransactionClearedStatus.Cleared) return 'Cleared';
    if (status === TransactionClearedStatus.Uncleared) return 'Uncleared';
    if (status === TransactionClearedStatus.Reconciled) return 'Reconciled';
    return '-';
}

export function formatTransactionLine(tx: Partial<TransactionDetail>, printClearedStatus = false): string {
    return `${tx.date} | ${formatField(tx.payee_name)} | ${formatField(tx.category_name)} | ${formatField(tx.memo)} `
        + `| ${formatYnabAmount(tx.amount || 0).padStart(8, ' ')}${printClearedStatus ? ` | ${getStatusText(tx.cleared)}` : ''}`;
}

function formatField(text: string | null | undefined, length = 20): string {
    const shortenedString = text && text.length > length - 1
        ? `${text.substring(0, length - 1)}…`
        : text;
    return (shortenedString || '').padEnd(length, ' ');
}
