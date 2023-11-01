import {useMMKVObject} from 'react-native-mmkv';
import {storageKeyKeyPair, StorageKeys} from '@constants/storage';
import {encryptedGetFromJson, encryptedStorage} from '@storage/mmkv';
import {KeyPair} from '@utils/types';

export const useKeyPair = (address: string) => {
    return useMMKVObject<KeyPair>(storageKeyKeyPair(address), encryptedStorage);
};

export const useGetKeyPair = (address: string) => {
    const [keyPair] = useMMKVObject<KeyPair>(storageKeyKeyPair(address), encryptedStorage);
    return keyPair;
};

export const getKeyPair = (address: string) => {
    return encryptedGetFromJson(storageKeyKeyPair(address));
};

export const useDefaultKeyPair = () => {
    const [defaultKeyPairAddress, setDefaultKeyPairAddress] = useMMKVObject<string>(
        StorageKeys.defaultKeyPair,
        encryptedStorage,
    );

    const [defaultKeyPair] = useMMKVObject<KeyPair>(storageKeyKeyPair(defaultKeyPairAddress || ''), encryptedStorage);
    return {defaultKeyPair, setDefaultKeyPairAddress};
};
