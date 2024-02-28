import {KeyPair} from '@utils/types';
import {rpcAccountInfo, rpcAccountRepresentative, rpcProcessBlock} from '@utils/rpc/rpc';
import {mustGetWork} from '@hooks/useBlockReceiver';
import {block as blockSigner} from 'nanocurrency-web';
import {WorkDifficulty} from '@utils/rpc/work';

export const changeRepresentative = async (newRep: string, account: KeyPair): Promise<boolean> => {
    const rep = await rpcAccountRepresentative(account.publicKey);
    if (rep.representative === newRep) {
        return true;
    }

    const accountInfo = await rpcAccountInfo(account.address);
    if (!accountInfo || !accountInfo.frontier) {
        throw new Error('Account not found');
    }
    console.log(accountInfo.frontier);

    const work = await mustGetWork(accountInfo.frontier, WorkDifficulty.Upper);
    if (!work) {
        throw new Error('Work not found');
    }

    const data = {
        walletBalanceRaw: accountInfo.balance,
        address: account.address,
        representativeAddress: newRep,
        frontier: accountInfo.frontier,
    };
    const signedBlock = blockSigner.representative(data, account.privateKey);
    signedBlock.work = work;

    const res = await rpcProcessBlock({
        action: 'process',
        json_block: 'true',
        subtype: 'change',
        block: signedBlock,
    });

    if (!!res.error) {
        throw new Error(res.error);
    }

    return !!res.hash;
};
