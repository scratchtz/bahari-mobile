import React, {useMemo} from 'react';
import Jazzicon from 'react-native-svg-jazzicon';
import {Image} from 'expo-image';
import {StyleProp, View, ViewStyle} from 'react-native';
import {getAddressDetails, useAddress} from '@hooks/useContacts';
import {Ionicons} from '@expo/vector-icons';
import {useAppTheme} from '@hooks/useAppTheme';
interface Props {
    uri?: any;
    size: number;
    address: string;
    containerStyle?: StyleProp<ViewStyle>;
}
const AddressThumbnail = ({uri, size, address, containerStyle}: Props) => {
    const theme = useAppTheme();
    const item = useAddress(address);
    const thumbnail = useMemo(() => {
        if (uri) {
            return uri;
        }
        if (item) {
            return item.thumbnail;
        }
    }, [item, uri]);

    if (thumbnail) {
        return (
            <View style={containerStyle}>
                <Image source={{uri: thumbnail}} style={[{width: size, height: size, borderRadius: size / 2}]} />
            </View>
        );
    }
    if (!address) {
        return (
            <View
                style={[
                    {
                        width: size,
                        height: size,
                        backgroundColor: theme.colors.cardBackgroundLight,
                        borderRadius: size / 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                    containerStyle,
                ]}>
                <Ionicons name="image" size={32} color={theme.colors.textSecondary} />
            </View>
        );
    }
    return <Jazzicon size={size} address={address} containerStyle={containerStyle} />;
};

export default React.memo(AddressThumbnail);
