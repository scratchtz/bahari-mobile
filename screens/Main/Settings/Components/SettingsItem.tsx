import {AppTheme, palette, rounded, spacing} from '@utils/styles';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useThemeStyleSheet} from '@hooks/useThemeStyleSheet';
import {Fontisto} from '@expo/vector-icons';
import Text from '@components/Text/Text';
import React from 'react';

interface Props {
    onPress: () => void;
    title: string;
    leftItem: React.ReactElement;
    rightItem?: React.ReactElement;
}
const SettingsItem = ({title, leftItem, rightItem, onPress}: Props) => {
    const styles = useThemeStyleSheet(sharedStyles);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            {leftItem}
            <Text style={styles.keyText}>{title}</Text>
            {rightItem}
        </TouchableOpacity>
    );
};

export const sharedStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: rounded.l,
            padding: spacing.m,
            paddingHorizontal: spacing.l,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: theme.colors.border,
        },
        keyText: {
            flex: 1,
            color: theme.colors.textSecondary,
        },
        valueText: {
            color: theme.colors.textPrimary,
        },
        settingIconBack: {
            width: 32,
            height: 32,
            borderRadius: rounded.m,
            backgroundColor: theme.colors.primary,
            marginRight: spacing.s,
            alignItems: 'center',
            justifyContent: 'center',
        },
        settingIcon: {
            fontSize: 18,
            color: 'white',
        },
    });

export default React.memo(SettingsItem);
