import { api, BudgetSummary } from 'ynab';
import inquirer from 'inquirer';
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
            : budgetsResponse.data.default_budget
            || await inquireBudgetSelection(budgetsResponse.data.budgets);
    }
    return budget;
}

async function inquireBudgetSelection(budgets: BudgetSummary[]): Promise<BudgetSummary> {
    const answers = await inquirer.prompt([{
        type: 'list',
        name: 'budget',
        message: 'Please choose a budget to reconcile:',
        choices: budgets.map((acc) => ({
            value: acc,
            name: acc.name,
        })),
    }]);
    return answers.budget as BudgetSummary;
}
