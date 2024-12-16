import {useMMKVObject, useMMKVString} from 'react-native-mmkv';
import {StorageKeys} from '@constants/storage';
import {encryptedStorage} from '@storage/mmkv';
import {Network} from '@utils/types/network';
import {isValidUrl} from '@utils/helper/url';
import {ToastController} from '@components/Toast/Toast';
import {BAHARI_RPC_URL, BAHARI_WORK_URL} from '@constants/endpoints';
import {useCallback, useMemo} from 'react';

export const DefaultServer: Network = {
    label: 'Bahari',
    endpoint: BAHARI_WORK_URL,
};

export const useWorkServer = () => {
    const [currServer, setCurrentServer] = useMMKVString(StorageKeys.currentWorkServer, encryptedStorage);
    const [servers, setServers] = useMMKVObject<Network[]>(StorageKeys.allWorkServers, encryptedStorage);

    if (!currServer) {
        setCurrentServer(DefaultServer.endpoint);
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
        if (!servers) {
            setServers([n]);
            return true;
        }
        setServers([...servers, n]);
        return true;
    };
    const deleteNetwork = (endpoint: string) => {
        if (endpoint === BAHARI_RPC_URL) {
            ToastController.show({kind: 'error', title: 'Error', content: "Can't delete the default network"});
            return;
        }
        if (!servers) {
            return;
        }
        setServers(servers.filter(n => n.endpoint !== endpoint));
    };

    const allNetworks: Network[] = useMemo(() => {
        if (!servers) return [DefaultServer];
        return [DefaultServer, ...servers];
    }, [servers]);

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
        return getLabel(currServer || BAHARI_RPC_URL);
    }, [currServer]);
    const changeCurrentNetwork = (endpoint: string) => {
        setCurrentServer(endpoint);
    };

    return {
        allNetworks,
        currentNetwork: currServer,
        currentNetworkLabel,
        changeCurrentNetwork,
        getLabel,
        appendNetwork,
        deleteNetwork,
    };
};
