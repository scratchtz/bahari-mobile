import {MMKV} from 'react-native-mmkv';

//permanentStorage - stores data permanent, rarely use this, prefer using encryptedStorage instead.
//only use this when necessary
export const permanentStorage = new MMKV({
    id: 'bahari-store',
});

//encryptedStorage - store any sensitive data.
//loaded on app start, so call anywhere in the app without fear.
export let encryptedStorage: MMKV;
export const initEncryptedStorage = (encryptionKey: string) => {
    encryptedStorage = new MMKV({
        id: 'bahari-enc-store',
        encryptionKey: encryptionKey,
    });
};

export function encryptedSetJson(key: string, value: any) {
    encryptedStorage.set(key, JSON.stringify(value));
}

export function encryptedGetFromJson<T>(key: string): T | undefined {
    const value = encryptedStorage.getString(key);
    if (!value) {
        return undefined;
    }
    return JSON.parse(value);
}
