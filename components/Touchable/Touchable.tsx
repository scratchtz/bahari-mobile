import React from 'react';
import {Pressable as NativePressable, Platform, StyleProp, ViewStyle, PressableProps} from 'react-native';
import {rounded, spacing} from '@utils/styles';

interface Props extends PressableProps {
    containerStyle?: StyleProp<ViewStyle>;
    touchOpacity?: number;
}

const Pressable = ({
    containerStyle,
    android_ripple = {color: 'rgba(255,255,255,0.05)'},
    touchOpacity = 0.5,
    children,
    ...restOfProps
}: Props) => {
    return (
        <NativePressable
            style={({pressed}) => [
                containerStyle,
                {
                    opacity: Platform.OS !== 'android' && pressed ? touchOpacity : 1,
                },
            ]}
            android_ripple={android_ripple}
            {...restOfProps}>
            {children}
        </NativePressable>
    );
};
export default Pressable;
