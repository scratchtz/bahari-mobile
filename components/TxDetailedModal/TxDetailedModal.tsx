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
import fromUnixTime from 'date-fns/fromUnixTime';
import {format} from 'date-fns';
import {Ionicons} from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import {ToastController} from '@components/Toast/Toast';
import Separator from '@components/Separator/Separator';
import {useNativeCurrency} from '@hooks/useNativeCurrency';
import {convertRawAmountToNativeCurrency} from '@utils/helper/nativeCurrency';
import AddressThumbnail from '@components/AddressThumbnail/AddressThumbnail';
import {getAddressDetails} from '@hooks/useContacts';
import {navigateDispatch} from '@navigation/shared';
import {CommonActions} from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import {modalOpacity} from '@constants/variables';
import {useTranslation} from 'react-i18next';

const TxDetailedModal = ({type, account, confirmed, amount, hash, local_timestamp}: History, ref: any) => {
    const {handleSheetPositionChange} = useBottomSheetBackHandler(ref);

    const {nativeCurrency} = useNativeCurrency();

    const {t} = useTranslation();

    const snapPoints = useMemo(() => [410, 600, '90%'], []);
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} opacity={modalOpacity} disappearsOnIndex={-1} appearsOnIndex={0} />
        ),
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
        ToastController.show({kind: 'info', content: `${t('wallet.transaction_item.modal.info_copied')}`});
    };

    const addressName = useMemo(() => {
        const data = getAddressDetails(account);
        return data?.name || '';
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

    const openOnBrowser = async () => {
        ref.current.close();
        void WebBrowser.openBrowserAsync(`https://nanolooker.com/block/${hash}`);
    };

    const amountColor = type === 'receive' ? theme.colors.priceUp : theme.colors.textPrimary;
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
                    <Ionicons name="close" style={styles.closeIcon} />
                </TouchableOpacity>
                <BottomSheetScrollView contentContainerStyle={styles.scrollView}>
                    <Separator space={spacing.m} />
                    <View style={styles.hor}>
                        <Text style={styles.hash}>Tx:</Text>
                        <TouchableOpacity
                            onPress={() => {
                                void onCopy(hash);
                            }}>
                            <Text style={styles.txHash}>{shortenAddress(hash, 6)}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.key}>{t(`wallet.transaction_item.modal.title.${type}`)}</Text>
                        <Text style={[styles.amount, {color: amountColor}]}>
                            {type === 'receive' ? '+' : type === 'send' ? '-' : ''}
                            {t('wallet.transaction_item.modal.amount',{amount:formatValue(nativeValue),currency:nativeCurrency})}
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.key}>
                            {type === 'receive' ? `${t('wallet.transaction_item.modal.type_from')}` : type === 'send' ? `${t('wallet.transaction_item.modal.type_to')}` : `${t('wallet.transaction_item.modal.type_account')}`}
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
                                        <Text style={styles.addContact}>{t('wallet.transaction_item.modal.add_contact')}</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.key}>{t('wallet.transaction_item.modal.date')}</Text>
                        <Text style={[styles.amount, {color: amountColor}]}>
                            <Text style={styles.date}>{time}</Text>
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.key}>{t('wallet.transaction_item.modal.status_label')}</Text>
                        <Text style={[styles.amount, {color: amountColor}]}>
                            <Text style={styles.date}>{confirmed === 'true' ? `${t('wallet.transaction_item.modal.status_confirmed')}` : `${t('wallet.transaction_item.modal.status_pending')}`}</Text>
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.openExplorerButton} onPress={openOnBrowser}>
                        <Text style={styles.openExplorerText}>{t('wallet.transaction_item.modal.block_explorer')}</Text>
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
            marginTop: spacing.s,
        },
        hor: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        key: {
            color: theme.colors.textSecondary,
        },
        amount: {
            fontSize: 18,
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
        txHash: {
            textDecorationLine: 'underline',
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
