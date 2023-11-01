import {useAppTheme} from '@hooks/useAppTheme';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAllCurrenciesValue, useDisplayValue} from '@hooks/useDisplayCurrency';
import {useBlockReceiver} from '@hooks/useBlockReceiver';
import {useSimplePrice} from '@hooks/useSimplePrice';
import {useDefaultKeyPair} from '@hooks/useKeyPair';
import {useDisplayBalance} from '@hooks/useAccountBalance';
import React, {useMemo} from 'react';
import BigNumber from 'bignumber.js';
import Text from '@components/Text/Text';
import {formatValue} from '@utils/helper/numberFormatter';
import {StyleSheet, View} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import {AppTheme, rounded, spacing} from '@utils/styles';
import {useNativeCurrency} from '@hooks/useNativeCurrency';
import Loading from '@components/Animation/Loading';

const BalanceSection = () => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, balanceSectionStyles);
    const {nativeCurrency, rawValueToNative} = useNativeCurrency();

    useAllCurrenciesValue(true);
    useBlockReceiver();

    const {change: priceChange} = useSimplePrice(true); //fetch here only

    const {defaultKeyPair} = useDefaultKeyPair();
    if (!defaultKeyPair) return null;

    const {balanceNano, balanceRaw, pendingRaw} = useDisplayBalance(defaultKeyPair.address, true);
    const {displayCurrency, displayValue, displayPrice, digits} = useDisplayValue(balanceNano);

    const changeValue = useMemo(() => {
        return formatValue(displayValue.times(priceChange).div(100));
    }, [displayValue, priceChange]);

    const priceChangePercent = useMemo(() => {
        return new BigNumber(priceChange).toFormat(2);
    }, [priceChange]);

    const priceChangeColor = useMemo(
        () => (priceChange > 0 ? theme.colors.priceUp : theme.colors.priceDown),
        [theme, priceChange],
    );
    const hasPendingAmount = useMemo(() => new BigNumber(pendingRaw).isGreaterThan(0), [pendingRaw]);

    return (
        <>
            <Text style={styles.balance} weight="700">
                {formatValue(rawValueToNative(balanceRaw), displayPrice, 4)}
                <Text style={styles.nativeCurrency}> {nativeCurrency}</Text>
            </Text>
            <Text style={styles.balanceInBase}>
                {displayValue.toFormat(digits)} {displayCurrency}
            </Text>

            <View style={styles.priceChangeContainer}>
                <View style={[styles.priceChangeInner, {backgroundColor: priceChangeColor}]}>
                    {priceChange > 0 ? (
                        <AntDesign name="caretup" style={styles.caret} />
                    ) : (
                        <AntDesign name="caretdown" style={styles.caret} />
                    )}
                    <Text style={styles.priceChange}>{priceChangePercent}%</Text>
                </View>
                <Text style={[styles.priceUpTime, {color: priceChangeColor}]} weight="600">
                    {priceChange > 0 ? '+' : ''}
                    {changeValue} {displayCurrency}
                </Text>
            </View>

            {hasPendingAmount && (
                <View style={styles.pendingAmountContainer}>
                    <View style={styles.pendingAmountInner}>
                        <Text style={styles.pendingAmountTitle}>Pending Amount</Text>
                        <Text style={styles.pendingAmount} weight="500">
                            {formatValue(rawValueToNative(pendingRaw))} {nativeCurrency}
                        </Text>
                    </View>
                    <Loading />
                </View>
            )}
        </>
    );
};

const balanceSectionStyles = (theme: AppTheme) =>
    StyleSheet.create({
        balance: {
            fontSize: 45,
        },
        balanceInBase: {
            fontSize: 20,
            color: theme.colors.textSecondary,
        },
        nativeCurrency: {
            fontSize: 20,
        },
        priceChangeContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacing.m,
            // alignSelf: 'center',
        },
        priceChangeInner: {
            backgroundColor: theme.colors.priceUp,
            marginRight: spacing.xs,
            padding: 3,
            borderRadius: rounded.m,
            flexDirection: 'row',
            alignItems: 'center',
        },
        priceChange: {
            color: 'white',
            fontSize: 14,
        },
        caret: {
            fontSize: 10,
            color: 'white',
            marginRight: 2,
        },
        priceUpTime: {
            color: theme.colors.priceUp,
            fontSize: 14,
        },
        pendingAmountContainer: {
            flexDirection: 'row',
            alignSelf: 'flex-end',
            alignItems: 'center',
        },
        pendingAmountInner: {
            alignItems: 'flex-end',
        },
        pendingAmountTitle: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
        pendingAmount: {
            fontSize: 16,
        },
    });

export default React.memo(BalanceSection);
