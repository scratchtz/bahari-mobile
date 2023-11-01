import {KeyPair, Wallet, WalletKV} from '@utils/types';
import {encryptedGetFromJson, encryptedSetJson, encryptedStorage} from './mmkv';
import {storageKeyKeyPair, StorageKeys, storageKeyWallet} from '../constants/storage';
import {navigate, navigateDispatch} from '@navigation/shared';
import {CommonActions} from '@react-navigation/native';

export function getAllWalletsKV(): WalletKV[] | undefined {
    return encryptedGetFromJson<WalletKV[]>(StorageKeys.walletsKv);
}

export function getDefaultKeyPairAddress(): string | undefined {
    return encryptedGetFromJson<string>(StorageKeys.defaultKeyPair);
}

export function setDefaultKeyPairAddress(address: string) {
    return encryptedSetJson(StorageKeys.defaultKeyPair, address);
}
function persistWalletsKv(wkv: WalletKV[]) {
    encryptedSetJson(StorageKeys.walletsKv, wkv);
}

export function hasAtLeastSingleWallet(): boolean {
    const wallets = getAllWalletsKV();
    if (!wallets) return false;
    return wallets.length > 0;
}

export function getAllAddresses(): string[] {
    const wallets = getAllWalletsKV();
    if (!wallets || wallets.length === 0) {
        return [];
    }
    let addresses: string[] = [];
    for (const walletKV of wallets) {
        const wallet = getWallet(walletKV.id);
        if (!wallet) {
            continue;
        }
        addresses = [...addresses, ...wallet.keyPairsAddresses];
    }
    return addresses;
}

export function persistWallet(w: Wallet, firstKeyPair: KeyPair) {
    let allWallets = getAllWalletsKV() || [];

    let walletWasAlreadySaved = false;
    for (let i = 0; i < allWallets.length; i++) {
        const old = allWallets[i];
        if (old.id === w.id) {
            walletWasAlreadySaved = true;
            break;
        }
    }

    if (walletWasAlreadySaved) {
        const old = getWallet(w.id);
        if (old && old.id) {
            throw 'wallet already exists';
        }
    } else {
        persistWalletsKv([...allWallets, {id: w.id}]);
    }

    encryptedSetJson(storageKeyWallet(w.id), w);
    encryptedSetJson(storageKeyKeyPair(firstKeyPair.address), firstKeyPair);
    if (!getDefaultKeyPairAddress()) {
        setDefaultKeyPairAddress(firstKeyPair.address);
    }
}

export function deleteWallet(id: string) {
    const defaultKeyPairAddress = getDefaultKeyPairAddress();
    const allWallets = getAllWalletsKV() || [];
    const newWallets = allWallets.filter(w => w.id !== id);

    if (!newWallets || newWallets.length === 0) {
        //navigate to main when nothing is left, navigating first just in case there's a screen depending on this wallet.
        navigateDispatch(
            CommonActions.reset({
                index: 1,
                routes: [{name: 'Setup'}],
            }),
        );
    }

    //delete all keys for that deleted wallet
    const oldWallet = getWallet(id);
    if (oldWallet && oldWallet.keyPairsAddresses) {
        for (const address of oldWallet.keyPairsAddresses) {
            //change to a different default keypair before deleting
            if (address === defaultKeyPairAddress) {
                for (const rw of newWallets) {
                    const remainingWallet = getWallet(rw.id);
                    if (remainingWallet && remainingWallet?.keyPairsAddresses.length > 0) {
                        setDefaultKeyPairAddress(remainingWallet.keyPairsAddresses[0]);
                        navigateDispatch(
                            CommonActions.reset({
                                index: 1,
                                routes: [{name: 'Main'}],
                            }),
                        );
                        break;
                    }
                }
            }
            //delete the key itself
            encryptedStorage.delete(storageKeyKeyPair(address));
        }
    }

    persistWalletsKv(newWallets);
    //delete the wallet itself
    encryptedStorage.delete(storageKeyWallet(id));
}

export function getWallet(id: string): Wallet | undefined {
    return encryptedGetFromJson<Wallet>(storageKeyWallet(id));
}

export function getKeyPair(address: string): KeyPair | undefined {
    return encryptedGetFromJson<KeyPair>(storageKeyKeyPair(address));
}
export function persistAppendKeyPair(kp: KeyPair) {
    const w = encryptedGetFromJson<Wallet>(storageKeyWallet(kp.walletID));
    if (!w) throw 'wallet not found trying to save keypair';
    for (let i = 0; i < w.keyPairsAddresses.length; i++) {
        const address = w.keyPairsAddresses[i];
        if (address === kp.address) {
            return;
        }
    }
    w.lastAccountIndex = kp.accountIndex;
    w.keyPairsAddresses = [...w.keyPairsAddresses, kp.address];
    encryptedSetJson(storageKeyWallet(w.id), w);
    encryptedSetJson(storageKeyKeyPair(kp.address), kp);
}
