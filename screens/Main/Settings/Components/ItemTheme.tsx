import {useThemeStyleSheet} from '@hooks/useThemeStyleSheet';
import SettingsItem, {sharedStyles} from '@screens/Main/Settings/Components/SettingsItem';
import {View} from 'react-native';
import {FontAwesome, MaterialCommunityIcons} from '@expo/vector-icons';
import Text from '@components/Text/Text';
import React, {useCallback, useRef} from 'react';
import ThemeChangeModal from '@screens/Main/Settings/ThemeChangeModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useAppColorSettings} from '@hooks/useAppColorScheme';
import {palette} from '@utils/styles';
import {useTranslation} from 'react-i18next';

const ItemTheme = () => {
    const styles = useThemeStyleSheet(sharedStyles);
    const themeChangeModal = useRef<BottomSheetModal>(null);
    const openThemeChangeModal = useCallback(() => {
        themeChangeModal.current?.present();
    }, []);

    const {t} = useTranslation();

    const currentScheme = useAppColorSettings();

    return (
        <>
            <SettingsItem
                onPress={openThemeChangeModal}
                title={t('settings.theme_label')}
                leftItem={
                    <View style={[styles.settingIconBack, {backgroundColor: palette.sky500}]}>
                        <MaterialCommunityIcons name="theme-light-dark" style={[styles.settingIcon]} />
                    </View>
                }
                rightItem={
                    <Text style={styles.valueText} weight={'500'}>
                        {t(`constants.themes.${currentScheme}`)}
                    </Text>
                }
            />
            <ThemeChangeModal ref={themeChangeModal} />
        </>
    );
};

export default React.memo(ItemTheme);
