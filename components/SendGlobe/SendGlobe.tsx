import React, {useMemo} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import Lottie from 'lottie-react-native';
import {useAppTheme} from '@hooks/useAppTheme';

interface Props {
    color?: string;
    size?: number;

    containerStyle?: StyleProp<ViewStyle>;
}

function colorAdjust(color: string, amount: number) {
    return (
        '#' +
        color
            .replace(/^#/, '')
            .replace(/../g, color =>
                ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2),
            )
    );
}
const SendGlobe = ({color, containerStyle, size = 120}: Props) => {
    const theme = useAppTheme();

    const keyColor = color ? color : theme.colors.secondaryLight;
    const keyColorLighter = useMemo(() => colorAdjust(keyColor, 40), [keyColor]);

    return (
        <View style={containerStyle}>
            <Lottie
                style={{height: size}}
                colorFilters={[
                    {keypath: 'Avatar Placeholder', color: keyColorLighter},
                    {keypath: 'Line Waves (2)', color: keyColorLighter},
                    {keypath: 'Line Waves (1)', color: keyColor},
                    {keypath: 'Waves (1)', color: keyColor},
                    {keypath: 'Waves (2)', color: keyColorLighter},
                    {keypath: 'Waves (3)', color: keyColorLighter},
                    {keypath: 'Line Waves (1) 2', color: keyColorLighter},
                    {keypath: 'Line Waves (2) 2', color: keyColorLighter},
                    {keypath: 'Layer 3/lottie_radio Outlines', color: keyColorLighter},
                    {keypath: `Avatar "Border"`, color: keyColorLighter},
                ]}
                resizeMode="contain"
                source={require('@assets/animation/loading-slow.json')}
                autoPlay
                loop
            />
        </View>
    );
};

export default React.memo(SendGlobe);
