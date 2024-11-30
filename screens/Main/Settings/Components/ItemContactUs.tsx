import SettingsItem, {sharedStyles} from './SettingsItem';
import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import {Linking, View} from 'react-native';
import {useThemeStyleSheet} from '@hooks/useThemeStyleSheet';
import {palette} from '@utils/styles';
import {useTranslation} from 'react-i18next';

const ContactUs = () => {
    const styles = useThemeStyleSheet(sharedStyles);
    const {t} = useTranslation();

    const onContact = async () => {
        const url = 'https://x.com/barakacrypto';
        try {
            await Linking.openURL(url);
        } catch (error) {
            console.error('An Error Occurred', error);
        }
    };
    return (
        <>
            <SettingsItem
                onPress={onContact}
                leftItem={
                    <View style={[styles.settingIconBack, {backgroundColor: palette.sky400}]}>
                        <AntDesign name="contacts" style={[styles.settingIcon]} />
                    </View>
                }
                title={t('others.contact_us')}
            />
        </>
    );
};

export default React.memo(ContactUs);
