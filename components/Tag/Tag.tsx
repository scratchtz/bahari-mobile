import React, {useCallback, useMemo} from 'react';
import {spacing, rounded, palette} from '@utils/styles';

import {AppTheme} from '@utils/styles/theme';
import {StyleProp, StyleSheet, TouchableOpacity, TextStyle, ViewStyle} from 'react-native';
import Text from '@components/Text/Text';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';

interface Props {
    title: string;
    onPress?: () => void;
    icon?: any;
    containerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

const Tag: React.FC<Props> = ({title, icon, onPress, containerStyle, textStyle}) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    return (
        <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress}>
            {icon}
            <Text variant="small" style={textStyle}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            ...theme.tag,
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: spacing.m,
            borderColor: theme.colors.borderLight,
            paddingVertical: spacing.m,
            paddingHorizontal: spacing.l,
            borderRadius: rounded.xl,
            borderWidth: 1,
        },
    });

export default Tag;
