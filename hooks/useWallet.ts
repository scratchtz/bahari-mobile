import {encryptedStorage} from '@storage/mmkv';
import {Wallet, WalletKV} from '@utils/types/wallet';
import {useMMKVObject} from 'react-native-mmkv';
import {StorageKeys, storageKeyWallet} from '@constants/storage';
import {useDefaultKeyPair} from '@hooks/useKeyPair';

export const useDefaultWallet = () => {
    const {defaultKeyPair} = useDefaultKeyPair();
    if (!defaultKeyPair) {
        return undefined;
    }
    const [defaultWallet] = useMMKVObject<Wallet>(storageKeyWallet(defaultKeyPair.walletID), encryptedStorage);
    return defaultWallet;
};

export const useWalletKVs = () => {
    const [wallets] = useMMKVObject<WalletKV[]>(StorageKeys.walletsKv, encryptedStorage);
    return wallets;
};

export const useWallet = (walletID: string) => {
    return useMMKVObject<Wallet>(storageKeyWallet(walletID), encryptedStorage);
};
export const useGetWallet = (walletID: string) => {
    const [wallet] = useMMKVObject<Wallet>(storageKeyWallet(walletID), encryptedStorage);
    return wallet;
};
