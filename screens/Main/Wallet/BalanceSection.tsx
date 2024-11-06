import {useAppTheme} from '@hooks/useAppTheme';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useDisplayValue} from '@hooks/useDisplayCurrency';
import {useBlockReceiver} from '@hooks/useBlockReceiver';
import {useSimplePrice} from '@hooks/useSimplePrice';
import {useDefaultKeyPair} from '@hooks/useKeyPair';
import {useDisplayBalance} from '@hooks/useAccountBalance';
import React from 'react';
import BigNumber from 'bignumber.js';
import Text from '@components/Text/Text';
import {formatValue} from '@utils/helper/numberFormatter';
import {StyleSheet, View} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import {AppTheme, rounded, spacing} from '@utils/styles';
import {useNativeCurrency} from '@hooks/useNativeCurrency';
import Loading from '@components/Animation/Loading';
import {useTranslation} from 'react-i18next';

const BalanceSection = () => {
    useBlockReceiver();

    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, balanceSectionStyles);
    const {nativeCurrency, rawValueToNative} = useNativeCurrency();

    const {change: priceChange} = useSimplePrice(true);

    const {t} = useTranslation();

    const {defaultKeyPair} = useDefaultKeyPair();
    if (!defaultKeyPair) return null;

    const {balanceNano, balanceRaw, pendingRaw} = useDisplayBalance(defaultKeyPair.address, true);
    const {displayCurrency, displayValue, displayPrice, digits} = useDisplayValue(balanceNano);

    const changeValue = formatValue(displayValue.times(priceChange).div(100));
    const priceChangePercent = new BigNumber(priceChange).toFormat(2);

    const priceChangeColor = priceChange > 0 ? theme.colors.priceUp : theme.colors.priceDown;
    const hasPendingAmount = new BigNumber(pendingRaw).isGreaterThan(0);
    const balance = formatValue(rawValueToNative(balanceRaw), displayPrice, 4)

    return (
        <>
            <Text style={styles.balance} weight="700">
                {t('wallet.balance_section.balance',{balance:balance})}
                <Text style={styles.nativeCurrency}> {nativeCurrency}</Text>
            </Text>
            <Text style={styles.balanceInBase}>
                {t('wallet.balance_section.balance_base',{balance:displayValue.toFormat(digits),currency:displayCurrency})}
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
                    {t('wallet.balance_section.price_change',{price:changeValue,currency:displayCurrency})}
                </Text>
            </View>

            {hasPendingAmount && (
                <View style={styles.pendingAmountContainer}>
                    <View style={styles.pendingAmountInner}>
                        <Text style={styles.pendingAmountTitle}>{t('wallet.balance_section.pending_amount')}</Text>
                        <Text style={styles.pendingAmount} weight="500">
                            {t('wallet.balance_section.pending',{balance:formatValue(rawValueToNative(pendingRaw)),currency:nativeCurrency})}
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
