import {AppState, AppStateStatus} from 'react-native';
import {useEffect, useRef, useState} from 'react';

interface Props {
    onForeground: () => void;
    onBackground: () => void;
}
export default function useAppState({onForeground, onBackground}: Props) {
    const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (appState === 'background' && nextAppState === 'active') {
            onForeground && onForeground();
        } else if (nextAppState === 'background') {
            onBackground && onBackground();
        }
        setAppState(nextAppState);
    };

    useEffect(() => {
        const appState = AppState.addEventListener('change', handleAppStateChange);
        return () => appState.remove();
    }, [onForeground, onBackground, appState]);

    return {appState};
}
