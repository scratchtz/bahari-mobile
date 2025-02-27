import {useThemeStyleSheet} from '@hooks/useThemeStyleSheet';
import SettingsItem, {sharedStyles} from '@screens/Main/Settings/Components/SettingsItem';
import {View} from 'react-native';
import {FontAwesome6} from '@expo/vector-icons';
import Text from '@components/Text/Text';
import SupportedLanguages, {SupportedLanguage} from '@constants/languages';
import React, {useCallback, useRef} from 'react';
import {useMMKVString} from 'react-native-mmkv';
import {StorageKeys} from '@constants/storage';
import {encryptedStorage} from '@storage/mmkv';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import ChangeLanguageModal from '@components/ChangeLanguageModal/ChangeLanguageModal';
import {useTranslation} from 'react-i18next';

const ItemLanguage = () => {
    const styles = useThemeStyleSheet(sharedStyles);
    const [savedLanguage] = useMMKVString(StorageKeys.language, encryptedStorage);
    const language = (savedLanguage || 'en') as SupportedLanguage;

    const {t} = useTranslation();

    const languageModal = useRef<BottomSheetModal>();
    const openLanguageModal = useCallback(() => {
        languageModal.current?.present();
    }, []);

    return (
        <>
            <SettingsItem
                onPress={openLanguageModal}
                title={t('settings.language_label')}
                leftItem={
                    <View style={[styles.settingIconBack, {backgroundColor: '#ff9ff3'}]}>
                        <FontAwesome6 name="language" style={[styles.settingIcon]} />
                    </View>
                }
                rightItem={
                    <Text style={styles.valueText} weight={'500'}>
                        {SupportedLanguages[language]}
                    </Text>
                }
            />
            <ChangeLanguageModal ref={languageModal} />
        </>
    );
};

export default React.memo(ItemLanguage);
