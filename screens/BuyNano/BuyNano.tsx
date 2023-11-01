import React from 'react';
import {AppTheme} from '@utils/styles/theme';
import {StyleSheet, View} from 'react-native';
import Text from '@components/Text/Text';
import {CommonStackScreenProps} from '@navigation/types';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {spacing} from '@utils/styles';

const BuyNano: React.FC<CommonStackScreenProps<'BuyNano'>> = ({navigation}) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    return (
        <View style={styles.container}>
            <Text variant="subheader">On ramp coming soon</Text>
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
