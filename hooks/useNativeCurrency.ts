import {useMMKVString} from 'react-native-mmkv';
import {StorageKeys} from '@constants/storage';
import {encryptedStorage} from '@storage/mmkv';
import {useCallback, useMemo} from 'react';
import {convertRawAmountToNativeCurrency} from '@utils/helper/nativeCurrency';
import BigNumber from 'bignumber.js';

export const NativeCurrencies = ['XNO', 'NYANO'] as const;
export type NativeCurrency = (typeof NativeCurrencies)[number];
export const useNativeCurrency = () => {
    const [nativeCurrency, setNativeCurrency] = useMMKVString(StorageKeys.nativeCurrency, encryptedStorage);
    if (!nativeCurrency) {
        setNativeCurrency('XNO');
    }

    const rawValueToNative = useCallback(
        (rawAmount: string | number | BigNumber | undefined) => {
            return convertRawAmountToNativeCurrency(rawAmount);
        },
        [nativeCurrency],
    );

    return {nativeCurrency, setNativeCurrency, rawValueToNative} as {
        nativeCurrency: NativeCurrency;
        setNativeCurrency: (n: NativeCurrency) => void;
        rawValueToNative: (rawAmount: string | number | BigNumber | undefined) => string;
    };
};
