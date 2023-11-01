export interface accountBalanceRes {
    balance: string;
    pending: string;
    receivable: string;
}

export interface History {
    type: 'receive' | 'send';
    account: string;
    amount: string;
    local_timestamp: string;
    height: string;
    hash: string;
    confirmed: string;
}

export interface accountHistoryRes {
    account: string;
    history: History[];
    previous: string;
}

export interface accountsReceivableRes {
    blocks: accountsReceivableBlock;
}
export interface accountsReceivableBlock {
    [key: string]: string[];
}

export interface BlockInfo {
    block_account: string;
    amount: string;
    balance: string;
    height: string;
    local_timestamp: string;
    successor: string;
    confirmed: string;
    contents: BlockInfoContents;
    subtype: string;
}
export interface BlockInfoContents {
    type: string;
    account: string;
    previous: string;
    representative: string;
    balance: string;
    link: string;
    link_as_account: string;
    signature: string;
    work: string;
}

export interface WorkResponse {
    work: string;
}

export type AccountNotFoundError = 'Account not found';
export interface AccountInfo {
    error?: AccountNotFoundError | string;
    frontier: string;
    open_block: string;
    representative_block: string;
    balance: string;
    modified_timestamp: string;
    block_count: string;
    account_version: string;
    confirmation_height: string;
    confirmation_height_frontier: string;
    representative?: string;
}

export interface ProcessBlockRes {
    hash?: string;
    error?: string;
}
export interface ProcessBlock {
    action: 'process';
    json_block: 'true' | 'false';
    subtype: 'receive' | 'open' | 'send';
    block: BlockToProcess;
}
export interface BlockToProcess {
    type: string;
    account: string;
    previous: string;
    representative: string;
    balance: string;
    link: string;
    signature: string;
    work?: string;
}

export type AccountsBalances = Record<
    string,
    {
        balance: string;
        pending: string;
        receivable: string;
    }
>;

export type AccountsBalancesResponse = {
    balances: AccountsBalances;
};
