import {apiGet} from '@utils/api/api';

export type Representative = {
    account: string;
    alias: string;
    last_seen: number;
    weight_percent: string;
    uptime_percent: string;
};
export const apiFetchRepresentatives = async () => {
    return apiGet<Representative[]>('/representatives');
};
