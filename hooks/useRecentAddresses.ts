import React from 'react';
import {useMMKVObject} from 'react-native-mmkv';
import {StorageKeys} from '@constants/storage';
import {encryptedStorage} from '@storage/mmkv';

const MAX_ITEMS = 6;
const useRecentAddresses = () => {
    const [recentAddresses, setRecentAddresses] = useMMKVObject<string[]>(
        StorageKeys.recentAddresses,
        encryptedStorage,
    );

    const appendRecentAddress = (address: string) => {
        if (!recentAddresses) {
            setRecentAddresses([address]);
            return;
        }
        const addresses = recentAddresses.filter(add => add !== address);
        const newAddresses = [address, ...addresses];
        setRecentAddresses(newAddresses.slice(0, MAX_ITEMS));
    };

    return {recentAddresses: recentAddresses || [], appendRecentAddress};
};

export default useRecentAddresses;
