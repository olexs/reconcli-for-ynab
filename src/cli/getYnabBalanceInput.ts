import inquirer from 'inquirer';

export async function getYnabBalanceInput(prompt: string, defaultBalance: number): Promise<number> {
    const answers = await inquirer.prompt([{
        type: 'number',
        name: 'number',
        message: `${prompt}:`,
        default: defaultBalance / 1000,
    }]);
    return (answers.number as number) * 1000;
}
