import {getKeyPair} from '@storage/wallet';
import BigNumber from 'bignumber.js';
import {rpcAccountInfo, rpcProcessBlock} from '@utils/rpc/rpc';
import {block as blockSigner} from 'nanocurrency-web';
import {clearWork, mustGetWork} from '@hooks/useBlockReceiver';
export const SendError = {
    keyPairNotFound: 'key pair not found',
    overdrawn: 'overdrawn',
    invalidAmount: 'invalid-amount',
    unknownError: 'unknown-error',
    workFailed: 'work-failed',
};
export async function sendNano(fromAddress: string, toAddress: string, rawAmount: string): Promise<boolean> {
    const kp = getKeyPair(fromAddress);
    if (!kp) {
        throw SendError.keyPairNotFound;
    }
    const amount = new BigNumber(rawAmount);
    if (!amount.isGreaterThan(0)) {
        throw SendError.invalidAmount;
    }
    const accountInfo = await rpcAccountInfo(kp.address);
    if (!accountInfo || !accountInfo.frontier) {
        throw SendError.unknownError;
    }
    const balance = new BigNumber(accountInfo.balance);

    if (!balance.minus(rawAmount).isGreaterThanOrEqualTo(0)) {
        throw SendError.overdrawn;
    }

    //TODO change representative
    const representative =
        accountInfo.representative || 'nano_3jwrszth46rk1mu7rmb4rhm54us8yg1gw3ipodftqtikf5yqdyr7471nsg1k';

    const data = {
        walletBalanceRaw: accountInfo.balance,
        fromAddress: fromAddress,
        toAddress: toAddress,
        representativeAddress: representative,
        frontier: accountInfo.frontier,
        amountRaw: rawAmount,
    };

    // Returns a correctly formatted and signed block ready to be sent to the blockchain
    const signedBlock = blockSigner.send(data, kp.privateKey);
    const work = await mustGetWork(accountInfo.frontier);
    if (!work) {
        throw SendError.workFailed;
    }
    signedBlock.work = work;
    const res = await rpcProcessBlock({
        action: 'process',
        json_block: 'true',
        subtype: 'send',
        block: signedBlock,
    });

    if (res.error && res.error.includes('work is insufficient')) {
        clearWork(accountInfo.frontier);
        return sendNano(fromAddress, toAddress, rawAmount);
    }
    if (res.hash) {
        void mustGetWork(res.hash);
    }
    return true;
}
