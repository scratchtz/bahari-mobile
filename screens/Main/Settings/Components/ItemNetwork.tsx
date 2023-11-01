import {useThemeStyleSheet} from '@hooks/useThemeStyleSheet';
import SettingsItem, {sharedStyles} from '@screens/Main/Settings/Components/SettingsItem';
import {View} from 'react-native';
import {FontAwesome5} from '@expo/vector-icons';
import Text from '@components/Text/Text';
import React from 'react';
import {navigate} from '@navigation/shared';
import {useNetworks} from '@hooks/useNetworks';

const ItemNetwork = () => {
    const styles = useThemeStyleSheet(sharedStyles);
    const {currentNetworkLabel} = useNetworks();

    return (
        <SettingsItem
            onPress={() => {
                navigate('Network');
            }}
            title="Network"
            leftItem={
                <View style={[styles.settingIconBack, {backgroundColor: '#ff793f'}]}>
                    <FontAwesome5 name="wifi" size={24} style={[styles.settingIcon]} />
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

export default React.memo(ItemNetwork);
