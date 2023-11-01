import {fromUnixTime} from 'date-fns';

export const getDateFromStringUnixTime = (unix: string): Date => {
    return fromUnixTime(parseInt(unix));
};
