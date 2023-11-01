import {encryptedGetFromJson, encryptedSetJson, encryptedStorage} from '@storage/mmkv';
import {StorageKeys} from '@constants/storage';
import {getAllAddresses} from '@storage/wallet';
import {apiPost, ApiResSuccess} from '@utils/api/api';
import {tr} from 'date-fns/locale';

export async function apiSendPushToken() {
    if (!encryptedStorage.getBoolean(StorageKeys.usePushNotifications)) {
        return;
    }
    const pushToken = encryptedStorage.getString(StorageKeys.pushNotificationToken);
    if (!pushToken) {
        return;
    }
    const addresses = getAllAddresses();
    if (!addresses || addresses.length === 0) {
        return;
    }
    const body = {
        push_token: pushToken,
        addresses,
    };
    //compare with previous save
    // const lastSuccessAddresses = encryptedGetFromJson<string[]>(pushToken);
    // if (lastSuccessAddresses) {
    //     if (areAddressesTheSame(lastSuccessAddresses, addresses)) {
    //         return;
    //     }
    // }
    try {
        const res = await apiPost<ApiResSuccess>('/push', body);
        if (res.data && res.data.success) {
            encryptedSetJson(pushToken, addresses);
        }
    } catch (e) {
        console.log(e);
    }
}

export async function apiDeletePushToken(): Promise<boolean> {
    const pushToken = encryptedStorage.getString(StorageKeys.pushNotificationToken);
    if (!pushToken) {
        return true;
    }
    try {
        const res = await apiPost<ApiResSuccess>('/push/delete');
        if (res.data && res.data.success) {
            encryptedStorage.delete(pushToken);
            return true;
        }
        console.warn(JSON.stringify(res));
        return false;
    } catch (e) {
        console.warn(e);
        return false;
    }
}

//We don't send the addresses each time to the server for listening when nothing changed.
function areAddressesTheSame(a: string[], b: string[]): boolean {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, index) => val === b[index]);
}
