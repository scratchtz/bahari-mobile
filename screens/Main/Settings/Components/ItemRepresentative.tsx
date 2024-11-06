import {useThemeStyleSheet} from '@hooks/useThemeStyleSheet';
import SettingsItem, {sharedStyles} from '@screens/Main/Settings/Components/SettingsItem';
import {View} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import React from 'react';
import {navigate} from '@navigation/shared';
import {useTranslation} from 'react-i18next';

const ItemRepresentative = () => {
    const styles = useThemeStyleSheet(sharedStyles);
    const {t} = useTranslation();
    return (
        <SettingsItem
            onPress={() => {
                navigate('Representative');
            }}
            title={t('settings.general.representative.title')}
            leftItem={
                <View style={[styles.settingIconBack, {backgroundColor: '#54a0ff'}]}>
                    <MaterialCommunityIcons name="server-security" style={[styles.settingIcon]} />
                </View>
            }
        />
    );
};

export default React.memo(ItemRepresentative);
