import {useThemeStyleSheet} from '@hooks/useThemeStyleSheet';
import SettingsItem, {sharedStyles} from '@screens/Main/Settings/Components/SettingsItem';
import {View} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import React from 'react';
import {navigate} from '@navigation/shared';

const ItemRepresentative = () => {
    const styles = useThemeStyleSheet(sharedStyles);

    return (
        <SettingsItem
            onPress={() => {
                navigate('Representative');
            }}
            title="Representative"
            leftItem={
                <View style={[styles.settingIconBack, {backgroundColor: '#54a0ff'}]}>
                    <MaterialCommunityIcons name="server-security" style={[styles.settingIcon]} />
                </View>
            }
        />
    );
};

export default React.memo(ItemRepresentative);
