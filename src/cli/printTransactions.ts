import { SaveTransaction, TransactionDetail } from 'ynab';
import ClearedEnum = SaveTransaction.ClearedEnum;
import { formatYnabAmount } from './formatYnabAmount';

export function printTransactions(clearedTransactions: Partial<TransactionDetail>[], printClearedStatus: boolean) {
    console.table(clearedTransactions.map((tx) => ({
        Date: tx.date,
        Payee: tx.payee_name,
        Memo: tx.memo || '-',
        Amount: tx.amount ? formatYnabAmount(tx.amount) : 0,
        ...printClearedStatus ? { Status: getStatusText(tx.cleared) } : {},
    })));
}

export function getStatusText(status?: ClearedEnum): string {
    if (status === ClearedEnum.Cleared) return 'Cleared';
    if (status === ClearedEnum.Uncleared) return 'Uncleared';
    if (status === ClearedEnum.Reconciled) return 'Reconciled';
    return '-';
}
