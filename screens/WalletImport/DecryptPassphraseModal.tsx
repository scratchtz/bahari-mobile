import React, {useCallback, useMemo, useState} from 'react';
import {View, StyleSheet, Keyboard, Platform} from 'react-native';
import {useBottomSheetBackHandler} from '@hooks/hooksbottomsheet/useBottomSheetBackHandler';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {AppTheme, rounded, spacing} from '@utils/styles';
import Text from '@components/Text/Text';
import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import Separator from '@components/Separator/Separator';
import Button from '@components/Button/Button';
import aes256 from '@utils/helper/aes256';
import {ToastController} from '@components/Toast/Toast';
import * as Clipboard from 'expo-clipboard';
import ButtonTiny from '@components/Button/ButtonTiny';
import {FontAwesome} from '@expo/vector-icons';
import BottomSheetTextInput from '@components/TextInput/BottomSheetTextInput';
import {modalOpacity} from '@constants/variables';
import {useTranslation} from 'react-i18next';

interface Props {
    onDecryption: (mnemonic: string) => void;
}

const DecryptPassphraseModal = (props: Props, ref: any) => {
    const {handleSheetPositionChange} = useBottomSheetBackHandler(ref);

    const [password, setPassword] = useState('');
    const [encryptedText, setEncryptedText] = useState('');
    const [decryptedText, setDecryptedText] = useState('');

    const {t} = useTranslation();

    const snapPoints = useMemo(() => ['80%', '92%'], []);
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} opacity={modalOpacity} disappearsOnIndex={-1} appearsOnIndex={0} />
        ),
        [],
    );

    const onProceed = () => {};

    const onPaste = async () => {
        const hasString = await Clipboard.hasStringAsync();
        if (hasString) {
            setEncryptedText(await Clipboard.getStringAsync());
            Keyboard.dismiss();
        }
    };
    const onDecrypt = () => {
        if (!password) {
            ToastController.show({kind: 'error', title: 'Error', content: `${t('import_wallet.decrypt_passphrase.errors.no_password')}`});
            return;
        }
        if (!encryptedText) {
            ToastController.show({kind: 'error', title: 'Error', content: `${t('import_wallet.decrypt_passphrase.errors.no_encrypted_text')}`});
            return;
        }
        try {
            const mnemonic = aes256.decryptText(password, encryptedText);
            const words = mnemonic.trim().split(' ');
            if (words.length < 12) {
                ToastController.show({
                    title: 'Error',
                    content: `${t('import_wallet.decrypt_passphrase.errors.failed')}`,
                    timeout: 6000,
                    kind: 'error',
                });
                return;
            }
            ref.current.close();
            props.onDecryption(mnemonic);
        } catch (e: any) {
            ToastController.show({title: 'Error', content: e.toString(), kind: 'error'});
        }
    };

    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    return (
        <BottomSheetModal
            enablePanDownToClose
            android_keyboardInputMode={'adjustResize'}
            backgroundStyle={styles.modal}
            handleIndicatorStyle={styles.indicator}
            ref={ref}
            onChange={handleSheetPositionChange}
            backdropComponent={renderBackdrop}
            snapPoints={snapPoints}>
            <BottomSheetScrollView
                keyboardDismissMode="on-drag"
                automaticallyAdjustKeyboardInsets
                style={styles.flex}
                contentContainerStyle={styles.container}>
                <Separator space={spacing.l} />
                {decryptedText ? (
                    <>
                        <Text variant="subheader">{t('import_wallet.decrypt_passphrase.your_passphrase')}</Text>
                        <View style={styles.encryptedTextContainer}>
                            <Text selectable style={styles.encryptedText}>
                                {decryptedText}
                            </Text>
                        </View>

                        <Separator space={spacing.m} />
                        <Button title="Proceed" onPress={onProceed} />
                    </>
                ) : (
                    <>
                        <Text variant="subheader">{t('import_wallet.decrypt_passphrase.import')}</Text>
                        <Separator space={spacing.l} />
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>{t('import_wallet.decrypt_passphrase.password')}</Text>
                        </View>
                        <View style={[styles.textInputContainer]}>
                            <BottomSheetTextInput
                                placeholder={t('import_wallet.decrypt_passphrase.password_placeholder')}
                                placeholderTextColor={theme.colors.textTertiary}
                                style={styles.textInput}
                                returnKeyType="next"
                                autoCapitalize="none"
                                secureTextEntry
                                onChangeText={setPassword}
                            />
                        </View>
                        <Separator space={spacing.l} />
                        <View style={styles.hor}>
                            <Text style={styles.label}>{t('import_wallet.decrypt_passphrase.encrypted_text')}</Text>
                            <ButtonTiny
                                icon={<FontAwesome name="paste" style={styles.pasteIcon} />}
                                title={t('import_wallet.decrypt_passphrase.paste')}
                                onPress={onPaste}
                            />
                        </View>
                        <Separator space={spacing.s} />
                        <View style={[styles.textInputContainer]}>
                            <BottomSheetTextInput
                                placeholder={t('import_wallet.decrypt_passphrase.encrypted_text_placeholder')}
                                multiline={true}
                                placeholderTextColor={theme.colors.textTertiary}
                                returnKeyType="next"
                                autoCapitalize="none"
                                secureTextEntry
                                onChangeText={setEncryptedText}
                                textStyle={styles.encryptedTextInput}
                            />
                        </View>

                        <Separator space={spacing.l} />
                        <Button
                            title={t('import_wallet.decrypt_passphrase.button')}
                            onPress={onDecrypt}
                            disabled={password.length === 0 || encryptedText.length === 0}
                        />
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
        hor: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        label: {
            marginLeft: spacing.s,
            flex: 1,
        },
        pasteIcon: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        textInputContainer: {},
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
            paddingVertical: Platform.select({ios: spacing.m, android: 0}),
        },
        encryptedText: {
            color: theme.colors.textSecondary,
        },
        encryptedTextInput: {
            ...theme.textVariants.body,
            color: theme.colors.textPrimary,
            textAlignVertical: 'top',
            minHeight: 120,
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

export default React.forwardRef(DecryptPassphraseModal);
