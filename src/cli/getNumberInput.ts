import { question } from './readline';
import { formatYnabAmount } from './formatYnabAmount';

export async function getNumberInput(prompt: string, defaultAmount: number): Promise<number> {
    let inputAmount: number = defaultAmount;

    do {
        const inputBalanceRaw = (await question(`${prompt} [${formatYnabAmount(defaultAmount)}]: `)) || formatYnabAmount(defaultAmount);
        inputAmount = parseFloat(inputBalanceRaw);
        if (isNaN(inputAmount)) {
            console.error(`Could not parse '${inputBalanceRaw}' as a valid floating point number, try again.`);
        } else {
            inputAmount = Math.round(inputAmount * 1000);
        }
    } while (isNaN(inputAmount));

    return inputAmount;
}
