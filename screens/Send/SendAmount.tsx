import React, {useEffect, useMemo, useRef, useState} from 'react';
import {rounded, spacing} from '@utils/styles';

import {AppTheme} from '@utils/styles/theme';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import Text from '@components/Text/Text';
import {CommonStackScreenProps} from '@navigation/types';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import Separator from '@components/Separator/Separator';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import Button from '@components/Button/Button';
import SendNanoModal from '@components/SendNanoModal/SendNanoModal';
import {ToastController} from '@components/Toast/Toast';
import {getAddressDetails} from '@hooks/useContacts';
import BigNumber from 'bignumber.js';
import {useDefaultKeyPair} from '@hooks/useKeyPair';
import {useAccountBalance} from '@hooks/useAccountBalance';
import {SimpleLineIcons, Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import {useNativeCurrency} from '@hooks/useNativeCurrency';
import {formatValue} from '@utils/helper/numberFormatter';
import {useDisplayValue} from '@hooks/useDisplayCurrency';
import * as Haptics from 'expo-haptics';
import {
    convertNativeCurrencies,
    convertNativeCurrencyAmountToRaw,
    convertRawAmountToNativeCurrency,
} from '@utils/helper/nativeCurrency';
import * as RNLocalize from 'react-native-localize';
import {SendToWrap} from '@screens/Send/SendToWrap';
import {tools} from 'nanocurrency-web';
import {useTranslation} from 'react-i18next';

const SendAmount: React.FC<CommonStackScreenProps<'SendAmount'>> = ({navigation, route}) => {
    const {defaultKeyPair} = useDefaultKeyPair();
    const {address, rawAmount: routeRawAmount} = route.params;
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const {t} = useTranslation();

    const {decimalSeparator, groupingSeparator: groupSeparator} = RNLocalize.getNumberFormatSettings();

    const {data: accountBalance} = useAccountBalance(defaultKeyPair?.address || '', true);

    const {nativeCurrency, rawValueToNative} = useNativeCurrency();
    const {displayCurrency, displayPrice} = useDisplayValue(0);

    const amountInputRef = useRef<TextInput>(null);

    const [inputAmount, setInputInputAmount] = useState<string>(
        routeRawAmount
            ? new BigNumber(convertRawAmountToNativeCurrency(routeRawAmount)).toFormat({
                  decimalSeparator,
                  groupSeparator: '',
              })
            : '',
    );

    const [inputCurrencyIsNative, setInputCurrencyIsNative] = useState(true);
    const sendNanoModal = useRef<BottomSheetModal>(null);

    const toName = useMemo(() => {
        const data = getAddressDetails(address);
        if (data) {
            return data.name;
        }
        return '';
    }, [address]);

    const handleNext = () => {
        if (!inputAmount) {
            ToastController.show({kind: 'error', title: 'Error', content: `${t('wallet.send.amount.error_no_amount')}`});
            amountInputRef.current?.focus();
            return;
        }
        sendNanoModal.current?.present();
    };

    const onMaxBalance = () => {
        //max balance only when input currency is native, don't deal with price changes.
        if (!inputCurrencyIsNative) {
            onSwapCurrencies();
        }
        const nativeTotalValue = convertRawAmountToNativeCurrency(accountBalance?.balance || 0);
        setInputInputAmount(new BigNumber(nativeTotalValue).toFormat({decimalSeparator: '.', groupSeparator: ''}));
    };

    const estimateAmount = useMemo(() => {
        if (inputCurrencyIsNative) {
            const valueInNano = convertNativeCurrencies(inputAmount, nativeCurrency, 'XNO');
            return new BigNumber(valueInNano || 0).times(displayPrice);
        }
        const amountInNano = new BigNumber(inputAmount || 0).div(displayPrice).toFixed(8, 1);
        return new BigNumber(convertNativeCurrencies(amountInNano, 'XNO', nativeCurrency));
    }, [inputCurrencyIsNative, nativeCurrency, displayCurrency, inputAmount]);

    const onSwapCurrencies = () => {
        setInputInputAmount('');
        setInputCurrencyIsNative(v => !v);
        amountInputRef.current?.focus();
    };

    const balanceAfter = (inputAmount: string) => {
        if (inputCurrencyIsNative) {
            return new BigNumber(accountBalance?.balance || 0).minus(
                convertNativeCurrencyAmountToRaw(inputAmount || 0),
            );
        }
        return new BigNumber(accountBalance?.balance || 0).minus(convertNativeCurrencyAmountToRaw(estimateAmount || 0));
    };

    const isBalanceInsufficient = !balanceAfter(inputAmount).isGreaterThanOrEqualTo(0);
    const {inputCurrency, estimateCurrency} = useMemo(() => {
        if (inputCurrencyIsNative) return {inputCurrency: nativeCurrency, estimateCurrency: displayCurrency};
        return {inputCurrency: displayCurrency, estimateCurrency: nativeCurrency};
    }, [inputCurrencyIsNative, nativeCurrency, displayCurrency]);

    const rawAmount = useMemo(() => {
        if (inputCurrencyIsNative) return convertNativeCurrencies(inputAmount, nativeCurrency, 'RAW');
        return convertNativeCurrencies(estimateAmount, estimateCurrency, 'RAW');
    }, [inputAmount]);

    const canProceed =
        new BigNumber(rawAmount).isGreaterThan(0) && !isBalanceInsufficient && tools.validateAddress(address);

    const textInputSize = useMemo(() => {
        if (inputAmount.length < 4) return 46;
        if (inputAmount.length < 8) return 38;
        if (inputAmount.length < 12) return 28;
        if (inputAmount.length < 16) return 24;
        return 20;
    }, [inputAmount]);

    const appendNumber = (n: string) => {
        setInputInputAmount(v => {
            if (v === '0' && n === '0') {
                return v;
            }
            const newBalanceString = `${v}${n}`;
            //prevent multiple decimal points, always use . when adding to a number even if decimal separator is comma
            if (newBalanceString.split('.').length > 2) {
                return v;
            }
            const newBalance = balanceAfter(newBalanceString);
            if (!balanceAfter(v).isGreaterThanOrEqualTo(0) && !newBalance.isGreaterThanOrEqualTo(0)) {
                void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                return v;
            }
            const decimals = new BigNumber(newBalanceString).decimalPlaces();
            if ((newBalance.isZero() && newBalanceString.length > 10) || (decimals && decimals > 10)) {
                void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                return v;
            }
            return newBalanceString;
        });
    };
    const onBackspace = () => {
        setInputInputAmount(amt => amt.substring(0, amt.length - 1));
    };

    const formattedInputAmount = useMemo(() => {
        if (!inputAmount) return '';
        const split = inputAmount.split('.');
        if (inputAmount.endsWith('.')) {
            return new BigNumber(split[0]).toFormat({groupSeparator: groupSeparator, groupSize: 3}) + decimalSeparator;
        }
        if (split.length === 1) {
            return new BigNumber(split[0]).toFormat({groupSeparator: groupSeparator, groupSize: 3}).toString();
        }

        return (
            new BigNumber(split[0]).toFormat({
                groupSeparator: groupSeparator,
                decimalSeparator: decimalSeparator,
                groupSize: 3,
            }) +
            decimalSeparator +
            (split.length > 1 ? split[1] : '')
        );
    }, [inputAmount]);

    const keyboardActions = useMemo(() => {
        let allActions = [];
        for (let i = 1; i <= 9; i++) {
            allActions.push({
                label: `${i}`,
                action: () => {
                    appendNumber(`${i}`);
                },
            });
        }
        allActions.push({
            label: decimalSeparator,
            action: () => {
                appendNumber('.');
            },
        });
        allActions.push({
            label: '0',
            action: () => {
                appendNumber('0');
            },
        });
        allActions.push({
            label: '<',
            action: () => onBackspace(),
        });
        return allActions;
    }, [inputCurrencyIsNative, inputAmount, nativeCurrency, displayCurrency]);

    return (
        <View style={styles.flex}>
            <View style={styles.topContainer}>
                <SendToWrap address={address} />
                <View style={styles.amountSection}>
                    <TouchableOpacity style={styles.swapIconContainer} onPress={onSwapCurrencies}>
                        <Ionicons name="swap-vertical-sharp" style={styles.swapIcon} />
                    </TouchableOpacity>
                    <View style={styles.amountContainer}>
                        <View style={styles.amountInputContainer}>
                            <Text
                                style={[
                                    styles.amountInputText,
                                    {fontSize: textInputSize},
                                    !inputAmount && {color: theme.colors.textTertiary},
                                ]}>
                                {formattedInputAmount ? formattedInputAmount : '0'}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    amountInputRef.current?.focus();
                                }}>
                                <Text style={[styles.amountInputCurrency, {fontSize: textInputSize}]} weight="600">
                                    {inputCurrency}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.estimateText}>
                            {formatValue(estimateAmount)} {estimateCurrency}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.maxContainer} onPress={onMaxBalance}>
                        <Text style={styles.maxText} weight="600">
                            {t('wallet.send.amount.max')}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.hor}>
                    <SimpleLineIcons name="wallet" style={styles.tinyIcon} />
                    <Text style={styles.tinyText}>{t('wallet.send.amount.your_balance')}</Text>
                    <Text style={styles.tinyValue}>
                        {formatValue(rawValueToNative(accountBalance?.balance), 0, 4)} {nativeCurrency}
                    </Text>
                </View>
                <Separator space={spacing.l} />
                <View style={styles.hor}>
                    <MaterialCommunityIcons name="wallet-plus-outline" style={styles.tinyIcon} />
                    <Text style={styles.tinyText}>{t('wallet.send.amount.balance_after')}</Text>
                    <Text style={[styles.tinyValue, isBalanceInsufficient && {color: theme.colors.warning}]}>
                        {formatValue(convertRawAmountToNativeCurrency(balanceAfter(inputAmount)), 0, 4)}{' '}
                        {nativeCurrency}
                    </Text>
                </View>
                {isBalanceInsufficient && <Text style={styles.insufficientBalance}>{t('wallet.send.amount.insufficient_balance')}</Text>}
                <Separator space={spacing.xl} />
            </View>
            <Button
                title={t('wallet.send.amount.button')}
                onPress={handleNext}
                disabled={!canProceed}
                containerStyle={styles.previewButton}
            />

            <View style={styles.keyboardContainer}>
                {keyboardActions.map(a => {
                    return (
                        <TouchableOpacity key={a.label} onPress={a.action} style={styles.keyboardButton}>
                            <Text style={styles.keyboardNumber} weight={'600'}>
                                {a.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <SendNanoModal ref={sendNanoModal} rawAmount={rawAmount} toName={toName} toAddress={address} />
        </View>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        flex: {
            flex: 1,
        },
        scrollView: {
            marginHorizontal: spacing.th,
        },
        topContainer: {
            marginHorizontal: spacing.th,
            marginTop: spacing.th,
            flex: 1,
        },

        previewButton: {
            marginHorizontal: spacing.th,
        },
        amountSection: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: spacing.l,
            marginHorizontal: -spacing.th,
            paddingHorizontal: spacing.th,
            paddingVertical: 25,
        },
        swapIconContainer: {
            backgroundColor: theme.colors.actionButton,
            borderRadius: rounded.full,
            borderWidth: 0.5,
            borderColor: theme.colors.border,
            padding: spacing.s,
        },
        swapIcon: {
            color: theme.colors.textPrimary,
            fontSize: 16,
        },
        amountContainer: {
            alignItems: 'center',
            flex: 1,
        },
        amountText: {
            fontSize: 36,
        },
        nativeCurrency: {
            fontSize: 16,
        },
        estimateText: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        maxContainer: {
            backgroundColor: theme.colors.actionButton,
            borderRadius: rounded.full,
            borderWidth: 0.5,
            borderColor: theme.colors.border,
        },
        maxText: {
            color: theme.colors.textPrimary,
            padding: spacing.s,
            fontSize: 10,
        },
        hor: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        tinyIcon: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginRight: spacing.s,
        },
        tinyText: {
            flex: 1,
            color: theme.colors.textSecondary,
        },
        tinyValue: {
            color: theme.colors.textPrimary,
        },
        amountInputContainer: {
            flexDirection: 'row',
            alignItems: 'flex-end',
        },
        amountInputText: {
            ...theme.textVariants.header,
            marginRight: spacing.s,
        },
        amountInputCurrency: {
            color: theme.colors.textPrimary,
            fontSize: 16,
        },
        insufficientBalance: {
            color: theme.colors.warning,
            marginLeft: spacing.s + 14,
        },
        keyboardContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            maxWidth: 600,
            maxHeight: 400,
            alignSelf: 'center',
            flex: 1,
        },
        keyboardButton: {
            width: '30%',
            height: '25%',
            alignItems: 'center',
            justifyContent: 'center',
        },
        keyboardNumber: {
            fontSize: 25,
            color: theme.colors.textPrimary,
        },
    });

export default SendAmount;
