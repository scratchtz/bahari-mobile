import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {useBottomSheetBackHandler} from '@hooks/hooksbottomsheet/useBottomSheetBackHandler';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {AppTheme, rounded, spacing} from '@utils/styles';
import Text from '@components/Text/Text';
import Separator from '@components/Separator/Separator';
import {beautifulLabel, shortenAddress} from '@utils/helper/address';
import Button from '@components/Button/Button';
import SendGlobe from '@components/SendGlobe/SendGlobe';
import {useDefaultWallet} from '@hooks/useWallet';
import {useDefaultKeyPair} from '@hooks/useKeyPair';
import BigNumber from 'bignumber.js';
import {Feather, Ionicons} from '@expo/vector-icons';
import {useDebounce} from '@hooks/useDebounce';
import {sendNano} from '@components/SendNanoModal/sendNano';
import {useNativeCurrency} from '@hooks/useNativeCurrency';
import {convertNativeCurrencies} from '@utils/helper/nativeCurrency';
import AddressThumbnail from '@components/AddressThumbnail/AddressThumbnail';
import Success from '@components/Animation/Success';
import {navigate, navigateDispatch} from '@navigation/shared';
import {CommonActions} from '@react-navigation/native';
import {useTransactionHistory} from '@hooks/useTransactionHistory';
import useRecentAddresses from '@hooks/useRecentAddresses';
import {useAccountBalance} from '@hooks/useAccountBalance';
import ButtonTiny from '@components/Button/ButtonTiny';
import * as RNLocalize from 'react-native-localize';
import {useMMKVBoolean} from 'react-native-mmkv';
import {StorageKeys} from '@constants/storage';
import {encryptedStorage} from '@storage/mmkv';
import * as LocalAuthentication from 'expo-local-authentication';
import {ToastController} from '@components/Toast/Toast';
import {ModalHeader} from '@components/ModalHeader/ModalHeader';

interface Props {
    toName?: string;
    toAddress: string;
    rawAmount: string;
}

type ScreenState = 'preview' | 'sending' | 'success';
const LOCK_TIMEOUT = 0;
const SendNanoModal = ({toName, toAddress, rawAmount}: Props, ref: any) => {
    const defaultWallet = useDefaultWallet();
    const {defaultKeyPair} = useDefaultKeyPair();
    const {nativeCurrency} = useNativeCurrency();
    const {debounce} = useDebounce();

    const {decimalSeparator} = RNLocalize.getNumberFormatSettings();
    const [requireBiometricsOnSend] = useMMKVBoolean(StorageKeys.biometricsOnSend, encryptedStorage);

    if (!defaultWallet || !defaultKeyPair) return null;

    const [screenState, setScreenState] = useState<ScreenState>('preview');
    const {handleSheetPositionChange} = useBottomSheetBackHandler(ref);

    const snapPoints = useMemo(() => [480, 550], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} opacity={0.6} disappearsOnIndex={-1} appearsOnIndex={0} />,
        [],
    );
    const {refetch: refetchTransactionHistory} = useTransactionHistory(false, defaultKeyPair?.address || '', 5);
    const {appendRecentAddress} = useRecentAddresses();
    const {refetch: refetchBalance} = useAccountBalance(defaultKeyPair?.address || '', false);

    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const onClose = () => {
        ref.current.close();
    };

    const onSend = async () => {
        if (requireBiometricsOnSend) {
            const res = await LocalAuthentication.authenticateAsync({requireConfirmation: true});
            if (!res.success) {
                return;
            }
        }

        setScreenState('sending');
        try {
            await sendNano(defaultKeyPair.address, toAddress, rawAmount);
            setScreenState('success');
            setTimeout(() => {
                void refetchTransactionHistory({cancelRefetch: true});
                void refetchBalance({cancelRefetch: true});
            }, 2000);
        } catch (e) {
            setScreenState('preview');
            ToastController.show({kind: 'error', title: 'Error', content: 'There was an error!'});
        }
    };

    const onDone = () => {
        appendRecentAddress(toAddress);
        navigate('Wallet');
        ref.current.close();
    };

    const onAddContact = () => {
        ref.current.close();
        // @ts-ignore
        navigateDispatch(state => {
            const routes = [...state.routes.slice(0, 1)];
            return CommonActions.reset({
                ...state,
                routes: [...routes, {name: 'ContactNew', params: {address: toAddress}}],
                index: 1,
            });
        });
    };

    const formattedAmount = useMemo(() => {
        return new BigNumber(convertNativeCurrencies(rawAmount, 'RAW', nativeCurrency)).toFormat({
            decimalSeparator,
            groupSeparator: '', //no group separator here, important to have the full number shown to user
        });
    }, [rawAmount, decimalSeparator]);

    return (
        <BottomSheetModal
            enablePanDownToClose
            backgroundStyle={styles.container}
            handleIndicatorStyle={styles.indicator}
            ref={ref}
            android_keyboardInputMode={'adjustResize'}
            onChange={handleSheetPositionChange}
            backdropComponent={renderBackdrop}
            snapPoints={snapPoints}>
            <ModalHeader title={'Send Confirm'} onClose={onClose} />
            <View style={{flex: 1}}>
                {screenState === 'preview' && (
                    <>
                        <View style={styles.innerContainer}>
                            <View style={styles.sectionItem}>
                                <Text style={styles.horKey}>Amount</Text>
                                <Text style={styles.amount} weight="500">
                                    {formattedAmount} {nativeCurrency}
                                </Text>
                            </View>
                            <View style={styles.sectionItem}>
                                <Text style={styles.horKey}>From</Text>
                                <View style={styles.hor}>
                                    <AddressThumbnail
                                        address={defaultKeyPair.address}
                                        size={36}
                                        containerStyle={styles.thumbnail}
                                    />
                                    <View>
                                        <Text style={styles.fromWallet}>
                                            {beautifulLabel(defaultWallet.label, defaultKeyPair.label)}
                                        </Text>
                                        <Text style={styles.fromAddress}>{shortenAddress(defaultKeyPair.address)}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.sectionItem}>
                                <Text style={styles.horKey}>To</Text>
                                <View style={styles.hor}>
                                    <AddressThumbnail address={toAddress} size={36} containerStyle={styles.thumbnail} />
                                    <View>
                                        {toName && <Text style={styles.toWallet}>{toName}</Text>}
                                        <Text style={styles.toAddress}>{shortenAddress(toAddress)}</Text>
                                    </View>
                                </View>
                            </View>
                            <Separator space={spacing.l} />
                            <Button
                                title={`Send`}
                                onPress={() => {
                                    debounce(onSend);
                                }}
                            />
                        </View>
                    </>
                )}
                {screenState === 'sending' && (
                    <>
                        <View style={styles.sendingContainer}>
                            <Text weight="600" style={styles.sendingText}>
                                Sending
                            </Text>
                            <Text style={styles.dontCloseInfo}>Please wait....</Text>
                            <SendGlobe size={180} color={theme.colors.secondary} />
                        </View>
                    </>
                )}
                {screenState === 'success' && (
                    <>
                        <View style={styles.sendingContainer}>
                            <Success size={120} />
                            <Text style={styles.amount} weight="500">
                                {formattedAmount} {nativeCurrency}
                            </Text>
                            <Separator space={spacing.m} />
                            <Text weight="500">Sent to</Text>

                            <Separator space={spacing.s} />
                            <View style={styles.hor}>
                                <AddressThumbnail address={toAddress} size={36} containerStyle={styles.thumbnail} />
                                <View>
                                    {toName && (
                                        <Text style={styles.toWallet} weight="500">
                                            {toName}
                                        </Text>
                                    )}
                                    <Text style={styles.toAddress}>{shortenAddress(toAddress, 10)}</Text>
                                </View>
                            </View>
                            {!toName && (
                                <ButtonTiny
                                    icon={<Feather name="plus-circle" style={styles.addContactIcon} />}
                                    title={'Add New Contact'}
                                    onPress={onAddContact}
                                    containerStyle={styles.addContactButton}
                                />
                            )}
                        </View>
                        <Button title={'Done'} onPress={onDone} containerStyle={styles.doneButton} />
                    </>
                )}
            </View>
        </BottomSheetModal>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.modalBackground,
        },
        indicator: {
            backgroundColor: theme.colors.modalIndicator,
        },
        innerContainer: {
            paddingHorizontal: spacing.th,
        },
        title: {
            fontSize: 18,
            marginLeft: spacing.s,
            flex: 1,
        },
        closeIcon: {
            fontSize: 24,
            color: theme.colors.textPrimary,
            marginRight: spacing.s,
        },
        sectionItem: {
            backgroundColor: theme.colors.cardBackground,
            paddingHorizontal: spacing.th,
            paddingVertical: spacing.l,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: rounded.xl,
            marginTop: spacing.m,
        },
        horKey: {
            flex: 1,
            color: theme.colors.textSecondary,
        },
        hor: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        fromWallet: {
            color: theme.colors.secondary,
        },
        toWallet: {
            color: theme.colors.textSecondary,
        },
        fromAddress: {
            fontSize: 14,
        },
        toAddress: {},
        separator: {
            height: 1,
        },
        thumbnail: {
            marginRight: spacing.m,
        },
        amountHead: {
            color: theme.colors.textSecondary,
            marginRight: spacing.m,
            textAlign: 'center',
        },
        amount: {
            fontSize: 20,
            textAlign: 'center',
        },
        sendingContainer: {
            alignItems: 'center',
            padding: spacing.l,
        },
        sendAnimation: {
            height: 220,
        },
        sendingText: {
            marginTop: spacing.l,
            fontSize: 16,
            color: theme.colors.textPrimary,
        },
        dontCloseInfo: {
            color: theme.colors.textSecondary,
        },
        doneButton: {
            marginHorizontal: spacing.th,
            marginTop: spacing.l,
        },
        addContactIcon: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        addContactButton: {
            marginTop: spacing.s,
        },
    });

export default React.forwardRef(SendNanoModal);
