import crypto from 'react-native-quick-crypto';

const AES_ALGO = 'aes-256-gcm';

export default class aes256 {
    public static encryptText = (password: string, data: string): string => {
        const cipher = crypto.createCipher(AES_ALGO, password);
        const encText = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
        return encText;
    };

    public static decryptText = (password: string, encryptedText: string): string => {
        const cipher = crypto.createDecipher(AES_ALGO, password);
        return cipher.update(encryptedText, 'hex', 'utf8') + cipher.final('utf8');
    };
}
