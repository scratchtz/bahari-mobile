import {ScrollView, View} from 'react-native';
import {AntDesign, MaterialCommunityIcons} from '@expo/vector-icons';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import AccountItem from '@components/PickAccountModal/AccountItem';
import React from 'react';
import {AppTheme, rounded, spacing} from '@utils/styles';
import {useGetWallet, useWalletKVs} from '@hooks/useWallet';
import {useAppTheme} from '@hooks/useAppTheme';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {StyleSheet} from 'react-native';
import {ModalHeader} from '@components/ModalHeader/ModalHeader';
import {PickerMode} from '@components/PickAccountModal/types';
import {generateKeyPairFromMnemonic} from '@utils/helper/wallet';
import {getWallet, persistAppendKeyPair} from '@storage/wallet';
import ButtonTiny from '@components/Button/ButtonTiny';
import {WalletKV} from '@utils/types';
import {ToastController} from '@components/Toast/Toast';
import {useDebounce} from '@hooks/useDebounce';
import {WalletSwitch} from '@components/PickAccountModal/WalletSwitch';
import {apiSendPushToken} from '@utils/api/pushToken';

interface Props {
    onPressWallet: (walletID: string) => void;

    onEditWallet: (walletID: string) => void;
    onPressAccount: (keyPairAddress: string) => void;

    onEditAccount: (keyPairAddress: string) => void;

    onImportWallet: () => void;
    onClose: () => void;

    mode: PickerMode;

    currentWalletID: string;
    currentKeyPairAddress?: string;
}
const PickAccountScreen = ({
    onPressAccount,
    onPressWallet,
    onEditWallet,
    onEditAccount,
    onImportWallet,
    onClose,
    mode,
    currentWalletID,
    currentKeyPairAddress,
}: Props) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const currentWallet = useGetWallet(currentWalletID);
    const wallets = useWalletKVs();
    const {debounce} = useDebounce();

    if (!wallets || !currentWallet) return null;

    const onNewAccount = (walletKV: WalletKV) => {
        const wallet = getWallet(walletKV.id);
        if (!wallet) {
            ToastController.show({kind: 'error', content: 'There was an error! try again'});
            return;
        }
        if (!wallet.mnemonic) return;
        if (!wallet.pathKind) return;

        const kp = generateKeyPairFromMnemonic(
            wallet.id,
            wallet.mnemonic,
            (wallet.lastAccountIndex || 0) + 1,
            wallet.pathKind,
        );
        persistAppendKeyPair(kp);
        ToastController.show({kind: 'success', content: `${kp.label} created`});
        void apiSendPushToken();
    };

    return (
        <View style={styles.flex}>
            <ModalHeader title={'Pick Account'} onClose={onClose} />
            <WalletSwitch
                containerStyle={{marginTop: spacing.xxl}}
                currentWalletID={currentWalletID}
                onChangeWallet={onPressWallet}
            />
            <View style={{marginTop: 80}} />
            <BottomSheetFlatList
                contentContainerStyle={styles.contentContainer}
                data={currentWallet.keyPairsAddresses}
                keyExtractor={item => item}
                ListHeaderComponent={() => (
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.tinyActionsScrollView}
                        contentContainerStyle={styles.addInnerContainer}>
                        {currentWallet?.kind === 'mnemonic' && (
                            <ButtonTiny
                                icon={<MaterialCommunityIcons name="wallet-plus" style={styles.addButtonIcon} />}
                                title={'New Account'}
                                onPress={() => {
                                    debounce(() => onNewAccount(currentWallet));
                                }}
                                containerStyle={styles.addButton}
                            />
                        )}
                        {currentWallet?.kind === 'key-only' && (
                            <ButtonTiny
                                icon={<MaterialCommunityIcons name="wallet-plus" style={styles.addButtonIcon} />}
                                title={'Import Private Key'}
                                onPress={onImportWallet}
                                containerStyle={styles.addButton}
                            />
                        )}
                        <ButtonTiny
                            icon={<AntDesign name="edit" style={styles.addButtonIcon} />}
                            title={'Edit Wallet'}
                            onPress={() => {
                                onEditWallet(currentWalletID);
                            }}
                            containerStyle={styles.addButton}
                        />
                    </ScrollView>
                )}
                renderItem={({item}) => (
                    <AccountItem
                        address={item}
                        mode={mode}
                        isSelected={item === currentKeyPairAddress}
                        onPress={() => {
                            onPressAccount(item);
                        }}
                        onMenu={() => {
                            onEditAccount(item);
                        }}
                    />
                )}
            />
        </View>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        flex: {
            flex: 1,
        },
        contentContainer: {
            marginHorizontal: spacing.th,
            marginBottom: spacing.xxl,
            marginTop: spacing.l,
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
        addWalletContainer: {
            ...theme.cardVariants.simple,
            backgroundColor: theme.colors.modalBackground,
            marginLeft: spacing.th,
            borderRadius: rounded.xl,
            minWidth: 330,
            padding: spacing.l,
        },
        addWalletTitle: {
            fontSize: 24,
        },
        addInfo: {
            fontSize: 13,
        },
        tinyActionsScrollView: {
            marginHorizontal: -spacing.th,
            marginBottom: spacing.m,
        },
        addInnerContainer: {
            marginLeft: spacing.th,
        },
        addButton: {
            marginRight: spacing.m,
            paddingVertical: spacing.m,
            borderRadius: rounded.full,
        },
        addButtonIcon: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
    });
export default React.memo(PickAccountScreen);
