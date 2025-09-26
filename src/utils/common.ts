import CryptoJS from 'crypto-js';

export function decryptData(encoded: string, passphrase: string): any {
    const decryptedData = JSON.parse(
        CryptoJS.AES.decrypt(encoded, passphrase).toString(CryptoJS.enc.Utf8)
    );
    return decryptedData;
}
