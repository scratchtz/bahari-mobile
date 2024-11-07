import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, StyleSheet, Alert, Keyboard, TouchableOpacity} from 'react-native';
import {useBottomSheetBackHandler} from '@hooks/hooksbottomsheet/useBottomSheetBackHandler';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {AppTheme, palette, rounded, spacing, PASSWORD_STRENGTH_COLORS} from '@utils/styles';
import Text from '@components/Text/Text';
import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import Separator from '@components/Separator/Separator';
import Button from '@components/Button/Button';
import {passwordStrength as strengthChecker} from 'check-password-strength';
import aes256 from '@utils/helper/aes256';
import CopyTag from '@components/Tag/CopyTag';
import {ToastController} from '@components/Toast/Toast';
import BottomSheetTextInput from '@components/TextInput/BottomSheetTextInput';
import {modalOpacity} from '@constants/variables';
import {useTranslation} from 'react-i18next';

interface Props {
    onSuccess: () => void;
    passphrase?: string;
}

const MINIMUM_LENGTH = 8;

const EncryptModal = (props: Props, ref: any) => {
    const {handleSheetPositionChange} = useBottomSheetBackHandler(ref);

    const {t} = useTranslation();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [encryptedText, setEncryptedText] = useState('');

    //reset encrypted text when passphrase changes
    useEffect(() => {
        reset();
    }, [props.passphrase]);

    const snapPoints = useMemo(() => ['90%', '96%'], []);
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} opacity={modalOpacity} disappearsOnIndex={-1} appearsOnIndex={0} />
        ),
        [],
    );

    const passwordStrength = useMemo(() => strengthChecker(password).id as 0 | 1 | 2 | 3, [password]);
    const passwordStrengthText = useMemo(() => {
        switch (passwordStrength) {
            case 0:
                return `${t('new_wallet.encrypt_wallet.unencrypted.strength.too_weak')}`;
            case 1:
                return `${t('new_wallet.encrypt_wallet.unencrypted.strength.weak')}`;
            case 2:
                return `${t('new_wallet.encrypt_wallet.unencrypted.strength.medium')}`;
            case 3:
                return `${t('new_wallet.encrypt_wallet.unencrypted.strength.strong')}`;
        }
    }, [passwordStrength]);

    const onEncrypt = () => {
        if (password.length < MINIMUM_LENGTH) {
            ToastController.show({kind: 'error', content: `${t('new_wallet.encrypt_wallet.errors.short_password')}`});
            return;
        }
        if (password !== confirmPassword) {
            ToastController.show({kind: 'error', content: `${t('new_wallet.encrypt_wallet.errors.unmatched_password')}`});
            return;
        }
        if (!props.passphrase) {
            ToastController.show({kind: 'error', title: 'Error', content: `${t('new_wallet.encrypt_wallet.errors.passphrase_unavailable')}`});
            return;
        }

        Keyboard.dismiss();

        const encryptedText = aes256.encryptText(password, props.passphrase);
        setEncryptedText(encryptedText);
    };

    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const passwordIncorrect = password.length > 0 && confirmPassword.length > 0 && password !== confirmPassword;
    const passwordsCorrect = password.length > MINIMUM_LENGTH && password === confirmPassword;

    const onDone = () => {
        ref.current.close();
        reset();
    };

    const reset = () => {
        setEncryptedText('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <BottomSheetModal
            enablePanDownToClose
            backgroundStyle={styles.modal}
            handleIndicatorStyle={styles.indicator}
            android_keyboardInputMode={'adjustResize'}
            ref={ref}
            onChange={handleSheetPositionChange}
            backdropComponent={renderBackdrop}
            snapPoints={snapPoints}>
            <BottomSheetScrollView style={styles.flex} contentContainerStyle={styles.container}>
                {encryptedText ? (
                    <>
                        <Text variant="subheader">{t('new_wallet.encrypt_wallet.unencrypted.title')}</Text>
                        <Text style={styles.info}>{t('new_wallet.encrypt_wallet.encrypted.store')}</Text>
                        <Text style={styles.warning} weight="500">
                            {t('new_wallet.encrypt_wallet.encrypted.reminder')}
                        </Text>
                        <View style={styles.encryptedTextContainer}>
                            <Text selectable style={styles.encryptedText}>
                                {encryptedText}
                            </Text>
                        </View>
                        <CopyTag content={encryptedText} containerStyle={{alignSelf: 'flex-end'}} />
                        <Separator space={spacing.m} />
                        <Button title={t('new_wallet.encrypt_wallet.encrypted.button')} onPress={onDone} />
                    </>
                ) : (
                    <>
                        <Text variant="subheader">{t('new_wallet.encrypt_wallet.unencrypted.title')}</Text>
                        <Text variant="small" style={styles.info}>
                            {t('new_wallet.encrypt_wallet.unencrypted.reminder')}
                        </Text>
                        <TouchableOpacity>
                            <Text style={styles.learnMore}>{t('new_wallet.encrypt_wallet.unencrypted.learn_more')}</Text>
                        </TouchableOpacity>
                        <View style={styles.mnemonicContainer}>
                            <Text variant="small" style={styles.mnemonic}>
                                {props.passphrase}
                            </Text>
                        </View>

                        <Separator space={spacing.l} />
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>{t('new_wallet.encrypt_wallet.unencrypted.password')}</Text>
                            {password.length > 0 && (
                                <Text style={[styles.strength, {color: PASSWORD_STRENGTH_COLORS[passwordStrength]}]}>
                                    {passwordStrengthText}
                                </Text>
                            )}
                        </View>
                        <View
                            style={[
                                styles.textInputContainer,
                                passwordIncorrect && {borderColor: theme.colors.warning},
                                passwordsCorrect && {borderColor: theme.colors.success},
                            ]}>
                            <BottomSheetTextInput
                                placeholder={t('new_wallet.encrypt_wallet.unencrypted.password_placeholder')}
                                placeholderTextColor={theme.colors.textTertiary}
                                style={styles.textInput}
                                returnKeyType="next"
                                autoCapitalize="none"
                                secureTextEntry
                                onChangeText={setPassword}
                            />
                        </View>
                        <Separator space={spacing.m} />
                        <Text style={styles.label}>{t('new_wallet.encrypt_wallet.unencrypted.confirm_password')}</Text>
                        <View
                            style={[
                                styles.textInputContainer,
                                passwordIncorrect && {borderColor: theme.colors.warning},
                                passwordsCorrect && {borderColor: theme.colors.success},
                            ]}>
                            <BottomSheetTextInput
                                placeholder={t('new_wallet.encrypt_wallet.unencrypted.confirm_password_placeholder')}
                                placeholderTextColor={theme.colors.textTertiary}
                                style={styles.textInput}
                                returnKeyType="done"
                                autoCapitalize="none"
                                secureTextEntry
                                onChangeText={setConfirmPassword}
                            />
                        </View>

                        <Separator space={spacing.l} />
                        <Button title={t('new_wallet.encrypt_wallet.unencrypted.button')} onPress={onEncrypt} disabled={!passwordsCorrect} />
                    </>
                )}
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        modal: {
            backgroundColor: theme.colors.modalBackground,
        },
        indicator: {
            backgroundColor: theme.colors.modalIndicator,
        },
        flex: {
            flex: 1,
        },
        container: {
            padding: spacing.th,
            marginBottom: 200,
            paddingBottom: 200,
        },
        info: {
            color: theme.colors.textSecondary,
            marginTop: spacing.s,
            fontSize: 14,
        },
        warning: {
            color: theme.colors.warning,
            marginTop: spacing.s,
            fontSize: 14,
        },
        mnemonicContainer: {
            padding: spacing.l,
            marginTop: spacing.m,
            borderWidth: 0.5,
            borderColor: theme.colors.border,
        },
        mnemonic: {
            lineHeight: 24,
            color: theme.colors.textPrimary,
            fontSize: 16,
        },
        labelContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        strength: {
            fontSize: 12,
            marginRight: spacing.s,
        },
        label: {
            marginLeft: spacing.s,
        },
        textInputContainer: {
            ...theme.cardVariants.simple,
            borderRadius: rounded.l,
            marginTop: spacing.xs,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        textInput: {
            ...theme.textVariants.body,
            padding: spacing.l,
        },
        encryptedTextContainer: {
            padding: spacing.l,
            borderRadius: rounded.l,
            backgroundColor: theme.colors.cardBackground,
            marginTop: spacing.m,
            borderWidth: 0.5,
            borderColor: theme.colors.border,
        },
        encryptedText: {
            color: theme.colors.textSecondary,
        },
        actionButton: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacing.m,
            borderRadius: rounded.full,
            backgroundColor: theme.colors.tag,
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.m,
            borderWidth: 0.5,
            borderColor: theme.colors.border,
            alignSelf: 'flex-end',
        },
        actionIcon: {
            fontSize: 18,
            marginRight: spacing.xs,
        },
        learnMore: {
            color: theme.colors.success,
            textDecorationLine: 'underline',
            fontSize: 12,
            marginTop: spacing.s,
        },
    });

export default React.forwardRef(EncryptModal);
