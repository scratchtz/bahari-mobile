import React, {useState} from 'react';

import {useAppTheme} from '@hooks/useAppTheme';
import {AppTheme, palette, rounded, spacing} from '@utils/styles';
import {Alert, StyleSheet, View} from 'react-native';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import Text from '@components/Text/Text';
import {ModalHeader} from '@components/ModalHeader/ModalHeader';
import Button from '@components/Button/Button';
import {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import Separator from '@components/Separator/Separator';
import {Entypo, MaterialIcons} from '@expo/vector-icons';
import ShowSecret from '@components/PickAccountModal/ShowPassphrase';
import {useWallet} from '@hooks/useWallet';
import {ToastController} from '@components/Toast/Toast';
import ButtonTiny from '@components/Button/ButtonTiny';
import {deleteWallet} from '@storage/wallet';
import {useTranslation} from 'react-i18next';
interface Props {
    walletID: string;
    onDone: () => void;
    onClose: () => void;
}

const EditWalletScreen = ({walletID, onDone, onClose}: Props) => {
    const [wallet, setWallet] = useWallet(walletID);

    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const {t} = useTranslation();

    const [label, setLabel] = useState(wallet?.label);
    const [showPassphrase, setShowPassphrase] = useState(false);

    if (!wallet) return null;
    const handleDone = () => {
        if (!label) {
            ToastController.show({kind: 'error', content: `${t('pick_account_modal.edit_wallet.name_required')}`});
            return;
        }
        setWallet({...wallet, label});
        onDone();
    };

    const onCancel = () => {
        onDone();
    };

    const handleDeleteWallet = () => {
        Alert.alert(
            `${t('pick_account_modal.edit_wallet.alert_delete')}`,
            `${t('pick_account_modal.edit_wallet.alert_delete_desc')}`,
            [
                {
                    text: `${t('pick_account_modal.edit_wallet.alert_button_cancel')}`,
                    style: 'cancel',
                },
                {
                    text: `${t('pick_account_modal.edit_wallet.alert_button_delete')}`,
                    onPress: handleDeleteConfirm,
                    style: 'destructive',
                },
            ],
        );
    };

    const handleDeleteConfirm = () => {
        onClose();
        deleteWallet(walletID);
    };

    return (
        <>
            <ModalHeader title={t('pick_account_modal.edit_wallet.label')} onClose={onClose} />
            <View style={styles.container}>
                {wallet.mnemonic && showPassphrase && <ShowSecret secret={wallet.mnemonic} />}

                {!showPassphrase && (
                    <>
                        <Text style={styles.label} weight="500">
                            {t('pick_account_modal.edit_wallet.name')}
                        </Text>
                        <View style={styles.nameInputContainer}>
                            <BottomSheetTextInput
                                clearTextOnFocus={true}
                                returnKeyType={'done'}
                                value={label}
                                style={styles.nameInput}
                                onChangeText={setLabel}
                            />
                        </View>

                        <Separator space={spacing.l} />

                        <View style={styles.tinyButtonsContainer}>
                            {wallet.mnemonic ? (
                                <ButtonTiny
                                    containerStyle={[styles.tinyButton, {marginRight: spacing.s}]}
                                    icon={<Entypo name="eye-with-line" style={[styles.actionButtonIcon]} />}
                                    title={t('pick_account_modal.edit_wallet.show_passphrase')}
                                    onPress={() => {
                                        setShowPassphrase(true);
                                    }}
                                />
                            ) : null}

                            <ButtonTiny
                                containerStyle={styles.tinyButton}
                                icon={
                                    <MaterialIcons
                                        name="delete-forever"
                                        style={[styles.actionButtonIcon, {color: palette.rose400}]}
                                    />
                                }
                                title={t('pick_account_modal.edit_wallet.delete_wallet')}
                                onPress={handleDeleteWallet}
                            />
                        </View>
                    </>
                )}

                <Separator space={spacing.xl} />
                <View style={styles.buttonsContainer}>
                    {!showPassphrase && (
                        <Button
                            title={t('pick_account_modal.edit_wallet.button_cancel')}
                            variant={'secondary'}
                            onPress={onCancel}
                            containerStyle={[styles.flex, {marginRight: spacing.s}]}
                        />
                    )}
                    <Button title={t('pick_account_modal.edit_wallet.button_done')} onPress={handleDone} containerStyle={styles.flex} />
                </View>
            </View>
        </>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            marginHorizontal: spacing.th,
        },
        label: {
            color: theme.colors.textSecondary,
            marginLeft: spacing.xs,
        },
        nameInputContainer: {
            ...theme.cardVariants.simple,
            borderRadius: rounded.l,
            borderBottomWidth: 0.5,
            borderBottomColor: theme.colors.border,
            marginTop: spacing.s,
        },
        nameInput: {
            ...theme.textVariants.nav,
            fontSize: 18,
            paddingVertical: spacing.l,
            paddingHorizontal: spacing.m,
        },
        flex: {
            flex: 1,
        },
        buttonsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        actionButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: spacing.m,
        },
        actionButtonIcon: {
            fontSize: 18,
            color: theme.colors.textSecondary,
            marginRight: spacing.m,
        },
        tinyButtonsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        tinyButton: {
            alignSelf: 'flex-end',
        },
    });

export default React.memo(EditWalletScreen, (p, n) => p.walletID === n.walletID);
