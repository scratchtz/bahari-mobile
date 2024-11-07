import {useAppTheme} from '@hooks/useAppTheme';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {Pressable, StyleSheet, View} from 'react-native';
import Text from '@components/Text/Text';
import React, {useCallback, useMemo, useRef} from 'react';
import {AppTheme, rounded, spacing} from '@utils/styles';
import {History} from '@utils/rpc/types';
import {shortenAddress} from '@utils/helper/address';
import fromUnixTime from 'date-fns/fromUnixTime';
import {format} from 'date-fns';
import TxDetailedModal from '@components/TxDetailedModal/TxDetailedModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {formatValue} from '@utils/helper/numberFormatter';
import {useNativeCurrency} from '@hooks/useNativeCurrency';
import {convertRawAmountToNativeCurrency} from '@utils/helper/nativeCurrency';
import AddressThumbnail from '@components/AddressThumbnail/AddressThumbnail';
import Touchable from '@components/Touchable/Touchable';
import Loading from '@components/Animation/Loading';
import {ToastController} from '@components/Toast/Toast';
import {hitSlop} from '@constants/variables';
import {useTranslation} from 'react-i18next';

type Props = {
    showFullDate?: boolean;
} & History;
const TransactionItem = (item: Props) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const {t} = useTranslation();

    const {nativeCurrency} = useNativeCurrency();
    const txDetailedModal = useRef<BottomSheetModal>();

    const onPress = () => {
        txDetailedModal.current?.present();
    };

    const message = useMemo(() => (item.type === 'send' ? `${t('wallet.transaction_item.message_sent')}` : `${t('wallet.transaction_item.message_received')}`), [item.type]);
    const time = useMemo(() => {
        const txTime = fromUnixTime(parseInt(item.local_timestamp));
        if (item.showFullDate) {
            return format(txTime, 'yyyy-MM-dd HH:mm');
        }
        return format(txTime, 'HH:mm');
    }, [item.local_timestamp]);

    const displayAmount = useMemo(
        () => formatValue(convertRawAmountToNativeCurrency(item.amount)),
        [nativeCurrency, item.amount],
    );
    const actionColor = item.type === 'send' ? theme.colors.textPrimary : theme.colors.priceUp;

    const showToastNotConfirmed = useCallback(() => {
        const elapsedMinutesAfterTx = (Date.now() - parseInt(item.local_timestamp) * 1000) / 1000 / 60;
        if (elapsedMinutesAfterTx > 1) {
            ToastController.show({
                kind: 'info',
                content: `${t('wallet.transaction_item.not_confirmed')}`,
                timeout: 5000,
            });
            return;
        }
        ToastController.show({kind: 'info', content: `${t('wallet.transaction_item.not_confirmed_info')}`});
    }, []);

    return (
        <>
            <Touchable onPress={onPress}>
                <View style={styles.container}>
                    <AddressThumbnail size={50} address={item.account} containerStyle={styles.thumbnail} />
                    <View style={styles.midContainer}>
                        <Text style={styles.action} weight="700">
                            {message}
                        </Text>
                        <Text style={styles.address}>{shortenAddress(item.account)}</Text>
                    </View>
                    <View style={styles.rightContainer}>
                        <Text weight="600" style={[styles.amount, {color: actionColor}]}>
                            {item.type === 'send' ? '-' : '+'}
                            {t('wallet.transaction_item.amount',{amount:displayAmount,currency:nativeCurrency})}
                        </Text>
                        <Text style={styles.time}>{time}</Text>
                    </View>
                    {item.confirmed === 'false' && (
                        <Pressable style={styles.notConfirmedWrap} onPress={showToastNotConfirmed} hitSlop={hitSlop}>
                            <Loading color={theme.colors.textTertiary} size={20} />
                        </Pressable>
                    )}
                </View>
            </Touchable>
            <TxDetailedModal ref={txDetailedModal} {...item} />
        </>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            ...theme.cardVariants.simple,
            padding: spacing.m,
            borderRadius: rounded.l,
            flexDirection: 'row',
            alignItems: 'center',
        },
        hor: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        icon: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
        action: {
            color: theme.colors.textPrimary,
        },
        time: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
        midContainer: {
            flex: 1,
        },
        thumbnail: {
            marginRight: spacing.m,
        },
        address: {
            color: theme.colors.textSecondary,
        },
        rightContainer: {
            alignItems: 'flex-end',
        },
        amount: {
            fontSize: 16,
        },
        notConfirmedWrap: {
            position: 'absolute',
            left: spacing.xs,
            top: spacing.xs,
        },
    });

export default React.memo(TransactionItem);
