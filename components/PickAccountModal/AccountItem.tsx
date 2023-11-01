import React, {memo, useEffect, useMemo, useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {AppTheme, rounded, spacing} from '@utils/styles';
import Text from '@components/Text/Text';
import {shortenAddress} from '@utils/helper/address';
import {TouchableOpacity} from '@gorhom/bottom-sheet';
import {Entypo} from '@expo/vector-icons';
import {PickerMode} from '@components/PickAccountModal/types';
import {useGetKeyPair} from '@hooks/useKeyPair';
import AddressThumbnail from '@components/AddressThumbnail/AddressThumbnail';
import {useLatestAddressBalance} from '@components/PickAccountModal/useAllWalletsBalance';
import {useNativeCurrency} from '@hooks/useNativeCurrency';
import {formatValue} from '@utils/helper/numberFormatter';
import {convertRawAmountToNativeCurrency} from '@utils/helper/nativeCurrency';

interface Props {
    address: string;
    isSelected?: boolean;
    onPress?: () => void;

    onMenu?: () => void;

    mode?: PickerMode;
}
const AccountItem = ({address, onPress, isSelected, onMenu, mode}: Props) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);
    const keyPair = useGetKeyPair(address);
    const [rawBalance] = useLatestAddressBalance(address);
    const {nativeCurrency} = useNativeCurrency();

    const nativeBalance = useMemo(() => {
        return formatValue(convertRawAmountToNativeCurrency(rawBalance));
    }, [rawBalance, nativeCurrency]);

    if (!keyPair) return null;
    return (
        <TouchableOpacity style={[styles.container, isSelected && styles.containerSelected]} onPress={onPress}>
            <AddressThumbnail address={keyPair.address} size={40} />
            <View style={styles.midContainer}>
                <Text style={[styles.label]} weight="500">
                    {keyPair.label}
                </Text>
                <Text style={styles.address}>{shortenAddress(address, 8)}</Text>
            </View>
            <Text variant="small" color="tertiary">
                {nativeBalance} {nativeCurrency}
            </Text>
            {mode === 'change' && (
                <TouchableOpacity onPress={onMenu}>
                    <Entypo name="dots-three-vertical" style={styles.menuIcon} />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            padding: spacing.m,
            borderRadius: rounded.xl,
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacing.s,
        },
        containerSelected: {
            borderWidth: 1,
            borderColor: theme.colors.primary,
            backgroundColor: theme.colors.primary + '10',
        },
        midContainer: {
            flex: 1,
            marginHorizontal: spacing.m,
        },
        label: {},
        address: {
            color: theme.colors.textSecondary,
        },
        balance: {
            fontSize: 12,
        },
        derivation: {
            position: 'absolute',
            top: spacing.s,
            right: spacing.s,
            fontSize: 8,
            color: theme.colors.textTertiary,
        },
        textSelected: {
            color: 'white',
        },
        menuIcon: {
            padding: spacing.s,
            fontSize: 18,
            color: theme.colors.textSecondary,
        },
    });

export default React.memo(AccountItem, (p, n) => p.address == n.address && p.isSelected === n.isSelected);
