import {generateMnemonic, mnemonicToSeedHex} from '@dreson4/react-native-quick-bip39';
import {KeyPair, MnemonicPathKind, Wallet} from '@utils/types';
import {derivePath} from 'ed25519-hd-key';
import crypto from 'react-native-quick-crypto';
import NanoAddress from 'nanocurrency-web/dist/lib/nano-address';
import {uniqueNamesGenerator, colors, animals} from 'unique-names-generator';
import Ed25519 from 'nanocurrency-web/dist/lib/ed25519';
import * as bip39 from 'bip39';
import * as nanocurrency from 'nanocurrency';

const shortName: string = uniqueNamesGenerator({
    dictionaries: [colors, animals],
});
export function generateNewMnemonicWallet(
    pathKind: MnemonicPathKind,
    wordlist?: string[],
    strength: 128 | 256 = 128,
): [Wallet, KeyPair] {
    if (strength !== 128 && strength !== 256) {
        throw 'invalid strength when generating passphrase';
    }
    const mnemonic = generateMnemonic(strength, wordlist);
    return generateWalletFromMnemonic(mnemonic, pathKind);
}

export function generateWalletFromMnemonic(
    mnemonic: string,
    pathKind: MnemonicPathKind,
    label?: string,
): [Wallet, KeyPair] {
    const walletID = Buffer.from(crypto.randomBytes(32)).toString('hex');
    const firstKeyPair = generateKeyPairFromMnemonic(walletID, mnemonic, 0, pathKind);

    const wallet: Wallet = {
        id: walletID,
        label: label || shortName,
        kind: 'mnemonic',
        mnemonic: mnemonic,
        keyPairsAddresses: [firstKeyPair.address],
        lastAccountIndex: firstKeyPair.accountIndex,
        pathKind,
    };

    return [wallet, firstKeyPair];
}

export function generateKeyPairFromMnemonic(
    walletID: string,
    mnemonic: string,
    index: number,
    pathKind: MnemonicPathKind,
): KeyPair {
    //Old nano style, use this one only for importing wallets not for new wallets
    if (pathKind === 'blake') {
        const seed = bip39.mnemonicToEntropy(mnemonic);
        const privateKey = nanocurrency.deriveSecretKey(seed, index);
        const publicKey = nanocurrency.derivePublicKey(privateKey);
        const address = nanocurrency.deriveAddress(publicKey, {useNanoPrefix: true});
        return {
            walletID,
            address,
            privateKey,
            publicKey,
            label: `account ${index + 1}`,
            accountIndex: index,
        };
    }

    const hexSeed = mnemonicToSeedHex(mnemonic);
    const path = getPath(pathKind, index);
    const secretKey = derivePath(path, hexSeed).key;
    const secretKeyHex = Buffer.from(secretKey).toString('hex');

    const {privateKey, publicKey, address} = newKeyPairFromHexSecretKey(secretKeyHex);

    return {
        walletID,
        address,
        privateKey,
        publicKey,
        path,
        label: `account ${index + 1}`,
        accountIndex: index,
    };
}

export const newKeyPairFromHexSecretKey = (
    secretKey: string,
): {privateKey: string; publicKey: string; address: string} => {
    const keyPair = new Ed25519().generateKeys(secretKey);
    const address = NanoAddress.deriveAddress(keyPair.publicKey);

    return {privateKey: keyPair.privateKey, publicKey: keyPair.publicKey, address};
};

export const getPath = (pathKind: MnemonicPathKind, index: number): string => {
    //TODO add other paths from other popular wallets
    switch (pathKind) {
        case '3lv':
            return `m/44'/165'/${index}'`;
        case '4lv':
            return `m/44'/165'/${index}'/0'`;
    }
    throw 'invalid path';
};
