import React from 'react';
import {spacing} from '@utils/styles';

import {AppTheme} from '@utils/styles/theme';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import Text from '@components/Text/Text';
import {Contact} from '@utils/types';
import {shortenAddress} from '@utils/helper/address';
import AddressThumbnail from '@components/AddressThumbnail/AddressThumbnail';

interface Props extends Contact {
    onPress: () => void;
}
const ContactCell = ({name, address, onPress}: Props) => {
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

export default React.memo(ContactCell);
