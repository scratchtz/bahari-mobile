import {URL} from 'react-native-url-polyfill';

export const isValidUrl = (s: string, protocols: string[]) => {
    try {
        const url = new URL(s);
        return protocols
            ? url.protocol
                ? protocols.map(x => `${x.toLowerCase()}:`).includes(url.protocol)
                : false
            : true;
    } catch (err) {
        return false;
    }
};
