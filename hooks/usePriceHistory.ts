import {useQuery} from '@tanstack/react-query';
import {useMemo} from 'react';

export const usePriceHistory = (enabled: boolean = false) => {
    const {data} = useQuery({
        enabled: enabled,
        queryKey: ['pricehistory'],
        refetchInterval: 30000,
        queryFn: () => fetchPriceHistory(),
    });

    const lineData = useMemo(() => {
        if (data?.prices) {
            let lineData: {timestamp: number; value: number}[] = data.prices.map(p => {
                return {timestamp: p[0], value: p[1]};
            });
            return lineData;
        }
        return [];
    }, [data]);

    const lastPrice = lineData.length > 0 ? lineData[lineData.length - 1].value : 0;
    return {lineData, lastPrice};
};

interface priceHistoryRes {
    prices: number[][];
    market_caps: number[][];
    total_volumes: number[][];
}
async function fetchPriceHistory(): Promise<priceHistoryRes> {
    const data = await fetch(
        'https://api.coingecko.com/api/v3/coins/nano/market_chart?vs_currency=usd&days=30&interval=daily',
    );
    return data.json();
}
