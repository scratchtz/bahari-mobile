import {encryptedStorage} from '@storage/mmkv';
import {StorageKeys} from '@constants/storage';
import BigNumber from 'bignumber.js';
import {tools} from 'nanocurrency-web';
import {NativeCurrency} from '@hooks/useNativeCurrency';

export const getNativeCurrency = (): string => {
    return encryptedStorage.getString(StorageKeys.nativeCurrency) || 'XNO';
};
export const convertRawAmountToNativeCurrency = (rawAmount: string | number | BigNumber | undefined): string => {
    const nativeCurrency = getNativeCurrency();
    return convertNativeCurrencies(rawAmount, 'RAW', nativeCurrency);
};

export const convertNativeCurrencyAmountToRaw = (nativeAmount: string | number | BigNumber | undefined): string => {
    if (!nativeAmount) return '0';
    const nativeCurrency = getNativeCurrency();
    return convertNativeCurrencies(nativeAmount, nativeCurrency, 'RAW');
};

export const convertNativeCurrencies = (
    amount: number | string | BigNumber | undefined,
    inputCurrency: NativeCurrency | 'RAW' | string,
    outputCurrency: NativeCurrency | 'RAW' | string,
): string => {
    if (!amount) {
        return '0';
    }
    let value = new BigNumber(amount.toString());
    if (value.isNaN()) {
        return '0';
    }

    switch (inputCurrency) {
        case 'RAW':
            break;
        case 'XNO':
            value = value.shiftedBy(30);
            break;
        case 'NYANO':
            value = value.shiftedBy(24);
            break;
        default:
            throw new Error(`Unknown input currency ${inputCurrency}`);
    }

    switch (outputCurrency) {
        case 'RAW':
            return value.toFixed(0);
        case 'XNO':
            return value.shiftedBy(-30).toFixed(30, 1);
        case 'NYANO':
            return value.shiftedBy(-24).toFixed(24, 1);
        default:
            throw new Error(`Unknown output currency ${outputCurrency}`);
    }
};
