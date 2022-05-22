import {api, Category} from "ynab";

const MASTER_CATEGORY_GROUP = "Internal Master Category";
const INFLOW_CATEGORY_KEYWORD = "Inflow";

export async function getInflowCategory(ynabApi: api, budgetId: string): Promise<Category> {
    const groupsResponse = await ynabApi.categories.getCategories(budgetId);
    const inflowCategory = groupsResponse.data.category_groups
        .find(grp => grp.name === MASTER_CATEGORY_GROUP)
        ?.categories
        .find(cat => cat.name.includes(INFLOW_CATEGORY_KEYWORD));
    if (!inflowCategory) {
        console.error("Error: cannot determine the YNAB 'Inflow' category for the adjustment transaction");
        process.exit(1);
    }
    return inflowCategory;
}