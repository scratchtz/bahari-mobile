import {WorkResponse} from '@utils/rpc/types';
import {BAHARI_API_URL} from '@constants/endpoints';

export const WorkDifficulty = {
    Upper: 'fffffff800000000',
    Lower: 'fffffe0000000000',
} as const;

export type WorkDifficulty = (typeof WorkDifficulty)[keyof typeof WorkDifficulty];
export async function rpcGenerateWork(
    hash: string,
    difficulty: WorkDifficulty = WorkDifficulty.Upper,
): Promise<WorkResponse> {
    let body = {hash, difficulty};
    const res = await fetch(`${BAHARI_API_URL}/work`, {method: 'POST', body: JSON.stringify(body)});
    return res.json();
}
