import React, {useEffect, useMemo, useRef} from 'react';
import {AppTheme} from '@utils/styles/theme';
import {Dimensions, StyleSheet, View} from 'react-native';
import Text from '@components/Text/Text';
import {RootStackScreenProps} from '@navigation/types';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {ScrollView} from 'react-native-gesture-handler';

const ImportLedger: React.FC<RootStackScreenProps<'ImportLedger'>> = ({navigation}) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const checkStatus = (e: any) => {
        console.log(e);
    };

    return (
        <ScrollView>
            <Text>Coming Soon.</Text>
        </ScrollView>
    );
};

const dynamicStyles = (theme: AppTheme) => StyleSheet.create({});

export default ImportLedger;
