import {encryptedGetFromJson, encryptedStorage} from '@storage/mmkv';
import {storageKeyKeyPair, StorageKeys} from '@constants/storage';
import {KeyPair} from '@utils/types';
import {rpcAccountInfo} from '@utils/rpc/rpc';

export function shortenAddress(address?: string, cut: number = 8): string {
    if (!address) return '';
    if (address.length < 10 || cut >= address.length) {
        return address;
    }
    return address.substring(0, cut) + '.....' + address.substring(address.length - cut, address.length);
}

export function beautifulLabel(walletLabel: string, accountLabel: string): string {
    return `${walletLabel} -> ${accountLabel}`;
}

export async function checkAddressValidity(address: string): Promise<boolean> {
    const myKey = encryptedGetFromJson<KeyPair>(storageKeyKeyPair(address));
    //if we generated ourselves
    if (myKey && myKey.address) {
        return true;
    }
    // if we checked before
    if (encryptedStorage.contains(`${StorageKeys.validAddress}${address}`)) {
        return true;
    }
    //check if exists on chain
    const acc = await rpcAccountInfo(address);
    if (parseInt(acc.modified_timestamp) > 0) {
        encryptedStorage.set(`${StorageKeys.validAddress}${address}`, true);
        return true;
    }
    return false;
}
