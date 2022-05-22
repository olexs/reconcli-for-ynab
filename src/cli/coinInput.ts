import {InputMode} from "../options";

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
    // TODO implement coin input mode
    return 0;
}

