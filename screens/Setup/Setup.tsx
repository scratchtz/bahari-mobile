import React, {useRef} from 'react';
import {spacing} from '@utils/styles';

import {AppTheme} from '@utils/styles/theme';
import {StyleSheet, TouchableOpacity, View, SafeAreaView} from 'react-native';
import Text from '@components/Text/Text';
import {RootStackScreenProps} from '@navigation/types';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import Separator from '@components/Separator/Separator';
import Button from '@components/Button/Button';
import {FontAwesome} from '@expo/vector-icons';
import ChangeLanguageModal from '@components/ChangeLanguageModal/ChangeLanguageModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {Image} from 'expo-image';
import SupportedLanguages, {SupportedLanguage} from '@constants/languages';
import {useMMKVString} from 'react-native-mmkv';
import {StorageKeys} from '@constants/storage';
import {encryptedStorage} from '@storage/mmkv';

const Setup: React.FC<RootStackScreenProps<'Setup'>> = ({navigation}) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);
    const [savedLanguage] = useMMKVString(StorageKeys.language, encryptedStorage);
    const language = (savedLanguage || 'en') as SupportedLanguage;

    const changeLanguageModal = useRef<BottomSheetModal>(null);
    const onChangeLanguage = () => {
        changeLanguageModal.current?.present();
    };

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={styles.container}>
                <Image source={require('@assets/logoclear.png')} style={styles.logo} />
                <Text variant="header" style={styles.head}>
                    Bahari
                </Text>
                <Text variant="small" color="secondary" style={styles.motto}>
                    Send and receive Nano at light speed{'\n'}Zero Fees
                </Text>

                <Separator space={spacing.xl} />
                <Button
                    title="Create New Wallet"
                    variant="primary"
                    containerStyle={styles.button}
                    onPress={() => {
                        navigation.navigate('WalletNew', {walletMode: 'onboard'});
                    }}
                />
                <Button
                    containerStyle={styles.button}
                    title="Import Wallet"
                    variant="secondary"
                    onPress={() => {
                        navigation.navigate('WalletImport');
                    }}
                />
                <TouchableOpacity style={styles.languagePicker} onPress={onChangeLanguage}>
                    <FontAwesome name="language" style={styles.languageIcon} />
                    <Text variant="small">{SupportedLanguages[language]}</Text>
                </TouchableOpacity>
            </View>
            <ChangeLanguageModal ref={changeLanguageModal} />
        </SafeAreaView>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        safeAreaView: {
            flex: 1,
        },
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: spacing.xl,
        },
        logo: {
            width: 80,
            height: 80,
            marginBottom: spacing.l,
        },
        head: {
            fontSize: 48,
            textAlign: 'center',
        },
        motto: {
            fontSize: 12,
            textAlign: 'center',
        },
        button: {
            width: 300,
            marginTop: spacing.l,
        },
        languagePicker: {
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'center',
            top: spacing.m,
            right: 0,
        },
        languageIcon: {
            fontSize: 24,
            color: theme.colors.textSecondary,
            marginRight: 10,
        },
    });

export default Setup;
