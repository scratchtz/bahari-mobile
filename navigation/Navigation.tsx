import React, {useEffect, useMemo, useRef, useState} from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppTheme} from '@utils/styles';
import {CommonStackList, MainTabParamList, RootStackParamList} from './types';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Setup from '@screens/Setup/Setup';
import {useAppTheme} from '@hooks/useAppTheme';
import WalletNew from '@screens/WalletNew/WalletNew';
import WalletImport from '@screens/WalletImport/WalletImport';
import Wallet from '@screens/Main/Wallet/Wallet';
import Settings from '@screens/Main/Settings/Settings';
import ImportPassphrase from '@screens/WalletImport/ImportPassphrase';
import ImportPrivateKey from '@screens/WalletImport/ImportPrivateKey';
import Discover from '@screens/Main/Discover/Discover';
import {Platform, StyleSheet, TouchableOpacity} from 'react-native';
import Send from '@screens/Send/Send';
import SendAmount from '@screens/Send/SendAmount';
import {hasAtLeastSingleWallet} from '@storage/wallet';
import {StatusBar} from 'expo-status-bar';
import Contacts from '@screens/Contacts/Contacts';
import ContactNew from '@screens/ContactNew/ContactNew';
import Contact from '@screens/Contact/Contact';
import Network from '@screens/Network/Network';
import NetworkNew from '@screens/NetworkNew/NetworkNew';
import TransactionHistory from '@screens/TransactionHistory/TransactionHistory';
import {MaterialIcons, FontAwesome, Ionicons, Octicons} from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';
import {navigationRef} from '@navigation/shared';
import ImportLedger from '@screens/WalletImport/ImportLedger';
import BuyNano from '@screens/BuyNano/BuyNano';
import Receive from '@screens/Receive/Receive';
import Representative from '@screens/Representative/Representative';
import ChangeRepresentative from '@screens/Representative/ChangeRepresentative';
import useTranslationInit from '@hooks/useTranslationInit';
import {TFunction} from 'i18next';
import {useTranslation} from 'react-i18next';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Navigation = () => {
    useTranslationInit()
    const theme = useAppTheme();
    const {t} = useTranslation();

    const navigationTheme = useMemo(() => {
        return {
            dark: theme.scheme === 'dark',
            colors: {
                ...DefaultTheme.colors,
                primary: theme.colors.primary,
                background: theme.colors.mainBackground,
                card: theme.colors.cardBackground,
                border: theme.colors.border,
                text: theme.colors.textPrimary,
                notification: theme.colors.textPrimary,
            },
        };
    }, [theme.scheme]);

    useEffect(() => {
        if (Platform.OS === 'android') {
            void NavigationBar.setBackgroundColorAsync(theme.colors.tabBackground);
            void NavigationBar.setButtonStyleAsync(theme.isDark ? 'light' : 'dark');
        }
    }, [theme]);

    const hasWallet = hasAtLeastSingleWallet();
    const initialRoute = hasWallet ? 'Main' : 'Setup';

    return (
        <>
            <NavigationContainer theme={navigationTheme} ref={navigationRef}>
                <Stack.Navigator initialRouteName={initialRoute}>
                    <Stack.Group>
                        <Stack.Screen
                            name={'Setup'}
                            component={Setup}
                            options={({route}) => navigatorScreenOptions({route, theme, headerShown: false})}
                        />
                        <Stack.Screen
                            name={'WalletNew'}
                            component={WalletNew}
                            options={({route}) => navigatorScreenOptions({route, theme, title: '', headerShown: true})}
                        />
                        <Stack.Screen
                            name={'WalletImport'}
                            component={WalletImport}
                            options={({route}) =>
                                navigatorScreenOptions({route, theme, headerShown: true, title: 'Import Wallet'})
                            }
                        />
                        <Stack.Screen
                            name={'Main'}
                            component={MainTabs}
                            options={({route}) => navigatorScreenOptions({route, theme, headerShown: false})}
                        />
                        <Stack.Screen
                            name={'ImportPassphrase'}
                            component={ImportPassphrase}
                            options={({route}) => navigatorScreenOptions({route, theme, headerShown: true})}
                        />
                        <Stack.Screen
                            name={'ImportPrivateKey'}
                            component={ImportPrivateKey}
                            options={({route}) => navigatorScreenOptions({route, theme, headerShown: true})}
                        />
                        <Stack.Screen
                            name={'ImportLedger'}
                            component={ImportLedger}
                            options={({route}) => navigatorScreenOptions({route, theme, headerShown: true})}
                        />
                    </Stack.Group>
                </Stack.Navigator>
            </NavigationContainer>
            <StatusBar style={theme.isDark ? 'light' : 'dark'} />
        </>
    );
};

export const CommonStackScreens = (
    Stack: ReturnType<typeof createNativeStackNavigator<CommonStackList>>,
    theme: AppTheme,
    t: TFunction<'translation', undefined>,
) => (
    <>
        <Stack.Screen
            name="Send"
            component={Send}
            options={({route}) =>
                navigatorScreenOptions({
                    route,
                    theme,
                    title: `${t('wallet.send.title')}`,
                    headerShown: true,
                })
            }
        />
        <Stack.Screen
            name="SendAmount"
            component={SendAmount}
            options={({route}) =>
                navigatorScreenOptions({
                    route,
                    theme,
                    title: `${t('wallet.send.amount.title')}`,
                    headerShown: true,
                })
            }
        />
        <Stack.Screen
            name="Contacts"
            component={Contacts}
            options={({navigation, route}) =>
                navigatorScreenOptions({
                    route,
                    theme,
                    title: `${t('settings.wallet.contacts.title')}`,
                    headerShown: true,
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('ContactNew');
                            }}>
                            <Ionicons name="add" size={24} color={theme.colors.textPrimary} />
                        </TouchableOpacity>
                    ),
                })
            }
        />
        <Stack.Screen
            name="ContactNew"
            component={ContactNew}
            options={({route}) =>
                navigatorScreenOptions({
                    route,
                    theme,
                    title: `${t('settings.wallet.contacts.new.title')}`,
                    headerShown: true,
                })
            }
        />
        <Stack.Screen
            name="Contact"
            component={Contact}
            options={({route}) =>
                navigatorScreenOptions({
                    route,
                    theme,
                    title: `${t('settings.wallet.contacts.contact.title')}`,
                    headerShown: true,
                })
            }
        />
        <Stack.Screen
            name="Network"
            component={Network}
            options={({route}) =>
                navigatorScreenOptions({
                    route,
                    theme,
                    title: `${t('settings.general.network.nav_title')}`,
                    headerShown: true,
                })
            }
        />
        <Stack.Screen
            name="NetworkNew"
            component={NetworkNew}
            options={({route}) =>
                navigatorScreenOptions({
                    route,
                    theme,
                    title: `${t('settings.general.network.new.title')}`,
                    headerShown: true,
                })
            }
        />
        <Stack.Screen
            name="TransactionHistory"
            component={TransactionHistory}
            options={({route}) =>
                navigatorScreenOptions({
                    route,
                    theme,
                    title: `${t('wallet.history_list.title')}`,
                    headerShown: true,
                })
            }
        />
        <Stack.Screen
            name="BuyNano"
            component={BuyNano}
            options={({route}) =>
                navigatorScreenOptions({
                    route,
                    theme,
                    title: `${t('wallet.buy.title')}`,
                    headerShown: true,
                })
            }
        />
        <Stack.Screen
            name="Receive"
            component={Receive}
            options={({route}) =>
                navigatorScreenOptions({
                    route,
                    theme,
                    title: `${t('wallet.receive.title')}`,
                    headerShown: true,
                })
            }
        />
        <Stack.Screen
            name="Representative"
            component={Representative}
            options={({route}) =>
                navigatorScreenOptions({
                    route,
                    theme,
                    title: `${t('settings.general.representative.title')}`,
                    headerShown: true,
                })
            }
        />
        <Stack.Screen
            name="ChangeRepresentative"
            component={ChangeRepresentative}
            options={({route}) =>
                navigatorScreenOptions({
                    route,
                    theme,
                    title: `${t('settings.general.representative.change.title')}`,
                    headerShown: true,
                })
            }
        />
    </>
);

const WalletStack = createNativeStackNavigator<CommonStackList>();
const WalletStackNavigation: React.FC = () => {
    const theme = useAppTheme();
    const {t} = useTranslation();
    return (
        <WalletStack.Navigator>
            <WalletStack.Group>
                <WalletStack.Screen
                    name={'Wallet'}
                    component={Wallet}
                    options={({route}) => navigatorScreenOptions({route, theme, headerShown: false})}
                />
                {CommonStackScreens(WalletStack, theme,t)}
            </WalletStack.Group>
        </WalletStack.Navigator>
    );
};

const SettingsStack = createNativeStackNavigator<CommonStackList>();
const SettingsStackNavigation: React.FC = () => {
    const theme = useAppTheme();
    const {t} = useTranslation();
    return (
        <SettingsStack.Navigator>
            <SettingsStack.Group>
                <SettingsStack.Screen
                    name={'Settings'}
                    component={Settings}
                    options={({route}) => navigatorScreenOptions({route, theme, headerShown: false})}
                />
                {CommonStackScreens(SettingsStack, theme,t)}
            </SettingsStack.Group>
        </SettingsStack.Navigator>
    );
};

const DiscoverStack = createNativeStackNavigator<CommonStackList>();
const DiscoverStackStackNavigation: React.FC = () => {
    const theme = useAppTheme();
    const {t} = useTranslation();
    return (
        <DiscoverStack.Navigator>
            <DiscoverStack.Group>
                <DiscoverStack.Screen
                    name={'Discover'}
                    component={Discover}
                    options={({route}) => navigatorScreenOptions({route, theme, headerShown: false})}
                />
                {CommonStackScreens(DiscoverStack, theme,t)}
            </DiscoverStack.Group>
        </DiscoverStack.Navigator>
    );
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const MainTabs: React.FC = () => {
    const theme = useAppTheme();

    return (
        <Tab.Navigator
            initialRouteName={'WalletTab'}
            screenOptions={{
                tabBarActiveTintColor: theme.colors.tabActiveTint,
                tabBarInactiveTintColor: theme.colors.tabInactiveTint,
                headerShown: false,
                tabBarShowLabel: false,
                headerStyle: {
                    backgroundColor: theme.colors.tabBackground,
                },
                tabBarStyle: {
                    backgroundColor: theme.colors.tabBackground,
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                },
            }}>
            {/*<Tab.Screen*/}
            {/*    name={'DiscoverTab'}*/}
            {/*    component={DiscoverStackStackNavigation}*/}
            {/*    options={{*/}
            {/*        tabBarLabel: '',*/}
            {/*        tabBarIcon: ({focused, color, size}) => (*/}
            {/*            <Octicons name="telescope-fill" size={size} color={color} style={tabStyles.icon} />*/}
            {/*        ),*/}
            {/*    }}*/}
            {/*/>*/}
            <Tab.Screen
                name={'WalletTab'}
                component={WalletStackNavigation}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({focused, color, size}) => (
                        <MaterialIcons name="account-balance-wallet" size={size} color={color} style={tabStyles.icon} />
                    ),
                }}
            />
            <Tab.Screen
                name={'SettingsTab'}
                component={SettingsStackNavigation}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({focused, color, size}) => (
                        <FontAwesome name="user" size={size} color={color} style={tabStyles.icon} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const tabStyles = StyleSheet.create({
    icon: {
        marginBottom: -3,
    },
});

interface screenOptions {
    route: any;
    theme: AppTheme;
    title?: string;
    headerShown?: boolean;

    headerRight?: () => JSX.Element;
}

const navigatorScreenOptions = ({route, title, theme, headerShown, headerRight}: screenOptions) => ({
    headerShown,
    title: route && route.params && route.params.title ? route.params.title : title,
    headerTitleStyle: {
        ...theme.textVariants.nav,
    },
    headerBackTitle: '',
    headerStyle: {backgroundColor: theme.colors.stackHeaderBackground},
    headerShadowVisible: true,
    headerTintColor: theme.colors.textPrimary,
    headerTransparent: false,
    headerRight,
});

export default Navigation;
