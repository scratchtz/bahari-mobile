import {apiGet, ApiRes} from '@utils/api/api';

export interface INanoPrice {
    usd: number;
    usd_24h_change: number;
}
export async function apiFetchNanoPrice(): Promise<ApiRes<INanoPrice>> {
    return apiGet<INanoPrice>('/price/nano');
}

export interface IExchangeRates {
    currency: string;
    rates: {
        [Property in string]: string;
    };
}
export async function apiFetchExchangeRates(): Promise<ApiRes<IExchangeRates>> {
    return apiGet<IExchangeRates>('/price/all');
}
