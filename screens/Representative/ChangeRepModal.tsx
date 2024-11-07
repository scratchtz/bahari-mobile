import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {useBottomSheetBackHandler} from '@hooks/hooksbottomsheet/useBottomSheetBackHandler';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {AppTheme, rounded, spacing} from '@utils/styles';
import Text from '@components/Text/Text';
import {useRepresentatives} from '@hooks/useRepresentatives';
import {ModalHeader} from '@components/ModalHeader/ModalHeader';
import {modalOpacity} from '@constants/variables';
import Button from '@components/Button/Button';
import Separator from '@components/Separator/Separator';
import {KeyPair} from '@utils/types';
import {getKeyPair} from '@storage/wallet';
import {useDefaultKeyPair} from '@hooks/useKeyPair';
import {useDefaultWallet} from '@hooks/useWallet';
import {ChangeAccountCard, publishRepChangeStatus} from '@screens/Representative/ChangeAccountCard';
import {CommonActions, useNavigation} from '@react-navigation/native';
import Success from '@components/Animation/Success';
import {FontAwesome} from '@expo/vector-icons';
import {changeRepresentative} from '@screens/Representative/changeRep';
import {useTranslation} from 'react-i18next';

interface Props {
    newRepAccount: string;
}

type Screen = 'confirm' | 'changing' | 'done';

const ChangeRepModal = ({newRepAccount}: Props, ref: any) => {
    const {handleSheetPositionChange} = useBottomSheetBackHandler(ref);
    const navigation = useNavigation();

    const {t} = useTranslation();

    const [isAllAccounts, setIsAllAccounts] = useState(false);
    const [screen, setScreen] = useState<Screen>('confirm');

    const {defaultKeyPair} = useDefaultKeyPair();
    const defaultWallet = useDefaultWallet();

    const {data: reps} = useRepresentatives();
    const newRep = useMemo(() => {
        return reps?.data?.find(rep => rep.account === newRepAccount);
    }, [reps?.data]);

    const [changingAccounts, setChangingAccounts] = useState<KeyPair[]>([]);
    const [success, setSuccess] = useState(0);
    const [failed, setFailed] = useState(0);

    const snapPoints = useMemo(() => [430, 600], []);
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} opacity={modalOpacity} disappearsOnIndex={-1} appearsOnIndex={0} />
        ),
        [],
    );

    const onPositionChange = (index: number) => {
        handleSheetPositionChange(index);
        if (index < 0) {
            setChangingAccounts([]);
            setScreen('confirm');
        }
    };

    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const onClose = useCallback(() => {
        ref.current.close();
    }, []);

    const isChanging = useRef(false);
    const onChange = async () => {
        if (isChanging.current) return;
        isChanging.current = true;

        if (!defaultWallet || !defaultKeyPair) return;

        setScreen('changing');
        const accounts: KeyPair[] = [];
        if (!isAllAccounts) {
            accounts.push(defaultKeyPair);
        } else {
            for (const w of defaultWallet.keyPairsAddresses) {
                const kp = getKeyPair(w);
                if (kp) accounts.push(kp);
            }
        }

        setChangingAccounts(accounts);
        let success = 0;
        let failed = 0;
        for (let i = 0; i < accounts.length; i++) {
            const account = accounts[i];
            try {
                const res = await changeRepresentative(newRepAccount, account);
                if (res) {
                    success++;
                    publishRepChangeStatus(account.address, 'success');
                } else {
                    publishRepChangeStatus(account.address, 'error');
                }
            } catch (e) {
                console.log(e);
                failed++;
                publishRepChangeStatus(account.address, 'error');
            }
            //sleep for 3s then continue
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        isChanging.current = false;
        setSuccess(success);
        setFailed(failed);
        setScreen('done');
    };

    const onDone = () => {
        onClose();
        navigation.dispatch(state => {
            //pop to the first screen
            const routes = state.routes.slice(0, 1);
            return CommonActions.reset({
                ...state,
                routes,
                index: routes.length - 1,
            });
        });
    };

    if (!defaultWallet || !defaultKeyPair) return null;
    return (
        <BottomSheetModal
            enablePanDownToClose
            backgroundStyle={styles.container}
            handleIndicatorStyle={styles.indicator}
            ref={ref}
            onChange={onPositionChange}
            backdropComponent={renderBackdrop}
            snapPoints={snapPoints}>
            <View style={{flex: 1}}>
                <ModalHeader title={t('representative.change.modal.title')} onClose={onClose} />
                {screen === 'confirm' && (
                    <View style={styles.innerWrap}>
                        <Text>{t('representative.change.modal.new_representative')}</Text>
                        <Separator space={spacing.m} />
                        {newRep && (
                            <Text weight={'700'} style={styles.name}>
                                {newRep?.alias}
                            </Text>
                        )}
                        <Text style={styles.repAddress}>{newRepAccount}</Text>

                        <Separator space={spacing.xl} color={theme.colors.textSecondary} />
                        <Text weight={'600'}>{t('representative.change.modal.change_for')}</Text>

                        <TouchableOpacity
                            style={styles.radioItem}
                            onPress={() => {
                                setIsAllAccounts(false);
                            }}>
                            <View style={[styles.radioWrap, !isAllAccounts && styles.radioWrapSelected]}>
                                {!isAllAccounts && <View style={styles.radio} />}
                            </View>
                            <Text>{t('representative.change.modal.current_account')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.radioItem}
                            onPress={() => {
                                setIsAllAccounts(true);
                            }}>
                            <View style={[styles.radioWrap, isAllAccounts && styles.radioWrapSelected]}>
                                {isAllAccounts && <View style={styles.radio} />}
                            </View>
                            <Text>{t('representative.change.modal.this_wallet')} ({defaultWallet.keyPairsAddresses.length} accounts)</Text>
                        </TouchableOpacity>

                        <Separator space={spacing.l} />
                        <Button title={t('representative.change.modal.button')} onPress={onChange} />
                    </View>
                )}
                {screen === 'changing' && (
                    <View style={styles.innerWrap}>
                        <Text>{t('representative.change.changing.title')}</Text>
                        <Text>{t('representative.change.changing.wait')}</Text>
                        <Separator space={spacing.m} />
                        <View style={styles.accountsWrap}>
                            {changingAccounts.map(acc => {
                                return <ChangeAccountCard key={acc.address} {...acc} />;
                            })}
                        </View>
                    </View>
                )}
                {screen === 'done' && (
                    <View style={styles.innerWrap}>
                        <Text>{t('representative.change.done.title')}</Text>
                        <Separator space={spacing.m} />
                        <View style={styles.statusWrap}>
                            <Success />
                            <Text style={styles.success} weight={'500'}>
                                {success} {t('representative.change.done.success')}
                            </Text>
                        </View>

                        {failed > 0 && (
                            <View style={styles.statusWrap}>
                                <FontAwesome name="warning" style={styles.failedIcon} />
                                <Text style={styles.failed} weight={'500'}>
                                    {failed} {t('representative.change.failed')}
                                </Text>
                            </View>
                        )}

                        <Separator space={spacing.l} />

                        <Button title={t('representative.change.button')} onPress={onDone} />
                    </View>
                )}
            </View>
        </BottomSheetModal>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.modalBackground,
        },
        indicator: {
            backgroundColor: theme.colors.modalIndicator,
        },
        innerWrap: {
            paddingHorizontal: spacing.th,
            flex: 1,
        },
        name: {
            fontSize: 16,
        },
        repAddress: {
            color: theme.colors.textSecondary,
        },
        radioItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacing.m,
            gap: spacing.m,
        },
        radioWrap: {
            width: 20,
            height: 20,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: theme.colors.textSecondary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        radioWrapSelected: {
            borderColor: theme.colors.success,
        },
        radio: {
            width: 10,
            height: 10,
            borderRadius: 10,
            backgroundColor: theme.colors.success,
        },
        accountsWrap: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacing.m,
        },
        statusWrap: {
            ...theme.cardVariants.simple,
            borderRadius: rounded.l,
            padding: spacing.m,
            marginTop: spacing.m,
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.m,
        },
        success: {
            fontSize: 18,
        },
        failed: {
            fontSize: 18,
        },
        failedIcon: {
            color: theme.colors.warning,
            fontSize: 20,
            marginLeft: 5,
            marginRight: 5,
        },
    });

export default React.forwardRef(ChangeRepModal);
