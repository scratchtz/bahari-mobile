//TODO TEST THIS
import {tools} from 'nanocurrency-web';

export interface NanoUriQuery {
    amount?: string;
    label?: string;
    message?: string;
}

export const NanoUriKinds = ['nano', 'nanorep', 'nanokey', 'nanoseed', 'nanoblock'] as const;
export type NanoUriKind = (typeof NanoUriKinds)[number];
export interface NanoUriParams {
    kind: NanoUriKind;
    address?: string;
    privateKey?: string;
    seed?: string;
    blob?: string;
    query?: NanoUriQuery;
}

const SCHEME = 'nano://';

export function formNanoUri(params: NanoUriParams): string {
    if (!params.kind) {
        return '';
    }
    let item = '';
    switch (params.kind) {
        case 'nano':
        case 'nanorep':
            item = params.address || '';
            break;
        case 'nanokey':
            item = params.privateKey || '';
            break;
        case 'nanoseed':
            item = params.seed || '';
            break;
        case 'nanoblock':
            item = params.blob || '';
            break;
        default:
            return '';
    }

    let query = '';
    if (params.query) {
        let split = [];
        for (const [key, value] of Object.entries(params.query)) {
            split.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        }
        query = `?${split.join('&')}`;
    }
    return `${SCHEME}${params.kind}:${item}${query}`;
}

export function parseNanoUri(uri: string): NanoUriParams {
    //Check first if it's plain address
    if (tools.validateAddress(uri)) {
        //by default when nothing else is provided we assume transfer to this address.
        return {
            kind: 'nano',
            address: uri,
        };
    }

    //remove scheme if present
    uri = uri.replace('nano://', '');

    //split to get queries
    const split = uri.split('?');

    //get queries first
    let query: NanoUriQuery = {};
    if (split.length > 1) {
        const queryParams = split[split.length - 1].split('&');
        for (let i = 0; i < queryParams.length; i++) {
            const querySplit = queryParams[i].split('=');
            if (querySplit.length !== 2) {
                continue;
            }
            const key = querySplit[0] as 'amount' | 'label' | 'message';
            query[key] = querySplit[1];
        }
    }

    const preUri = split[0];
    const preUriSplit = preUri.split(':');
    if (preUriSplit.length !== 2) {
        throw 'failed to parse';
    }

    let kind: NanoUriKind | undefined = undefined;
    for (let i = 0; i < NanoUriKinds.length; i++) {
        if (preUriSplit[0] === NanoUriKinds[i]) {
            kind = preUriSplit[0];
        }
    }

    if (!kind) {
        throw 'failed to parse';
    }

    let result: NanoUriParams = {
        kind,
        query,
    };

    switch (preUriSplit[0] as NanoUriKind) {
        case 'nano':
        case 'nanorep':
            result.address = preUriSplit[1];
            break;
        case 'nanokey':
            result.privateKey = preUriSplit[1];
            break;
        case 'nanoseed':
            result.seed = preUriSplit[1];
            break;
        case 'nanoblock':
            result.blob = preUriSplit[1];
            break;
        default:
            throw 'failed to parse';
    }

    return result;
}
