const util = require('util');
const exec = util.promisify(require('child_process').exec);

export async function getTokenFrom1PasswordCLI(item: string, fieldLabel: string): Promise<string> {
    console.info("Retrieving access token from 1Password CLI...");
    await checkOpCliAvailable();
    const token = retrieveTokenViaCli(item, fieldLabel);
    console.info("Token successfully retrieved from 1Password CLI");
    return token;
}

async function checkOpCliAvailable(): Promise<void> {
    try {
        const {stdout} = await exec(`which op`);
        if (!stdout || stdout.trim() == '') {
            console.error("No 'op' binary available on PATH. Make sure you have 1Password CLI 2 installed.");
            process.exit(1);
        }
    } catch (err) {
        console.error("Error occured while checking for 'op' binary", err);
        process.exit(1);
    }
}

async function retrieveTokenViaCli(item: string, fieldLabel: string): Promise<string> {
    try {
        const {stdout, stderr} = await exec(`op item get "${item}" --fields label="${fieldLabel}"`);
        if (stderr) {
            console.error("1Password CLI returned an error while retrieving the token", stderr);
            process.exit(1);
        }
        return stdout.trim();
    } catch (err) {
        console.error("Error occured while retrieving the token from 1Password CLI", err);
        process.exit(1);
    }
}