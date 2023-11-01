import React, {useMemo, useRef} from 'react';
import {rounded, spacing} from '@utils/styles';

import {AppTheme} from '@utils/styles/theme';
import {StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import Text from '@components/Text/Text';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {Entypo} from '@expo/vector-icons';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {beautifulLabel, shortenAddress} from '@utils/helper/address';
import {useDefaultWallet} from '@hooks/useWallet';
import {useDefaultKeyPair} from '@hooks/useKeyPair';
import PickAccountModal from '@components/PickAccountModal/PickAccountModal';
import AddressThumbnail from '@components/AddressThumbnail/AddressThumbnail';

interface Props {
    containerStyle?: StyleProp<ViewStyle>;
}
const CurrentAccount = ({containerStyle}: Props) => {
    const {defaultKeyPair} = useDefaultKeyPair();
    if (!defaultKeyPair) return null;

    const defaultWallet = useDefaultWallet();
    if (!defaultWallet) return null;

    const pickAccountModal = useRef<BottomSheetModal>();

    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const onPress = () => {
        pickAccountModal.current?.present();
    };

    const accountShortAddress = useMemo(() => {
        if (!defaultKeyPair) return '';
        return shortenAddress(defaultKeyPair.address);
    }, [defaultKeyPair]);

    const label = useMemo(
        () => beautifulLabel(defaultWallet.label, defaultKeyPair.label),
        [defaultKeyPair, defaultWallet],
    );

    return (
        <>
            <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress}>
                <AddressThumbnail address={defaultKeyPair.address} size={40} containerStyle={styles.image} />
                <View style={styles.textContainer}>
                    <Text style={styles.name} weight="600">
                        {label}
                    </Text>
                    <Text style={styles.address} weight="400">
                        {accountShortAddress}
                    </Text>
                </View>
                <Entypo name="chevron-down" style={styles.chevron} />
            </TouchableOpacity>
            <PickAccountModal ref={pickAccountModal} mode="change" />
        </>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            ...theme.cardVariants.simple,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: rounded.l,
            padding: spacing.l,
        },
        textContainer: {
            flex: 1,
        },
        image: {
            marginRight: spacing.s,
        },
        name: {
            fontSize: 12,
        },
        address: {
            fontSize: 13,
            color: theme.colors.textSecondary,
        },
        chevron: {
            fontSize: 20,
            color: theme.colors.textSecondary,
        },
    });

export default React.memo(CurrentAccount);
