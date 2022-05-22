import {formatYnabAmount} from "./formatYnabAmount";
import {question} from "./readline";
import {InputMode} from "../options";
import {coinInput} from "./coinInput";

export async function getInputBalance(clearedBalance: number, mode: InputMode): Promise<number> {
    if (mode === 'number') {
        return await numberInput(clearedBalance);
    } else {
        return coinInput(mode);
    }
}

async function numberInput(clearedBalance: number): Promise<number> {
    let inputBalance: number = clearedBalance;
    do {
        const inputBalanceRaw = (await question(`Enter new balance [${formatYnabAmount(clearedBalance)}]: `)) || formatYnabAmount(clearedBalance);
        inputBalance = parseFloat(inputBalanceRaw);
        if (!inputBalance) {
            console.error(`Could not parse '${inputBalanceRaw}' as a valid floating point number, try again.`);
        } else {
            inputBalance = Math.round(inputBalance * 1000);
        }
    } while (isNaN(inputBalance));
    return inputBalance;
}
