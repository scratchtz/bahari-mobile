import React, {useMemo} from 'react';
import Lottie from 'lottie-react-native';
import {useAppTheme} from '@hooks/useAppTheme';

interface Props {
    size?: number;
    color?: string;
    loop?: boolean;
}

const Loading = ({size = 32, color, loop = true}: Props) => {
    const theme = useAppTheme();
    const colorFilters = useMemo(() => {
        let filters: {keypath: string; color: string}[] = [];
        for (let i = 1; i <= 4; i++) {
            filters.push({keypath: `Rectangle_${i}`, color: color || theme.colors.secondaryLight});
        }
        return filters;
    }, [theme, color]);

    return (
        <Lottie
            style={{width: size, height: size}}
            resizeMode="cover"
            colorFilters={colorFilters}
            source={require('@assets/animation/simple-progress.json')}
            autoPlay
            loop={loop}
        />
    );
};

export default React.memo(Loading);
