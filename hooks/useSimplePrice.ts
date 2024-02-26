import {useQuery} from '@tanstack/react-query';
import {useMemo} from 'react';
import {apiFetchNanoPrice} from '@utils/api/price';
export const useSimplePrice = (enabled: boolean = false) => {
    const {data: res} = useQuery({
        enabled: enabled,
        staleTime: 30000,
        queryKey: ['simpleprice'],
        refetchInterval: 30000,
        queryFn: () => apiFetchNanoPrice(),
    });

    return useMemo(() => {
        if (!res || !res.data) return {price: 0, change: 0};
        return {price: res.data.usd, change: res.data.usd_24h_change};
    }, [res]);
};
