import React, {useState} from 'react';

import {useAppTheme} from '@hooks/useAppTheme';
import {AppTheme, rounded, spacing} from '@utils/styles';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import Text from '@components/Text/Text';
import {ModalHeader} from '@components/ModalHeader/ModalHeader';
import Button from '@components/Button/Button';
import Separator from '@components/Separator/Separator';
import {Entypo} from '@expo/vector-icons';
import ShowSecret from '@components/PickAccountModal/ShowPassphrase';
import {useGetWallet} from '@hooks/useWallet';
import {ToastController} from '@components/Toast/Toast';
import * as Clipboard from 'expo-clipboard';
import {useKeyPair} from '@hooks/useKeyPair';
import BottomSheetTextInput from '@components/TextInput/BottomSheetTextInput';
import ButtonTiny from '@components/Button/ButtonTiny';
import ThumbnailSelector from '@components/ThumbnailSelector/ThumbnailSelector';
import AddressThumbnail from '@components/AddressThumbnail/AddressThumbnail';
import {useTranslation} from 'react-i18next';

interface Props {
    keyPairAddress: string;
    onClose: () => void;
    onDone: () => void;
}

const EditAccount = ({keyPairAddress, onClose, onDone}: Props) => {
    const {t} = useTranslation();
    const [account, setAccount] = useKeyPair(keyPairAddress);
    if (!account) return null; //can't happen

    const wallet = useGetWallet(account.walletID);
    if (!wallet) return null; //can't happen

    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const [label, setLabel] = useState(account.label);
    const [thumbnail, setThumbnail] = useState(account.thumbnail || '');
    const [showPrivateKey, setShowPrivateKey] = useState(false);

    const handleDone = () => {
        if (!label) {
            ToastController.show({kind: 'error', content: `${t('pick_account_modal.edit_account.error_name_required')}`});
            return;
        }
        if (!account) return;
        setAccount({...account, label, thumbnail});
        onDone();
    };

    const onCancel = () => {
        onDone();
    };

    const onAddressPress = async () => {
        await Clipboard.setStringAsync(account.address);
        ToastController.show({content: `${t('pick_account_modal.edit_account.info_copied')}`, kind: 'success'});
    };

    return (
        <>
            <ModalHeader title={t('pick_account_modal.edit_account.label')} onClose={onClose} />
            <View style={styles.container}>
                {account.privateKey && showPrivateKey && (
                    <ShowSecret secret={account.privateKey} derivationPath={account.path} />
                )}

                {!showPrivateKey && (
                    <>
                        <ThumbnailSelector style={styles.imageContainer} onImageSuccess={setThumbnail}>
                            <AddressThumbnail uri={thumbnail} size={100} address={account.address} />
                            <View style={styles.editIconContainer}>
                                <Entypo name="edit" style={styles.editIcon} />
                            </View>
                        </ThumbnailSelector>
                        <Separator space={spacing.xl} />
                        <View style={styles.accountHeader}>
                            <Text style={styles.walletLabelTitle} weight="500">
                                {t('pick_account_modal.edit_account.wallet')}:{' '}
                            </Text>
                            <Text style={styles.walletLabel} weight="500">
                                {wallet.label}
                            </Text>
                        </View>

                        <Separator space={spacing.l} />
                        <Text style={styles.label} weight="600">
                            {t('pick_account_modal.edit_account.name')}
                        </Text>
                        <BottomSheetTextInput
                            returnKeyType={'done'}
                            value={label}
                            style={styles.nameInput}
                            onChangeText={setLabel}
                        />

                        <Separator space={spacing.l} />
                        <Text style={styles.label} weight="600">
                            {t('pick_account_modal.edit_account.public_address')}
                        </Text>
                        <TouchableOpacity onPress={onAddressPress}>
                            <Text weight="500" style={styles.address}>
                                {account.address}
                            </Text>
                        </TouchableOpacity>
                        <Separator space={spacing.xl} />
                        <ButtonTiny
                            icon={<Entypo name="eye-with-line" style={[styles.actionButtonIcon]} />}
                            containerStyle={{alignSelf: 'flex-start'}}
                            title={t('pick_account_modal.edit_account.show_private_key')}
                            onPress={() => setShowPrivateKey(true)}
                        />
                    </>
                )}

                <Separator space={spacing.xl} />
                <View style={styles.buttonsContainer}>
                    {!showPrivateKey && (
                        <Button
                            title={t('pick_account_modal.edit_account.button_cancel')}
                            variant={'secondary'}
                            onPress={onCancel}
                            containerStyle={[styles.flex, {marginRight: spacing.s}]}
                        />
                    )}
                    <Button title={t('pick_account_modal.edit_account.button_done')} onPress={handleDone} containerStyle={styles.flex} />
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
        accountHeader: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        label: {
            color: theme.colors.textPrimary,
        },
        walletLabelTitle: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
        walletLabel: {
            color: theme.colors.textPrimary,
            flex: 1,
        },
        derivation: {
            fontSize: 10,
            color: theme.colors.textTertiary,
        },
        address: {
            marginTop: spacing.xs,
        },
        nameInputContainer: {
            ...theme.cardVariants.simple,
            borderRadius: rounded.m,
            borderBottomWidth: 0.5,
            borderBottomColor: theme.colors.border,
        },
        nameInput: {
            ...theme.textVariants.nav,
            fontSize: 18,
            paddingVertical: spacing.l,
            paddingHorizontal: spacing.m,
        },
        imageContainer: {
            alignSelf: 'center',
        },
        editIconContainer: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: theme.colors.cardBackgroundLight,
            borderRadius: rounded.full,
            padding: spacing.s,
            borderWidth: 2,
            borderColor: theme.colors.borderLight,
        },
        editIcon: {
            fontSize: 14,
            color: theme.colors.textPrimary,
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
    });

export default React.memo(EditAccount, (p, n) => p.keyPairAddress === n.keyPairAddress);
