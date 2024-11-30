import {useThemeStyleSheet, useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import SettingsItem, {sharedStyles} from '@screens/Main/Settings/Components/SettingsItem';
import {Alert, StyleSheet, View} from 'react-native';
import {AntDesign, Feather} from '@expo/vector-icons';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {AppTheme, palette, rounded, spacing} from '@utils/styles';
import Text from '@components/Text/Text';
import {useBottomSheetBackHandler} from '@hooks/hooksbottomsheet/useBottomSheetBackHandler';
import {useAppTheme} from '@hooks/useAppTheme';
import {ModalHeader} from '@components/ModalHeader/ModalHeader';
import Button from '@components/Button/Button';
import {modalOpacity} from '@constants/variables';
import {useTranslation} from 'react-i18next';
import {encryptedStorage} from '@storage/mmkv';
import {navigateDispatch} from '@navigation/shared';
import {CommonActions} from '@react-navigation/native';

const ItemResetWallet = () => {
    const styles = useThemeStyleSheet(sharedStyles);

    const {t} = useTranslation();

    const resetWalletModal = useRef<BottomSheetModal>(null);
    const openResetWalletModal = useCallback(() => {
        resetWalletModal.current?.present();
    }, []);

    return (
        <>
            <SettingsItem
                onPress={openResetWalletModal}
                title={t('settings.reset_wallet.label')}
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

const LOCK_TIMEOUT = 5;
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

    const onReset = () => {
        Alert.alert(t('settings.reset_wallet.modal_label'), t('settings.reset_wallet.warning'), [
            {
                text: t('settings.reset_wallet.button_cancel'),
                style: 'cancel',
            },
            {
                text: t('settings.reset_wallet.button_confirm'),
                onPress: () => {
                    confirmReset();
                },
                style: 'destructive',
            },
        ]);
    };

    const confirmReset = () => {
        navigateDispatch(
            CommonActions.reset({
                index: 1,
                routes: [{name: 'Setup'}],
            }),
        );
        encryptedStorage.clearAll();
    };

    const snapPoints = useMemo(() => [400, '80%'], []);
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
            <ModalHeader title={''} onClose={() => ref.current.close()} />
            <View style={styles.innerContainer}>
                <View style={styles.warningWrap}>
                    <AntDesign name="warning" size={46} color={'white'} style={styles.warningIcon} />
                </View>
                <Text style={styles.header} weight="600">
                    {t('settings.reset_wallet.modal_label')}
                </Text>
                <Text style={styles.warning}>{t('settings.reset_wallet.warning')}</Text>
                <View style={styles.buttonsContainer}>
                    <Button
                        title={t('settings.reset_wallet.button_cancel')}
                        onPress={() => {
                            ref.current.close();
                        }}
                        variant="secondary"
                        containerStyle={styles.button}
                    />
                    <Button
                        title={
                            timeout > 0
                                ? `${t('settings.reset_wallet.button_confirm')} (${timeout})`
                                : `${t('settings.reset_wallet.button_confirm')}`
                        }
                        variant="primary"
                        disabled={timeout > 0}
                        onPress={onReset}
                        containerStyle={[
                            styles.button,
                            {marginLeft: spacing.s, backgroundColor: theme.colors.warning},
                            timeout > 0 && {opacity: 0.75},
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
        header: {
            marginTop: spacing.l,
            fontSize: 18,
            textAlign: 'center',
        },
        warning: {
            marginLeft: spacing.m,
            marginTop: spacing.m,
            textAlign: 'center',
        },
        buttonsContainer: {
            flexDirection: 'row',
            marginTop: spacing.xl,
        },
        button: {
            flex: 1,
        },
        warningWrap: {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.warning,
            alignSelf: 'center',
            borderRadius: rounded.xl,
        },
        warningIcon: {
            padding: spacing.l,
        },
    });

export default React.memo(ItemResetWallet);
