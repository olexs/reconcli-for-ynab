import {InputMode} from "../options";
import {coinInput} from "./coinInput";
import {getNumberInput} from "./getNumberInput";

export async function getInputBalance(clearedBalance: number, mode: InputMode): Promise<number> {
    if (mode === 'number') {
        return getNumberInput("Enter new balance", clearedBalance);
    } else {
        return coinInput(mode);
    }
}

