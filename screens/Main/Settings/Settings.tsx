import React, {useRef} from 'react';
import {palette, rounded, spacing} from '@utils/styles';

import {AppTheme} from '@utils/styles/theme';
import {ScrollView, StyleSheet, View, SafeAreaView} from 'react-native';
import Text from '@components/Text/Text';
import {AllScreenProps} from '@navigation/types';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {FontAwesome5, Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import Separator from '@components/Separator/Separator';
import CurrentAccount from '@components/CurrentAccount/CurrentAccount';
import {useScrollToTop} from '@react-navigation/native';
import SettingsItem, {sharedStyles} from '@screens/Main/Settings/Components/SettingsItem';
import ItemLanguage from '@screens/Main/Settings/Components/ItemLanguage';
import ItemTheme from '@screens/Main/Settings/Components/ItemTheme';
import ItemDisplayCurrency from '@screens/Main/Settings/Components/ItemDIsplayCurrency';
import ItemNativeCurrency from '@screens/Main/Settings/Components/ItemNativeCurrency';
import ItemPushNotifications from '@screens/Main/Settings/Components/ItemPushNotifications';
import ItemNetwork from '@screens/Main/Settings/Components/ItemNetwork';
import ItemPassword from '@screens/Main/Settings/Components/ItemUnlockMethod';
import ItemAutolock from '@screens/Main/Settings/Components/ItemAutolock';
import ItemResetWallet from '@screens/Main/Settings/Components/ItemResetWallet';

const Settings: React.FC<AllScreenProps<'Settings'>> = ({navigation}) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);
    const settingItemStyle = useThemeStyleSheetProvided(theme, sharedStyles);

    const scrollViewRef = useRef(null);

    useScrollToTop(scrollViewRef);

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                ref={scrollViewRef}>
                <CurrentAccount />
                <Separator space={spacing.m} />
                <Text variant="subheader" style={styles.subheader}>
                    Wallet
                </Text>
                <View style={styles.section}>
                    <SettingsItem
                        onPress={() => {
                            navigation.navigate('WalletNew', {walletMode: 'passphrase'});
                        }}
                        leftItem={
                            <View style={[settingItemStyle.settingIconBack, {backgroundColor: '#ff9f43'}]}>
                                <MaterialCommunityIcons
                                    name="wallet-plus-outline"
                                    style={[settingItemStyle.settingIcon]}
                                />
                            </View>
                        }
                        title="New Wallet"
                    />

                    <SettingsItem
                        onPress={() => {
                            navigation.navigate('WalletImport');
                        }}
                        leftItem={
                            <View style={[settingItemStyle.settingIconBack, {backgroundColor: '#ee5253'}]}>
                                <FontAwesome5 name="search-plus" style={[settingItemStyle.settingIcon]} />
                            </View>
                        }
                        title="Import Wallet"
                    />
                    <SettingsItem
                        onPress={() => {
                            navigation.navigate('Contacts');
                        }}
                        leftItem={
                            <View style={[settingItemStyle.settingIconBack, {backgroundColor: palette.teal500}]}>
                                <Ionicons name="people" style={[settingItemStyle.settingIcon]} />
                            </View>
                        }
                        title="Contacts"
                    />
                </View>
                <Separator space={spacing.l} />
                <Text variant="subheader" style={styles.subheader}>
                    General
                </Text>
                <View style={styles.section}>
                    <ItemLanguage />
                    <ItemTheme />
                    <ItemDisplayCurrency />
                    <ItemNativeCurrency />
                    <ItemPushNotifications />
                    <ItemNetwork />
                </View>

                <Separator space={spacing.l} />
                <Text variant="subheader" style={styles.subheader}>
                    Security
                </Text>
                <View style={styles.section}>
                    <ItemPassword />
                    <ItemAutolock />
                    <ItemResetWallet />
                </View>
            </ScrollView>
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
        subheader: {
            paddingVertical: spacing.s,
            marginLeft: spacing.s,
        },
        walletActionsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        section: {
            ...theme.cardVariants.simple,
            paddingVertical: spacing.xs,
            borderRadius: rounded.l,
        },
    });

export default Settings;
