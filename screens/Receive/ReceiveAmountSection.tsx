import React, {useMemo, useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {TouchableOpacity} from '@gorhom/bottom-sheet';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {AppTheme, rounded, spacing} from '@utils/styles';
import Text from '@components/Text/Text';
import {AntDesign, MaterialIcons} from '@expo/vector-icons';
import BigNumber from 'bignumber.js';
import {useDisplayCurrency, useDisplayValue} from '@hooks/useDisplayCurrency';
import {formatValue} from '@utils/helper/numberFormatter';
import {useNativeCurrency} from '@hooks/useNativeCurrency';
import {convertNativeCurrencies} from '@utils/helper/nativeCurrency';
import Separator from '@components/Separator/Separator';
import Button from '@components/Button/Button';
import Pressable from '@components/Touchable/Touchable';
import {useTranslation} from 'react-i18next';

export interface RequestProps {
    rawAmount: string;
    displayAmount: string;
    displayCurrency: string;
}
interface Props {
    initialAmount: RequestProps;
    onChangeAmount: (props: RequestProps | null) => void;
    onCancel: () => void;
}

const ReceiveAmountSection = (props: Props) => {
    const {nativeCurrency} = useNativeCurrency();
    const {displayCurrency} = useDisplayCurrency();
    const {displayPrice} = useDisplayValue(0);

    const [inputCurrencyIsNative, setInputCurrencyIsNative] = useState(true);
    const [requestAmount, setRequestAmount] = useState(props.initialAmount.displayAmount);

    const {t} = useTranslation();

    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const estimateAmount = useMemo(() => {
        if (displayPrice.isZero()) {
            return new BigNumber(0);
        }
        if (inputCurrencyIsNative) {
            const valueInNano = convertNativeCurrencies(requestAmount, nativeCurrency, 'XNO');
            return new BigNumber(valueInNano || 0).times(displayPrice);
        }
        const amountInNano = new BigNumber(requestAmount || 0).div(displayPrice).toFixed(8, 1);
        return new BigNumber(convertNativeCurrencies(amountInNano, 'XNO', nativeCurrency));
    }, [inputCurrencyIsNative, nativeCurrency, requestAmount]);

    const onSwapCurrencies = () => {
        const dp = estimateAmount.isGreaterThan(100) ? 0 : estimateAmount.isLessThan(0.01) ? 4 : 2;
        setRequestAmount(estimateAmount.decimalPlaces(dp).toString());
        setInputCurrencyIsNative(t => !t);
    };

    const rawAmount = useMemo(() => {
        if (inputCurrencyIsNative) {
            return convertNativeCurrencies(requestAmount, nativeCurrency, 'RAW');
        }
        return convertNativeCurrencies(estimateAmount, nativeCurrency, 'RAW');
    }, [inputCurrencyIsNative, estimateAmount, requestAmount]);

    const {inputCurrency, estimateCurrency} = useMemo(() => {
        if (inputCurrencyIsNative) return {inputCurrency: nativeCurrency, estimateCurrency: displayCurrency};
        return {inputCurrency: displayCurrency, estimateCurrency: nativeCurrency};
    }, [inputCurrencyIsNative, nativeCurrency, displayCurrency]);

    const appendNumber = (t: number | string) => {
        setRequestAmount(curr => `${curr}${t}`);
    };
    const onBackspace = () => {
        setRequestAmount(p => p.substring(0, p.length - 1));
    };

    const onRequest = () => {
        const n = new BigNumber(requestAmount);
        if (n.isNaN() || n.isZero()) {
            props.onChangeAmount(null);
            return;
        }
        props.onChangeAmount({
            rawAmount,
            displayAmount: requestAmount,
            displayCurrency: inputCurrency,
        });
    };

    const keyboardActions = useMemo(() => {
        let actions: {render: () => React.ReactElement}[] = [];
        for (let i = 1; i <= 9; i++) {
            actions.push({
                render: () => (
                    <TouchableOpacity
                        key={i}
                        style={styles.keyWrap}
                        onPress={() => {
                            appendNumber(i);
                        }}>
                        <Text style={styles.keyText} weight={'500'}>
                            {i}
                        </Text>
                    </TouchableOpacity>
                ),
            });
        }
        actions.push({
            render: () => (
                <TouchableOpacity
                    key={'clear'}
                    style={styles.keyWrap}
                    onPress={() => {
                        appendNumber('.');
                    }}>
                    <Text style={styles.keyText} weight={'500'}>
                        .
                    </Text>
                </TouchableOpacity>
            ),
        });

        actions.push({
            render: () => (
                <TouchableOpacity
                    key={'0'}
                    style={styles.keyWrap}
                    onPress={() => {
                        appendNumber(0);
                    }}>
                    <Text style={styles.keyText} weight={'500'}>
                        {'0'}
                    </Text>
                </TouchableOpacity>
            ),
        });
        actions.push({
            render: () => (
                <TouchableOpacity key={'backspace'} style={styles.keyWrap} onPress={onBackspace}>
                    <AntDesign name="arrowleft" style={styles.keyText} />
                </TouchableOpacity>
            ),
        });

        return actions;
    }, [requestAmount, theme, styles]);

    return (
        <View style={styles.container}>
            <View style={{justifyContent: 'center'}}>
                {requestAmount ? (
                    <View>
                        <Text style={styles.requestAmountInput} weight={'800'}>
                            {t('wallet.receive.request.amount',{amount:requestAmount,currency:inputCurrency})}
                        </Text>
                        <TouchableOpacity onPress={onSwapCurrencies}>
                            <Text style={styles.estimateAmount} weight={'600'}>
                                {t('wallet.receive.request.estimate_amount',{amount:formatValue(estimateAmount),currency:estimateCurrency})}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.placeholderWrap}>
                        <Text style={styles.requestAmountInputHolder} weight={'300'}>
                            {t('wallet.receive.request.how_much',{currency:inputCurrency})}
                        </Text>
                    </View>
                )}
                <Pressable style={styles.swapIconWrap} onPress={onSwapCurrencies}>
                    <MaterialIcons name="swap-vert" style={styles.swapIcon} />
                </Pressable>
            </View>
            <Separator space={spacing.l} />
            <View style={styles.keyboardContainer}>
                {keyboardActions.map((action, i) => {
                    return action.render();
                })}
            </View>
            <View style={styles.buttonsWrap}>
                <Button
                    title={t('wallet.receive.request.cancel')}
                    variant={'secondary'}
                    onPress={props.onCancel}
                    containerStyle={styles.actionButton}
                />
                <Button title={t('wallet.receive.request.confirm')} onPress={onRequest} containerStyle={styles.actionButton} />
            </View>
        </View>
    );
};

const KEYBOARD_HEIGHT = Dimensions.get('screen').height / 3 - 50;
const KEYBOARD_WIDTH = 300;
const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            // flex: 1,
        },
        keyboardContainer: {
            flexDirection: 'row',
            height: KEYBOARD_HEIGHT,
            width: KEYBOARD_WIDTH,
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            maxWidth: 600,
            maxHeight: 350,
            alignSelf: 'center',
        },
        keyWrap: {
            justifyContent: 'center',
            alignItems: 'center',
            width: KEYBOARD_WIDTH / 3,
            height: KEYBOARD_HEIGHT / 4,
        },
        keyText: {
            color: theme.colors.textPrimary,
            fontSize: 25,
        },
        placeholderWrap: {
            flexDirection: 'row',
            alignSelf: 'center',
            alignItems: 'center',
        },
        requestAmountInput: {
            fontSize: 28,
            textAlign: 'center',
        },
        requestAmountInputHolder: {
            textAlign: 'center',
            fontSize: 28,
            color: theme.colors.textSecondary,
        },
        estimateAmount: {
            color: theme.colors.textSecondary,
            textAlign: 'center',
        },
        swapIconWrap: {
            borderColor: theme.colors.border,
            borderRadius: rounded.full,
            position: 'absolute',
            padding: spacing.s,
            borderWidth: 1,
            right: 0,
        },
        swapIcon: {
            color: theme.colors.textSecondary,
            fontSize: 24,
        },
        buttonsWrap: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacing.m,
            gap: spacing.m,
        },
        actionButton: {
            flex: 1,
        },
    });

export default ReceiveAmountSection;
