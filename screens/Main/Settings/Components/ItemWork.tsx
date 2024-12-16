import {useThemeStyleSheet} from '@hooks/useThemeStyleSheet';
import SettingsItem, {sharedStyles} from '@screens/Main/Settings/Components/SettingsItem';
import {View} from 'react-native';
import {FontAwesome5} from '@expo/vector-icons';
import Text from '@components/Text/Text';
import React from 'react';
import {navigate} from '@navigation/shared';
import {useNetworks} from '@hooks/useNetworks';
import {useTranslation} from 'react-i18next';

const ItemWork = () => {
    const styles = useThemeStyleSheet(sharedStyles);
    const {currentNetworkLabel} = useNetworks();
    const {t} = useTranslation();

    return (
        <SettingsItem
            onPress={() => {
                navigate('WorkServer');
            }}
            title={t('settings.work_label')}
            leftItem={
                <View style={[styles.settingIconBack, {backgroundColor: '#575fcf'}]}>
                    <FontAwesome5 name="hammer" style={[styles.settingIcon]} />
                </View>
            }
            rightItem={
                <Text style={styles.valueText} weight={'500'}>
                    {currentNetworkLabel}
                </Text>
            }
        />
    );
};

export default React.memo(ItemWork);
