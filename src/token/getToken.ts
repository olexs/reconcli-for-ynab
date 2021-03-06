import inquirer from 'inquirer';
import { CliOptions, TokenMode } from '../options';
import { getTokenFrom1PasswordCLI } from './1password';

export async function getToken(options: CliOptions): Promise<string> {
    let ynabToken = '';

    const tokenMode = options.tokenMode || await inquireTokenMode();

    if (tokenMode === 'param') {
        ynabToken = getTokenFromOptions(options);
    } else if (tokenMode === 'input') {
        ynabToken = await inquireTokenInput();
    } else if (tokenMode === '1password') {
        ynabToken = await getTokenFrom1PasswordCLI(options.opItem, options.opFieldLabel);
    }

    return ynabToken;
}

function getTokenFromOptions(options: CliOptions): string {
    if (!options.token) {
        console.error('You must either specify the YNAB Personal Access Token manually using -t/--token, '
            + "or enable 1Password retrieval with '-m 1password'.");
        process.exit(1);
    }
    console.info('Using provided YNAB Personal Access Token');
    return options.token;
}

async function inquireTokenMode(): Promise<TokenMode> {
    const answers = await inquirer.prompt([{
        type: 'list',
        name: 'tokenMode',
        message: 'How would you like to provide the YNAB Personal Access Token?',
        choices: [
            { name: 'Manual entry', value: 'input' },
            { name: 'Retrieve via 1Password CLI 2', value: '1password' },
        ],
    }]);
    return answers.tokenMode as TokenMode;
}

async function inquireTokenInput(): Promise<string> {
    const answers = await inquirer.prompt([{
        type: 'password',
        name: 'token',
        message: 'Enter the YNAB Personal Access Token:',
    }]);
    return answers.token as string;
}
