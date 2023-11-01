import BigNumber from 'bignumber.js';
import * as RNLocalize from 'react-native-localize';

export const formatValue = (
    value: string | number | BigNumber | undefined,
    price?: string | number | BigNumber | undefined,
    decimals?: number,
) => {
    const {decimalSeparator, groupingSeparator} = RNLocalize.getNumberFormatSettings();
    if (!value) return '0';
    let precision = 2;
    if (decimals) {
        precision = decimals;
    } else if (price) {
        precision = Math.ceil(Math.log10(new BigNumber(price).toNumber()));
    }
    const n = new BigNumber(value);
    if (n.abs().isLessThan(1)) {
        precision = new BigNumber(value).precision(2, 1).decimalPlaces() || 2;
    }
    if (n.abs().isGreaterThanOrEqualTo(100)) {
        precision = 2;
    }
    if (n.abs().isGreaterThanOrEqualTo(1000)) {
        precision = 0;
    }
    return n.toFormat(precision, 1, {
        decimalSeparator,
        groupSeparator: groupingSeparator,
        groupSize: 3,
    });
};

export const formatPrice = (price: string | number | BigNumber | undefined, digits: number = 2): string => {
    const {decimalSeparator, groupingSeparator} = RNLocalize.getNumberFormatSettings();
    const p = new BigNumber(price || 0);
    if (p.isLessThan(10)) {
        digits = 4;
    }
    return p.toFormat(digits, 1, {
        decimalSeparator,
        groupSeparator: groupingSeparator,
        groupSize: 3,
    });
};
