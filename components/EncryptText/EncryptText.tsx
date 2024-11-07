import React, {useMemo, useState} from 'react';
import {View, StyleSheet, Keyboard} from 'react-native';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {AppTheme, rounded, spacing, PASSWORD_STRENGTH_COLORS} from '@utils/styles';
import Text from '@components/Text/Text';
import Separator from '@components/Separator/Separator';
import Button from '@components/Button/Button';
import {passwordStrength as strengthChecker} from 'check-password-strength';
import aes256 from '@utils/helper/aes256';
import CopyTag from '@components/Tag/CopyTag';
import {ToastController} from '@components/Toast/Toast';
import BottomSheetTextInput from '@components/TextInput/BottomSheetTextInput';
import {useTranslation} from 'react-i18next';

/*
Using this one instead of modal inside modals because a modal inside a modal breaks text input
* */
interface Props {
    passphrase?: string;
    onCancel?: () => void;
    onDone?: () => void;
}

const MINIMUM_LENGTH = 8;

const EncryptText = (props: Props) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [encryptedText, setEncryptedText] = useState('');

    const {t} = useTranslation();

    const passwordStrength = useMemo(() => strengthChecker(password).id as 0 | 1 | 2 | 3, [password]);
    const passwordStrengthText = useMemo(() => {
        switch (passwordStrength) {
            case 0:
                return `${t('encrypt_text.strength_too_weak')}`;
            case 1:
                return `${t('encrypt_text.strength_weak')}`;
            case 2:
                return `${t('encrypt_text.strength_medium')}`;
            case 3:
                return `${t('encrypt_text.strength_strong')}`;
        }
    }, [passwordStrength]);

    const onEncrypt = () => {
        if (password.length < MINIMUM_LENGTH) {
            ToastController.show({kind: 'error', content: `${t('encrypt_text.error_short_password')}`});
            return;
        }
        if (password !== confirmPassword) {
            ToastController.show({kind: 'error', content: `${t('encrypt_text.error_password_not_match')}`});
            return;
        }
        if (!props.passphrase) {
            ToastController.show({kind: 'error', title: 'Error', content: `${t('encrypt_text.error_passphrase_not_available')}`});
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

    return (
        <View style={styles.container}>
            {encryptedText ? (
                <>
                    <Text style={styles.info}>{t('encrypt_text.store')}</Text>
                    <Text style={styles.warning} weight="500">
                        {t('encrypt_text.disclaimer')}
                    </Text>
                    <View style={styles.encryptedTextContainer}>
                        <Text selectable style={styles.encryptedText}>
                            {encryptedText}
                        </Text>
                    </View>
                    <Separator space={spacing.m} />
                    <CopyTag content={encryptedText} containerStyle={{alignSelf: 'flex-end'}} />
                    <Separator space={spacing.m} />
                </>
            ) : (
                <>
                    <Separator space={spacing.m} />
                    <Text style={styles.info}>{t('encrypt_text.enter_password')}</Text>
                    <Separator space={spacing.m} />
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>{t('encrypt_text.password_label')}</Text>
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
                            placeholder={t('encrypt_text.password_placeholder')}
                            placeholderTextColor={theme.colors.textTertiary}
                            style={styles.textInput}
                            returnKeyType="next"
                            autoCapitalize="none"
                            secureTextEntry
                            onChangeText={setPassword}
                        />
                    </View>
                    <Separator space={spacing.m} />
                    <Text style={styles.label}>{t('encrypt_text.confirm_password_label')}</Text>
                    <View
                        style={[
                            styles.textInputContainer,
                            passwordIncorrect && {borderColor: theme.colors.warning},
                            passwordsCorrect && {borderColor: theme.colors.success},
                        ]}>
                        <BottomSheetTextInput
                            placeholder={t('encrypt_text.confirm_password_placeholder')}
                            placeholderTextColor={theme.colors.textTertiary}
                            style={styles.textInput}
                            returnKeyType="done"
                            autoCapitalize="none"
                            secureTextEntry
                            onChangeText={setConfirmPassword}
                        />
                    </View>

                    <Separator space={spacing.l} />
                    <Button title={t('encrypt_text.button_encrypt')} onPress={onEncrypt} disabled={!passwordsCorrect} />
                </>
            )}
        </View>
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
        container: {},
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

export default EncryptText;
