import {Account, api, BudgetSummary, SaveTransaction, utils} from "ynab";
import {getInflowCategory} from "./getInflowCategory";
import ClearedEnum = SaveTransaction.ClearedEnum;

export async function createAdjustmentTx(ynabApi: api, budget: BudgetSummary, account: Account, remainingDifference: number): Promise<SaveTransaction> {
    const inflowCategory = await getInflowCategory(ynabApi, budget.id);
    return {
        account_id: account.id,
        date: utils.getCurrentDateInISOFormat(),
        amount: remainingDifference,
        payee_name: "ReconCLI for YNAB: Adjustment",
        memo: "Entered automatically by ReconCLI for YNAB",
        cleared: ClearedEnum.Reconciled,
        category_id: inflowCategory.id,
        approved: true
    };
}