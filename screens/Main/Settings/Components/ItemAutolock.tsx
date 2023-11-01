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

const ItemAutolock = () => {
    const styles = useThemeStyleSheet(sharedStyles);
    const autolockModal = useRef<BottomSheetModal>();
    const openAutolockModal = useCallback(() => {
        autolockModal.current?.present();
    }, []);
    const [autolockSeconds, setAutolockSeconds] = useMMKVNumber(StorageKeys.autolockSeconds, encryptedStorage);

    useEffect(() => {
        if (!autolockSeconds) {
            setAutolockSeconds(30);
        }
    }, [autolockSeconds]);

    const autoLockLabel = useCallback((value: number) => {
        switch (value) {
            case 1:
                return 'Immediately';
            case 30:
                return '30s';
            case 60:
                return '1min';
            case 300:
                return '5min';
            case 1800:
                return '30min';
            case 3600:
                return '1hr';
            case -1:
                return 'Never';
        }
        return '';
    }, []);

    return (
        <>
            <SettingsItem
                onPress={openAutolockModal}
                title="Autolock"
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
