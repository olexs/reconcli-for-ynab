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
            name: 'πͺπΊ Euro coin counts',
        }, {
            value: 'usd-coins',
            name: 'πΊπΈ USD coin counts',
        }, {
            value: 'gbp-coins',
            name: 'π¬π§ GBP coin counts',
        }],
    }]);
    return answers.inputMode as InputMode;
}
