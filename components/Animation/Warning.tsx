import React, {useMemo} from 'react';
import Lottie from 'lottie-react-native';

interface Props {
    size: number;
    loop?: boolean;
}
export const Warning = ({size, loop = true}: Props) => {
    return (
        <Lottie
            style={{height: size}}
            resizeMode="cover"
            source={require('@assets/animation/warning.json')}
            autoPlay
            loop={loop}
        />
    );
};
