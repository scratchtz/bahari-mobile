import React, {useEffect, useRef, useState} from 'react';
import {palette, rounded, size, spacing} from '@utils/styles';

import {AppTheme} from '@utils/styles/theme';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import Text from '@components/Text/Text';
import {RootStackScreenProps} from '@navigation/types';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {generateNewMnemonicWallet} from '@utils/helper/wallet';
import {KeyPair, Wallet} from '@utils/types';
import Button from '@components/Button/Button';
import Separator from '@components/Separator/Separator';
import {Ionicons, MaterialIcons, Foundation} from '@expo/vector-icons';
import Lottie from 'lottie-react-native';
import WordListPickerModal, {WordListPick} from './WordListPickerModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {Wordlists} from '@dreson4/react-native-quick-bip39';
import EncryptModal from './EncryptModal';
import {isTablet} from 'react-native-device-info';
import {Fontisto, Entypo, MaterialCommunityIcons} from '@expo/vector-icons';
import Tag from '@components/Tag/Tag';
import CopyTag from '@components/Tag/CopyTag';
import {persistWallet, setDefaultKeyPairAddress} from '@storage/wallet';
import {CommonActions} from '@react-navigation/native';
import {hitSlop} from '@constants/variables';
import {useTranslation} from 'react-i18next';
export type WalletNewMode = 'onboard' | 'passphrase';

const WalletNew: React.FC<RootStackScreenProps<'WalletNew'>> = ({navigation, route}) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const {t} = useTranslation();

    const [mode, setMode] = useState<WalletNewMode>(
        route && route.params.walletMode ? route.params.walletMode : 'onboard',
    );

    const [wallet, setWallet] = useState<Wallet | undefined>(undefined);
    const [firstKeyPair, setFirstKeyPair] = useState<KeyPair | undefined>(undefined);
    const [isGenerating, setIsGenerating] = useState(false);

    const wordListPickerModal = useRef<BottomSheetModal>(null);
    const [wordListPick, setWordListPick] = useState<WordListPick>({label: 'English', value: 'en'});
    const wordList = useRef<string[]>(Wordlists.en);
    const strength = useRef<128 | 256>(128);

    const encryptModal = useRef<BottomSheetModal>(null);

    const onDone = () => {
        if (!wallet || !firstKeyPair) return;
        persistWallet(wallet, firstKeyPair);
        setDefaultKeyPairAddress(firstKeyPair.address);
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [{name: 'Main'}],
            }),
        );
    };

    useEffect(() => {
        if (mode === 'passphrase') {
            onRegenerate();
        }
    }, [mode]);

    const onUnderstand = () => {
        setMode('passphrase');
    };

    const onRegenerate = () => {
        setIsGenerating(true);

        const [wallet, firstKeyPair] = generateNewMnemonicWallet('4lv', wordList.current, strength.current);
        setWallet(wallet);
        setFirstKeyPair(firstKeyPair);

        setTimeout(() => {
            setIsGenerating(false);
        }, 600);
    };

    const onChangeStrength = (ns: 128 | 256) => {
        if (strength.current === ns) return;
        strength.current = ns;
        onRegenerate();
    };

    const openWordListPicker = () => {
        wordListPickerModal.current?.present();
    };

    const onWordListPick = (pick: WordListPick) => {
        if (pick.value === wordListPick.value) {
            return;
        }
        setWordListPick(pick);
        wordList.current = Wordlists[pick.value];
        onRegenerate();
    };

    const openEncryptModal = () => {
        encryptModal.current?.present();
    };

    return (
        <>
            <ScrollView contentContainerStyle={[styles.container, isTablet() && styles.containerTablet]}>
                {mode === 'onboard' && (
                    <>
                        <Text variant="header">{t('settings.wallet.new_wallet.onboard.title')}</Text>
                        <Text>{t('settings.wallet.new_wallet.onboard.generate')}</Text>
                        <Separator space={spacing.l} />

                        <Text variant="subheader">{t('settings.wallet.new_wallet.onboard.remember')}</Text>

                        <View style={styles.noteContainer}>
                            <Text style={styles.note}>{t('settings.wallet.new_wallet.onboard.funds_access')}</Text>
                            <View style={[styles.noteIconContainer]}>
                                <Fontisto name="persons" style={styles.noteIcon} />
                            </View>
                        </View>
                        <View style={styles.noteContainer}>
                            <Text style={styles.note}>{t('settings.wallet.new_wallet.onboard.keep_safe')}</Text>
                            <View style={[styles.noteIconContainer]}>
                                <Entypo name="shield" style={styles.noteIcon} />
                            </View>
                        </View>
                        <View style={styles.noteContainer}>
                            <Text style={styles.note}>
                                {t('settings.wallet.new_wallet.onboard.never_ask')}
                            </Text>
                            <View style={[styles.noteIconContainer]}>
                                <MaterialCommunityIcons name="message-lock" style={styles.noteIcon} />
                            </View>
                        </View>
                        <View style={styles.noteContainer}>
                            <Text style={styles.note}>
                                {t('settings.wallet.new_wallet.onboard.passphrase_lost')}
                            </Text>
                            <View style={[styles.noteIconContainer]}>
                                <MaterialCommunityIcons name="briefcase-search" style={styles.noteIcon} />
                            </View>
                        </View>
                        <TouchableOpacity style={styles.learnMoreButton}>
                            <Text weight="500" style={styles.learnMore}>
                                {t('settings.wallet.new_wallet.onboard.learn_more')}
                            </Text>
                        </TouchableOpacity>
                        <Separator space={spacing.xl} />
                        <Button variant="secondary" title={t('settings.wallet.new_wallet.onboard.button')} onPress={onUnderstand} />
                    </>
                )}

                {mode === 'passphrase' && (
                    <>
                        <Text variant="subheader">{t('settings.wallet.new_wallet.passphrase.title')}</Text>
                        <Text variant="small">{t('settings.wallet.new_wallet.passphrase.for_you')}</Text>

                        <View style={styles.topBar}>
                            <TouchableOpacity
                                style={styles.strengthTag}
                                onPress={() => {
                                    onChangeStrength(128);
                                }}>
                                <Text variant="small" weight={'600'} style={styles.strength}>
                                    12
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.strengthTag}
                                onPress={() => {
                                    onChangeStrength(256);
                                }}>
                                <Text variant="small" weight={'600'} style={styles.strength}>
                                    24
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.wordListContainer}
                                onPress={openWordListPicker}
                                hitSlop={hitSlop}>
                                <Entypo name="language" style={[styles.actionIcon, {color: palette.sky500}]} />
                                <Text variant="small" style={styles.language}>
                                    {wordListPick.label}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.mnemonicContainer}>
                            {isGenerating ? (
                                <>
                                    <Lottie
                                        style={styles.generatingAnimation}
                                        resizeMode="cover"
                                        source={require('@assets/animation/simple-loading.json')}
                                        autoPlay
                                        loop
                                    />
                                    <Text variant="small" style={styles.generatingText}>
                                        {t('settings.wallet.new_wallet.passphrase.generating')}
                                    </Text>
                                </>
                            ) : (
                                <Text weight="500" style={styles.mnemonic}>
                                    {wallet?.mnemonic}
                                </Text>
                            )}
                        </View>

                        <View style={styles.otherActionsContainer}>
                            <CopyTag content={wallet?.mnemonic || ''} />

                            <Tag
                                icon={
                                    <MaterialIcons
                                        name="enhanced-encryption"
                                        style={[styles.actionIcon, {color: palette.teal500}]}
                                    />
                                }
                                onPress={openEncryptModal}
                                title={t('settings.wallet.new_wallet.passphrase.encrypt')}
                            />
                            <Tag
                                icon={
                                    <Foundation
                                        name="refresh"
                                        style={[styles.actionIcon, {color: palette.purple600}]}
                                    />
                                }
                                title={t('settings.wallet.new_wallet.passphrase.regenerate')}
                                onPress={onRegenerate}
                            />

                            {/* <TouchableOpacity style={styles.actionButton} onPress={onRegenerate}>
                                <MaterialCommunityIcons
                                    name="image-edit"
                                    style={[styles.actionIcon, {color: palette.rose500}]}
                                />
                                <Text variant="small">Hide in image</Text>
                            </TouchableOpacity> */}
                        </View>

                        <Separator space={spacing.xl} />
                        <Button variant="primary" title={t('settings.wallet.new_wallet.passphrase.button')} onPress={onDone} />
                    </>
                )}
            </ScrollView>

            <WordListPickerModal ref={wordListPickerModal} onWordListPick={onWordListPick} />
            <EncryptModal ref={encryptModal} passphrase={wallet?.mnemonic} onSuccess={() => {}} />
        </>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            marginHorizontal: spacing.th,
            marginTop: spacing.th,
        },
        containerTablet: {
            width: size.tabletCut,
            alignSelf: 'center',
        },
        mnemonicContainer: {
            ...theme.cardVariants.simple,
            padding: isTablet() ? spacing.xl : spacing.l,
            borderRadius: rounded.xl,
            marginVertical: spacing.l,
            minHeight: 140,
            alignItems: 'center',
            justifyContent: 'center',
        },
        wordListContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        topBar: {
            alignSelf: 'flex-end',
            flexDirection: 'row',
            alignItems: 'center',
        },
        strengthTag: {
            ...theme.cardVariants.simple,
            backgroundColor: theme.colors.cardBackground,
            padding: spacing.s,
            borderRadius: rounded.full,
            marginRight: spacing.s,
        },
        strength: {
            fontSize: 11,
            color: theme.colors.textSecondary,
        },
        language: {
            color: theme.colors.textTertiary,
            alignSelf: 'flex-end',
            fontSize: 12,
        },
        mnemonic: {
            fontSize: 18,
            lineHeight: 34,
        },
        noteContainer: {
            borderBottomColor: theme.colors.border,
            borderBottomWidth: 1,
            paddingVertical: spacing.l,
            flexDirection: 'row',
            alignItems: 'center',
        },
        note: {
            color: theme.colors.textPrimary,
            flex: 1,
        },
        noteIconContainer: {
            padding: spacing.m,
            marginLeft: spacing.m,
        },
        noteIcon: {
            fontSize: 24,
            color: theme.colors.textTertiary,
        },
        otherActionsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: spacing.s,
        },
        actionButton: {
            ...theme.tag,
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacing.m,
            paddingHorizontal: spacing.l,
            paddingVertical: spacing.s,
            marginRight: spacing.m,
            borderWidth: 0.5,
            borderColor: theme.colors.border,
        },
        actionIcon: {
            fontSize: 18,
            marginRight: spacing.s,
            color: theme.colors.textSecondary,
        },
        learnMoreButton: {
            marginTop: spacing.l,
        },
        learnMore: {
            color: theme.colors.success,
            fontSize: 14,
            textDecorationLine: 'underline',
        },
        generatingAnimation: {
            height: 60,
            alignSelf: 'center',
        },
        generatingText: {
            fontSize: 14,
            color: theme.colors.textTertiary,
            marginTop: spacing.m,
        },
        warning: {
            color: theme.colors.textSecondary,
        },
        advancedTab: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            marginVertical: spacing.m,
        },
        advancedText: {
            fontSize: 12,
            color: theme.colors.textTertiary,
        },
        advancedChevron: {
            fontSize: 20,
            marginLeft: spacing.xs,
            color: theme.colors.textTertiary,
        },
    });

export default WalletNew;
