import React, {useMemo, useState} from 'react';
import {
    NativeSyntheticEvent,
    StyleProp,
    StyleSheet,
    TextInput as NativeTextInput,
    TextInputFocusEventData,
    TextInputProps,
    View,
    ViewProps,
    ViewStyle,
} from 'react-native';
import {useAppTheme} from '@hooks/useAppTheme';
import {AppTheme, rounded, spacing} from '@utils/styles';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';

interface Props extends TextInputProps {
    containerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<ViewStyle>;

    rightItem?: JSX.Element | null;
}

const TextInput = (props: Props, ref: any) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);
    const [isFocused, setIsFocused] = useState(false);

    const onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        if (props.onFocus) {
            props.onFocus(e);
        }
        setIsFocused(true);
    };
    const onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        if (props.onBlur) {
            props.onBlur(e);
        }
        setIsFocused(false);
    };

    return (
        <View style={[styles.container, isFocused ? styles.focusedContainer : {}, props.containerStyle]}>
            <NativeTextInput
                ref={ref}
                {...props}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholderTextColor={theme.colors.textTertiary}
                style={[styles.text, props.textStyle]}
            />
            {props.rightItem}
        </View>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.cardBackground,
            borderRadius: rounded.l,
            borderWidth: 0.5,
            borderColor: theme.colors.border,
        },
        focusedContainer: {
            borderWidth: 1,
            borderColor: theme.colors.primary,
        },
        text: {
            ...theme.textVariants.body,
            color: theme.colors.textPrimary,
            padding: spacing.l,
            flex: 1,
        },
    });
export default React.forwardRef(TextInput);
