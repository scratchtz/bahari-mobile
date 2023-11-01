import {WorkResponse} from '@utils/rpc/types';
import {BAHARI_API_URL} from '@constants/endpoints';

export const UPPER_WORK_DIFFICULTY = 'fffffff800000000';
export type WorkDifficulty = 'fffffe0000000000' | 'fffffff800000000';
export async function rpcGenerateWork(
    hash: string,
    difficulty: WorkDifficulty = UPPER_WORK_DIFFICULTY,
): Promise<WorkResponse> {
    let body = {hash, difficulty};
    const res = await fetch(`${BAHARI_API_URL}/work`, {method: 'POST', body: JSON.stringify(body)});
    return res.json();
}
