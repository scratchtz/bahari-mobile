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
import Toast, {ToastController} from '@components/Toast/Toast';
import BottomSheetTextInput from '@components/TextInput/BottomSheetTextInput';
import {passwordStrength as strengthChecker} from 'check-password-strength';
import security from '@storage/security';
import useUnlockMethod from '@hooks/useUnlockMethod';
import {useMMKVBoolean} from 'react-native-mmkv';
import {StorageKeys} from '@constants/storage';
import {encryptedStorage} from '@storage/mmkv';
import {modalOpacity} from '@constants/variables';

const ItemUnlockMethod = () => {
    const styles = useThemeStyleSheet(sharedStyles);
    const {unlockMethod} = useUnlockMethod();

    const unlockMethodModal = useRef<BottomSheetModal>();
    const openModal = useCallback(() => {
        unlockMethodModal.current?.present();
    }, []);

    const methodLabel = useMemo(() => {
        switch (unlockMethod) {
            case 'password':
                return 'Password';
            case 'biometrics':
                return 'Biometrics';
        }
        return '';
    }, [unlockMethod]);

    return (
        <>
            <SettingsItem
                onPress={openModal}
                title="Unlock Method"
                leftItem={
                    <View style={[styles.settingIconBack, {backgroundColor: '#8c7ae6'}]}>
                        <Entypo name="lock" style={[styles.settingIcon]} />
                    </View>
                }
                rightItem={
                    <Text style={styles.valueText} weight={'500'}>
                        {methodLabel}
                    </Text>
                }
            />
            <UnlockMethodModal ref={unlockMethodModal} />
        </>
    );
};

type unlockModalMode = 'normal' | 'set-biometrics' | 'set-password';
const UnlockMethodModal = React.forwardRef((props: any, ref: any) => {
    const [modalMode, setModalMode] = useState<unlockModalMode>('normal');
    const {handleSheetPositionChange} = useBottomSheetBackHandler(ref);
    const {unlockMethod, setUnlockMethod} = useUnlockMethod();

    const [biometricsPassword, setBiometricsPassword] = useState('');

    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

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
            setModalMode('normal');
        }
    };

    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const unlockMethods: {value: UnlockMethod; label: string; description: string}[] = useMemo(() => {
        return [
            {value: 'biometrics', label: 'Biometrics', description: 'Use Face-ID or Touch ID to unlock your wallet'},
            {value: 'password', label: 'Password', description: 'Use password to unlock your wallet'},
        ];
    }, []);

    const onSelectUnlockMethod = async (method: UnlockMethod) => {
        if (method === unlockMethod) {
            return;
        }
        if (method === 'biometrics') {
            //if u set password even once to change u must enter the password
            if (unlockMethod === 'password') {
                setModalMode('set-biometrics');
                return;
            }
            setUnlockMethod('biometrics');
            return;
        }
        if (method === 'password') {
            //verify first before setting up password
            if (unlockMethod === 'biometrics') {
                try {
                    const res = await LocalAuthentication.authenticateAsync({requireConfirmation: true});
                    if (res.success) {
                        setModalMode('set-password');
                    }
                } catch (e) {}
                return;
            }
            setUnlockMethod('password');
            return;
        }
    };

    const onChangeToBiometrics = async () => {
        try {
            const storedPassword = await security.getPassword();
            //TODO if many tries clean up
            if (biometricsPassword !== storedPassword) {
                ToastController.show({kind: 'error', content: 'Wrong password'});
                return;
            }
            setUnlockMethod('biometrics');
            ref.current.close();
        } catch (e: any) {
            ToastController.show({kind: 'error', content: 'Error occurred!' + e.toString()});
        }
    };

    const onChangeToPassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            ToastController.show({kind: 'error', content: 'Enter password more than 6 characters'});
            return;
        }
        if (newPassword !== confirmNewPassword) {
            ToastController.show({kind: 'error', content: "Passwords don't match"});
            return;
        }

        try {
            await security.storePassword(newPassword);
            setUnlockMethod('password');
            ref.current.close();
        } catch (e: any) {
            ToastController.show({kind: 'error', content: 'Error occurred!' + e.toString()});
        }
        //Saving password to keychain
    };

    const passwordStrength = useMemo(() => {
        return strengthChecker(newPassword).id as 0 | 1 | 2 | 3;
    }, [newPassword]);
    const passwordStrengthText = useMemo(() => {
        switch (passwordStrength) {
            case 0:
                return 'too weak';
            case 1:
                return 'weak';
            case 2:
                return 'medium';
            case 3:
                return 'strong';
        }
    }, [passwordStrength]);

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
                    title={'Unlock Method'}
                    onClose={() => {
                        ref.current.close();
                    }}
                />
                {modalMode === 'normal' && (
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
                            <Text>Require biometrics on Send</Text>
                            <Switch value={requireBiometricsOnSend} onValueChange={toggleBiometricsOnSend} />
                        </View>
                    </BottomSheetScrollView>
                )}
                {modalMode === 'set-biometrics' && (
                    <BottomSheetScrollView contentContainerStyle={styles.innerContainer}>
                        <Text>Enter your password to continue</Text>
                        <Separator space={spacing.m} />
                        <BottomSheetTextInput
                            returnKeyType="done"
                            autoCapitalize="none"
                            secureTextEntry
                            placeholder={'Password'}
                            value={biometricsPassword}
                            onChangeText={setBiometricsPassword}
                        />

                        <View style={styles.actionButtons}>
                            <Button
                                title={'Cancel'}
                                variant="secondary"
                                onPress={() => {
                                    setModalMode('normal');
                                }}
                                containerStyle={[styles.actionButton, {marginRight: spacing.m}]}
                            />
                            <Button
                                title={'Done'}
                                onPress={onChangeToBiometrics}
                                containerStyle={styles.actionButton}
                            />
                        </View>
                    </BottomSheetScrollView>
                )}
                {modalMode === 'set-password' && (
                    <BottomSheetScrollView style={{flex: 1}} contentContainerStyle={styles.innerContainer}>
                        <View style={{flex: 1}}>
                            <Text>Setup password to unlock your wallet</Text>
                            <Text
                                weight="500"
                                style={[
                                    styles.passwordStrength,
                                    !newPassword && {opacity: 0},
                                    {color: PASSWORD_STRENGTH_COLORS[passwordStrength]},
                                ]}>
                                {passwordStrengthText}
                            </Text>
                            <BottomSheetTextInput
                                returnKeyType="next"
                                autoCapitalize="none"
                                secureTextEntry
                                placeholder={'Password'}
                                value={newPassword}
                                onChangeText={setNewPassword}
                            />
                            <Separator space={spacing.m} />
                            <BottomSheetTextInput
                                returnKeyType="done"
                                autoCapitalize="none"
                                secureTextEntry
                                placeholder={'Confirm Password'}
                                value={confirmNewPassword}
                                onChangeText={setConfirmNewPassword}
                            />

                            <View style={styles.actionButtons}>
                                <Button
                                    title={'Cancel'}
                                    variant="secondary"
                                    onPress={() => {
                                        setNewPassword('');
                                        setConfirmNewPassword('');
                                        setModalMode('normal');
                                    }}
                                    containerStyle={[styles.actionButton, {marginRight: spacing.m}]}
                                />
                                <Button
                                    title={'Done'}
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
