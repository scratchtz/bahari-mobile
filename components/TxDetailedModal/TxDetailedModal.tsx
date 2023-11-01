import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useBottomSheetBackHandler} from '@hooks/hooksbottomsheet/useBottomSheetBackHandler';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {AppTheme, rounded, spacing} from '@utils/styles';
import Text from '@components/Text/Text';
import {History} from '@utils/rpc/types';
import {shortenAddress} from '@utils/helper/address';
import {formatValue} from '@utils/helper/numberFormatter';
import {tools} from 'nanocurrency-web';
import BigNumber from 'bignumber.js';
import {Image} from 'expo-image';
import fromUnixTime from 'date-fns/fromUnixTime';
import {format} from 'date-fns';
import {Ionicons} from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import {ToastController} from '@components/Toast/Toast';
import Separator from '@components/Separator/Separator';
import {useNativeCurrency} from '@hooks/useNativeCurrency';
import {convertRawAmountToNativeCurrency} from '@utils/helper/nativeCurrency';
import AddressThumbnail from '@components/AddressThumbnail/AddressThumbnail';
import {getAddressDetails, getContact} from '@hooks/useContacts';
import {navigate, navigateDispatch} from '@navigation/shared';
import {CommonActions} from '@react-navigation/native';
interface Props {}

const TITLE = {
    receive: 'Received',
    send: 'Sent',
    change: 'Changed Representative',
};
const TxDetailedModal = ({type, account, amount, hash, local_timestamp, height, confirmed}: History, ref: any) => {
    const {handleSheetPositionChange} = useBottomSheetBackHandler(ref);

    const {nativeCurrency} = useNativeCurrency();
    const snapPoints = useMemo(() => ['45%', '60%', '85%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} opacity={0.5} disappearsOnIndex={-1} appearsOnIndex={0} />,
        [],
    );

    const time = useMemo(() => {
        const txTime = fromUnixTime(parseInt(local_timestamp));
        return format(txTime, 'MMM dd, yyyy HH:mm');
    }, [local_timestamp]);

    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);
    const nativeValue = useMemo(() => convertRawAmountToNativeCurrency(amount), [nativeCurrency, amount]);

    const onCopy = async (value: string) => {
        await Clipboard.setStringAsync(value);
        ToastController.show({kind: 'info', content: 'Copied to clipboard'});
    };

    const addressName = useMemo(() => {
        const data = getAddressDetails(account);
        if (data && data.name) {
            return data.name;
        }
        return '';
    }, [account]);

    const onAddContact = () => {
        ref.current.close();
        // @ts-ignore
        navigateDispatch(state => {
            const routes = [...state.routes.slice(0, 1)];
            return CommonActions.reset({
                ...state,
                routes: [...routes, {name: 'ContactNew', params: {address: account}}],
                index: 1,
            });
        });
    };

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
            <View style={styles.flex}>
                <TouchableOpacity
                    style={styles.closeIconContainer}
                    onPress={() => {
                        ref.current.close();
                    }}>
                    <Ionicons name="ios-close" style={styles.closeIcon} />
                </TouchableOpacity>
                <BottomSheetScrollView contentContainerStyle={styles.scrollView}>
                    <Separator space={spacing.m} />
                    <View style={styles.hor}>
                        <Text style={styles.hash}>Tx:</Text>
                        <TouchableOpacity
                            onPress={() => {
                                void onCopy(hash);
                            }}>
                            <Text style={{color: theme.colors.secondary}}>{shortenAddress(hash, 6)}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.key}>{TITLE[type]}</Text>
                        <Text
                            weight="700"
                            style={[
                                styles.amount,
                                {
                                    color:
                                        type === 'receive'
                                            ? theme.colors.priceUp
                                            : type === 'send'
                                            ? theme.colors.priceDown
                                            : theme.colors.textSecondary,
                                },
                            ]}>
                            {type === 'receive' ? '+' : type === 'send' ? '-' : ''}
                            {formatValue(nativeValue)} {nativeCurrency}
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.key}>
                            {type === 'receive' ? 'From' : type === 'send' ? 'To' : 'Account'}
                        </Text>
                        <View style={styles.hor}>
                            <AddressThumbnail address={account} size={30} containerStyle={styles.thumbnail} />
                            <View>
                                {addressName && <Text style={styles.from}>{addressName}</Text>}
                                <TouchableOpacity
                                    onPress={() => {
                                        void onCopy(account);
                                    }}>
                                    <Text style={styles.address} weight="500">
                                        {shortenAddress(account)}
                                    </Text>
                                </TouchableOpacity>
                                {!addressName && (
                                    <TouchableOpacity onPress={onAddContact}>
                                        <Text style={styles.addContact}>Add Contact</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                    <Text style={styles.date}>{time}</Text>
                    <TouchableOpacity style={styles.openExplorerButton}>
                        <Text style={styles.openExplorerText}>Open on block explorer</Text>
                    </TouchableOpacity>
                </BottomSheetScrollView>
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
        flex: {
            flex: 1,
        },
        closeIconContainer: {
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 999999,
            padding: spacing.th,
        },
        closeIcon: {
            fontSize: 24,
            color: theme.colors.textPrimary,
        },
        scrollView: {
            marginTop: spacing.th,
            marginHorizontal: spacing.th,
        },
        section: {
            ...theme.cardVariants.simple,
            padding: spacing.l,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: rounded.l,
            marginTop: spacing.l,
        },
        hor: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        key: {
            fontSize: 16,
            color: theme.colors.textSecondary,
        },
        amount: {
            fontSize: 24,
        },
        thumbnail: {
            borderRadius: rounded.full,
            marginRight: spacing.l,
        },
        from: {},
        address: {
            color: theme.colors.textSecondary,
        },
        hash: {
            color: theme.colors.textSecondary,
            marginLeft: spacing.s,
        },
        date: {
            marginRight: spacing.s,
            marginTop: spacing.l,
            textAlign: 'right',
        },
        openExplorerButton: {
            alignSelf: 'center',
            padding: spacing.l,
        },
        openExplorerText: {
            color: theme.colors.secondary,
            textDecorationLine: 'underline',
            fontSize: 12,
        },
        addContact: {
            marginTop: spacing.xs,
            color: theme.colors.textSecondary,
            textDecorationLine: 'underline',
            textAlign: 'right',
            fontSize: 12,
        },
    });

export default React.forwardRef(TxDetailedModal);
