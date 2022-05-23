import {api, SaveTransaction, utils} from "ynab";
import {getInflowCategory} from "./getInflowCategory";
import ClearedEnum = SaveTransaction.ClearedEnum;

export async function createAdjustmentTx(ynabApi: api,
                                         budgetId: string,
                                         accountId: string,
                                         remainingDifference: number): Promise<SaveTransaction | undefined> {
    if (remainingDifference === 0.0) {
        return undefined;
    }

    const inflowCategory = await getInflowCategory(ynabApi, budgetId);
    return {
        account_id: accountId,
        date: utils.getCurrentDateInISOFormat(),
        amount: remainingDifference,
        payee_name: "ReconCLI for YNAB: Adjustment",
        memo: "Entered automatically by ReconCLI for YNAB",
        cleared: ClearedEnum.Reconciled,
        category_id: inflowCategory.id,
        approved: true
    };
}