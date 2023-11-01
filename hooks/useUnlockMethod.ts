import {useMMKVString} from 'react-native-mmkv';
import {StorageKeys} from '@constants/storage';
import {useEffect} from 'react';
import {encryptedStorage} from '@storage/mmkv';
import {UnlockMethod} from '@utils/types/unlockMethod';
import {hasHardwareAsync} from 'expo-local-authentication';

export default function useUnlockMethod() {
    const [unlockMethod, setUnlockMethod] = useMMKVString(StorageKeys.unlockMethod, encryptedStorage) as [
        UnlockMethod | undefined,
        (value: UnlockMethod) => void,
    ];

    //Initial setup
    useEffect(() => {
        if (!unlockMethod) {
            void initializeUnlockMethod();
        }
    }, [unlockMethod]);

    const initializeUnlockMethod = async () => {
        try {
            const hasHardware = await hasHardwareAsync();
            if (hasHardware) {
                setUnlockMethod('biometrics');
            }
        } catch (e) {}
    };

    return {unlockMethod, setUnlockMethod};
}
