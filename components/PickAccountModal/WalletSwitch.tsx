import React, {useMemo, useState} from 'react';
import {useAppTheme} from '@hooks/useAppTheme';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useGetWallet, useWalletKVs} from '@hooks/useWallet';
import {StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import {Entypo, Feather, MaterialCommunityIcons} from '@expo/vector-icons';
import Text from '@components/Text/Text';
import {AppTheme, rounded, spacing} from '@utils/styles';
import AddressThumbnail from '@components/AddressThumbnail/AddressThumbnail';
import Separator from '@components/Separator/Separator';
import {useWalletTotalBalance} from '@components/PickAccountModal/useAllWalletsBalance';
import {useNativeCurrency} from '@hooks/useNativeCurrency';
import {convertRawAmountToNativeCurrency} from '@utils/helper/nativeCurrency';
import {formatValue} from '@utils/helper/numberFormatter';

interface WalletSwitchProps {
    currentWalletID: string;
    onChangeWallet: (walletID: string) => void;
    containerStyle?: StyleProp<ViewStyle>;
}

export const WalletSwitch = React.memo(
    ({containerStyle, currentWalletID, onChangeWallet}: WalletSwitchProps) => {
        const theme = useAppTheme();
        const styles = useThemeStyleSheetProvided(theme, walletSwitchStyles);
        const [showWallets, setShowWallets] = useState(false);

        const currentWallet = useGetWallet(currentWalletID);
        const wallets = useWalletKVs();

        const totalBalance = useWalletTotalBalance(currentWalletID);
        const {nativeCurrency} = useNativeCurrency();
        const totalBalanceInXno = useMemo(() => {
            return convertRawAmountToNativeCurrency(totalBalance);
        }, [totalBalance, nativeCurrency]);

        if (!currentWallet) return null;
        return (
            <View style={[styles.container, containerStyle]}>
                <TouchableOpacity
                    style={styles.innerContainer}
                    onPress={() => {
                        setShowWallets(s => !s);
                    }}>
                    {/*<AddressThumbnail size={24} address={currentWallet.id} containerStyle={styles.thumbnail} />*/}
                    <MaterialCommunityIcons name="piggy-bank" style={styles.bankIcon} />
                    <View style={styles.midContainer}>
                        <Text style={styles.label} weight="600">
                            {currentWallet?.label}
                        </Text>
                        <Text style={styles.accounts}>{currentWallet.keyPairsAddresses.length} accounts</Text>
                    </View>

                    <Text variant="small" color="tertiary">
                        {formatValue(totalBalanceInXno)} {nativeCurrency}
                    </Text>
                    <Entypo name="chevron-right" style={styles.chevron} />
                </TouchableOpacity>
                {showWallets && (
                    <View style={styles.walletsContainer}>
                        {wallets?.map(w => {
                            return (
                                <WalletItem
                                    currentWalletID={currentWalletID}
                                    key={w.id}
                                    walletID={w.id}
                                    onPress={() => {
                                        onChangeWallet(w.id);
                                        setShowWallets(false);
                                    }}
                                />
                            );
                        })}
                    </View>
                )}
            </View>
        );
    },
    (p, n) => p.currentWalletID === n.currentWalletID,
);

const walletSwitchStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999999,
        },
        innerContainer: {
            ...theme.cardVariants.simple,
            alignSelf: 'center',
            marginHorizontal: spacing.th,
            paddingHorizontal: spacing.l,
            paddingVertical: spacing.l,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: rounded.l,
            height: 70,
        },
        walletsContainer: {
            marginTop: spacing.xs,
            ...theme.cardVariants.simple,
            marginHorizontal: spacing.th,
            borderRadius: rounded.l,
        },
        bankIcon: {
            fontSize: 24,
            color: theme.colors.textPrimary,
            marginRight: spacing.m,
        },
        label: {
            color: theme.colors.secondary,
        },
        accounts: {
            fontSize: 13,
        },
        thumbnail: {
            marginRight: spacing.l,
        },
        chevron: {
            marginLeft: spacing.m,
            fontSize: 24,
            color: theme.colors.textPrimary,
        },
        midContainer: {
            flex: 1,
        },
    });

const WalletItem = React.memo(
    ({currentWalletID, walletID, onPress}: {currentWalletID?: string; walletID: string; onPress: () => void}) => {
        const theme = useAppTheme();
        const styles = useThemeStyleSheetProvided(theme, walletItemStyles);
        const wallet = useGetWallet(walletID);
        const rawBalance = useWalletTotalBalance(walletID);
        const {nativeCurrency} = useNativeCurrency();

        const balance = useMemo(() => {
            return formatValue(convertRawAmountToNativeCurrency(rawBalance));
        }, [rawBalance, nativeCurrency]);

        if (!wallet) return null;
        return (
            <TouchableOpacity style={styles.container} onPress={onPress}>
                <Text style={styles.label} weight="500">
                    {wallet.label} <Text style={styles.accounts}>- {wallet.keyPairsAddresses.length}</Text>
                </Text>
                {currentWalletID === walletID && <Feather name="check" style={styles.checkIcon} />}
                <View style={{flex: 1}} />
                <Text variant="small" color="secondary">
                    {balance} {nativeCurrency}
                </Text>
            </TouchableOpacity>
        );
    },
);

const walletItemStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            padding: spacing.l,
            paddingHorizontal: spacing.l,
            flexDirection: 'row',
            alignItems: 'center',
        },
        label: {
            color: theme.colors.textPrimary,
        },
        checkIcon: {
            color: theme.colors.textPrimary,
            fontSize: 18,
            marginLeft: spacing.xs,
        },
        accounts: {
            color: theme.colors.textTertiary,
        },
    });
