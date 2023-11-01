import React, {useMemo} from 'react';
import {Text as NativeText, TextProps} from 'react-native';
import {FontColors, FontWeight} from '@utils/styles';
import {TextVariant} from '@utils/types/text';
import {useAppTheme} from '@hooks/useAppTheme';

interface Props extends TextProps {
    variant?: TextVariant;
    weight?: FontWeight;
    color?: FontColors;
}

const Text: React.FC<Props> = props => {
    const {variant = 'body', color = 'primary', weight, style} = props;

    const theme = useAppTheme();
    const textColor = useMemo(() => {
        switch (color) {
            case 'secondary':
                return theme.colors.textSecondary;
            case 'tertiary':
                return theme.colors.textTertiary;
            default:
                return theme.colors.textPrimary;
        }
    }, [color, theme]);
    const defaultStyle = theme.textVariants[variant] || {};
    return (
        <NativeText
            {...props}
            style={[defaultStyle, color && {color: textColor}, style, weight && {fontFamily: `OpenSans-${weight}`}]}
        />
    );
};

export default Text;
