import React, {useState} from 'react';
import {spacing, palette} from '@utils/styles';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import Tag from './Tag';
import {FontAwesome5} from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import {ToastController} from '@components/Toast/Toast';
import {useAppTheme} from '@hooks/useAppTheme';

interface Props {
    content: string;
    containerStyle?: StyleProp<ViewStyle>;
}

const CopyTag: React.FC<Props> = ({content, containerStyle}) => {
    const onCopy = async () => {
        await Clipboard.setStringAsync(content);
        ToastController.show({content: 'Copied to clipboard', kind: 'success'});
    };

    const theme = useAppTheme();

    return (
        <Tag
            icon={<FontAwesome5 name="copy" style={[styles.icon, {color: palette.amber500}]} />}
            title="Copy"
            onPress={onCopy}
            containerStyle={containerStyle}
        />
    );
};

const styles = StyleSheet.create({
    lottie: {
        width: 18,
        height: 18,
        marginRight: spacing.s,
    },
    icon: {
        fontSize: 14,
        marginRight: spacing.s,
    },
});

export default CopyTag;
