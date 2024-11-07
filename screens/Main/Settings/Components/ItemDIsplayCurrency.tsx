import {useThemeStyleSheet} from '@hooks/useThemeStyleSheet';
import SettingsItem, {sharedStyles} from '@screens/Main/Settings/Components/SettingsItem';
import Text from '@components/Text/Text';
import React, {useCallback, useRef} from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import CurrencyModal from '@components/CurrencyModal/CurrencyModal';
import {View} from 'react-native';
import {palette} from '@utils/styles';
import {Fontisto} from '@expo/vector-icons';
import {useDisplayCurrency} from '@hooks/useDisplayCurrency';
import {useTranslation} from 'react-i18next';

const ItemDisplayCurrency = () => {
    const styles = useThemeStyleSheet(sharedStyles);
    const {displayCurrency} = useDisplayCurrency();

    const {t} = useTranslation();

    const currencyModal = useRef<BottomSheetModal>();
    const openCurrencyModal = useCallback(() => {
        currencyModal.current?.present();
    }, []);

    return (
        <>
            <SettingsItem
                onPress={openCurrencyModal}
                title={t('settings.display_currency_label')}
                leftItem={
                    <View style={[styles.settingIconBack, {backgroundColor: palette.amber400}]}>
                        <Fontisto name="money-symbol" style={[styles.settingIcon]} />
                    </View>
                }
                rightItem={
                    <Text style={styles.valueText} weight={'500'}>
                        {displayCurrency}
                    </Text>
                }
            />
            <CurrencyModal ref={currencyModal} />
        </>
    );
};

export default React.memo(ItemDisplayCurrency);
