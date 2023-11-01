import React, {useEffect, useMemo, useRef, useState} from 'react';
import {rounded, size, spacing} from '@utils/styles';

import {AppTheme} from '@utils/styles/theme';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import Text from '@components/Text/Text';
import {Contact} from '@utils/types';
import {Image} from 'expo-image';
import {shortenAddress} from '@utils/helper/address';
import AddressThumbnail from '@components/AddressThumbnail/AddressThumbnail';

interface Props extends Contact {
    onPress: () => void;
}
const ContactItem = ({name, address, onPress}: Props) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <AddressThumbnail address={address} size={50} containerStyle={styles.thumbnail} />
            <View style={styles.midContainer}>
                <Text style={styles.name} weight={'500'}>
                    {name}
                </Text>
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
            borderTopWidth: 1,
            borderColor: theme.colors.border,
            padding: spacing.s,
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

export default React.memo(
    ContactItem,
    (prevProps, nextProps) => prevProps.name === nextProps.name && prevProps.thumbnail === nextProps.thumbnail,
);
