import React from 'react';
import {StyleProp, TouchableOpacity, ViewStyle} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {manipulateAsync, SaveFormat} from 'expo-image-manipulator';

interface Props {
    style?: StyleProp<ViewStyle>;
    children: JSX.Element | JSX.Element[];
    onImageSuccess: (uri: string) => void;
}

const ThumbnailSelector: React.FC<Props> = ({style, onImageSuccess, children}: Props) => {
    const onPress = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.95,
            allowsMultipleSelection: false,
        });
        if (result.canceled) {
            return;
        }
        if (result.assets.length > 0) {
            const imageUri = result.assets[0].uri;
            const resizeResult = await manipulateAsync(imageUri, [{resize: {width: 250, height: 250}}], {
                compress: 1,
                format: SaveFormat.PNG,
                base64: true,
            });
            const resizedThumbnail = `data:image/png;base64,${resizeResult.base64}`;
            if (!resizedThumbnail) {
                return;
            }
            onImageSuccess(resizedThumbnail);
        }
    };

    return (
        <TouchableOpacity style={style} onPress={onPress}>
            {children}
        </TouchableOpacity>
    );
};

export default ThumbnailSelector;
