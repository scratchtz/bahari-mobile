import React from 'react';
import {AppTheme} from '@utils/styles/theme';
import {StyleProp, StyleSheet, TextStyle, TouchableOpacity, ViewStyle} from 'react-native';
import Text from '@components/Text/Text';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {isTablet} from 'react-native-device-info';
import {rounded, spacing} from '@utils/styles';

interface Props {
    icon: JSX.Element | null;
    title: string;
    containerStyle?: StyleProp<ViewStyle>;

    titleStyle?: StyleProp<TextStyle>;
    onPress: () => void;
}

const ButtonTiny: React.FC<Props> = ({title, icon, containerStyle, titleStyle, onPress}) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, containerStyle]}>
            {icon}
            <Text weight="500" style={[styles.title, titleStyle]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.actionButton,
            paddingVertical: spacing.s,
            paddingHorizontal: spacing.m,
            borderRadius: rounded.full,
            borderWidth: 0.5,
            borderColor: theme.colors.border,
        },
        title: {
            fontSize: 12,
            color: theme.colors.textPrimary,
            marginLeft: spacing.s,
        },
    });

export default ButtonTiny;
