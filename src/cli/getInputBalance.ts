import { InputMode } from '../options';
import { inquireCoinCounts} from './coinInput';
import { getYnabBalanceInput } from './getYnabBalanceInput';

export async function getInputBalance(clearedBalance: number, mode: InputMode = 'number'): Promise<number> {
    if (mode === 'number') {
        return getYnabBalanceInput('Enter new balance', clearedBalance);
    }
    return inquireCoinCounts(mode);
}
