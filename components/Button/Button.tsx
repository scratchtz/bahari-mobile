import React, {useMemo} from 'react';
import {AppTheme} from '@utils/styles/theme';
import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import Text from '@components/Text/Text';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {isTablet} from 'react-native-device-info';

type Variant = 'primary' | 'secondary';

interface Props {
    variant?: Variant;
    title: string;
    onPress: () => void;
    containerStyle?: StyleProp<ViewStyle>;
    disabled?: boolean;
    leftChild?: JSX.Element | null;
    rightChild?: JSX.Element;
}

const Button: React.FC<Props> = ({
    title,
    variant = 'primary',
    onPress,
    containerStyle,
    disabled = false,
    leftChild,
    rightChild,
}) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const variantStyle = useMemo(
        () =>
            disabled ? (theme.buttonVariants['disabled'] as ViewStyle) : (theme.buttonVariants[variant] as ViewStyle),
        [variant, theme, disabled],
    );
    const textVariantStyle = useMemo(() => (disabled ? theme.buttonTextVariants['disabled'] : {}), [disabled]);
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.container, isTablet() && styles.containerTablet, variantStyle, containerStyle]}>
            {leftChild}
            <Text weight="600" style={[theme.buttonTextVariants[variant], textVariantStyle]}>
                {title}
            </Text>
            {rightChild}
        </TouchableOpacity>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        containerTablet: {
            width: 300,
            alignSelf: 'center',
        },
    });

export default Button;
