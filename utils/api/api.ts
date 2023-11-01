import {getRPC} from '@utils/rpc/rpc';
import {BAHARI_API_URL} from '@constants/endpoints';
import {encryptedStorage} from '@storage/mmkv';
import {Platform} from 'react-native';
import {StorageKeys} from '@constants/storage';
import crypto from 'react-native-quick-crypto';

export const ApiStatus = {
    Success: 200,
    BadRequest: 400,
    Unauthorized: 401,
    ServerError: 500,
};

export interface ApiResSuccess {
    success: boolean;
}
export interface ApiRes<T> {
    data?: T;
    status: number;
    error?: string;
}

export interface ApiError {
    status: number;
    error?: string;
}
export const apiGet = async <T>(url: string): Promise<ApiRes<T>> => {
    const endpoint = `${BAHARI_API_URL}${url}`;
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: getHeaders(),
    });
    const res = await response.json();
    if (res.status === ApiStatus.Success) {
        return {data: res.data, status: res.status};
    }
    throw `${res.status}:${res.error || ''}`;
};

export const apiPost = async <T>(url: string, body?: any): Promise<ApiRes<T>> => {
    const endpoint = `${BAHARI_API_URL}${url}`;
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    const res = await response.json();
    if (res.status === ApiStatus.Success) {
        return {data: res.data, status: res.status};
    }
    throw `${res.status}:${res.error || ''}`;
};

type Headers = {
    'Content-Type': string;
    Platform: string;
    Version: string;
    'Device-ID': string;
};

const getHeaders = (): Headers => {
    return {
        'Content-Type': 'application/json',
        Platform: Platform.OS,
        Version: Platform.Version.toString(),
        'Device-ID': getDeviceID(),
    };
};

const getDeviceID = (): string => {
    let deviceID = encryptedStorage.getString(StorageKeys.deviceId);
    if (!deviceID) {
        deviceID = Buffer.from(crypto.randomBytes(16)).toString('hex');
        encryptedStorage.set(StorageKeys.deviceId, deviceID);
    }
    return deviceID;
};
