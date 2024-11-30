import {useThemeStyleSheet, useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import SettingsItem, {sharedStyles} from '@screens/Main/Settings/Components/SettingsItem';
import {StyleSheet, Switch, TouchableOpacity, View} from 'react-native';
import {Entypo, Feather} from '@expo/vector-icons';
import Text from '@components/Text/Text';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {useBottomSheetBackHandler} from '@hooks/hooksbottomsheet/useBottomSheetBackHandler';
import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {AppTheme, PASSWORD_STRENGTH_COLORS, rounded, spacing} from '@utils/styles';
import {ModalHeader} from '@components/ModalHeader/ModalHeader';
import {UnlockMethod} from '@utils/types/unlockMethod';
import Button from '@components/Button/Button';
import Separator from '@components/Separator/Separator';
import * as LocalAuthentication from 'expo-local-authentication';
import {ToastController} from '@components/Toast/Toast';
import BottomSheetTextInput from '@components/TextInput/BottomSheetTextInput';
import {passwordStrength as strengthChecker} from 'check-password-strength';
import security from '@storage/security';
import useUnlockMethod from '@hooks/useUnlockMethod';
import {useMMKVBoolean} from 'react-native-mmkv';
import {StorageKeys} from '@constants/storage';
import {encryptedStorage} from '@storage/mmkv';
import {modalOpacity} from '@constants/variables';
import {useTranslation} from 'react-i18next';

const ItemUnlockMethod = () => {
    const styles = useThemeStyleSheet(sharedStyles);
    const {unlockMethod} = useUnlockMethod();

    const {t} = useTranslation();
    const unlockMethodModal = useRef<BottomSheetModal>();
    const openModal = useCallback(() => {
        unlockMethodModal.current?.present();
    }, []);

    return (
        <>
            <SettingsItem
                onPress={openModal}
                title={t('settings.unlock_method.label')}
                leftItem={
                    <View style={[styles.settingIconBack, {backgroundColor: '#8c7ae6'}]}>
                        <Entypo name="lock" style={[styles.settingIcon]} />
                    </View>
                }
                rightItem={
                    <Text style={styles.valueText} weight={'500'}>
                        {t(`settings.unlock_method.method_${unlockMethod}`)}
                    </Text>
                }
            />
            <UnlockMethodModal ref={unlockMethodModal} />
        </>
    );
};

type unlockModalMode = 'pick' | 'verify-password' | 'set-password';
const UnlockMethodModal = React.forwardRef((props: any, ref: any) => {
    const [modalMode, setModalMode] = useState<unlockModalMode>('pick');
    const {handleSheetPositionChange} = useBottomSheetBackHandler(ref);
    const {unlockMethod, setUnlockMethod} = useUnlockMethod();
    const [pendingUnlockMethod, setPendingUnlockMethod] = useState<UnlockMethod | null>(null);
    const [biometricsPassword, setBiometricsPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const {t} = useTranslation();

    const snapPoints = useMemo(() => ['64%', '85%'], []);
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} opacity={modalOpacity} disappearsOnIndex={-1} appearsOnIndex={0} />
        ),
        [],
    );
    const [requireBiometricsOnSend, setRequireBiometricsOnSend] = useMMKVBoolean(
        StorageKeys.biometricsOnSend,
        encryptedStorage,
    );
    const toggleBiometricsOnSend = async (newValue: boolean) => {
        if (!newValue) {
            //can't turn it off without first authenticating
            const res = await LocalAuthentication.authenticateAsync({requireConfirmation: true});
            if (!res.success) {
                return;
            }
        }
        setRequireBiometricsOnSend(newValue);
    };
    const onSheetPositionChange = (index: number) => {
        handleSheetPositionChange(index);
        if (index === -1) {
            setNewPassword('');
            setConfirmNewPassword('');
            setBiometricsPassword('');
            setModalMode('pick');
        }
    };

    const onClose = () => {
        ref.current.close();
    };

    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const unlockMethods: {value: UnlockMethod; label: string; description: string}[] = useMemo(() => {
        return [
            {
                value: 'none',
                label: `${t('settings.unlock_method.method_none')}`,
                description: `${t('settings.unlock_method.none.description')}`,
            },
            {
                value: 'biometrics',
                label: `${t('settings.unlock_method.biometrics.label')}`,
                description: `${t('settings.unlock_method.biometrics.description')}`,
            },
            {
                value: 'password',
                label: `${t('settings.unlock_method.password.label')}`,
                description: `${t('settings.unlock_method.password.description')}`,
            },
        ];
    }, []);

    const onSelectUnlockMethod = async (method: UnlockMethod) => {
        if (method === unlockMethod) {
            return;
        }

        //previous was none, just allow the new method
        if (unlockMethod === 'none') {
            if (method === 'password') {
                setModalMode('set-password');
                return;
            }
            if (method === 'biometrics') {
                const hasHardware = await LocalAuthentication.hasHardwareAsync();
                if (hasHardware) {
                    setUnlockMethod('biometrics');
                    return;
                }
                ToastController.show({
                    kind: 'error',
                    content: `${t('settings.unlock_method.on_set.error_no_hardware')}`,
                });
                return;
            }
            throw new Error('Unknown method');
        }

        //previous was biometrics, verify first before proceeding
        if (unlockMethod === 'biometrics') {
            try {
                const res = await LocalAuthentication.authenticateAsync({requireConfirmation: true});
                if (!res.success) {
                    return;
                }
                if (method === 'password') {
                    setModalMode('set-password');
                    return;
                }
                if (method === 'none') {
                    setUnlockMethod('none');
                    onClose();
                    return;
                }
                return;
            } catch (e) {
                return;
            }
        }

        if (unlockMethod === 'password') {
            setPendingUnlockMethod(method);
            setModalMode('verify-password');
            return;
        }
    };

    const onConfirmCurrentPassword = async () => {
        console.log('onConfirmCurrentPassword', pendingUnlockMethod);
        if (!pendingUnlockMethod) {
            setModalMode('pick');
            return;
        }
        try {
            const storedPassword = await security.getPassword();
            if (biometricsPassword !== storedPassword) {
                ToastController.show({
                    kind: 'error',
                    content: `${t('settings.unlock_method.on_set.error_wrong_password')}`,
                });
                return;
            }
            setUnlockMethod(pendingUnlockMethod);
            setModalMode('pick');
            onClose();
        } catch (e: any) {
            ToastController.show({
                kind: 'error',
                content: `${t('settings.unlock_method.on_set.error_other')}` + e.toString(),
            });
        }
    };

    const onChangeToPassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            ToastController.show({
                kind: 'error',
                content: `${t('settings.unlock_method.password.error_short_password')}`,
            });
            return;
        }
        if (newPassword !== confirmNewPassword) {
            ToastController.show({kind: 'error', content: `${t('settings.unlock_method.password.error_not_match')}`});
            return;
        }
        try {
            await security.storePassword(newPassword);
            setUnlockMethod('password');
            onClose();
        } catch (e: any) {
            ToastController.show({
                kind: 'error',
                content: `${t('settings.unlock_method.password.error_other')}` + e.toString(),
            });
        }
    };

    const passwordStrength = useMemo(() => strengthChecker(newPassword).id as 0 | 1 | 2 | 3, [newPassword]);
    return (
        <BottomSheetModal
            enablePanDownToClose
            backgroundStyle={styles.container}
            handleIndicatorStyle={styles.indicator}
            ref={ref}
            keyboardBehavior="interactive"
            onChange={onSheetPositionChange}
            backdropComponent={renderBackdrop}
            android_keyboardInputMode={'adjustResize'}
            snapPoints={snapPoints}>
            <View style={{flex: 1}}>
                <ModalHeader
                    title={t('settings.unlock_method.label')}
                    onClose={() => {
                        ref.current.close();
                    }}
                />
                {modalMode === 'pick' && (
                    <BottomSheetScrollView contentContainerStyle={styles.innerContainer}>
                        {unlockMethods.map(item => {
                            const isSelected = unlockMethod === item.value;
                            return (
                                <TouchableOpacity
                                    style={[styles.card, isSelected && styles.cardSelected]}
                                    key={item.value}
                                    onPress={() => {
                                        void onSelectUnlockMethod(item.value);
                                    }}>
                                    <View style={styles.cardInner}>
                                        <Text style={styles.cardTitle} weight="600">
                                            {item.label}
                                        </Text>
                                        <Text style={styles.cardDesc}>{item.description}</Text>
                                    </View>
                                    {unlockMethod === item.value && <Feather name="check" style={styles.checkMark} />}
                                </TouchableOpacity>
                            );
                        })}
                        <View style={styles.requireContainer}>
                            <Text>{t('settings.unlock_method.require_biometrics')}</Text>
                            <Switch value={requireBiometricsOnSend} onValueChange={toggleBiometricsOnSend} />
                        </View>
                    </BottomSheetScrollView>
                )}
                {modalMode === 'verify-password' && (
                    <BottomSheetScrollView contentContainerStyle={styles.innerContainer}>
                        <Text>{t('settings.unlock_method.on_set.label')}</Text>
                        <Separator space={spacing.m} />
                        <BottomSheetTextInput
                            returnKeyType="done"
                            autoCapitalize="none"
                            secureTextEntry
                            placeholder={t('settings.unlock_method.on_set.placeholder')}
                            value={biometricsPassword}
                            onChangeText={setBiometricsPassword}
                        />

                        <View style={styles.actionButtons}>
                            <Button
                                title={t('settings.unlock_method.on_set.button_cancel')}
                                variant="secondary"
                                onPress={() => {
                                    setModalMode('pick');
                                }}
                                containerStyle={[styles.actionButton, {marginRight: spacing.m}]}
                            />
                            <Button
                                title={t('settings.unlock_method.on_set.button_done')}
                                onPress={onConfirmCurrentPassword}
                                containerStyle={styles.actionButton}
                            />
                        </View>
                    </BottomSheetScrollView>
                )}
                {modalMode === 'set-password' && (
                    <BottomSheetScrollView style={{flex: 1}} contentContainerStyle={styles.innerContainer}>
                        <View style={{flex: 1}}>
                            <Text>{t('settings.unlock_method.password.setup')}</Text>
                            <Text
                                weight="500"
                                style={[
                                    styles.passwordStrength,
                                    !newPassword && {opacity: 0},
                                    {color: PASSWORD_STRENGTH_COLORS[passwordStrength]},
                                ]}>
                                {t(`settings.unlock_method.password.strength.${passwordStrength}`)}
                            </Text>
                            <BottomSheetTextInput
                                returnKeyType="next"
                                autoCapitalize="none"
                                secureTextEntry
                                placeholder={t('settings.unlock_method.password.placeholder')}
                                value={newPassword}
                                onChangeText={setNewPassword}
                            />
                            <Separator space={spacing.m} />
                            <BottomSheetTextInput
                                returnKeyType="done"
                                autoCapitalize="none"
                                secureTextEntry
                                placeholder={t('settings.unlock_method.password.confirm_placeholder')}
                                value={confirmNewPassword}
                                onChangeText={setConfirmNewPassword}
                            />

                            <View style={styles.actionButtons}>
                                <Button
                                    title={t('settings.unlock_method.password.button_cancel')}
                                    variant="secondary"
                                    onPress={() => {
                                        setNewPassword('');
                                        setConfirmNewPassword('');
                                        setModalMode('pick');
                                    }}
                                    containerStyle={[styles.actionButton, {marginRight: spacing.m}]}
                                />
                                <Button
                                    title={t('settings.unlock_method.password.button_done')}
                                    onPress={onChangeToPassword}
                                    containerStyle={styles.actionButton}
                                />
                            </View>
                        </View>
                    </BottomSheetScrollView>
                )}
            </View>
        </BottomSheetModal>
    );
});
const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.modalBackground,
        },
        indicator: {
            backgroundColor: theme.colors.modalIndicator,
        },
        innerContainer: {
            paddingHorizontal: spacing.th,
        },
        card: {
            ...theme.cardVariants.simple,
            borderRadius: rounded.l,
            marginTop: spacing.m,
            padding: spacing.l,
            flexDirection: 'row',
            alignItems: 'center',
        },
        cardSelected: {
            borderColor: theme.colors.primary,
            borderWidth: 2,
        },
        cardInner: {
            flex: 1,
        },
        cardTitle: {
            marginBottom: spacing.xs,
        },
        cardDesc: {
            color: theme.colors.textSecondary,
        },
        checkMark: {
            fontSize: 24,
            color: theme.colors.textSecondary,
        },
        passwordStrength: {
            alignSelf: 'flex-end',
            fontSize: 12,
            marginBottom: spacing.m,
        },
        actionButtons: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacing.xl,
        },
        actionButton: {
            flex: 1,
        },
        requireContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: spacing.l,
        },
    });

export default React.memo(ItemUnlockMethod);
