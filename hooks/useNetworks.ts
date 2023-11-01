import {useMMKVObject, useMMKVString} from 'react-native-mmkv';
import {StorageKeys} from '@constants/storage';
import {encryptedStorage} from '@storage/mmkv';
import {Network} from '@utils/types/network';
import {isValidUrl} from '@utils/helper/url';
import {ToastController} from '@components/Toast/Toast';
import {BAHARI_RPC_URL} from '@constants/endpoints';
import {useCallback, useMemo} from 'react';

export const BahariDefaultNode: Network = {
    label: 'Bahari Node',
    endpoint: BAHARI_RPC_URL,
};
export const useNetworks = () => {
    const [currentNetwork, setCurrentNetwork] = useMMKVString(StorageKeys.currentNetwork, encryptedStorage);
    const [networks, setNetworks] = useMMKVObject<Network[]>(StorageKeys.allNetworks, encryptedStorage);

    //TODO fix this
    if (!currentNetwork) {
        setCurrentNetwork(BahariDefaultNode.endpoint);
    }
    const appendNetwork = (n: Network): boolean => {
        if (!isValidUrl(n.endpoint, ['http', 'https'])) {
            ToastController.show({
                kind: 'error',
                title: 'Error',
                content: 'Enter a valid endpoint that starts with https or http',
                timeout: 6000,
            });
            return false;
        }
        for (let i = 0; i < allNetworks.length; i++) {
            const old = allNetworks[i];
            if (old.endpoint === n.endpoint) {
                ToastController.show({
                    kind: 'error',
                    title: 'Error',
                    content: 'Network with the same endpoint already exists.',
                });
                return false;
            }
            if (old.label === n.label) {
                ToastController.show({
                    kind: 'error',
                    title: 'Error',
                    content: 'Network with same name already exists, change the name.',
                });
                return false;
            }
        }
        if (!networks) {
            setNetworks([n]);
            return true;
        }
        setNetworks([...networks, n]);
        return true;
    };
    const deleteNetwork = (endpoint: string) => {
        if (endpoint === BAHARI_RPC_URL) {
            ToastController.show({kind: 'error', title: 'Error', content: "Can't delete the default network"});
            return;
        }
        if (!networks) {
            return;
        }
        setNetworks(networks.filter(n => n.endpoint !== endpoint));
    };

    const allNetworks: Network[] = useMemo(() => {
        if (!networks) return [BahariDefaultNode];
        return [BahariDefaultNode, ...networks];
    }, [networks]);

    const getLabel = useCallback(
        (endpoint: string) => {
            for (let i = 0; i < allNetworks.length; i++) {
                const n = allNetworks[i];
                if (n.endpoint === endpoint) {
                    return n.label;
                }
            }
            return '';
        },
        [allNetworks],
    );

    const currentNetworkLabel = useMemo(() => {
        return getLabel(currentNetwork || BAHARI_RPC_URL);
    }, [currentNetwork]);
    const changeCurrentNetwork = (endpoint: string) => {
        setCurrentNetwork(endpoint);
    };

    return {
        allNetworks,
        currentNetwork,
        currentNetworkLabel,
        changeCurrentNetwork,
        getLabel,
        appendNetwork,
        deleteNetwork,
    };
};
