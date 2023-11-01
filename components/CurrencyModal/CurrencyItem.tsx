import React, {useCallback, useEffect, useRef} from 'react';
import {useAppTheme} from '@hooks/useAppTheme';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {AppTheme, rounded, spacing} from '@utils/styles';
import {Currency} from '@constants/currencies';
import Text from '@components/Text/Text';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useDisplayCurrency} from '@hooks/useDisplayCurrency';

interface Props extends Currency {
    isSelected: boolean;
    onPress: () => void;
}
const CurrencyItem = ({name, symbol, code, onPress, isSelected}: Props) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    return (
        <TouchableOpacity style={[styles.container, isSelected && styles.containerSelected]} onPress={onPress}>
            <Text style={styles.flex}>
                {name} - {symbol}
            </Text>
            <Text>{code}</Text>
        </TouchableOpacity>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            // backgroundColor: theme.colors.cardBackground,
            padding: spacing.l,
            marginHorizontal: spacing.th,
            borderRadius: rounded.l,
        },
        containerSelected: {
            borderWidth: 1,
            borderColor: theme.colors.primary,
        },
        flex: {
            flex: 1,
        },
    });

export default React.memo(CurrencyItem, (p, n) => p.code === n.code && p.isSelected === n.isSelected);
