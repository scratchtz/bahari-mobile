import React, {useLayoutEffect} from 'react';
import {AppTheme} from '@utils/styles/theme';
import {StyleSheet, View} from 'react-native';
import Text from '@components/Text/Text';
import {CommonStackScreenProps} from '@navigation/types';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {spacing} from '@utils/styles';
import {useTranslation} from 'react-i18next';

const BuyNano: React.FC<CommonStackScreenProps<'BuyNano'>> = ({navigation}) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);
    const {t} = useTranslation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: t('buy_nano.title'),
        });
    }, [t]);

    return (
        <View style={styles.container}>
            <Text variant="subheader">{t('buy_nano.on_ramp')}</Text>
        </View>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            marginHorizontal: spacing.th,
        },
    });

export default BuyNano;
