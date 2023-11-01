import React from 'react';
import {ColorValue, View} from 'react-native';
import {spacing} from '@utils/styles';

interface Props {
    space?: number;
    lineSize?: number;
    horizontal?: boolean;
    color?: ColorValue;
}

const Separator: React.FC<Props> = ({space = spacing.s, lineSize = 0.5, horizontal, color}) => {
    return (
        <View
            style={[
                horizontal
                    ? {marginHorizontal: space / 2, width: lineSize}
                    : {marginVertical: space / 2, height: lineSize},
                color ? {backgroundColor: color} : {},
            ]}
        />
    );
};

export default Separator;
