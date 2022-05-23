import { formatYnabAmount } from './formatYnabAmount';

describe('formatYnabAmount()', () => {
    test.each([
        { input: 0, output: '0.00' },
        { input: 1, output: '0.00' },
        { input: 10, output: '0.01' },
        { input: 100, output: '0.10' },
        { input: 1000, output: '1.00' },
        { input: 1001, output: '1.00' },
        { input: 20000, output: '20.00' },
        { input: 1550, output: '1.55' },
        { input: 21550, output: '21.55' },
    ])('format $input to $output', ({ input, output }) => {
        expect(formatYnabAmount(input)).toEqual(output);
    });
});
