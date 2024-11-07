import {useThemeStyleSheet} from '@hooks/useThemeStyleSheet';
import SettingsItem, {sharedStyles} from '@screens/Main/Settings/Components/SettingsItem';
import {Switch, View} from 'react-native';
import {FontAwesome5} from '@expo/vector-icons';
import React from 'react';
import {useMMKVBoolean} from 'react-native-mmkv';
import {StorageKeys} from '@constants/storage';
import {encryptedStorage} from '@storage/mmkv';
import {useTranslation} from 'react-i18next';

const ItemPushNotifications = () => {
    const styles = useThemeStyleSheet(sharedStyles);
    const {t} = useTranslation()
    const [allowPush, setAllowPush] = useMMKVBoolean(StorageKeys.usePushNotifications, encryptedStorage);

    return (
        <SettingsItem
            onPress={() => {}}
            title={t('settings.notification_label')}
            leftItem={
                <View style={[styles.settingIconBack, {backgroundColor: '#e84118'}]}>
                    <FontAwesome5 name="bell" style={[styles.settingIcon]} />
                </View>
            }
            rightItem={<Switch value={allowPush} onValueChange={setAllowPush} />}
        />
    );
};

export default React.memo(ItemPushNotifications);
