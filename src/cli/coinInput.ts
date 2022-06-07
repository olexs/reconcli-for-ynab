import { InputMode } from '../options';
import { question } from './readline';
import { formatYnabAmount } from './formatYnabAmount';
import { getYnabBalanceInput } from './getYnabBalanceInput';
import inquirer from "inquirer";

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

export async function inquireCoinCounts(mode: InputMode): Promise<number> {
    const coins = coinMaps.get(mode);
    if (!coins) {
        console.error(`Cannot find coin map for '${mode}', aborting.`);
        process.exit(1);
    }

    const answers = await inquirer.prompt([...coins.map((coin) => ({
        name: coin.name,
        type: 'number',
        default: 0,
        message: `Number of ${coin.name}:`,
    })), {
        name: 'paper cash',
        type: 'number',
        default: 0,
        message: 'Enter the amount of paper cash:',
    }]);

    const coinsTotalAmount = coins
        .map((coin) => coin.value * answers[coin.name] * 1000)
        .reduce((x, y) => x + y);
    const paperCashAmount = answers['paper cash'] * 1000;

    console.info(`Total balance from coins and paper cash is ${formatYnabAmount(coinsTotalAmount + paperCashAmount)}.`);

    return coinsTotalAmount + paperCashAmount;
}
