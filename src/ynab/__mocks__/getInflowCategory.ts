import {api, Category} from "ynab";

export async function getInflowCategory(ynabApi: api, budgetId: string): Promise<Category> {
    return {
        id: 'mock_inflow_category_id',
        name: 'Mock Inflow Category',
        hidden: true,
        budgeted: 0,
        balance: 0,
        deleted: false,
        category_group_id: 'mock_default_category_group_id',
        activity: 0
    };
}