import React, {useEffect} from 'react';
import AddressThumbnail from '@components/AddressThumbnail/AddressThumbnail';
import Text from '@components/Text/Text';
import Loading from '@components/Animation/Loading';
import Success from '@components/Animation/Success';
import {View, StyleSheet} from 'react-native';
import {useAppTheme} from '@hooks/useAppTheme';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {AppTheme, rounded, spacing} from '@utils/styles';
import {KeyPair} from '@utils/types';
import {FontAwesome} from '@expo/vector-icons';

export type CardStatus = 'pending' | 'success' | 'error';

let statusListener = new Map<string, (status: CardStatus) => void>();

export const publishRepChangeStatus = (address: string, status: CardStatus) => {
    const listener = statusListener.get(address);
    if (listener) {
        listener(status);
    }
};
export const ChangeAccountCard = React.memo(({label, address}: KeyPair) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const [status, setStatus] = React.useState<CardStatus>('pending');

    useEffect(() => {
        statusListener.set(address, setStatus);
        return () => {
            statusListener.delete(address);
        };
    }, []);

    return (
        <View style={styles.container}>
            <AddressThumbnail address={address} size={32} containerStyle={styles.thumbnail} />
            <Text style={styles.label}>{label}</Text>
            {status === 'pending' && <Loading color={theme.colors.textSecondary} size={24} />}
            {status === 'success' && <Success size={30} />}
            {status === 'error' && <FontAwesome name="warning" size={20} color={theme.colors.warning} />}
        </View>
    );
});

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            ...theme.cardVariants.simple,
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: spacing.m,
            paddingHorizontal: spacing.l,
            borderRadius: rounded.l,
        },
        thumbnail: {
            marginRight: spacing.s,
        },
        label: {
            marginRight: spacing.s,
        },
    });
