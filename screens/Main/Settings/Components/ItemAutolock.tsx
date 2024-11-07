import {useThemeStyleSheet} from '@hooks/useThemeStyleSheet';
import SettingsItem, {sharedStyles} from '@screens/Main/Settings/Components/SettingsItem';
import {View} from 'react-native';
import {FontAwesome, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import Text from '@components/Text/Text';
import React, {useCallback, useEffect, useRef} from 'react';
import {palette} from '@utils/styles';
import AutolockModal from '@screens/Main/Settings/AutolockModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useMMKVNumber} from 'react-native-mmkv';
import {StorageKeys} from '@constants/storage';
import {encryptedStorage} from '@storage/mmkv';
import {useTranslation} from 'react-i18next';

const ItemAutolock = () => {
    const styles = useThemeStyleSheet(sharedStyles);
    const autolockModal = useRef<BottomSheetModal>();
    const openAutolockModal = useCallback(() => {
        autolockModal.current?.present();
    }, []);
    const [autolockSeconds, setAutolockSeconds] = useMMKVNumber(StorageKeys.autolockSeconds, encryptedStorage);

    const {t} = useTranslation();

    useEffect(() => {
        if (!autolockSeconds) {
            setAutolockSeconds(30);
        }
    }, [autolockSeconds]);

    const autoLockLabel = useCallback((value: number) => {
        switch (value) {
            case 1:
                return `${t('settings.auto_lock.interval.1')}`;
            case 30:
                return `${t('settings.auto_lock.interval.30')}`;
            case 60:
                return `${t('settings.auto_lock.interval.60')}`;
            case 300:
                return `${t('settings.auto_lock.interval.300')}`;
            case 1800:
                return `${t('settings.auto_lock.interval.1800')}`;
            case 3600:
                return `${t('settings.auto_lock.interval.3600')}`;
            case -1:
                return `${t('settings.auto_lock.interval.-1')}`;
        }
        return '';
    }, []);

    return (
        <>
            <SettingsItem
                onPress={openAutolockModal}
                title={t('settings.auto_lock.title')}
                leftItem={
                    <View style={[styles.settingIconBack, {backgroundColor: palette.fuschia400}]}>
                        <MaterialIcons name="lock-clock" style={[styles.settingIcon]} />
                    </View>
                }
                rightItem={
                    <Text style={styles.valueText} weight={'500'}>
                        {autoLockLabel(autolockSeconds || 0)}
                    </Text>
                }
            />
            <AutolockModal ref={autolockModal} />
        </>
    );
};

export default React.memo(ItemAutolock);
