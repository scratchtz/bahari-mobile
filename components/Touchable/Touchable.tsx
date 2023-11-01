import React from 'react';
import {Pressable as NativePressable, Platform, StyleProp, ViewStyle, PressableProps} from 'react-native';

interface Props extends PressableProps {
    containerStyle?: StyleProp<ViewStyle>;
    touchOpacity?: number;
}

const Pressable = ({
    containerStyle,
    android_ripple = {color: 'lightgrey'},
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
