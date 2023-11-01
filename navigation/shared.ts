import {CommonActions, createNavigationContainerRef} from '@react-navigation/native';
import {NavigationAction} from '@react-navigation/routers';

export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params?: any) {
    if (navigationRef.isReady()) {
        // @ts-ignore
        navigationRef.navigate(name, params);
    }
}

export function navigateDispatch(action: any | ((state: any) => NavigationAction)) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(action);
    }
}

export function navigateReset(routes: {name: string; params?: any}[]) {
    if (navigationRef.isReady()) {
        navigationRef.reset({
            index: 0,
            routes: routes,
        });
    }
}

export function navigateReplace(routes: {name: string; params?: any}[]) {
    if (navigationRef.isReady()) {
        navigationRef.reset({
            index: 0,
            routes: routes,
        });
    }
}
