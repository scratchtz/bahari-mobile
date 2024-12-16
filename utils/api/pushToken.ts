import {encryptedSetJson, encryptedStorage} from '@storage/mmkv';
import {StorageKeys} from '@constants/storage';
import {getAllAddresses} from '@storage/wallet';
import {apiPost, ApiResSuccess} from '@utils/api/api';

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
