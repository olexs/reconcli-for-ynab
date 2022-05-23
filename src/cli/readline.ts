import readline = require('readline');

const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

export function question(query: string): Promise<string> {
    return new Promise((resolve) => {
        readlineInterface.question(query, resolve);
    });
}
