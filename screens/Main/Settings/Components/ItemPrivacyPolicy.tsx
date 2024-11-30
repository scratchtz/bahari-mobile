import SettingsItem, {sharedStyles} from './SettingsItem';
import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {View} from 'react-native';
import {useThemeStyleSheet} from '@hooks/useThemeStyleSheet';
import {palette} from '@utils/styles';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const PrivacyPolicy = () => {
    const styles = useThemeStyleSheet(sharedStyles);
    const navigation = useNavigation();
    const {t} = useTranslation();
    return (
        <>
            <SettingsItem
                onPress={() => navigation.navigate('PrivacyPolicy')}
                leftItem={
                    <View style={[styles.settingIconBack, {backgroundColor: palette.rose500}]}>
                        <MaterialIcons name="privacy-tip" style={[styles.settingIcon]} />
                    </View>
                }
                title={t('others.privacy')}
            />
        </>
    );
};

export default React.memo(PrivacyPolicy);
