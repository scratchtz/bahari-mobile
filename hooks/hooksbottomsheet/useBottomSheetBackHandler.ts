import {BottomSheetModal, BottomSheetModalProps} from '@gorhom/bottom-sheet';
import {useCallback, useRef} from 'react';
import {BackHandler, Linking, NativeEventSubscription} from 'react-native';

/*
 * hook that dismisses the bottom sheet on the hardware back button press if it is visible
 * Credit: https://github.com/gorhom/react-native-bottom-sheet/issues/556
 */

export const useBottomSheetBackHandler = (bottomSheetRef: React.RefObject<BottomSheetModal | null>) => {
    const backHandlerSubscriptionRef = useRef<NativeEventSubscription | null>(null);
    const handleSheetPositionChange = useCallback<NonNullable<BottomSheetModalProps['onChange']>>(
        index => {
            const isBottomSheetVisible = index >= 0;
            if (isBottomSheetVisible && !backHandlerSubscriptionRef.current) {
                // Set up the back handler if the bottom sheet is right in front of the user
                backHandlerSubscriptionRef.current = BackHandler.addEventListener('hardwareBackPress', () => {
                    bottomSheetRef.current?.dismiss();
                    return true;
                });
            } else if (!isBottomSheetVisible) {
                backHandlerSubscriptionRef.current?.remove();
                backHandlerSubscriptionRef.current = null;
            }
        },
        [bottomSheetRef, backHandlerSubscriptionRef],
    );
    return {handleSheetPositionChange};
};
