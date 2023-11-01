import {useAppTheme} from '@hooks/useAppTheme';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Pressable, StyleSheet, View} from 'react-native';
import Text from '@components/Text/Text';
import React, {useMemo, useRef} from 'react';
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

const TransactionItem = (item: History) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const {nativeCurrency} = useNativeCurrency();
    const txDetailedModal = useRef<BottomSheetModal>();

    const onPress = () => {
        txDetailedModal.current?.present();
    };

    const message = useMemo(() => (item.type === 'send' ? 'Sent' : 'Received'), [item.type]);
    const time = useMemo(() => {
        const txTime = fromUnixTime(parseInt(item.local_timestamp));
        return format(txTime, 'yyyy/MM/dd HH:mm');
    }, [item.local_timestamp]);

    const displayAmount = useMemo(
        () => formatValue(convertRawAmountToNativeCurrency(item.amount)),
        [nativeCurrency, item.amount],
    );
    const actionColor = item.type === 'send' ? theme.colors.textPrimary : theme.colors.priceUp;

    return (
        <>
            <Touchable containerStyle={styles.container} onPress={onPress}>
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
                        {displayAmount} {nativeCurrency}
                    </Text>
                    <Text style={styles.time}>{time}</Text>
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
            // paddingVertical: spacing.xs,
            padding: spacing.m,
            borderRadius: rounded.l,
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacing.m,
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
    });

export default React.memo(TransactionItem);
