import {useEffect, useRef} from 'react';

export const useRenderChecker = (name: string) => {
    const renderCount = useRef(0);
    useEffect(() => {
        renderCount.current++;
        console.log('render...', name, renderCount.current);
    });
};
