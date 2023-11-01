import {apiGet, ApiRes, ApiResSuccess} from '@utils/api/api';
import {INanoPrice} from '@utils/api/price';

export async function apiFaucet(address: string): Promise<ApiRes<ApiResSuccess>> {
    return apiGet<ApiResSuccess>(`/faucet/${address}`);
}
