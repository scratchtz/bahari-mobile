import {useMMKVString} from 'react-native-mmkv';
import {StorageKeys} from '@constants/storage';
import {useEffect} from 'react';
import {encryptedStorage} from '@storage/mmkv';
import {UnlockMethod} from '@utils/types/unlockMethod';

export default function useUnlockMethod() {
    const [unlockMethod, setUnlockMethod] = useMMKVString(StorageKeys.unlockMethod, encryptedStorage);

    useEffect(() => {
        if (!unlockMethod) {
            setUnlockMethod('none');
        }
    }, [unlockMethod]);

    return {
        unlockMethod: unlockMethod as UnlockMethod,
        setUnlockMethod: setUnlockMethod as (method: UnlockMethod) => void,
    };
}
