import {initEncryptedStorage, permanentStorage} from '@storage/mmkv';
import security from '@storage/security';
import {useEffect, useState} from 'react';
import crypto from 'react-native-quick-crypto';

//useEncryptionStorage - on app start, loads encrypted storage, makes a random key for encryption if one not present.
export function useEncryptionStorage() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        void loadEncryptionKey();
    },[]);

    async function loadEncryptionKey() {
        //we clean up because we don't want persist across installs (keychain persists data)
        const isFirstInstall = permanentStorage.getString('is-first-install');
        if (isFirstInstall) {
            await security.reset();
            permanentStorage.set('is-first-install', 'nope');
        }

        const encryptionKey = await security.getEncryptionKey();
        if (encryptionKey && encryptionKey.length > 0) {
            initEncryptedStorage(encryptionKey);
            setIsLoaded(true);
            return;
        }
        //Generating new random 256 bit key used to encrypt our storage.
        const randomKey = Buffer.from(crypto.randomBytes(32)).toString('hex');
        await security.storeEncryptionKey(randomKey);
        initEncryptedStorage(randomKey);
        setIsLoaded(true);
    }

    return [isLoaded];
}
