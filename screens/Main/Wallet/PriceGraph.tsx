import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {AppTheme, spacing} from '@utils/styles';
import {LineChart} from 'react-native-wagmi-charts';
import React, {useMemo} from 'react';
import {useAppTheme} from '@hooks/useAppTheme';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {usePriceHistory} from '@hooks/usePriceHistory';
import Text from '@components/Text/Text';
import {useSimplePrice} from '@hooks/useSimplePrice';
import {useDisplayValue} from '@hooks/useDisplayCurrency';
import {formatPrice} from '@utils/helper/numberFormatter';
import {useMMKVBoolean} from 'react-native-mmkv';
import {encryptedStorage} from '@storage/mmkv';
import {StorageKeys} from '@constants/storage';
import {Feather} from '@expo/vector-icons';
import {useTranslation} from 'react-i18next';

const width = Dimensions.get('window').width;
const PriceGraph = () => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);
    const {lineData} = usePriceHistory(true);
    const {change: priceChange} = useSimplePrice(false);
    const {displayCurrency, displayPrice} = useDisplayValue('0');

    const {t} = useTranslation()

    const [hide, setHide] = useMMKVBoolean(StorageKeys.hidePriceGraph);

    const lineGraphColor = useMemo(
        () => (priceChange > 0 ? theme.colors.priceUp : theme.colors.priceDown),
        [theme, priceChange],
    );

    const toggleHide = () => {
        setHide(h => !h);
    };

    if (lineData.length === 0) {
        return null;
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={toggleHide}
                style={styles.currPriceContainer}
                hitSlop={{top: -5, left: -5, right: -5, bottom: -5}}>
                {!hide ? <Feather name="eye" style={styles.eye} /> : <Feather name="eye-off" style={styles.eye} />}
                <Text style={styles.currPriceTitle}>{t("wallet.price_graph.current_nano_price")}</Text>
                <Text style={styles.currPrice} weight="800">
                    {t('wallet.price_graph.price',{price:formatPrice(displayPrice),currency:displayCurrency})}
                </Text>
            </TouchableOpacity>
            {!hide && (
                <LineChart.Provider data={lineData}>
                    <LineChart height={140} width={width}>
                        <LineChart.Path color={lineGraphColor}>
                            <LineChart.Dot color={lineGraphColor} at={lineData.length - 1} hasPulse />
                            <LineChart.Gradient />
                            <LineChart.CursorCrosshair color="hotpink">
                                <LineChart.HoverTrap />
                            </LineChart.CursorCrosshair>
                        </LineChart.Path>
                    </LineChart>
                </LineChart.Provider>
            )}
        </View>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            marginHorizontal: -spacing.th,
        },
        currPriceContainer: {
            alignItems: 'flex-end',
            marginHorizontal: spacing.th,
        },
        currPriceTitle: {
            fontSize: 10,
            color: theme.colors.textTertiary,
        },
        currPrice: {
            fontSize: 11,
            color: theme.colors.textSecondary,
            textDecorationLine: 'underline',
        },
        eyeIcon: {
            alignSelf: 'flex-end',
            paddingHorizontal: spacing.th,
        },
        eye: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
    });

export default React.memo(PriceGraph);
