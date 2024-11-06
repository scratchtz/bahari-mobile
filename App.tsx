import 'text-encoding-polyfill';
import 'react-native-url-polyfill/auto';

import 'intl';
import 'intl/locale-data/jsonp/en';
import 'intl/locale-data/jsonp/ja';
import 'intl/locale-data/jsonp/ko';
import 'intl/locale-data/jsonp/zh';
import 'intl/locale-data/jsonp/sw';
import 'intl-pluralrules';

import {Initializer} from './Initializer';

global.Buffer = require('@craftzdog/react-native-buffer').Buffer;

import React, {useCallback} from 'react';
import Navigation from '@navigation/Navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useEncryptionStorage} from '@hooks/useEncryptionStorage';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import Toast from '@components/Toast/Toast';
import LockScreen from '@screens/LockScreen/LockScreen';
import {enableLayoutAnimations} from 'react-native-reanimated';
import {encryptedStorage} from '@storage/mmkv';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';
import {createSyncStoragePersister} from '@tanstack/query-sync-storage-persister';
import {QueryClient} from '@tanstack/react-query';
import 'intl-pluralrules';
import './i18n'

//Don't remove this, on Android screens are inconsistent
enableLayoutAnimations(false);

void SplashScreen.preventAutoHideAsync().catch(e => console.warn(e));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
        },
    },
});

const clientStorage = {
    setItem: (key: string, value: any) => {
        encryptedStorage.set(key, value);
    },
    getItem: (key: string) => {
        const value = encryptedStorage.getString(key);
        return value === undefined ? null : value;
    },
    removeItem: (key: string) => {
        encryptedStorage.delete(key);
    },
};

export const clientPersister = createSyncStoragePersister({storage: clientStorage});

export default function App() {
    const [encryptionStorageLoaded] = useEncryptionStorage();
    const [fontsLoaded] = useFonts({
        'OpenSans-300': require('./assets/fonts/OpenSans/OpenSans-300.ttf'),
        'OpenSans-400': require('./assets/fonts/OpenSans/OpenSans-400.ttf'),
        'OpenSans-500': require('./assets/fonts/OpenSans/OpenSans-500.ttf'),
        'OpenSans-600': require('./assets/fonts/OpenSans/OpenSans-600.ttf'),
        'OpenSans-700': require('./assets/fonts/OpenSans/OpenSans-700.ttf'),
        'OpenSans-800': require('./assets/fonts/OpenSans/OpenSans-800.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) await SplashScreen.hideAsync();
    }, [fontsLoaded]);

    if (!fontsLoaded || !encryptionStorageLoaded) {
        return null;
    }
    return (
        <SafeAreaProvider onLayout={onLayoutRootView}>
            <PersistQueryClientProvider client={queryClient} persistOptions={{persister: clientPersister}}>
                <GestureHandlerRootView style={styles.rootView}>
                    <BottomSheetModalProvider>
                        <Initializer />
                        <Navigation />
                        <LockScreen />
                    </BottomSheetModalProvider>
                    <Toast />
                </GestureHandlerRootView>
            </PersistQueryClientProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
    },
});
