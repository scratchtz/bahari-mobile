import React, {useEffect, useMemo, useRef, useState} from 'react';
import {rounded, size, spacing} from '@utils/styles';

import {AppTheme} from '@utils/styles/theme';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import Text from '@components/Text/Text';
import {Image} from 'expo-image';
import {beautifulLabel, shortenAddress} from '@utils/helper/address';
import {getContact} from '@hooks/useContacts';
import {getKeyPair, getWallet} from '@storage/wallet';
import AddressThumbnail from '@components/AddressThumbnail/AddressThumbnail';

interface Props {
    address: string;
    onPress: () => void;
}
const RecentAddressItem = ({address, onPress}: Props) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const user = useMemo(() => {
        const myKeyPair = getKeyPair(address);
        if (myKeyPair) {
            const w = getWallet(myKeyPair.walletID);
            return {thumbnail: myKeyPair.thumbnail, label: beautifulLabel(w?.label || '', myKeyPair.label)};
        }
        const contact = getContact(address);
        if (contact) {
            return {thumbnail: contact.thumbnail, label: contact.name};
        }
        return {thumbnail: '', label: ''};
    }, [address]);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <AddressThumbnail address={address} size={50} containerStyle={styles.thumbnail} />
            <View style={styles.midContainer}>
                {user.label && (
                    <Text style={styles.name} weight={'500'}>
                        {user.label}
                    </Text>
                )}
                <Text style={styles.address}>{shortenAddress(address, 10)}</Text>
            </View>
        </TouchableOpacity>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: spacing.s,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        thumbnail: {
            marginRight: spacing.l,
        },
        midContainer: {
            flex: 1,
        },
        name: {},
        address: {
            color: theme.colors.textSecondary,
        },
    });

export default React.memo(RecentAddressItem, (p, n) => p.address === n.address);
