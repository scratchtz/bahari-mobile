import {Text, View} from 'react-native';
import React from 'react';
import {useThemeStyleSheet} from '@hooks/useThemeStyleSheet';
import SettingsItem, {sharedStyles} from './SettingsItem';
import AntDesign from '@expo/vector-icons/AntDesign';
import {palette} from '@utils/styles';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const TermsAndConditions = () => {
    const styles = useThemeStyleSheet(sharedStyles);
    const navigation = useNavigation();
    const {t} = useTranslation();
    return (
        <>
            <SettingsItem
                onPress={() => navigation.navigate('Terms')}
                leftItem={
                    <View style={[styles.settingIconBack, {backgroundColor: palette.amber400}]}>
                        <AntDesign name="Safety" style={[styles.settingIcon]} />
                    </View>
                }
                title={t('others.terms')}
            />
        </>
    );
};
export default React.memo(TermsAndConditions);
