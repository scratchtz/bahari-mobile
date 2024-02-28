import React, {useCallback, useMemo, useRef, useState} from 'react';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {useBottomSheetBackHandler} from '@hooks/hooksbottomsheet/useBottomSheetBackHandler';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {AppTheme, rounded, spacing} from '@utils/styles';
import {View, StyleSheet} from 'react-native';
import PickAccountScreen from '@components/PickAccountModal/PickAccountScreen';
import EditAccountScreen from '@components/PickAccountModal/EditAccountScreen';
import EditWalletScreen from '@components/PickAccountModal/EditWalletScreen';
import type {PickerMode} from '@components/PickAccountModal/accountItem.types';
import {useDefaultWallet, useWalletKVs} from '@hooks/useWallet';
import {useDefaultKeyPair} from '@hooks/useKeyPair';
import {ToastController} from '@components/Toast/Toast';
import {navigate} from '@navigation/shared';
import {useAllWalletsBalance} from '@components/PickAccountModal/accountItem.hooks';
import {modalOpacity} from '@constants/variables';

interface Props {
    mode: PickerMode;
    onSelectKeyPair?: (keyPairAddress: string) => void;
}

type Screens = 'pick-account' | 'edit-account' | 'edit-wallet';
const PickAccountModal = (props: Props, ref: any) => {
    useDefaultWallet();
    useAllWalletsBalance(true);

    const defaultWallet = useDefaultWallet();
    const {defaultKeyPair, setDefaultKeyPairAddress} = useDefaultKeyPair();
    const walletKvs = useWalletKVs();

    if (!walletKvs || !defaultWallet || !defaultKeyPair) return null;

    const [currentScreen, setCurrentScreen] = useState<Screens>('pick-account');
    const [editWalletID, setEditWalletID] = useState<string>('');
    const [editKeyPairAddress, setEditKeyPairAddress] = useState<string>('');

    const [currentWalletID, setCurrentWalletID] = useState<string>(defaultWallet.id);
    const [currentKeyPairAddress, setCurrentKeyPairAddress] = useState<string>('');

    const selectedAccountAddress = props.mode === 'change' ? defaultKeyPair.address : currentKeyPairAddress;
    const {handleSheetPositionChange} = useBottomSheetBackHandler(ref);

    const snapPoints = useMemo(() => ['90%', '94%'], []);
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} opacity={modalOpacity} disappearsOnIndex={-1} appearsOnIndex={0} />
        ),
        [],
    );

    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const onClose = () => {
        ref.current.close();
    };

    const onPressAccount = (keyPairAddress: string) => {
        if (props.mode === 'change') {
            setDefaultKeyPairAddress(keyPairAddress);
            ToastController.show({kind: 'info', content: 'Account changed', timeout: 1000});
        }
        if (props.mode === 'select') {
            props.onSelectKeyPair && props.onSelectKeyPair(keyPairAddress);
        }
        ref.current.close();
    };

    const onImportWallet = () => {
        ref.current.close();
        navigate('ImportPrivateKey', {walletID: currentWalletID});
    };
    const onEditWallet = (walletID: string) => {
        setEditWalletID(walletID);
        setCurrentScreen('edit-wallet');
    };
    const onEditAccount = (keyPairAddress: string) => {
        setEditKeyPairAddress(keyPairAddress);
        setCurrentScreen('edit-account');
    };

    const onDoneWalletScreen = () => {
        setCurrentScreen('pick-account');
    };
    const onDoneAccountScreen = () => {
        setCurrentScreen('pick-account');
    };

    const onPressWallet = (walletID: string) => {
        setCurrentWalletID(walletID);
    };

    //reset screen to pick
    const onSheetChange = (index: number) => {
        if (index === -1) {
            setCurrentScreen('pick-account');
            setCurrentWalletID(defaultWallet.id);
            setCurrentKeyPairAddress('');
        }
        handleSheetPositionChange(index);
    };

    return (
        <BottomSheetModal
            style={styles.flex}
            containerStyle={styles.flex}
            enablePanDownToClose
            backgroundStyle={styles.container}
            handleIndicatorStyle={styles.indicator}
            android_keyboardInputMode={'adjustResize'}
            ref={ref}
            onChange={onSheetChange}
            backdropComponent={renderBackdrop}
            snapPoints={snapPoints}>
            <View style={styles.flex}>
                {currentScreen === 'pick-account' && (
                    <PickAccountScreen
                        currentWalletID={currentWalletID}
                        currentKeyPairAddress={selectedAccountAddress}
                        onPressAccount={onPressAccount}
                        onClose={onClose}
                        onEditAccount={onEditAccount}
                        onEditWallet={onEditWallet}
                        onImportWallet={onImportWallet}
                        onPressWallet={onPressWallet}
                        mode={props.mode}
                    />
                )}
                {currentScreen === 'edit-account' && (
                    <EditAccountScreen
                        keyPairAddress={editKeyPairAddress}
                        onClose={onClose}
                        onDone={onDoneAccountScreen}
                    />
                )}
                {currentScreen === 'edit-wallet' && (
                    <EditWalletScreen walletID={editWalletID} onClose={onClose} onDone={onDoneWalletScreen} />
                )}
            </View>
        </BottomSheetModal>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        flex: {
            flex: 1,
        },
        title: {
            marginHorizontal: spacing.th,
            textAlign: 'center',
        },
        container: {
            backgroundColor: theme.colors.modalBackground,
        },
        indicator: {
            backgroundColor: theme.colors.modalIndicator,
        },
        contentContainer: {
            marginHorizontal: spacing.th,
            marginBottom: spacing.xxl,
            paddingBottom: spacing.xxl,
        },
        labelsScrollView: {
            marginHorizontal: spacing.th,
        },
        footerContainer: {
            borderTopWidth: 1,
            marginTop: spacing.l,
            paddingTop: spacing.l,
            borderColor: theme.colors.border,
        },
        currentWallet: {
            color: theme.colors.textSecondary,
        },
        footerButton: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: spacing.l,
        },
        footerButtonIcon: {
            fontSize: 24,
            color: theme.colors.textSecondary,
            marginRight: spacing.l,
        },
        footerButtonText: {
            color: theme.colors.textPrimary,
        },
        walletsContainer: {
            marginRight: spacing.xxl,
            paddingRight: spacing.xxl,
            marginVertical: spacing.m,
        },
        walletLabelContainer: {
            backgroundColor: theme.colors.cardBackground,
            marginLeft: spacing.th,
            paddingHorizontal: spacing.l,
            borderRadius: rounded.full,
            flexDirection: 'row',
            alignItems: 'center',
            height: 60,
            borderWidth: 0.5,
            borderColor: theme.colors.borderLight,
        },
        selectedWalletCheck: {
            marginLeft: spacing.l,
            fontSize: 32,
            color: 'white',
        },
        walletLabelContainerSelected: {
            backgroundColor: theme.colors.primary,
        },
        walletLabel: {},
        walletKind: {
            fontSize: 12,
            color: theme.colors.textTertiary,
        },
        textSelected: {
            color: 'white',
        },
    });

export default React.forwardRef(PickAccountModal);
