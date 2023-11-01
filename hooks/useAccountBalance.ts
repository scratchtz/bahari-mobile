import {rpcAccountBalance} from '@utils/rpc/rpc';
import {useQuery} from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import {useEffect, useMemo} from 'react';
import {tools} from 'nanocurrency-web';
import {saveLatestAddressBalanceAndUpdate} from '@components/PickAccountModal/useAllWalletsBalance';

export const useAccountBalance = (address: string, enabled = false) => {
    const enable = address ? address !== '' && enabled : false;
    const response = useQuery({
        enabled: enable,
        refetchInterval: 8000,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        queryKey: ['account_balance', address],
        queryFn: () => rpcAccountBalance(address),
    });

    useEffect(() => {
        if (enabled && response.data) {
            const total = new BigNumber(response.data.balance).plus(response.data.pending).toString();
            saveLatestAddressBalanceAndUpdate(address, total);
        }
    }, [address, response.data]);

    return response;
};

interface DisplayBalance {
    balanceNano: string;
    balanceRaw: string;
    pendingNano: string;
    pendingRaw: string;
}
export const useDisplayBalance = (account: string, enabled = false): DisplayBalance => {
    const {data} = useAccountBalance(account, enabled);

    return useMemo(() => {
        if (!data || !data.balance) {
            return {balanceNano: '0', balanceRaw: '0', pendingNano: '0', pendingRaw: '0'};
        }
        return {
            balanceRaw: data.balance,
            pendingRaw: data.pending,
            balanceNano: tools.convert(data.balance, 'RAW', 'NANO'),
            pendingNano: tools.convert(data.pending, 'RAW', 'NANO'),
        };
    }, [data?.balance, data?.pending]);
};
