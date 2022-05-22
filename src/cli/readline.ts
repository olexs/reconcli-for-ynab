const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

export function question(query: string): Promise<string> {
    return new Promise(resolve => {
        readline.question(query, resolve);
    });
}