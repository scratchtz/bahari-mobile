import {
    accountBalanceRes,
    accountHistoryRes,
    AccountInfo,
    AccountsBalancesResponse,
    accountsReceivableRes,
    BlockInfo,
    ProcessBlock,
    ProcessBlockRes,
} from '@utils/rpc/types';
import {encryptedStorage} from '@storage/mmkv';
import {StorageKeys} from '@constants/storage';
import {BAHARI_RPC_URL} from '@constants/endpoints';

export function getRPC(): string {
    if (encryptedStorage) {
        return encryptedStorage.getString(StorageKeys.currentNetwork) || BAHARI_RPC_URL;
    }
    return BAHARI_RPC_URL;
}

async function apiPost<T>(body: any): Promise<T> {
    const res = await fetch(getRPC(), {method: 'POST', body: JSON.stringify(body)});
    return await res.json();
}

export async function rpcAccountBalance(account: string): Promise<accountBalanceRes> {
    return apiPost<accountBalanceRes>({action: 'account_balance', account});
}

export async function rpcAccountsBalances(accounts: string[]): Promise<AccountsBalancesResponse> {
    return apiPost<AccountsBalancesResponse>({action: 'accounts_balances', accounts});
}

export async function rpcAccountHistory(account: string, count: number = 5): Promise<accountHistoryRes | undefined> {
    if (!account) return undefined;
    return apiPost<accountHistoryRes>({action: 'account_history', account, count});
}

export async function rpcAccountsReceivable(accounts: string[], count: number = 10) {
    if (!accounts || accounts.length === 0) return undefined;
    return apiPost<accountsReceivableRes>({action: 'accounts_receivable', accounts: accounts, count});
}

export async function rpcBlockInfo(blockHash: string) {
    let body = {
        action: 'block_info',
        json_block: 'true',
        hash: blockHash,
    };
    return apiPost<BlockInfo>(body);
}

export async function rpcAccountInfo(address: string): Promise<AccountInfo> {
    return apiPost<AccountInfo>({action: 'account_info', account: address, representative: true});
}

export async function rpcProcessBlock(data: ProcessBlock): Promise<ProcessBlockRes> {
    return apiPost<ProcessBlockRes>(data);
}

type AccountRepresentativeRes = {
    representative: string;
};
export async function rpcAccountRepresentative(account: string): Promise<AccountRepresentativeRes> {
    return apiPost<AccountRepresentativeRes>({action: 'account_representative', account});
}
