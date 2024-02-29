import {useQuery} from '@tanstack/react-query';
import {rpcAccountRepresentative} from '@utils/rpc/rpc';
import {apiFetchRepresentatives} from '@utils/api/representatives';

export function useRepresentative(account?: string, enabled = true) {
    return useQuery({
        enabled: enabled && !!account,
        queryKey: ['account_representative', account],
        queryFn: () => rpcAccountRepresentative(account || ''),
    });
}

export function useRepresentatives() {
    return useQuery({
        queryKey: ['/v1/representatives'],
        staleTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 10,
        queryFn: () => apiFetchRepresentatives(),
    });
}
