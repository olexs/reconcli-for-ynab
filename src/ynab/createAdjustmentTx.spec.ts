import {createAdjustmentTx} from "./createAdjustmentTx";
import {api, SaveTransaction} from "ynab";
import ClearedEnum = SaveTransaction.ClearedEnum;

jest.mock('./getInflowCategory');
const apiMock = jest.mocked(new api('', ''));

describe('createAdjustmentTx()', function () {

    test('when remainingDifference is 0.0, then do not create a transaction', async function () {
        const remainingDifference = 0.0;

        const transactionResult = await createAdjustmentTx(apiMock, 'mock_budget_id', 'mock_account_id', remainingDifference);

        expect(transactionResult).toBeUndefined();
    });

    test('when remainingDifference is not 0.0, then create a reconciled adjustment transaction with the specified amount and inflow category', async function () {
        const accountId = 'mock_account_id';
        const remainingDifference = 23.42;

        const transactionResult = await createAdjustmentTx(apiMock, 'mock_budget_id', accountId, remainingDifference);

        expect(transactionResult).toBeTruthy();
        const transaction = transactionResult as SaveTransaction;
        expect(transaction.cleared).toEqual(ClearedEnum.Reconciled);
        expect(transaction.amount).toEqual(remainingDifference);
        expect(transaction.category_id).toEqual('mock_inflow_category_id');
        expect(transaction.account_id).toEqual(accountId);
    });

});