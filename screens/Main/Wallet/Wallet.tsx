import React, {useCallback, useRef} from 'react';
import {rounded, spacing} from '@utils/styles';

import {AppTheme} from '@utils/styles/theme';
import {AllScreenProps} from '@navigation/types';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {FontAwesome, MaterialCommunityIcons, MaterialIcons, FontAwesome5} from '@expo/vector-icons';
import {ScanQRCodeModal} from './ScanQRCodeModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import Text from '@components/Text/Text';
import Separator from '@components/Separator/Separator';
import PriceGraph from '@screens/Main/Wallet/PriceGraph';
import {ScrollView, StyleSheet, View, SafeAreaView} from 'react-native';
import HistoryList from '@screens/Main/Wallet/HistoryList';
import CurrentAccount from '@components/CurrentAccount/CurrentAccount';
import BalanceSection from '@screens/Main/Wallet/BalanceSection';
import {useScrollToTop} from '@react-navigation/native';
import usePushNotifications from '@hooks/usePushNotifications';
import TouchableScale from 'react-native-touchable-scale';

const WalletScreen: React.FC<AllScreenProps<'Wallet'>> = ({navigation}) => {
    usePushNotifications(); //initial load of push notifications

    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const qrCodeModal = useRef<BottomSheetModal>();
    const scrollViewRef = useRef(null);

    const onScanQrCode = useCallback(() => {
        qrCodeModal.current?.present();
    }, []);

    useScrollToTop(scrollViewRef);

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                ref={scrollViewRef}>
                <CurrentAccount />

                <Separator space={spacing.xl} />
                <BalanceSection />
                <PriceGraph />
                <Separator space={spacing.xl} />
                <View style={styles.actionButtons}>
                    <ActionButton
                        title="Buy"
                        icon={<MaterialIcons name="payments" style={styles.actionButtonIcon} />}
                        onPress={() => {
                            navigation.navigate('BuyNano');
                        }}
                    />
                    <ActionButton
                        title="Send"
                        icon={<FontAwesome name="send" style={styles.actionButtonIcon} />}
                        onPress={() => {
                            navigation.navigate('Send');
                        }}
                    />
                    <ActionButton
                        title="Receive"
                        icon={<MaterialCommunityIcons name="briefcase-download" style={styles.actionButtonIcon} />}
                        onPress={() => {
                            navigation.navigate('Receive');
                        }}
                    />
                    <ActionButton
                        icon={<FontAwesome5 name="qrcode" style={styles.actionButtonIcon} />}
                        title={'Scan Code'}
                        onPress={onScanQrCode}
                    />
                </View>
                <Separator space={spacing.xl} />
                <HistoryList />
                <Separator space={spacing.xl} />
            </ScrollView>
            <ScanQRCodeModal
                ref={qrCodeModal}
                onClose={params => {
                    qrCodeModal.current?.close();
                    if (params && params.address) {
                        navigation.navigate('SendAmount', {
                            address: params.address,
                            rawAmount: params.query?.amount,
                        });
                    }
                }}
            />
        </SafeAreaView>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        safeAreaView: {
            flex: 1,
        },
        container: {
            marginTop: spacing.l,
            padding: spacing.th,
            marginBottom: 100,
            paddingBottom: 100,
        },
        headContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        accountImage: {
            width: 80,
            height: 80,
        },
        walletName: {
            fontSize: 14,
        },
        actionButtons: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: 1000,
        },
        actionButtonIcon: {
            fontSize: 22,
            color: theme.colors.textPrimary,
        },
    });

const ActionButton = React.memo(({icon, title, onPress}: {icon: JSX.Element; title: string; onPress: () => void}) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, actionButtonStyles);
    return (
        <TouchableScale activeScale={0.95} style={styles.container} onPress={onPress}>
            <View style={styles.roundContainer}>{icon}</View>
            <Text style={styles.title} weight="600">
                {title}
            </Text>
        </TouchableScale>
    );
});

const actionButtonStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            marginRight: spacing.xl,
            alignItems: 'center',
        },
        roundContainer: {
            ...theme.cardVariants.simple,
            borderRadius: rounded.l,
            borderWidth: 0.5,
            borderColor: theme.colors.borderLight,
            justifyContent: 'center',
            alignItems: 'center',
            height: 54,
            width: 54,
        },
        title: {
            marginTop: spacing.m,
        },
    });

export default WalletScreen;
