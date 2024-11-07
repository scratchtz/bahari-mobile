import React, {useCallback, useRef, useState} from 'react';
import {rounded, spacing} from '@utils/styles';

import {AppTheme} from '@utils/styles/theme';
import {Dimensions, ScrollView, StyleSheet, TextInput, TouchableOpacity, View, Animated} from 'react-native';
import Text from '@components/Text/Text';
import {CommonStackScreenProps} from '@navigation/types';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {FontAwesome} from '@expo/vector-icons';
import Separator from '@components/Separator/Separator';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import AccountSelect from '@components/AccountSelect/AccountSelect';
import ContactList from '@screens/Send/ContactsList';
import {Contact} from '@utils/types';
import {ScanQRCodeModal} from '@screens/Main/Wallet/ScanQRCodeModal';
import {NanoUriParams} from '@utils/helper/uri';
import ButtonTiny from '@components/Button/ButtonTiny';
import * as Clipboard from 'expo-clipboard';
import {tools} from 'nanocurrency-web';
import Button from '@components/Button/Button';
import {ToastController} from '@components/Toast/Toast';
import RecentAddresses from '@screens/Send/RecentAddresses';
import {useTranslation} from 'react-i18next';

const TAB_PADDING = 2;

const Send: React.FC<CommonStackScreenProps<'Send'>> = ({navigation}) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const {t} = useTranslation();

    const width = Dimensions.get('window').width;
    const scrollViewRef = useRef<ScrollView>() as React.MutableRefObject<ScrollView>;
    const tabSelectedTranslation = useRef(new Animated.Value(0)).current;
    const scanQrCodeModalRef = useRef<BottomSheetModal>(null);

    const [address, setAddress] = useState('');
    const [addressIsFocused, setAddressIsFocused] = useState(false);

    const onNext = () => {
        const isValid = tools.validateAddress(address);
        if (!isValid) {
            ToastController.show({kind: 'error', title: 'Error', content: `${t('send.invalid_address')}`});
            return;
        }
        openSendAmount(address);
    };

    const translationX = tabSelectedTranslation.interpolate({
        inputRange: [0, width],
        outputRange: [0, width / 2 - spacing.th / 2 - TAB_PADDING],
        extrapolate: 'clamp',
    });
    const colorInterpolation = tabSelectedTranslation.interpolate({
        inputRange: [0, width],
        outputRange: [theme.colors.textSecondary, 'white'],
    });
    const colorInterpolationInverse = tabSelectedTranslation.interpolate({
        inputRange: [0, width],
        outputRange: ['white', theme.colors.textSecondary],
    });

    const onMyAccountSelect = (keyPairAddress: string) => {
        openSendAmount(keyPairAddress);
    };

    const openSendAmount = (address: string) => {
        navigation.navigate('SendAmount', {address});
    };
    const onCloseScanQrCodeModal = (params?: NanoUriParams) => {
        scanQrCodeModalRef.current?.close();
        if (params && params.address) {
            navigation.navigate('SendAmount', {address: params.address, rawAmount: params.query?.amount});
        }
    };

    const openScanQrCodeModal = useCallback(() => {
        scanQrCodeModalRef.current?.present();
    }, []);

    const onPasteAddress = async () => {
        const string = await Clipboard.getStringAsync();
        setAddress(string);
    };

    const onRecentAddress = (address: string) => {
        openSendAmount(address);
    };

    return (
        <View style={styles.container}>
            <View style={styles.upperContainer}>
                <Text style={styles.head} weight="600">
                    {t('send.label')}
                </Text>

                <View style={styles.tabContainer}>
                    <Animated.View style={[styles.tabSelectedBack, {transform: [{translateX: translationX}]}]} />
                    <TouchableOpacity
                        style={[styles.tabButton]}
                        onPress={() => {
                            scrollViewRef.current?.scrollTo({x: 0, animated: true});
                        }}>
                        <Animated.Text style={[styles.tabText, {color: colorInterpolationInverse}]}>
                            {t('send.address.label')}
                        </Animated.Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton]}
                        onPress={() => {
                            scrollViewRef.current?.scrollTo({x: width, animated: true});
                        }}>
                        <Animated.Text style={[styles.tabText, {color: colorInterpolation}]}>{t('send.contact_label')}</Animated.Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event([{nativeEvent: {contentOffset: {x: tabSelectedTranslation}}}], {
                    useNativeDriver: false,
                })}>
                {/******** Address Tab*/}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        width: width - 2 * spacing.th,
                        marginLeft: spacing.th,
                        marginRight: spacing.th,
                        paddingBottom: 100,
                    }}>
                    <Separator space={spacing.s} />
                    <View style={[styles.textInputContainer, addressIsFocused ? styles.textInputContainerFocused : {}]}>
                        <TextInput
                            value={address}
                            onFocus={() => setAddressIsFocused(true)}
                            onBlur={() => setAddressIsFocused(false)}
                            blurOnSubmit={true}
                            onChangeText={setAddress}
                            style={styles.textInput}
                            placeholderTextColor={theme.colors.textSecondary}
                            placeholder={t('send.address.placeholder')}
                            returnKeyType={'done'}
                            autoCapitalize={'none'}
                        />
                    </View>
                    <View style={styles.scanActionsContainer}>
                        <AccountSelect
                            containerStyle={styles.accountSelectContainer}
                            onSelectAccount={onMyAccountSelect}
                        />
                        <View style={styles.flex} />
                        <ButtonTiny
                            icon={<FontAwesome name="qrcode" style={styles.scanIcon} />}
                            title={t('send.address.scan_code')}
                            onPress={openScanQrCodeModal}
                        />
                        <Separator space={spacing.s} horizontal={true} />
                        <ButtonTiny
                            icon={<FontAwesome name="paste" style={styles.scanIcon} />}
                            title={t('send.address.paste')}
                            onPress={onPasteAddress}
                        />
                    </View>

                    <Text variant="subheader" style={styles.recentHeader}>
                        {t('send.address.recents_label')}
                    </Text>
                    <Separator space={spacing.l} />
                    <RecentAddresses onPress={onRecentAddress} />
                </ScrollView>

                {/******** Contacts Tab*/}
                <View style={{width: width - 2 * spacing.th, marginRight: spacing.th}}>
                    <Separator space={spacing.s} />
                    <ContactList
                        onPress={(c: Contact) => {
                            openSendAmount(c.address);
                        }}
                    />
                </View>
            </ScrollView>

            <View style={styles.nextButton}>
                <Button title={t('send.button_next')} onPress={onNext} />
            </View>
            <ScanQRCodeModal ref={scanQrCodeModalRef} onClose={onCloseScanQrCodeModal} />
        </View>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        upperContainer: {
            marginHorizontal: spacing.th,
        },
        head: {
            fontSize: 18,
            paddingVertical: spacing.m,
        },
        tabContainer: {
            ...theme.cardVariants.simple,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.cardBackground,
            borderRadius: rounded.full,
            padding: spacing.xs,
        },
        tabButton: {
            padding: spacing.m,
            flex: 1,
        },
        tabSelectedBack: {
            backgroundColor: theme.colors.primary,
            borderRadius: rounded.full,
            position: 'absolute',
            top: TAB_PADDING,
            left: TAB_PADDING,
            right: TAB_PADDING,
            bottom: TAB_PADDING,
            width: '50%',
        },
        tabText: {
            ...theme.textVariants.nav,
            textAlign: 'center',
        },
        tabTextSelected: {
            color: 'white',
        },
        textInputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacing.l,
            backgroundColor: theme.colors.cardBackground,
            borderRadius: rounded.l,
            borderWidth: 0.5,
            borderColor: theme.colors.border,
        },
        textInputContainerFocused: {
            borderColor: theme.colors.primary,
        },
        textInput: {
            ...theme.textVariants.body,
            padding: spacing.l,
            flex: 1,
        },
        scanActionsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacing.l,
        },
        flex: {
            flex: 1,
        },
        scanIconContainer: {
            marginTop: spacing.s,
            marginLeft: spacing.m,
            padding: spacing.xs,
            borderRadius: rounded.full,
            alignItems: 'center',
            flexDirection: 'row',
        },
        scanIcon: {
            fontSize: 16,
            color: theme.colors.textPrimary,
        },
        actionText: {
            color: theme.colors.textPrimary,
            textDecorationLine: 'underline',
        },
        accountSelectContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        recentHeader: {
            marginTop: spacing.xl,
        },
        recentAddressItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacing.m,
            paddingVertical: spacing.s,
            paddingHorizontal: spacing.xs,
        },
        recentImage: {
            width: 50,
            height: 50,
            borderRadius: rounded.full,
            marginRight: spacing.l,
        },
        recentMidContainer: {
            flex: 1,
        },
        recentName: {},
        recentAddress: {
            color: theme.colors.textSecondary,
        },
        nextButton: {
            position: 'absolute',
            bottom: spacing.xl,
            left: spacing.th,
            right: spacing.th,
        },
    });

export default Send;
