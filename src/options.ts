export type CliOptions = {
    tokenMode?: TokenMode,
    token?: string,
    budget?: string,
    account?: string,
    opItem: string,
    opFieldLabel: string,
    input?: InputMode
}

export type TokenMode = 'param' | 'input' | '1password';

export type InputMode = 'number' | 'euro-coins' | 'usd-coins' | 'gbp-coins';
