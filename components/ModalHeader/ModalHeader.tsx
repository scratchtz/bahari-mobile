import React from 'react';
import {AppTheme, rounded, spacing} from '@utils/styles';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useAppTheme} from '@hooks/useAppTheme';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import Text from '@components/Text/Text';
import {Ionicons} from '@expo/vector-icons';

interface Props {
    title: string;
    onClose: () => void;
}
export const ModalHeader = ({title, onClose}: Props) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    return (
        <View style={styles.container}>
            <Text weight={'700'} style={styles.title}>
                {title}
            </Text>
            <TouchableOpacity
                onPress={onClose}
                style={styles.closeWrap}
                hitSlop={{top: -5, bottom: -5, left: -5, right: -5}}>
                <Ionicons name="ios-close" style={styles.closeIcon} />
            </TouchableOpacity>
        </View>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: spacing.m,
            marginHorizontal: spacing.th,
        },
        title: {
            fontSize: 16,
        },
        closeWrap: {
            backgroundColor: theme.colors.cardBackgroundLight,
            borderRadius: rounded.full,
            justifyContent: 'center',
            alignItems: 'center',
            height: 26,
            width: 26,
        },
        closeIcon: {
            color: theme.colors.textSecondary,
            fontSize: 18,
        },
    });
