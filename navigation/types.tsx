import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NanoUriParams} from '@utils/helper/uri';
import {WalletNewMode} from '@screens/WalletNew/WalletNew';
import {Contact} from '@utils/types';

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}

//CommonStack - shared routes across all tabs
export type CommonStackList = {
    Wallet: undefined;
    Settings: undefined;
    Discover: undefined;
    Send: NanoUriParams | undefined;
    SendAmount: {address: string; rawAmount?: string};
    Contacts: undefined;
    ContactNew: {address?: string} | undefined;
    Contact: {contact: Contact};
    Network: undefined;
    NetworkNew: undefined;
    TransactionHistory: undefined;
    Receive: undefined;
    Representative: undefined;
    ChangeRepresentative: undefined;
    BuyNano: undefined;
};

export type RootStackParamList = {
    Main: NavigatorScreenParams<MainTabParamList> | undefined;
    Setup: undefined;
    WalletImport: undefined;
    ImportPrivateKey: {walletID?: string} | undefined;
    ImportPassphrase: {passphrase: string} | undefined;

    ImportLedger: undefined;
    WalletNew: {walletMode: WalletNewMode};
};

type AllScreensList = CommonStackList & RootStackParamList;
export type AllScreenProps<Screen extends keyof AllScreensList> = NativeStackScreenProps<AllScreensList, Screen>;

export type CommonStackScreenProps<Screen extends keyof CommonStackList> = NativeStackScreenProps<
    CommonStackList,
    Screen
>;

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
    RootStackParamList,
    Screen
>;

export type MainTabParamList = {
    WalletTab: undefined;
    SettingsTab: undefined;
    DiscoverTab: undefined;
};

export type RootTabScreenProps<Screen extends keyof MainTabParamList> = CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
>;
