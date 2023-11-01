import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, TextInput, Share} from 'react-native';
import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, TouchableOpacity} from '@gorhom/bottom-sheet';
import {useBottomSheetBackHandler} from '@hooks/hooksbottomsheet/useBottomSheetBackHandler';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {AppTheme, palette, rounded, spacing} from '@utils/styles';
import Text from '@components/Text/Text';
import QRCode from 'react-native-qrcode-svg';
import {Feather, FontAwesome5} from '@expo/vector-icons';
import Tag from '@components/Tag/Tag';
import CopyTag from '@components/Tag/CopyTag';
import {formNanoUri, NanoUriQuery} from '@utils/helper/uri';
import * as Clipboard from 'expo-clipboard';
import {ToastController} from '@components/Toast/Toast';
import {useDefaultKeyPair} from '@hooks/useKeyPair';
import {beautifulLabel, shortenAddress} from '@utils/helper/address';
import {useDefaultWallet} from '@hooks/useWallet';
import Separator from '@components/Separator/Separator';
import ReceiveAmountSection, {RequestProps} from '@components/ReceiveModal/ReceiveAmountSection';

interface Props {}

const initialRequestItems = {rawAmount: '', displayAmount: '', displayCurrency: ''};
const ReceiveModal = (props: Props, ref: any) => {
    const {defaultKeyPair} = useDefaultKeyPair();
    const defaultWallet = useDefaultWallet();

    if (!defaultKeyPair || !defaultWallet) return null;

    const {address} = defaultKeyPair;
    const {handleSheetPositionChange} = useBottomSheetBackHandler(ref);

    const [showAmount, setShowAmount] = useState(false);
    const [requestItems, setRequestItems] = useState<RequestProps>({...initialRequestItems});

    useEffect(() => {
        if (showAmount) {
            ref.current.snapToIndex(1);
        }
    }, [showAmount]);

    const onSheetChange = (index: number) => {
        if (index == -1) {
            setShowAmount(false);
            setRequestItems({...initialRequestItems});
        }
        handleSheetPositionChange(index);
    };

    const snapPoints = useMemo(() => [430, '60%', '85%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} opacity={0.7} disappearsOnIndex={-1} appearsOnIndex={0} />,
        [],
    );

    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const qrCodeContent = useMemo(() => {
        if (!address) return '';
        let query: NanoUriQuery = {};
        if (requestItems.rawAmount && requestItems.rawAmount.length > 0) {
            query.amount = requestItems.rawAmount;
        }
        if (Object.keys(query).length === 0) {
            return address;
        }
        return formNanoUri({kind: 'nano', address, query});
    }, [address, requestItems.rawAmount]);

    const onShare = async () => {
        await Share.share({title: 'Nano', url: qrCodeContent});
    };
    const onPressAddress = async () => {
        await Clipboard.setStringAsync(address);
        ToastController.show({content: 'Copied to clipboard', kind: 'success'});
    };

    return (
        <BottomSheetModal
            enablePanDownToClose
            backgroundStyle={styles.container}
            handleIndicatorStyle={styles.indicator}
            ref={ref}
            android_keyboardInputMode={'adjustResize'}
            onChange={onSheetChange}
            backdropComponent={renderBackdrop}
            snapPoints={snapPoints}>
            <BottomSheetScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollView}
                keyboardDismissMode="interactive">
                {showAmount ? (
                    <ReceiveAmountSection
                        onCancel={() => {
                            setShowAmount(false);
                        }}
                        onChangeAmount={props => {
                            setRequestItems(props || {...initialRequestItems});
                            setShowAmount(false);
                        }}
                        initialAmount={requestItems}
                    />
                ) : (
                    <>
                        <Text style={styles.label} weight={'600'}>
                            {beautifulLabel(defaultWallet.label, defaultKeyPair.label)}
                        </Text>
                        {requestItems.displayAmount && (
                            <View style={styles.requestAmountWrap}>
                                <Text style={styles.requestAmountTitle} weight={'600'}>
                                    Request Amount: {requestItems.displayAmount} {requestItems.displayCurrency}
                                </Text>
                                <TouchableOpacity
                                    style={styles.requestCancelWrap}
                                    hitSlop={{top: -5, left: -5, right: -5, bottom: -5}}
                                    onPress={() => {
                                        setRequestItems({...initialRequestItems});
                                    }}>
                                    <Feather name="x" style={styles.requestCancelIcon} />
                                </TouchableOpacity>
                            </View>
                        )}
                        <Separator space={spacing.l} />
                        <Text style={styles.scanInfo}>Scan QR code to receive nano</Text>
                        <Separator space={spacing.s} />
                        <View style={styles.section}>
                            <View style={styles.qrContainer}>
                                {qrCodeContent && (
                                    <QRCode
                                        value={qrCodeContent}
                                        size={180}
                                        color={'white'}
                                        backgroundColor="transparent"
                                    />
                                )}
                            </View>

                            <View style={styles.actionButtons}>
                                <CopyTag content={qrCodeContent} />
                                <Tag
                                    title={'Share'}
                                    icon={<Feather name="share" style={[styles.actionIcon, {color: palette.sky500}]} />}
                                    onPress={onShare}
                                />
                                {!showAmount && (
                                    <Tag
                                        title={'Enter Amount'}
                                        icon={
                                            <FontAwesome5
                                                name="money-bill-wave"
                                                style={[styles.actionIcon, {color: palette.violet400}]}
                                            />
                                        }
                                        onPress={() => {
                                            setShowAmount(true);
                                        }}
                                    />
                                )}
                            </View>
                        </View>
                        <Separator space={spacing.m} />
                        <TouchableOpacity onPress={onPressAddress}>
                            <Text style={styles.address}>{shortenAddress(address, 12)}</Text>
                        </TouchableOpacity>
                    </>
                )}
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.modalBackground,
        },
        scrollView: {
            marginHorizontal: spacing.th,
        },
        indicator: {
            backgroundColor: theme.colors.modalIndicator,
        },
        accountContainer: {
            alignSelf: 'center',
        },
        flex: {
            flex: 1,
        },
        section: {
            flexDirection: 'row',
            // alignItems: 'center',
        },
        scanInfo: {
            color: theme.colors.textSecondary,
            marginBottom: spacing.m,
            textAlign: 'center',
        },
        qrContainer: {
            backgroundColor: !theme.isDark ? palette.dark900 : 'transparent',
            borderRadius: rounded.l,
            marginRight: spacing.l,
            padding: spacing.m,
        },
        accountDetailsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: spacing.xl,
            marginBottom: spacing.m,
        },
        accountThumbnail: {
            width: 0,
            height: 0,
            borderRadius: rounded.full,
            marginRight: spacing.m,
        },
        label: {
            color: theme.colors.secondary,
            paddingVertical: spacing.m,
            textAlign: 'center',
        },
        address: {
            color: theme.colors.textSecondary,
            paddingVertical: spacing.m,
            textAlign: 'center',
        },
        info: {
            fontSize: 10,
            marginTop: spacing.l,
            color: theme.colors.textSecondary,
            textAlign: 'center',
        },
        actionButtons: {
            // flexDirection: 'row',
            flex: 1,
            gap: spacing.m,
            justifyContent: 'flex-end',
        },
        actionButton: {
            ...theme.cardVariants.simple,
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.cardBackground,
            marginRight: spacing.m,
            paddingVertical: spacing.m,
            paddingHorizontal: spacing.l,
            borderRadius: rounded.xl,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        actionIcon: {
            fontSize: 14,
            marginRight: spacing.m,
            color: theme.colors.textSecondary,
        },
        actionText: {
            fontSize: 14,
        },
        amountInputContainer: {
            marginBottom: spacing.xl,
            alignItems: 'center',
        },
        hor: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        amountInput: {
            ...theme.textVariants.body,
            fontSize: 28,
            textAlign: 'center',
            marginRight: spacing.s,
        },
        currencyContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
        },
        currency: {
            fontSize: 16,
            color: theme.colors.textSecondary,
        },
        chevron: {
            fontSize: 16,
            color: theme.colors.textSecondary,
        },
        estimate: {
            color: theme.colors.textSecondary,
            marginTop: spacing.xs,
            fontSize: 12,
        },
        swapIconContainer: {
            borderRadius: rounded.full,
            marginVertical: spacing.s,
            position: 'absolute',
            right: 0,
            top: spacing.m,
        },
        swapIcon: {
            padding: spacing.s,
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        requestAmountWrap: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        requestAmountTitle: {
            textAlign: 'center',
        },
        requestCancelWrap: {
            backgroundColor: theme.colors.cardBackgroundLight,
            borderRadius: rounded.full,
            alignItems: 'center',
            justifyContent: 'center',
            width: 24,
            height: 24,
            marginLeft: spacing.m,
        },
        requestCancelIcon: {
            color: theme.colors.textSecondary,
            fontSize: 18,
        },
    });

export default React.forwardRef(ReceiveModal);
