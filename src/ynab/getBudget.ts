import { api, BudgetSummary } from 'ynab';
import { CliOptions } from '../options';

export async function getBudget(ynabApi: api, options: CliOptions) {
    const budgetsResponse = await ynabApi.budgets.getBudgets();
    let budget: BudgetSummary | null | undefined;

    if (options.budget) {
        budget = budgetsResponse.data.budgets.find((b) => b.name === options.budget);
        if (!budget) {
            console.error(`Budget with the name ${options.budget} (provided via -b/--budget) could not be found.`);
            process.exit(1);
        }
    } else {
        budget = budgetsResponse.data.budgets.length === 1
            ? budgetsResponse.data.budgets[0]
            : budgetsResponse.data.default_budget;
        if (!budget) {
            const budgetNames = budgetsResponse.data.budgets.map((b) => b.name);
            console.error(`There are multiple budgets (${budgetNames.join(', ')}), and none is set as default.`
                          + 'Choose one via -b/--budget or set a default budget in YNAB.');
            process.exit(1);
        }
    }
    return budget;
}
