import {useNativeCurrency} from '@hooks/useNativeCurrency';

import {useThemeStyleSheet} from '@hooks/useThemeStyleSheet';
import SettingsItem, {sharedStyles} from '@screens/Main/Settings/Components/SettingsItem';
import {View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import Text from '@components/Text/Text';
import React, {useCallback, useRef} from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import NativeCurrencyModal from '@components/NativeCurrencyModal/NativeCurrencyModal';

const ItemNativeCurrency = () => {
    const styles = useThemeStyleSheet(sharedStyles);
    const {nativeCurrency} = useNativeCurrency();
    const nativeCurrencyModal = useRef<BottomSheetModal>();
    const openNativeCurrencyModal = useCallback(() => {
        nativeCurrencyModal.current?.present();
    }, []);

    return (
        <>
            <SettingsItem
                onPress={openNativeCurrencyModal}
                title="Native Currency"
                leftItem={
                    <View style={[styles.settingIconBack, {backgroundColor: '#82589F'}]}>
                        <FontAwesome name="chain" style={[styles.settingIcon]} />
                    </View>
                }
                rightItem={
                    <Text style={styles.valueText} weight={'500'}>
                        {nativeCurrency}
                    </Text>
                }
            />
            <NativeCurrencyModal ref={nativeCurrencyModal} />
        </>
    );
};

export default React.memo(ItemNativeCurrency);
