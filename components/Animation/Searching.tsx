import React, {useMemo} from 'react';
import Lottie from 'lottie-react-native';

interface Props {
    size: number;
    color: string;
    loop?: boolean;
}
export const Searching = ({size, color, loop = true}: Props) => {
    const colorFilters = useMemo(() => {
        return Array(10)
            .fill(0)
            .map((_, i) => ({
                keypath: `Shape Layer ${i}`,
                color,
            }));
    }, [color]);

    return (
        <Lottie
            style={{height: size}}
            colorFilters={colorFilters}
            resizeMode="cover"
            source={require('@assets/animation/searching.json')}
            autoPlay
            loop={loop}
        />
    );
};
