export type CliOptions = {
    tokenMode: TokenMode,
    token?: string,
    budget?: string,
    account?: string,
    opItem: string,
    opFieldLabel: string,
    input: InputMode
}

export type TokenMode = 'direct' | '1password';

export type InputMode = 'number' | 'euro-coins' | 'usd-coins' | 'gbp-coins';