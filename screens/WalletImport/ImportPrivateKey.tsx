import React, {createRef, useCallback, useMemo, useRef, useState} from 'react';
import {rounded, spacing} from '@utils/styles';

import {AppTheme} from '@utils/styles/theme';
import Text from '@components/Text/Text';
import {RootStackScreenProps} from '@navigation/types';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {ScrollView} from 'react-native-gesture-handler';
import ButtonTiny from '@components/Button/ButtonTiny';
import {FontAwesome} from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import Button from '@components/Button/Button';
import {ToastController} from '@components/Toast/Toast';
import {newKeyPairFromHexSecretKey} from '@utils/helper/wallet';
import {getKeyPair, getWallet, persistAppendKeyPair, persistWallet, setDefaultKeyPairAddress} from '@storage/wallet';
import {checkAddressValidity} from '@utils/helper/address';
import {StyleSheet, View, TextInput as NativeTextInput, Keyboard, Platform} from 'react-native';
import TextInput from '@components/TextInput/TextInput';
import Separator from '@components/Separator/Separator';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {useBottomSheetBackHandler} from '@hooks/hooksbottomsheet/useBottomSheetBackHandler';
import {KeyPair} from '@utils/types';
import {KEY_IMPORTED_PRIVATE_KEYS} from '@constants/others';
import Loading from '@components/Animation/Loading';
import {useDebounce} from '@hooks/useDebounce';
import {CommonActions} from '@react-navigation/native';
import {modalOpacity} from '@constants/variables';
import {useTranslation} from 'react-i18next';

const ImportPrivateKey: React.FC<RootStackScreenProps<'ImportPrivateKey'>> = ({navigation, route}) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const {t} = useTranslation();

    const importWalletID =
        route && route.params && route.params.walletID ? route.params.walletID : KEY_IMPORTED_PRIVATE_KEYS;

    const {debounce} = useDebounce();

    const [privateKey, setPrivateKey] = useState('');
    const [label, setLabel] = useState('');
    const [isImporting, setIsImporting] = useState(false);

    const [keyPair, setKeyPair] = useState<KeyPair | undefined>(undefined);

    const labelInputRef = createRef<NativeTextInput>();
    const keyInputRef = createRef<NativeTextInput>();

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const {handleSheetPositionChange} = useBottomSheetBackHandler(bottomSheetRef);

    const snapPoints = useMemo(() => ['45%', '94%'], []);
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} opacity={modalOpacity} disappearsOnIndex={-1} appearsOnIndex={0} />
        ),
        [],
    );

    const onPaste = async () => {
        const hasString = await Clipboard.hasStringAsync();
        if (hasString) {
            setPrivateKey(await Clipboard.getStringAsync());
            Keyboard.dismiss();
        }
    };

    const onImport = async () => {
        try {
            if (!label) {
                ToastController.show({kind: 'error', content: `${t('settings.wallet.import_wallet.private_key.errors.no_name')}`});
                labelInputRef.current?.focus();
                return;
            }
            if (privateKey.length !== 64) {
                ToastController.show({kind: 'error', content: `${t('settings.wallet.import_wallet.private_key.errors.invalid')}`});
                keyInputRef.current?.focus();
                setIsImporting(false);
                return;
            }
            setIsImporting(true);
            const {publicKey, address} = newKeyPairFromHexSecretKey(privateKey);
            //checking if already exists
            const myKey = getKeyPair(address);
            if (myKey && myKey.address) {
                setIsImporting(false);
                ToastController.show({kind: 'error', content: `${t('settings.wallet.import_wallet.private_key.errors.exists')}`});
                return;
            }

            const kp: KeyPair = {
                address,
                walletID: importWalletID,
                label,
                publicKey,
                privateKey,
                accountIndex: 0,
            };

            setKeyPair(kp);
            //checking if address is valid
            const isValid = await checkAddressValidity(address);
            if (!isValid) {
                setIsImporting(false);
                bottomSheetRef.current?.present();
                return;
            }

            setIsImporting(false);
            onPersist(kp);
        } catch (e: any) {
            setIsImporting(false);
            ToastController.show({kind: 'error', content: `${t('settings.wallet.import_wallet.private_key.errors.unknown')}\n${e.toString()}`, timeout: 6000});
        }
    };

    const onImportVerified = () => {
        if (!keyPair) return;
        onPersist(keyPair);
    };

    const onPersist = (kp: KeyPair) => {
        kp.walletID = importWalletID;
        let w = getWallet(importWalletID);
        if (!w) {
            w = {
                id: importWalletID,
                label: `${t('settings.wallet.import_wallet.private_key.imported')}`,
                kind: 'key-only',
                keyPairsAddresses: [kp.address],
                lastAccountIndex: 0,
            };
            persistWallet(w, kp);
            resetToMain();
            return;
        }
        persistAppendKeyPair(kp);
        setDefaultKeyPairAddress(kp.address);
        resetToMain();
    };

    const resetToMain = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [{name: 'Main'}],
            }),
        );
    };

    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.label}>{t('settings.wallet.import_wallet.private_key.label')}</Text>
                <Separator space={spacing.s} />
                <TextInput ref={labelInputRef} placeholder={t('settings.wallet.import_wallet.private_key.label_placeholder')} value={label} onChangeText={setLabel} />

                <Separator space={spacing.l} />
                <View style={styles.hor}>
                    <Text style={styles.label}>{t('settings.wallet.import_wallet.private_key.title')}</Text>
                    <ButtonTiny
                        icon={<FontAwesome name="paste" style={styles.pasteIcon} />}
                        title={t('settings.wallet.import_wallet.private_key.paste')}
                        onPress={onPaste}
                    />
                </View>
                <TextInput
                    ref={keyInputRef}
                    value={privateKey}
                    placeholder={t('settings.wallet.import_wallet.private_key.placeholder')}
                    placeholderTextColor={theme.colors.textTertiary}
                    multiline={true}
                    onChangeText={setPrivateKey}
                    containerStyle={styles.inputContainer}
                    textStyle={styles.textInput}
                />
                <Button
                    title={t('settings.wallet.import_wallet.private_key.button.import')}
                    leftChild={
                        isImporting ? (
                            <View style={{position: 'absolute', left: spacing.th}}>
                                <Loading size={24} loop={true} />
                            </View>
                        ) : null
                    }
                    onPress={() => debounce(onImport)}
                    containerStyle={styles.importButton}
                />
            </ScrollView>
            <BottomSheetModal
                enablePanDownToClose
                backgroundStyle={styles.bottomSheetContainer}
                handleIndicatorStyle={styles.bottomSheetIndicator}
                ref={bottomSheetRef}
                onChange={handleSheetPositionChange}
                backdropComponent={renderBackdrop}
                snapPoints={snapPoints}>
                <View style={styles.sheetInnerContainer}>
                    <Text style={styles.sheetAddressTitle}>{t('settings.wallet.import_wallet.private_key.address')}</Text>
                    <View style={styles.sheetAddressContainer}>
                        <Text style={styles.sheetAddress}>{keyPair?.address}</Text>
                    </View>

                    <Text style={styles.sheetWarning}>
                        {t('settings.wallet.import_wallet.private_key.errors.wrong_address')}
                    </Text>

                    <View style={styles.sheetButtonsContainer}>
                        <Button
                            title={t('settings.wallet.import_wallet.private_key.button.cancel')}
                            variant={'secondary'}
                            onPress={() => {
                                bottomSheetRef.current?.close();
                            }}
                            containerStyle={[styles.sheetButton, {marginRight: spacing.m}]}
                        />
                        <Button
                            title={t('settings.wallet.import_wallet.private_key.button.accept')}
                            variant={'primary'}
                            onPress={onImportVerified}
                            containerStyle={styles.sheetButton}
                        />
                    </View>
                </View>
            </BottomSheetModal>
        </>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            marginHorizontal: spacing.th,
            marginTop: spacing.l,
            marginBottom: spacing.xxl,
            paddingBottom: spacing.xxl,
        },
        hor: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: spacing.s,
        },
        pasteIcon: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        inputContainer: {
            ...theme.cardVariants.simple,
            borderRadius: rounded.l,
            paddingVertical: Platform.select({android: 0, ios: spacing.s}),
        },
        textInput: {
            ...theme.textVariants.body,
            minHeight: 120,
            // padding: spacing.l,
            textAlignVertical: 'top',
        },
        importButton: {
            marginTop: spacing.xl,
        },
        label: {
            marginLeft: spacing.xs,
            color: theme.colors.textSecondary,
        },
        bottomSheetContainer: {
            backgroundColor: theme.colors.modalBackground,
        },
        bottomSheetIndicator: {
            backgroundColor: theme.colors.modalIndicator,
        },
        sheetInnerContainer: {
            marginHorizontal: spacing.th,
        },
        sheetAddressTitle: {
            color: theme.colors.textSecondary,
            marginLeft: spacing.s,
        },
        sheetAddressContainer: {
            ...theme.cardVariants.simple,
            padding: spacing.m,
            borderRadius: rounded.l,
            marginTop: spacing.m,
        },
        sheetAddress: {
            color: theme.colors.textPrimary,
            fontSize: 16,
        },
        sheetWarning: {
            marginTop: spacing.s,
            color: theme.colors.warning,
            textAlign: 'center',
        },
        sheetButtonsContainer: {
            flexDirection: 'row',
            marginTop: spacing.xl,
        },
        sheetButton: {
            flex: 1,
        },
        importingContainer: {
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

export default ImportPrivateKey;
