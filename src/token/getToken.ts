import { CliOptions } from '../options';
import { getTokenFrom1PasswordCLI } from './1password';

export async function getToken(options: CliOptions): Promise<string> {
    let ynabToken = '';

    if (options.tokenMode === 'direct') {
        ynabToken = getTokenFromOptions(options);
    } else if (options.tokenMode === '1password') {
        ynabToken = await getTokenFrom1PasswordCLI(options.opItem, options.opFieldLabel);
    }

    return ynabToken;
}

function getTokenFromOptions(options: CliOptions): string {
    if (options.token) {
        console.info('Using provided YNAB Personal Access Token');
        return options.token;
    }
    console.error('You must either specify the YNAB Personal Access Token manually using -t/--token, '
        + "or enable 1Password retrieval with '-m 1password'.");
    process.exit(1);
}
