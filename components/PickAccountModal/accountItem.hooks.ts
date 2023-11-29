import {useQuery} from '@tanstack/react-query';
import {rpcAccountsBalances} from '@utils/rpc/rpc';
import {getAllAddresses, getWallet} from '@storage/wallet';
import {useEffect, useMemo} from 'react';
import {encryptedStorage} from '@storage/mmkv';
import {StorageKeys} from '@constants/storage';
import BigNumber from 'bignumber.js';
import {useMMKVString} from 'react-native-mmkv';
import crypto from 'react-native-quick-crypto';

export function useAllWalletsBalance(enabled: boolean) {
    const addresses = getAllAddresses();
    const {data} = useQuery({
        enabled: enabled && addresses.length > 0,
        queryKey: ['all-wallets-balance'],
        queryFn: () => rpcAccountsBalances(addresses),
        refetchInterval: 20000,
    });

    useEffect(() => {
        if (data?.balances) {
            for (const key in data.balances) {
                if (data.balances.hasOwnProperty(key)) {
                    const bal = data.balances[key].balance;
                    const pen = data.balances[key].pending;
                    const totalBalance = new BigNumber(bal).plus(pen);
                    saveLatestAddressBalance(key, totalBalance.toString());
                }
            }
            updateForEffect();
        }
    }, [data]);
}

export function useWalletTotalBalance(walletID: string): string {
    const [changeChecker] = useMMKVString(StorageKeys.latestAddressBalance, encryptedStorage);
    return useMemo(() => {
        const w = getWallet(walletID);
        if (!w) {
            return '0';
        }
        return w.keyPairsAddresses
            .reduce((total, address) => total.plus(getLatestAddressBalance(address) || 0), new BigNumber(0))
            .toString();
    }, [changeChecker, walletID]);
}

export function saveLatestAddressBalance(address: string, amount: string) {
    encryptedStorage.set(StorageKeys.latestAddressBalance + address, amount);
}
export function getLatestAddressBalance(address: string): BigNumber {
    const value = new BigNumber(encryptedStorage.getString(StorageKeys.latestAddressBalance + address) || 0);
    if (value.isNaN()) return new BigNumber(0);
    return value;
}

export function saveLatestAddressBalanceAndUpdate(address: string, amount: string) {
    if (!amount) return;
    encryptedStorage.set(StorageKeys.latestAddressBalance + address, amount);
    updateForEffect();
}

function updateForEffect() {
    const randomKey = Buffer.from(crypto.randomBytes(12)).toString('hex');
    encryptedStorage.set(StorageKeys.latestAddressBalance, randomKey);
}

export function useLatestAddressBalance(address: string) {
    return useMMKVString(StorageKeys.latestAddressBalance + address, encryptedStorage);
}
