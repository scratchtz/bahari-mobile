import {useThemeStyleSheet, useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import SettingsItem, {sharedStyles} from '@screens/Main/Settings/Components/SettingsItem';
import {StyleSheet, View} from 'react-native';
import {AntDesign, Feather} from '@expo/vector-icons';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {AppTheme, palette, spacing} from '@utils/styles';
import Text from '@components/Text/Text';
import {useBottomSheetBackHandler} from '@hooks/hooksbottomsheet/useBottomSheetBackHandler';
import {useAppTheme} from '@hooks/useAppTheme';
import {ModalHeader} from '@components/ModalHeader/ModalHeader';
import Button from '@components/Button/Button';
import {modalOpacity} from '@constants/variables';
import {useTranslation} from 'react-i18next';

const ItemResetWallet = () => {
    const styles = useThemeStyleSheet(sharedStyles)

    const {t} = useTranslation();

    const resetWalletModal = useRef<BottomSheetModal>(null);
    const openResetWalletModal = useCallback(() => {
        resetWalletModal.current?.present();
    }, []);

    return (
        <>
            <SettingsItem
                onPress={openResetWalletModal}
                title={t('settings.security.reset_wallet.title')}
                leftItem={
                    <View style={[styles.settingIconBack, {backgroundColor: palette.rose500}]}>
                        <Feather name="delete" style={[styles.settingIcon]} />
                    </View>
                }
            />
            <ResetWalletModal ref={resetWalletModal} />
        </>
    );
};

const LOCK_TIMEOUT = 4;
const ResetWalletModal = React.forwardRef(({}, ref: any) => {
    const {handleSheetPositionChange} = useBottomSheetBackHandler(ref);

    const {t} = useTranslation();

    const countdownStarted = useRef(false);
    const [timeout, setTimeLeft] = useState(LOCK_TIMEOUT);
    useEffect(() => {
        if (!countdownStarted.current) {
            return;
        }
        if (timeout <= 0) return;
        const interval = setInterval(() => {
            setTimeLeft(t => t - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timeout]);
    const handlePositionChange = (index: number) => {
        handleSheetPositionChange(index);
        if (index === -1) {
            setTimeLeft(LOCK_TIMEOUT);
            countdownStarted.current = false;
            return;
        }
        if (index >= 0) {
            if (countdownStarted.current) return;
            countdownStarted.current = true;
            setTimeLeft(t => t - 1);
        }
    };

    const snapPoints = useMemo(() => [280, 320], []);
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} opacity={modalOpacity} disappearsOnIndex={-1} appearsOnIndex={0} />
        ),
        [],
    );

    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, deleteStyles);

    return (
        <BottomSheetModal
            enablePanDownToClose
            backgroundStyle={styles.container}
            handleIndicatorStyle={styles.indicator}
            ref={ref}
            onChange={handlePositionChange}
            backdropComponent={renderBackdrop}
            snapPoints={snapPoints}>
            <ModalHeader title={t('settings.security.reset_wallet.modal_label')} onClose={() => ref.current.close()} />
            <View style={styles.innerContainer}>
                <View style={styles.warningWrap}>
                    <AntDesign name="warning" size={24} color={theme.colors.warning} />
                    <Text style={styles.warning}>
                        {t('settings.security.reset_wallet.warning')}
                    </Text>
                </View>
                <View style={styles.buttonsContainer}>
                    <Button
                        title={t('settings.security.reset_wallet.cancel')}
                        onPress={() => {
                            ref.current.close();
                        }}
                        variant="secondary"
                        containerStyle={styles.button}
                    />
                    <Button
                        title={timeout > 0 ? `${t('settings.security.reset_wallet.confirm')} (${timeout})` : `${t('settings.security.reset_wallet.confirm')}`}
                        variant="primary"
                        disabled={timeout > 0}
                        onPress={() => {}}
                        containerStyle={[
                            styles.button,
                            {marginLeft: spacing.s},
                            timeout === 0 && {backgroundColor: theme.colors.warning},
                        ]}
                    />
                </View>
            </View>
        </BottomSheetModal>
    );
});

const deleteStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.modalBackground,
        },
        indicator: {
            backgroundColor: theme.colors.modalIndicator,
        },
        innerContainer: {
            marginHorizontal: spacing.th,
        },
        info: {
            textAlign: 'center',
        },
        warning: {
            marginLeft: spacing.m,
            flex: 1,
        },
        buttonsContainer: {
            flexDirection: 'row',
            marginTop: spacing.xl,
        },
        button: {
            flex: 1,
        },
        warningWrap: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacing.l,
        },
    });

export default React.memo(ItemResetWallet);
