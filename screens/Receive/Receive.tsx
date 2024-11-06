import React, {useMemo, useState} from 'react';
import {View, StyleSheet, Share} from 'react-native';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {AppTheme, palette, rounded, spacing} from '@utils/styles';
import Text from '@components/Text/Text';
import {Feather, FontAwesome5} from '@expo/vector-icons';
import Tag from '@components/Tag/Tag';
import CopyTag from '@components/Tag/CopyTag';
import {formNanoUri, NanoUriQuery} from '@utils/helper/uri';
import * as Clipboard from 'expo-clipboard';
import {ToastController} from '@components/Toast/Toast';
import {useDefaultKeyPair} from '@hooks/useKeyPair';
import {useDefaultWallet} from '@hooks/useWallet';
import Separator from '@components/Separator/Separator';
import ReceiveAmountSection, {RequestProps} from '@screens/Receive/ReceiveAmountSection';
import Pressable from '@components/Touchable/Touchable';
import QRCode from 'react-native-qrcode-svg';
import {CommonStackScreenProps} from '@navigation/types';
import CurrentAccount from '@components/CurrentAccount/CurrentAccount';
import {formatValue} from '@utils/helper/numberFormatter';
import {useTranslation} from 'react-i18next';

const initialRequestItems = {rawAmount: '', displayAmount: '', displayCurrency: ''};
const Receive = ({}: CommonStackScreenProps<'Receive'>) => {
    const {defaultKeyPair} = useDefaultKeyPair();
    const defaultWallet = useDefaultWallet();

    const {t} = useTranslation();

    if (!defaultKeyPair || !defaultWallet) return null;

    const {address} = defaultKeyPair;

    const [showAmount, setShowAmount] = useState(false);
    const [requestItems, setRequestItems] = useState<RequestProps>({...initialRequestItems});

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
        ToastController.show({content: `${t('wallet.receive.copied')}`, kind: 'success'});
    };

    return (
        <View style={styles.container}>
            <CurrentAccount />
            <View style={{flex: 1}} />

            {showAmount && (
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
            )}

            {!showAmount && (
                <>
                    <View style={styles.qrContainer}>
                        {qrCodeContent && (
                            <QRCode
                                value={qrCodeContent}
                                size={180}
                                color={theme.colors.textPrimary}
                                backgroundColor="transparent"
                            />
                        )}
                    </View>

                    {requestItems.displayAmount && (
                        <View style={styles.requestAmountWrap}>
                            <Text style={styles.requestAmountTitle} weight={'600'}>
                                Request:
                            </Text>
                            <Text weight={'600'}>
                                {formatValue(requestItems.displayAmount)} {requestItems.displayCurrency}
                            </Text>
                            <Pressable
                                style={styles.requestCancelWrap}
                                hitSlop={{top: -5, left: -5, right: -5, bottom: -5}}
                                onPress={() => {
                                    setRequestItems({...initialRequestItems});
                                }}>
                                <Feather name="x" style={styles.requestCancelIcon} />
                            </Pressable>
                        </View>
                    )}

                    <Separator space={spacing.m} />
                    <Text style={styles.addressTitle}>{t('wallet.receive.your_address')}</Text>
                    <Pressable onPress={onPressAddress}>
                        <Text style={styles.address} weight={'800'}>
                            {address}
                        </Text>
                    </Pressable>

                    <View style={styles.actionButtons}>
                        <CopyTag content={qrCodeContent} containerStyle={styles.actionButton} />
                        <Tag
                            title={t('wallet.receive.share')}
                            containerStyle={styles.actionButton}
                            icon={<Feather name="share" style={[styles.actionIcon, {color: palette.sky500}]} />}
                            onPress={onShare}
                        />
                        {!showAmount && (
                            <Tag
                                title={t('wallet.receive.request.label')}
                                containerStyle={styles.actionButton}
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
                    <Separator space={spacing.m} />
                </>
            )}
            <View style={{flex: 1}} />
        </View>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            marginHorizontal: spacing.th,
            paddingTop: spacing.l,
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
        },
        scrollView: {
            alignItems: 'center',
        },
        flex: {
            flex: 1,
        },
        scanInfo: {
            color: theme.colors.textSecondary,
            marginBottom: spacing.m,
        },
        qrContainer: {
            alignItems: 'center',
            padding: spacing.m,
        },
        addressTitle: {
            color: theme.colors.textSecondary,
        },
        address: {
            textAlign: 'center',
            padding: spacing.xs,
            fontSize: 12,
            paddingHorizontal: spacing.xl,
        },
        info: {
            fontSize: 10,
            marginTop: spacing.l,
            color: theme.colors.textSecondary,
            textAlign: 'center',
        },
        actionButtons: {
            marginTop: spacing.xl,
            flexDirection: 'row',
            gap: spacing.s,
            justifyContent: 'center',
        },
        actionButton: {
            ...theme.cardVariants.simple,
            flex: 1,
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
            backgroundColor: theme.colors.cardBackground,
            borderRadius: rounded.full,
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacing.l,
            padding: spacing.s,
            paddingLeft: spacing.m,
        },
        requestAmountTitle: {
            marginRight: spacing.m,
        },
        requestCancelWrap: {
            backgroundColor: theme.colors.cardBackgroundLight,
            borderRadius: rounded.full,
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            marginLeft: spacing.l,
        },
        requestCancelIcon: {
            color: theme.colors.textPrimary,
            fontSize: 14,
        },
    });

export default Receive;
