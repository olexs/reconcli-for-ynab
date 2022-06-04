import { InputMode } from '../options';
import { question } from './readline';
import { formatYnabAmount } from './formatYnabAmount';
import { getYnabBalanceInput } from './getYnabBalanceInput';

const coinMaps = new Map<InputMode, {name: string; value: number}[]>([
    ['euro-coins', [
        // Order from a mechanical coin sorter, largest diameter to smallest
        { name: '€2 coins', value: 2.0 },
        { name: '50c coins', value: 0.5 },
        { name: '€1 coins', value: 1.0 },
        { name: '20c coins', value: 0.2 },
        { name: '5c coins', value: 0.05 },
        { name: '10c coins', value: 0.1 },
        { name: '2c coins', value: 0.02 },
        { name: '1c coins', value: 0.01 },
    ]],
    ['usd-coins', [
        // Order by value
        { name: 'dollars', value: 1.0 },
        { name: 'half dollars', value: 0.5 },
        { name: 'quarters', value: 0.25 },
        { name: 'dimes', value: 0.1 },
        { name: 'nickels', value: 0.05 },
        { name: 'cents/pennies', value: 0.01 },
    ]],
    ['gbp-coins', [
        // Order by value
        { name: 'two pound coins', value: 2.0 },
        { name: 'one pound coins', value: 1.0 },
        { name: 'fifty pence coins', value: 0.5 },
        { name: 'twenty pence coins', value: 0.2 },
        { name: 'ten pence coins', value: 0.1 },
        { name: 'five pence coins', value: 0.05 },
        { name: 'two pence coins', value: 0.02 },
        { name: 'one penny coins', value: 0.01 },
    ]],
]);

export async function coinInput(mode: InputMode): Promise<number> {
    const coins = coinMaps.get(mode);
    if (!coins) {
        console.error(`Cannot find coin map for '${mode}', aborting.`);
        process.exit(1);
    }

    let coinsTotalAmount = 0;
    for (const coin of coins) {
        let validInput = false;
        while (!validInput) {
            const inputRaw = (await question(`Number of ${coin.name} [0]: `)) || '0';
            const inputNumber = parseInt(inputRaw, 10);
            if (!Number.isNaN(inputNumber) && inputNumber >= 0) {
                validInput = true;
                coinsTotalAmount += Math.round(inputNumber * coin.value * 1000);
            } else {
                console.error('Invalid input, please input an integer >= 0 or nothing');
            }
        }
    }

    console.info(`Total amount from coins is ${formatYnabAmount(coinsTotalAmount)}.`);

    const paperCashAmount = await getYnabBalanceInput('Enter the amount of paper cash', 0);
    console.info(`Total balance from coins and paper cash is ${formatYnabAmount(coinsTotalAmount + paperCashAmount)}.`);

    return coinsTotalAmount + paperCashAmount;
}
