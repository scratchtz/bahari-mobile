import React, {createRef, useCallback, useEffect, useMemo, useRef, useState} from 'react';
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
import {StyleSheet, View, TextInput as NativeTextInput, Keyboard, TouchableOpacity} from 'react-native';
import TextInput from '@components/TextInput/TextInput';
import Separator from '@components/Separator/Separator';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {useBottomSheetBackHandler} from '@hooks/hooksbottomsheet/useBottomSheetBackHandler';
import {KeyPair, MnemonicPathKinds, Wallet} from '@utils/types';
import Loading from '@components/Animation/Loading';
import {useDebounce} from '@hooks/useDebounce';
import {CommonActions} from '@react-navigation/native';
import {generateWalletFromMnemonic} from '@utils/helper/wallet';
import {checkAddressValidity} from '@utils/helper/address';
import {encryptedGetFromJson} from '@storage/mmkv';
import {storageKeyKeyPair} from '@constants/storage';
import {persistWallet, setDefaultKeyPairAddress} from '@storage/wallet';
import SendGlobe from '@components/SendGlobe/SendGlobe';
import {modalOpacity} from '@constants/variables';
import {useTranslation} from 'react-i18next';

interface GenWallet {
    wallet: Wallet;
    firstKeyPair: KeyPair;
}
const ImportPassphrase: React.FC<RootStackScreenProps<'ImportPassphrase'>> = ({navigation, route}) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const {t} = useTranslation();

    const {debounce} = useDebounce();

    const [passphrase, setPassphrase] = useState(
        route && route.params && route.params.passphrase ? route.params.passphrase : '',
    );
    const [label, setLabel] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const [isNotFound, setIsNotFound] = useState(false);
    const [generatedWallets, setGeneratedWallets] = useState<GenWallet[]>([]);

    const labelInputRef = createRef<NativeTextInput>();
    const keyInputRef = createRef<NativeTextInput>();

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const {handleSheetPositionChange} = useBottomSheetBackHandler(bottomSheetRef);

    const openSheet = useCallback(() => {
        bottomSheetRef.current?.present();
    }, []);

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
            setPassphrase(await Clipboard.getStringAsync());
            Keyboard.dismiss();
        }
    };

    const onImport = async () => {
        try {
            if (!label) {
                ToastController.show({kind: 'error', content: `${t('import_wallet.passphrase.errors.no_name')}`});
                labelInputRef.current?.focus();
                return;
            }
            const mnemonicSplit = passphrase.trim().split(' ');
            if (mnemonicSplit.length < 12) {
                ToastController.show({kind: 'error', content: `${t('import_wallet.passphrase.errors.incorrect')}`})
                return;
            }
            setIsImporting(true);
            void importPassphrase();
        } catch (e: any) {
            setIsImporting(false);
            ToastController.show({kind: 'error', content: `${t('import_wallet.passphrase.errors.unknown')}\n${e.toString()}`, timeout: 6000});
        } finally {
            setIsImporting(false);
        }
    };

    const importPassphrase = async () => {
        openSheet();
        let generatedWallets: GenWallet[] = [];
        let found = false;
        for (const kind of MnemonicPathKinds) {
            try {
                const [wallet, firstKeyPair] = generateWalletFromMnemonic(passphrase.trim(), kind, label);
                const myKey = encryptedGetFromJson<KeyPair>(storageKeyKeyPair(firstKeyPair.address));
                if (myKey && myKey.address) {
                    ToastController.show({kind: 'error', content: `${t('import_wallet.passphrase.errors.exists')}`});
                    return;
                }
                generatedWallets.push({wallet, firstKeyPair});
                const isValid = await checkAddressValidity(firstKeyPair.address);
                if (isValid) {
                    found = true;
                    pickWallet(wallet, firstKeyPair);
                    return;
                }
            } catch (error) {
                console.warn(error);
            }
        }
        setIsNotFound(!found);
        setGeneratedWallets(generatedWallets);
    };

    const pickWallet = (wallet: Wallet, firstKeyPair: KeyPair) => {
        bottomSheetRef.current?.close();

        persistWallet(wallet, firstKeyPair);
        setDefaultKeyPairAddress(firstKeyPair.address);
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
            <ScrollView keyboardDismissMode={'interactive'} contentContainerStyle={styles.container}>
                <Text style={styles.label}>{t('import_wallet.passphrase.label')}</Text>
                <Separator space={spacing.s} />
                <TextInput ref={labelInputRef} placeholder={t('import_wallet.passphrase.label_placeholder')} value={label} onChangeText={setLabel} />

                <Separator space={spacing.xl} />
                <View style={styles.hor}>
                    <View style={styles.labelInfo}>
                        <Text style={styles.label}>{t('import_wallet.passphrase.title')}</Text>
                        <Text style={styles.info}>{t('import_wallet.passphrase.description')}</Text>
                    </View>
                    <ButtonTiny
                        icon={<FontAwesome name="paste" style={styles.pasteIcon} />}
                        title={t('import_wallet.passphrase.paste')}
                        onPress={onPaste}
                    />
                </View>
                <TextInput
                    ref={keyInputRef}
                    value={passphrase}
                    placeholder={t('import_wallet.passphrase.placeholder')}
                    placeholderTextColor={theme.colors.textTertiary}
                    multiline={true}
                    onChangeText={setPassphrase}
                    containerStyle={styles.inputContainer}
                    textStyle={styles.textInput}
                />
                <Button
                    title={t('import_wallet.passphrase.button')}
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
                    {!isNotFound && generatedWallets.length === 0 && (
                        <Text>{t('import_wallet.passphrase.errors.not_found')}</Text>
                    )}
                    {isImporting && (
                        <View style={styles.importingWrap}>
                            <SendGlobe size={180} color={theme.colors.primary} />
                            <Text variant="subheader">{t('import_wallet.passphrase.importing')}</Text>
                        </View>
                    )}
                    {isNotFound && generatedWallets.length > 0 && (
                        <Text style={styles.pickText} weight={'600'}>
                            {t('import_wallet.passphrase.errors.not_identified')}
                        </Text>
                    )}
                    {isNotFound &&
                        generatedWallets.map(item => (
                            <TouchableOpacity
                                key={item.wallet.id}
                                style={styles.pickWallet}
                                onPress={() => {
                                    pickWallet(item.wallet, item.firstKeyPair);
                                }}>
                                <Text style={styles.pickAddress}>{item.firstKeyPair.address}</Text>
                            </TouchableOpacity>
                        ))}
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
        labelInfo: {
            flex: 1,
            marginRight: spacing.m,
        },
        pasteIcon: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        inputContainer: {
            ...theme.cardVariants.simple,
            borderRadius: rounded.l,
            paddingVertical: spacing.m,
            marginTop: spacing.m,
        },
        textInput: {
            ...theme.textVariants.body,
            padding: spacing.l,
            minHeight: 120,
            textAlignVertical: 'top',
        },
        importButton: {
            marginTop: spacing.xl,
        },
        label: {
            marginLeft: spacing.xs,
            color: theme.colors.textPrimary,
        },
        info: {
            marginLeft: spacing.xs,
            color: theme.colors.textSecondary,
            marginTop: spacing.xs,
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
        importingWrap: {
            alignItems: 'center',
        },
        sheetButton: {
            flex: 1,
        },
        importingContainer: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        pickText: {},
        pickAddress: {},
        pickWallet: {
            ...theme.cardVariants.simple,
            padding: spacing.m,
            marginTop: spacing.l,
            borderRadius: rounded.m,
        },
    });

export default ImportPassphrase;
