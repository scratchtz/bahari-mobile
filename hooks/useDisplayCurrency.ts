import {useMMKVString} from 'react-native-mmkv';
import {StorageKeys} from '@constants/storage';
import {encryptedStorage} from '@storage/mmkv';
import {useQuery} from '@tanstack/react-query';
import {useMemo} from 'react';
import BigNumber from 'bignumber.js';
import {useSimplePrice} from '@hooks/useSimplePrice';
import Currencies from '@constants/currencies';
import {apiFetchExchangeRates, IExchangeRates} from '@utils/api/price';

export function useDisplayCurrency() {
    const [displayCurrency, setDisplayCurrency] = useMMKVString(StorageKeys.displayCurrency, encryptedStorage);
    return {displayCurrency: displayCurrency || 'USD', setDisplayCurrency};
}

export function useDisplayValue(nanoValue: string | BigNumber | number | undefined): {
    displayCurrency: string;
    displayValue: BigNumber;
    displayPrice: BigNumber;
    digits: number;
} {
    const {displayCurrency} = useDisplayCurrency();
    const {price} = useSimplePrice();
    const {allCurrencyData} = useAllCurrenciesValue();

    return useMemo(() => {
        const multiplier = allCurrencyData.get(displayCurrency);
        if (!multiplier || multiplier === 0) {
            return {displayCurrency, displayPrice: new BigNumber(0), displayValue: new BigNumber(0), digits: 0};
        }
        let digits = 0;
        //@ts-ignore
        const currencyDetails = Currencies[displayCurrency];
        if (currencyDetails) {
            digits = currencyDetails.decimal_digits;
        }
        //minimum two
        if (digits === 0) digits = 2;
        const displayPrice = new BigNumber(price).multipliedBy(multiplier);
        if (!nanoValue) {
            return {displayCurrency, displayPrice, displayValue: new BigNumber(0), digits};
        }
        return {displayCurrency, displayPrice, displayValue: displayPrice.multipliedBy(nanoValue), digits};
    }, [displayCurrency, allCurrencyData, price, nanoValue]);
}

//we fetch all currencies vs usd, then use usd from coingecko to convert to any currency.
export function useAllCurrenciesValue(enabled?: boolean) {
    const {displayCurrency} = useDisplayCurrency();

    //if usd we don't need to fetch at all no need for conversion
    const {data: res} = useQuery({
        enabled: enabled && displayCurrency !== 'USD',
        queryKey: ['all-currencies'],
        refetchInterval: 30000,
        queryFn: () => apiFetchExchangeRates(),
    });

    const allCurrencyData = useMemo(() => {
        const map = new Map<string, number>();
        if (!res) {
            map.set('USD', 1);
            return map;
        }
        if (res.data && res.data.rates) {
            for (const [code, rate] of Object.entries(res.data.rates)) {
                map.set(code, parseFloat(rate));
            }
        }
        return map;
    }, [res, displayCurrency]);
    return {allCurrencyData};
}
