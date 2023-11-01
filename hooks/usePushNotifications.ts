import {useMMKVBoolean} from 'react-native-mmkv';
import {StorageKeys} from '@constants/storage';
import {encryptedStorage} from '@storage/mmkv';
import {useEffect} from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {Platform} from 'react-native';
import {apiDeletePushToken, apiSendPushToken} from '@utils/api/pushToken';
import {ToastController} from '@components/Toast/Toast';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});
export default function usePushNotifications() {
    const [allowPush, setAllowPush] = useMMKVBoolean(StorageKeys.usePushNotifications, encryptedStorage);

    useEffect(() => {
        if (typeof allowPush === 'boolean') {
            void onPushSwitch(allowPush);
            return;
        }
        setAllowPush(true); //initial setup is true
    }, [allowPush]);

    const onPushSwitch = async (enabled: boolean) => {
        if (enabled) {
            const token = await registerForPushNotificationsAsync();
            if (token) {
                encryptedStorage.set(StorageKeys.pushNotificationToken, token);
                void apiSendPushToken();
            }
            return;
        } else {
            //If fails to delete on server, turn it on again
            const success = await apiDeletePushToken();
            setAllowPush(!success);
        }
    };

    return {
        allowPush,
        setAllowPush,
    };
}

async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    let token;
    if (Device.isDevice) {
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            encryptedStorage.set(StorageKeys.usePushNotifications, false);
            ToastController.show({kind: 'info', content: 'Push notification permission not granted.'});
            return;
        }
        token = (await Notifications.getDevicePushTokenAsync()).data;
    } else {
        console.warn('Must use physical device for Push Notifications');
    }
    return token;
}
