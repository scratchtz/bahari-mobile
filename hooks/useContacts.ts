import {useMMKVObject} from 'react-native-mmkv';
import {Contact, KeyPair} from '@utils/types';
import {ToastController} from '@components/Toast/Toast';
import {storageKeyContact, storageKeyKeyPair, StorageKeys} from '@constants/storage';
import {encryptedGetFromJson, encryptedSetJson, encryptedStorage} from '@storage/mmkv';
import {useMemo} from 'react';
import {getKeyPair, getWallet} from '@storage/wallet';
import {beautifulLabel} from '@utils/helper/address';

const contactsSort = (a: Contact, b: Contact) => a.name.toLowerCase().localeCompare(b.name.toLowerCase());
export function useContacts() {
    const [contacts, setContacts] = useMMKVObject<Contact[]>(StorageKeys.contacts, encryptedStorage);

    const appendContact = (newContact: Contact): boolean => {
        if (!newContact.name) {
            ToastController.show({kind: 'error', content: 'Name is required'});
            return false;
        }
        if (!newContact.address) {
            ToastController.show({kind: 'error', content: 'Address is required'});
            return false;
        }
        if (!contacts) {
            setContacts([newContact]);
            persistContact(newContact);
            return true;
        }

        for (let i = 0; i < contacts.length; i++) {
            const c = contacts[i];
            if (c.address === newContact.address) {
                ToastController.show({kind: 'error', content: 'Contact with same address already exists.'});
                return false;
            }
            if (c.name === newContact.name) {
                ToastController.show({kind: 'error', content: 'Contact with same name already exists.'});
                return false;
            }
        }

        const newContacts = [...contacts, newContact];
        newContacts.sort(contactsSort);
        setContacts(newContacts);
        persistContact(newContact);
        return true;
    };

    const editContact = (oldAddress: string, nc: Contact) => {
        if (!contacts) {
            return;
        }

        let newContacts = [...contacts];
        for (let i = 0; i < newContacts.length; i++) {
            const c = newContacts[i];
            if (c.address === oldAddress) {
                newContacts[i] = nc;
                break;
            }
        }
        newContacts.sort(contactsSort);
        setContacts(newContacts);
        persistContact(nc);
    };

    const deleteContact = (address: string) => {
        if (!contacts) return;
        const newContacts = contacts.filter(c => c.address !== address);
        setContacts(newContacts);
        removeContact(address);
    };

    //internal only don't export
    const persistContact = (c: Contact) => {
        const key = storageKeyContact(c.address);
        encryptedSetJson(key, c);
    };

    //internal only don't export
    const removeContact = (address: string) => {
        const key = storageKeyContact(address);
        encryptedStorage.delete(key);
    };

    return {contacts, appendContact, editContact, deleteContact};
}

export const getContact = (address: string): Contact | undefined => {
    return encryptedGetFromJson(storageKeyContact(address));
};

export function useAddress(address: string) {
    const [contact] = useMMKVObject<Contact>(storageKeyContact(address), encryptedStorage);
    const [keyPair] = useMMKVObject<KeyPair>(storageKeyKeyPair(address), encryptedStorage);

    if (contact) {
        return {name: contact.name, thumbnail: contact.thumbnail, isContact: true};
    }
    if (keyPair) {
        return {name: keyPair.label, thumbnail: keyPair.thumbnail, isContact: false};
    }
    return undefined;
}
export function getAddressDetails(address: string): {name: string; thumbnail?: string} | undefined {
    const contact = getContact(address);
    if (contact) {
        return {name: contact.name, thumbnail: contact.thumbnail};
    }

    //checking from my wallets
    const myAccDetails = getKeyPair(address);
    if (myAccDetails) {
        const wp = getWallet(myAccDetails.walletID);
        if (!wp) {
            return undefined;
        }
        return {name: beautifulLabel(wp.label, myAccDetails.label), thumbnail: myAccDetails.thumbnail};
    }
    return undefined;
}
