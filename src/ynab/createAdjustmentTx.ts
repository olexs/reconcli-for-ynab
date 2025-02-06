import {
    api, TransactionClearedStatus, utils,
} from 'ynab';
import { SaveTransactionWithIdOrImportId } from 'ynab/dist/models/SaveTransactionWithIdOrImportId';
import { getInflowCategory } from './getInflowCategory';

export async function createAdjustmentTx(
    ynabApi: api,
    budgetId: string,
    accountId: string,
    remainingDifference: number,
): Promise<SaveTransactionWithIdOrImportId | undefined> {
    if (remainingDifference === 0.0) {
        return undefined;
    }

    const inflowCategory = await getInflowCategory(ynabApi, budgetId);
    return {
        account_id: accountId,
        date: utils.getCurrentDateInISOFormat(),
        amount: remainingDifference,
        payee_name: 'ReconCLI for YNAB: Adjustment',
        memo: 'Entered automatically by ReconCLI for YNAB',
        cleared: TransactionClearedStatus.Reconciled,
        category_id: inflowCategory.id,
        approved: true,
    };
}
