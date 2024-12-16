import {WorkResponse} from '@utils/rpc/types';
import {BAHARI_API_URL, BAHARI_WORK_URL} from '@constants/endpoints';
import {encryptedStorage} from '@storage/mmkv';
import {StorageKeys} from '@constants/storage';

export const WorkDifficulty = {
    Upper: 'fffffff800000000',
    Lower: 'fffffe0000000000',
} as const;

export type WorkDifficulty = (typeof WorkDifficulty)[keyof typeof WorkDifficulty];
export async function rpcGenerateWork(
    hash: string,
    difficulty: WorkDifficulty = WorkDifficulty.Upper,
): Promise<WorkResponse> {
    let body = {action: 'work_generate', hash, difficulty};
    const endpoint = encryptedStorage.getString(StorageKeys.currentWorkServer) || BAHARI_WORK_URL;
    const res = await fetch(endpoint, {method: 'POST', body: JSON.stringify(body)});
    return res.json();
}
