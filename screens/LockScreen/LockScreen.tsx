import React, {useEffect, useRef, useState} from 'react';
import {Modal, ScrollView, StyleSheet, TouchableOpacity, View, SafeAreaView} from 'react-native';
import {AppTheme, spacing} from '@utils/styles';
import {useThemeStyleSheet} from '@hooks/useThemeStyleSheet';
import Text from '@components/Text/Text';
import useAppState from '@hooks/useAppState';
import {useMMKVNumber} from 'react-native-mmkv';
import {StorageKeys} from '@constants/storage';
import {encryptedStorage} from '@storage/mmkv';
import TextInput from '@components/TextInput/TextInput';
import Button from '@components/Button/Button';
import Separator from '@components/Separator/Separator';
import {TextInput as NativeTextInput} from 'react-native';
import useUnlockMethod from '@hooks/useUnlockMethod';
import {FontAwesome5} from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import security from '@storage/security';
import {Image} from 'expo-image';
import {hasAtLeastSingleWallet} from '@storage/wallet';
import {useTranslation} from 'react-i18next';

const LockScreen = () => {
    const hasWallet = hasAtLeastSingleWallet();
    const {unlockMethod} = useUnlockMethod();
    const [autolockSeconds] = useMMKVNumber(StorageKeys.autolockSeconds, encryptedStorage);

    const {t} = useTranslation();

    const lockedState = !!(hasWallet && unlockMethod && (autolockSeconds || 0) > 0);
    const [isLocked, setIsLocked] = useState(lockedState);
    const [password, setPassword] = useState('');
    const [showInputPassword, setShowInputPassword] = useState(false);
    const passwordInputRef = useRef<NativeTextInput>();

    const [showWrongPassword, setShowWrongPassword] = useState(false);

    const [failedCount, setFailedCount] = useState(0);

    const [lastAppToBackground, setLastAppToBackground] = useMMKVNumber(
        StorageKeys.lastPutAppToBackground,
        encryptedStorage,
    );

    useEffect(() => {
        if (unlockMethod === 'none') {
            unlock();
            return;
        }
        if (isLocked && unlockMethod === 'biometrics') {
            void tryBiometrics();
        }
    }, []);

    const tryBiometrics = async () => {
        try {
            const res = await LocalAuthentication.authenticateAsync({requireConfirmation: true});
            if (res.success) {
                unlock();
                return;
            }
            setFailedCount(count => count + 1);
        } catch (e) {
            console.debug(e);
        }
    };
    const onAppBackground = () => {
        if (!autolockSeconds || unlockMethod === 'none') {
            return;
        }
        setIsLocked(autolockSeconds > 0);
        setLastAppToBackground(new Date().getTime());
    };

    const onAppForeground = () => {
        if (unlockMethod === 'none') {
            unlock();
            return;
        }
        if (!lastAppToBackground) {
            return;
        }
        if (!autolockSeconds || autolockSeconds === -1) {
            return;
        }
        const elapsedTimeInSeconds = (new Date().getTime() - lastAppToBackground) / 1000;
        const shouldLock = elapsedTimeInSeconds - autolockSeconds > 0;
        setIsLocked(shouldLock);

        if (shouldLock && unlockMethod === 'biometrics') {
            void tryBiometrics();
        }
    };

    useAppState({onBackground: onAppBackground, onForeground: onAppForeground});
    const styles = useThemeStyleSheet(dynamicStyles);

    const onUnlock = async () => {
        if (!password) {
            setShowInputPassword(true);
            passwordInputRef.current?.focus();
            setTimeout(() => {
                setShowInputPassword(false);
            }, 3000);
            return;
        }

        const storedPassword = await security.getPassword();
        if (storedPassword !== password) {
            setShowWrongPassword(true);
            setTimeout(() => {
                setShowWrongPassword(false);
            }, 2000);
            setFailedCount(failedCount + 1);
            return;
        }

        unlock();
    };

    const unlock = () => {
        setFailedCount(0);
        setIsLocked(false);
    };

    const onResetWallet = () => {};

    return (
        <Modal visible={isLocked} transparent={true}>
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <ScrollView contentContainerStyle={styles.innerContainer}>
                        <Image source={require('@assets/logoclear.png')} style={styles.logo} />

                        <Text variant="subheader" style={styles.unlockHeader}>
                            {t('lock_screen.unlock')}
                        </Text>
                        <Separator space={spacing.l} />

                        {unlockMethod === 'biometrics' && (
                            <>
                                <Text style={styles.biometricsText}>{t('lock_screen.unlock_with_biometrics')}</Text>
                                <TouchableOpacity style={styles.biometricsButton} onPress={tryBiometrics}>
                                    <FontAwesome5 name="fingerprint" style={styles.biometricsIcon} />
                                </TouchableOpacity>
                            </>
                        )}

                        {unlockMethod === 'password' && (
                            <>
                                <Text>{t('lock_screen.enter_password')}</Text>
                                {showWrongPassword && (
                                    <Text style={styles.wrongPassword}>{t('lock_screen.error_wrong_password')}</Text>
                                )}
                                {showInputPassword && (
                                    <Text style={styles.inputPasswordWarning}>
                                        {t('lock_screen.input_password_warning')}
                                    </Text>
                                )}
                                <TextInput
                                    ref={passwordInputRef}
                                    placeholder={t('lock_screen.password_placeholder')}
                                    returnKeyType={'done'}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    autoFocus={true}
                                    containerStyle={styles.passwordInputContainer}
                                    secureTextEntry={true}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <Button
                                    title={t('lock_screen.unlock_button')}
                                    onPress={onUnlock}
                                    containerStyle={styles.unlockButton}
                                />
                            </>
                        )}

                        {failedCount >= 3 && (
                            <View style={styles.resetContainer}>
                                <Text>{t('lock_screen.failed')}</Text>
                                <TouchableOpacity style={styles.resetButton} onPress={onResetWallet}>
                                    <Text style={styles.resetText} weight={'500'}>
                                        {t('lock_screen.reset')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        <Separator space={spacing.xxl} />
                    </ScrollView>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.mainBackground,
            justifyContent: 'center',
            flex: 1,
        },
        logo: {
            width: 80,
            height: 80,
            marginBottom: spacing.l,
        },
        noneContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
        },
        innerContainer: {
            marginHorizontal: spacing.xl,
            marginTop: spacing.xxl,
        },
        unlockHeader: {
            fontSize: 18,
        },
        inputPasswordWarning: {
            color: theme.colors.warning,
        },
        passwordInputContainer: {
            marginTop: spacing.s,
        },
        useBiometricsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: spacing.l,
        },
        unlockButton: {
            marginTop: spacing.xl,
        },
        resetButton: {
            paddingHorizontal: spacing.m,
        },
        resetText: {
            color: theme.colors.warning,
        },
        biometricsButton: {
            // alignSelf: 'center',
        },
        biometricsText: {
            // textAlign: 'center',
        },
        wrongPassword: {
            color: theme.colors.warning,
            marginTop: spacing.xs,
        },
        biometricsIcon: {
            color: theme.colors.textSecondary,
            fontSize: 46,
            marginTop: spacing.l,
        },
        resetContainer: {
            marginTop: spacing.xl,
            flexDirection: 'row',
            alignItems: 'center',
        },
    });

export default React.memo(LockScreen);
