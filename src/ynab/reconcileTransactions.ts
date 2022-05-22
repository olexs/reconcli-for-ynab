import {Account, api, BudgetSummary, SaveTransaction, TransactionDetail, UpdateTransaction} from "ynab";
import {reconcileWithoutAdjustment} from "../cli/reconcileWithoutAdjustment";
import {reconcileWithAdjustment} from "../cli/reconcileWithAdjustment";
import ClearedEnum = TransactionDetail.ClearedEnum;

export async function reconcileTransactions(ynabApi: api,
                                            budget: BudgetSummary,
                                            account: Account,
                                            clearedBalance: number,
                                            inputBalance: number):
    Promise<{ updatedTransactions: Array<UpdateTransaction>, adjustmentTransaction?: SaveTransaction }> {

    const transactionsResponse = await ynabApi.transactions.getTransactionsByAccount(budget.id, account.id);
    const transactions = transactionsResponse.data.transactions;

    let reconciledTransactionIds: string[];
    let adjustmentTransaction: SaveTransaction | undefined = undefined;

    if (clearedBalance === inputBalance) {
        reconciledTransactionIds = reconcileWithoutAdjustment(transactions);
    } else {
        const result = await reconcileWithAdjustment(ynabApi, transactions, inputBalance, clearedBalance, budget, account);
        reconciledTransactionIds = result.clearedTransactionIds;
        adjustmentTransaction = result.adjustmentTx;
    }

    return {
        updatedTransactions: reconciledTransactionIds
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

