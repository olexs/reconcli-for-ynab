import inquirer from 'inquirer';
import { InputMode } from '../options';

export async function inquireCashInputMode(): Promise<InputMode> {
    const answers = await inquirer.prompt([{
        type: 'list',
        name: 'inputMode',
        message: 'Selected account is a cash account. Choose a balance input mode:',
        choices: [{
            value: 'number',
            name: 'Direct balance number input',
        }, {
            value: 'euro-coins',
            name: '🇪🇺 Euro coin counts',
        }, {
            value: 'usd-coins',
            name: '🇺🇸 USD coin counts',
        }, {
            value: 'gbp-coins',
            name: '🇬🇧 GBP coin counts',
        }],
    }]);
    return answers.inputMode as InputMode;
}
