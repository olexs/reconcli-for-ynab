import {
    Account, api, BudgetSummary, TransactionClearedStatus, TransactionDetail,
} from 'ynab';
import { SaveTransactionWithIdOrImportId } from 'ynab/dist/models/SaveTransactionWithIdOrImportId';
import { reconcileWithoutAdjustment } from '../cli/reconcileWithoutAdjustment';
import { reconcileWithAdjustment } from '../cli/reconcileWithAdjustment';

export async function reconcileTransactions(
    ynabApi: api,
    budget: BudgetSummary,
    account: Account,
    clearedBalance: number,
    inputBalance: number,
):
    Promise<{
        updatedTransactions: Array<SaveTransactionWithIdOrImportId>,
        adjustmentTx?: SaveTransactionWithIdOrImportId
    }> {
    const transactionsResponse = await ynabApi.transactions.getTransactionsByAccount(budget.id, account.id);
    const { transactions } = transactionsResponse.data;

    let reconciledTransactionIds: string[];
    let adjustmentTransaction: SaveTransactionWithIdOrImportId | undefined;

    if (clearedBalance === inputBalance) {
        reconciledTransactionIds = reconcileWithoutAdjustment(transactions);
    } else {
        const result = await reconcileWithAdjustment(ynabApi, transactions, inputBalance, clearedBalance, budget, account);
        reconciledTransactionIds = result.clearedTransactionIds;
        adjustmentTransaction = result.adjustmentTx;
    }

    return {
        updatedTransactions: reconciledTransactionIds
            .map((id) => transactions.find((tx) => tx.id === id) as TransactionDetail)
            .map((tx) => ({
                id: tx.id,
                account_id: account.id,
                cleared: TransactionClearedStatus.Reconciled,
                date: tx.date,
                amount: tx.amount,
            })),
        adjustmentTx: adjustmentTransaction,
    };
}
