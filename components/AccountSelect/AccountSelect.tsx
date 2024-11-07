import React, {useEffect, useMemo, useRef, useState} from 'react';
import {rounded, spacing} from '@utils/styles';

import {AppTheme} from '@utils/styles/theme';
import {StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import Text from '@components/Text/Text';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {Ionicons} from '@expo/vector-icons';
import PickAccountModal from '@components/PickAccountModal/PickAccountModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import ButtonTiny from '@components/Button/ButtonTiny';
import {useTranslation} from 'react-i18next';

interface Props {
    containerStyle?: StyleProp<ViewStyle>;
    onSelectAccount: (keyPairAddress: string) => void;
}
const AccountSelect = ({containerStyle, onSelectAccount}: Props) => {
    const pickAccountModal = useRef<BottomSheetModal>();

    const theme = useAppTheme();
    const {t } = useTranslation();

    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const onPress = () => {
        pickAccountModal.current?.present();
    };

    const handleSelectKeyPair = (keyPairAddress: string) => {
        onSelectAccount(keyPairAddress);
    };

    return (
        <>
            <ButtonTiny
                icon={<Ionicons name="wallet" style={styles.walletIcon} />}
                title={t('send.address.my_wallets')}
                containerStyle={containerStyle}
                onPress={onPress}
            />
            <PickAccountModal ref={pickAccountModal} mode="select" onSelectKeyPair={handleSelectKeyPair} />
        </>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
        },
        myWalletsText: {
            color: theme.colors.primary,
            textDecorationLine: 'underline',
            marginRight: spacing.s,
        },
        chevron: {
            fontSize: 16,
            color: theme.colors.textSecondary,
        },
        walletIcon: {
            fontSize: 14,
            color: theme.colors.textPrimary,
        },
        textContainer: {
            flex: 1,
        },
        image: {
            width: 40,
            height: 40,
            marginRight: spacing.s,
            borderRadius: rounded.full,
        },
        address: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
    });

export default React.memo(AccountSelect);
