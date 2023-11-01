import {permanentStorage} from '@storage/mmkv';
import {createSyncStoragePersister} from '@tanstack/query-sync-storage-persister';

const clientStorage = {
    setItem: (key: string, value: any) => {
        permanentStorage.set(key, value);
    },
    getItem: (key: string) => {
        const value = permanentStorage.getString(key);
        return value === undefined ? null : value;
    },
    removeItem: (key: string) => {
        permanentStorage.delete(key);
    },
};

export const queryClientPersister = createSyncStoragePersister({storage: clientStorage});
