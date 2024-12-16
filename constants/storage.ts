export const StorageKeys = {
    deviceId: 'device-id',
    walletsKv: 'app-wallet',
    wallet: 'wallets',
    keyPair: 'key-pair',
    defaultKeyPair: 'default-keypair',
    theme: 'app-theme',
    unlockMethod: 'unlockMethod',
    displayCurrency: 'display-currency',
    autolockSeconds: 'autolock-seconds',
    contacts: 'app-contacts',
    contact: 'contact',
    usePushNotifications: 'use-push-notifications',
    useContinuity: 'use-continuity',
    language: 'language',
    currentNetwork: 'curr-network',
    currentWorkServer: 'curr-work-server',
    allNetworks: 'all-networks',
    allWorkServers: 'all-work-servers',
    validAddress: 'valid-address',
    nativeCurrency: 'native-currency',
    recentAddresses: 'recent-addresses',
    lastPutAppToBackground: 'last-app-to-background',
    pushNotificationToken: 'push-notification-token',
    biometricsOnSend: 'biometrics-on-send',
    latestAddressBalance: 'latest-address-balance',
    hidePriceGraph: 'hide-price-graph',
    useTor: 'use-tor',
};

export function storageKeyKeyPair(address: string) {
    return `${StorageKeys.keyPair}${address}`;
}
export function storageKeyWallet(id: string) {
    return `${StorageKeys.wallet}${id}`;
}

export function storageKeyContact(address: string) {
    return `${StorageKeys.contact}${address}`;
}
