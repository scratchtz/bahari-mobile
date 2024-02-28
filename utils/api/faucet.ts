import {apiGet, ApiRes, ApiResSuccess} from '@utils/api/api';

export async function apiFaucet(address: string): Promise<ApiRes<ApiResSuccess>> {
    return apiGet<ApiResSuccess>(`/faucet/${address}`);
}
