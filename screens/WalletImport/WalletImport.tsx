import React, {useMemo, useRef} from 'react';
import {rounded, size, spacing} from '@utils/styles';

import {AppTheme} from '@utils/styles/theme';
import {Dimensions, StyleSheet, View} from 'react-native';
import Text from '@components/Text/Text';
import {RootStackScreenProps} from '@navigation/types';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {ScrollView} from 'react-native-gesture-handler';
import {BottomSheetModal, TouchableOpacity} from '@gorhom/bottom-sheet';
import {FontAwesome5, MaterialCommunityIcons, MaterialIcons, Entypo} from '@expo/vector-icons';
import {Canvas, Rect, LinearGradient, vec} from '@shopify/react-native-skia';
import MaskedView from '@react-native-masked-view/masked-view';
import {isTablet} from 'react-native-device-info';
import DecryptPassphraseModal from './DecryptPassphraseModal';
import {Image} from 'expo-image';
import {useTranslation} from 'react-i18next';

const SAMPLE_WORDS = [
    'abandon',
    'ability',
    'able',
    'about',
    'above',
    'absent',
    'absorb',
    'abstract',
    'absurd',
    'abuse',
    'access',
    'accident',
];

const WalletImport = ({navigation}: RootStackScreenProps<'WalletImport'>) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);
    const {t} = useTranslation();

    const decryptPassphraseModal = useRef<BottomSheetModal>(null);

    const onEncryptedPassphrase = () => {
        decryptPassphraseModal.current?.present();
    };
    const onDecryptedPassphrase = (passphrase: string) => {
        decryptPassphraseModal.current?.close();
        navigation.navigate('ImportPassphrase', {passphrase});
    };

    const width = Dimensions.get('window').width;

    const maskGradient = useMemo(
        () =>
            theme.scheme === 'dark'
                ? [theme.colors.white, theme.colors.cardBackground]
                : [theme.colors.textSecondary, theme.colors.cardBackground],
        [theme.scheme],
    );

    return (
        <>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.container, isTablet() && styles.containerTablet]}>
                <Text style={styles.methodPick}>{t('import_wallet.title')}</Text>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => {
                        navigation.navigate('ImportPassphrase');
                    }}>
                    <View style={[styles.iconContainer, {backgroundColor: '#8c7ae6'}]}>
                        <MaterialCommunityIcons name="card-text-outline" style={styles.icon} color="white" />
                    </View>
                    <View style={styles.cardInner}>
                        <Text style={styles.cardTitle} weight="700">
                            {t('import_wallet.label_passphrase')}
                        </Text>
                        <Text style={styles.cardInfo}>{t('import_wallet.passphrase_desc')}</Text>

                        <MaskedView
                            maskElement={
                                <View style={styles.sampleWordsContainer}>
                                    {SAMPLE_WORDS.map((word, i) => {
                                        return (
                                            <Text weight="500" key={word} style={styles.sampleWord}>
                                                {i + 1}. {word}
                                            </Text>
                                        );
                                    })}
                                </View>
                            }>
                            <Canvas style={{width: width, height: 46}}>
                                <Rect x={0} y={0} width={width} height={50}>
                                    <LinearGradient start={vec(0, 0)} end={vec(0, 50)} colors={maskGradient} />
                                </Rect>
                            </Canvas>
                        </MaskedView>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.card} onPress={onEncryptedPassphrase}>
                    <View style={[styles.iconContainer, {backgroundColor: '#0097e6'}]}>
                        <MaterialIcons name="enhanced-encryption" style={styles.icon} color={'white'} />
                    </View>
                    <View style={styles.cardInner}>
                        <Text style={styles.cardTitle} weight="700">
                            {t('import_wallet.encrypted_passphrase')}
                        </Text>
                        <Text style={styles.cardInfo}>
                            {t('import_wallet.encrypted_passphrase_desc')}
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => {
                        navigation.navigate('ImportPrivateKey');
                    }}>
                    <View style={[styles.iconContainer, {backgroundColor: '#ff9f1a'}]}>
                        <FontAwesome5 name="key" style={styles.icon} color={'white'} />
                    </View>
                    <View style={styles.cardInner}>
                        <Text style={styles.cardTitle} weight="700">
                            {t('import_wallet.label_private_key')}
                        </Text>
                        <Text style={styles.cardInfo}>
                            {t('import_wallet.private_key_desc')}
                        </Text>
                    </View>
                </TouchableOpacity>

                {/*<TouchableOpacity*/}
                {/*    style={styles.card}*/}
                {/*    onPress={() => {*/}
                {/*        navigation.navigate('ImportLedger');*/}
                {/*    }}>*/}
                {/*    <View style={[styles.iconContainer, {backgroundColor: '#0fb9b1'}]}>*/}
                {/*        <Entypo name="wallet" style={styles.icon} color={'white'} />*/}
                {/*    </View>*/}
                {/*    <View style={styles.cardInner}>*/}
                {/*        <Text style={styles.cardTitle} weight="700">*/}
                {/*            Ledger Wallet*/}
                {/*        </Text>*/}
                {/*        <Text style={styles.cardInfo}>Import using ledger's hardware wallet.</Text>*/}
                {/*        <Image source={require('@assets/images/ledger-logo.png')} style={styles.ledgerLogo} />*/}
                {/*    </View>*/}
                {/*</TouchableOpacity>*/}
            </ScrollView>
            <DecryptPassphraseModal ref={decryptPassphraseModal} onDecryption={onDecryptedPassphrase} />
        </>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            marginHorizontal: spacing.th,
            marginBottom: spacing.xxl * 2,
            paddingBottom: spacing.xxl * 2,
        },
        containerTablet: {
            alignSelf: 'center',
            width: size.tabletCut,
        },
        methodPick: {
            marginTop: spacing.l,
            marginLeft: spacing.s,
        },
        card: {
            ...theme.cardVariants.simple,
            borderRadius: rounded.xl,
            marginTop: spacing.l,
            padding: spacing.l,
            flexDirection: 'row',
            alignItems: 'center',
        },
        cardInner: {
            flex: 1,
        },
        cardTitle: {
            color: theme.colors.textPrimary,
            fontSize: 20,
            marginTop: spacing.m,
        },
        cardInfo: {
            color: theme.colors.textSecondary,
            marginTop: spacing.xs,
            marginBottom: spacing.l,
            fontSize: 14,
        },
        sampleWordsContainer: {
            borderRadius: rounded.l,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: spacing.m,
        },
        sampleWord: {
            width: 64,
            fontSize: 9,
            opacity: 0.8,
            marginBottom: spacing.s,
        },
        sampleKeyContainer: {
            borderRadius: rounded.l,
            justifyContent: 'space-between',
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: spacing.m,
        },
        sampleKey: {
            fontSize: 9,
            opacity: 0.8,
        },
        iconContainer: {
            padding: spacing.m,
            borderRadius: rounded.full,
            marginRight: spacing.l,
            borderWidth: 0.5,
            borderColor: theme.colors.border,
            shadowColor: theme.colors.shadow,
            shadowOffset: {
                height: 5,
                width: 0,
            },
            shadowRadius: 5,
            shadowOpacity: 1,
            elevation: 3,
            width: 50,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
        },
        icon: {
            fontSize: 24,
        },
        ledgerLogo: {
            width: 80,
            height: 30,
        },
    });

export default WalletImport;
