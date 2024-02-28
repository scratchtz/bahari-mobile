import {useDefaultKeyPair} from '@hooks/useKeyPair';
import {useEffect} from 'react';
import {useQuery} from '@tanstack/react-query';
import {rpcAccountInfo, rpcAccountsReceivable, rpcBlockInfo, rpcProcessBlock} from '@utils/rpc/rpc';
import {permanentStorage} from '@storage/mmkv';
import {BlockInfo} from '@utils/rpc/types';
import {getKeyPair} from '@storage/wallet';
import {block as blockSigner} from 'nanocurrency-web';
import {useTransactionHistory} from '@hooks/useTransactionHistory';
import {rpcGenerateWork, WorkDifficulty} from '@utils/rpc/work';
import {useAccountBalance} from '@hooks/useAccountBalance';
import {sleep} from '@utils/helper/sleep';

export const useAccountReceivable = (account?: string, enabled?: boolean) => {
    const enable = account ? account !== '' && enabled : false;
    const accounts = account ? [account] : [];
    return useQuery({
        enabled: enable,
        refetchInterval: 10000,
        queryKey: ['accounts_receivable', account],
        queryFn: () => rpcAccountsReceivable(accounts, 50),
    });
};
export const useBlockReceiver = () => {
    const {defaultKeyPair} = useDefaultKeyPair();
    const {refetch: refetchAccountBalance} = useAccountBalance(defaultKeyPair?.address || '', false);
    const {data} = useAccountReceivable(defaultKeyPair?.address, true);
    const {refetch: refetchTransactionHistory} = useTransactionHistory(false, defaultKeyPair?.address || '', 5);

    useEffect(() => {
        void handleBlocks();
    }, [data]);

    const handleBlocks = async () => {
        if (!data || !data.blocks) return;
        for (const [address, blocks] of Object.entries(data.blocks)) {
            await getBlocks(address, blocks);
        }
    };

    const getBlocks = async (address: string, blocks: string[]) => {
        const kp = getKeyPair(address);
        if (!kp) return;

        let lastHash = '';
        for (const blockHash of blocks) {
            try {
                const blockData = await fetchBlock(blockHash);
                if (!blockData) {
                    return;
                }
                const accountInfo = await rpcAccountInfo(address);
                let isNewAccount = false;

                if (accountInfo.error) {
                    if (accountInfo.error === 'Account not found') {
                        isNewAccount = true;
                    } else {
                        //Bad account maybe? what if they change error in the future?
                        continue;
                    }
                }

                const frontier = isNewAccount
                    ? '0000000000000000000000000000000000000000000000000000000000000000'
                    : accountInfo.frontier;

                const accountBalance = accountInfo.balance || '0';
                const data = {
                    frontier,
                    walletBalanceRaw: accountBalance,
                    amountRaw: blockData.amount,
                    toAddress: address,
                    representativeAddress: blockData.contents.representative,
                    transactionHash: blockHash,
                };

                const signedBlock = blockSigner.receive(data, kp.privateKey);
                const hashForWork = isNewAccount ? kp.publicKey.toUpperCase() : signedBlock.previous;

                let work = await mustGetWork(hashForWork);
                if (!work) {
                    return;
                }

                signedBlock.work = work;
                const res = await rpcProcessBlock({
                    action: 'process',
                    json_block: 'true',
                    subtype: 'receive',
                    block: signedBlock,
                });
                if (res.hash) {
                    await sleep(1000); //work is expensive, spend at least a second before going to the next one
                    await refetchAccountBalance({cancelRefetch: true});
                    await refetchTransactionHistory({cancelRefetch: true});
                    lastHash = res.hash;
                }
            } catch (error) {
                console.log(error);
            } finally {
                await refetchAccountBalance({cancelRefetch: true});
            }
        }

        if (lastHash.length > 0) {
            //fetching hash in background just in case we'll need it later
            void mustGetWork(lastHash);
        }
    };
};

export const fetchBlock = async (blockHash: string): Promise<BlockInfo> => {
    const cachingKey = 'block_info' + blockHash;
    //caching coz block info never changes anyway, avoid sending too many requests
    const savedBlock = permanentStorage.getString(cachingKey);
    if (savedBlock) {
        return JSON.parse(savedBlock);
    }
    try {
        const data = await rpcBlockInfo(blockHash);
        permanentStorage.set(cachingKey, JSON.stringify(data));
        return data;
    } catch (e) {
        throw e;
    }
};

export const saveWork = (hash: string, difficulty: string, work: string) => {
    permanentStorage.set('work_' + hash.toUpperCase() + difficulty, work);
};

export const clearWork = (hash: string) => {
    permanentStorage.delete('work_' + hash.toUpperCase());
};
export const mustGetWork = async (
    hash: string,
    difficulty: WorkDifficulty = WorkDifficulty.Upper,
): Promise<string | undefined> => {
    hash = hash.toUpperCase();
    let work =
        permanentStorage.getString('work_' + hash.toUpperCase() + WorkDifficulty.Upper) ||
        permanentStorage.getString('work_' + hash.toUpperCase() + difficulty);
    if (work) {
        return work;
    }
    try {
        const workRes = await rpcGenerateWork(hash, difficulty);
        if (workRes && workRes.work) {
            const work = workRes.work;
            saveWork(hash, difficulty, work);
            return work;
        }
        return undefined;
    } catch (e) {
        console.log(e);
    }
};
