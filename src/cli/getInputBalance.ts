import { InputMode } from '../options';
import { coinInput } from './coinInput';
import { getYnabBalanceInput } from './getYnabBalanceInput';

export async function getInputBalance(clearedBalance: number, mode: InputMode): Promise<number> {
    if (mode === 'number') {
        return getYnabBalanceInput('Enter new balance', clearedBalance);
    }
    return coinInput(mode);
}
