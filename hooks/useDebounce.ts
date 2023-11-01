import {useRef} from 'react';

//Used to debounce presses, e.g. when a user double taps a button quickly.
export const useDebounce = () => {
    const busy = useRef(false);
    const debounce = (callback: Function) => {
        setTimeout(() => {
            busy.current = false;
        }, 1000);

        if (!busy.current) {
            busy.current = true;
            callback();
        }
    };

    return {debounce};
};
