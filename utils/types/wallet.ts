export interface WalletKV {
    id: string;
}

export const MnemonicPathKinds = ['4lv', '3lv', 'blake'] as const;

export type MnemonicPathKind = (typeof MnemonicPathKinds)[number];

export interface Wallet {
    id: string;
    label: string;
    thumbnail?: string;
    kind: 'mnemonic' | 'key-only' | 'hardware';
    mnemonic?: string;
    keyPairsAddresses: string[];
    lastAccountIndex: number;
    pathKind?: MnemonicPathKind;
}

export interface KeyPairKV {
    address: string;
}

export interface KeyPair {
    address: string;
    walletID: string;
    thumbnail?: string;
    label: string;
    publicKey: string;
    privateKey: string;
    accountIndex: number;
    path?: string;
}
