import {useQuery} from '@tanstack/react-query';
import {rpcAccountHistory} from '@utils/rpc/rpc';

export const useTransactionHistory = (enabled: boolean, address: string, count: number) => {
    return useQuery({
        enabled: enabled,
        queryKey: ['history', address, count],
        refetchInterval: 15000,
        queryFn: () => rpcAccountHistory(address, count),
    });
};
