import {useAppTheme} from '@hooks/useAppTheme';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {StyleSheet, View} from 'react-native';
import Text from '@components/Text/Text';
import React, {useCallback, useMemo, useRef} from 'react';
import {AppTheme, rounded, spacing} from '@utils/styles';
import {History} from '@utils/rpc/types';
import {shortenAddress} from '@utils/helper/address';
import {format} from 'date-fns';
import TxDetailedModal from '@components/TxDetailedModal/TxDetailedModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {formatValue} from '@utils/helper/numberFormatter';
import {getDateFromStringUnixTime} from '@utils/helper/date';
import {useNativeCurrency} from '@hooks/useNativeCurrency';
import AddressThumbnail from '@components/AddressThumbnail/AddressThumbnail';

const HistoryItem = (item: History) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const txDetailedModal = useRef<BottomSheetModal>();
    const {nativeCurrency, rawValueToNative} = useNativeCurrency();

    const message = item.type === 'send' ? 'Sent' : 'Received';
    const localTimestamp = getDateFromStringUnixTime(item.local_timestamp);
    const shortTime = format(localTimestamp, 'HH:mm');
    const actionColor = item.type === 'send' ? theme.colors.textPrimary : theme.colors.priceUp;

    const onPress = useCallback(() => {
        txDetailedModal.current?.present();
    }, []);

    return (
        <>
            <TouchableOpacity style={styles.container} onPress={onPress}>
                <AddressThumbnail address={item.account} size={50} containerStyle={styles.thumbnail} />
                <View style={styles.flex}>
                    <View style={styles.innerContainer}>
                        <Text style={[styles.action, {color: actionColor}]} weight="500">
                            {message}
                        </Text>
                        <Text weight="600" style={[styles.amount, {color: actionColor}]}>
                            {item.type === 'send' ? '-' : '+'}
                            {formatValue(rawValueToNative(item.amount))} {nativeCurrency}
                        </Text>
                    </View>
                    <View style={styles.innerContainer}>
                        <Text style={styles.address}>
                            {item.type == 'send' ? 'To ' : 'From '}
                            {shortenAddress(item.account)}
                        </Text>

                        <Text style={styles.time}>{shortTime}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <TxDetailedModal ref={txDetailedModal} {...item} />
        </>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            ...theme.cardVariants.simple,
            padding: spacing.l,
            borderRadius: rounded.l,
            flexDirection: 'row',
            alignItems: 'center',
        },
        dateSeparatorContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacing.l,
            marginBottom: spacing.m,
        },
        flex: {
            flex: 1,
        },
        dateLineSeparator: {
            flex: 1,
            borderBottomColor: theme.colors.border,
            borderBottomWidth: StyleSheet.hairlineWidth,
        },
        dateSeparatorText: {
            textAlign: 'center',
            marginHorizontal: spacing.m,
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
            fontSize: 14,
            color: theme.colors.secondary,
        },
        time: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
        innerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        thumbnail: {
            width: 50,
            height: 50,
            borderRadius: 100,
            marginRight: spacing.m,
        },
        address: {
            color: theme.colors.textSecondary,
            flex: 1,
        },
        amount: {
            flex: 1,
            textAlign: 'right',
        },
    });

export default React.memo(HistoryItem, () => true);
