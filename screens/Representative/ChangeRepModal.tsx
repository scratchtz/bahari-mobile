import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {useBottomSheetBackHandler} from '@hooks/hooksbottomsheet/useBottomSheetBackHandler';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {AppTheme, spacing} from '@utils/styles';
import Text from '@components/Text/Text';
import {useRepresentatives} from '@hooks/useRepresentatives';
import {ModalHeader} from '@components/ModalHeader/ModalHeader';
import {modalOpacity} from '@constants/variables';
import Button from '@components/Button/Button';
import Separator from '@components/Separator/Separator';
import {KeyPair} from '@utils/types';
import {getDefaultKeyPairAddress, getKeyPair, getWallet} from '@storage/wallet';
import {useDefaultKeyPair} from '@hooks/useKeyPair';
import {useDefaultWallet} from '@hooks/useWallet';
import {changeRepresentative} from '@screens/Representative/changeRep';

interface Props {
    newRepAccount: string;
}

type Screen = 'confirm' | 'changing' | 'done';

const ChangeRepModal = ({newRepAccount}: Props, ref: any) => {
    const {handleSheetPositionChange} = useBottomSheetBackHandler(ref);

    const [isAllAccounts, setIsAllAccounts] = useState(false);
    const [screen, setScreen] = useState<Screen>('confirm');

    const {defaultKeyPair} = useDefaultKeyPair();
    const defaultWallet = useDefaultWallet();

    const {data: reps} = useRepresentatives();
    const newRep = useMemo(() => {
        return reps?.data?.find(rep => rep.account === newRepAccount);
    }, [reps?.data]);

    const snapPoints = useMemo(() => [430, 600], []);
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} opacity={modalOpacity} disappearsOnIndex={-1} appearsOnIndex={0} />
        ),
        [],
    );

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

        for (const account of accounts) {
            console.log(account.address);
            try {
                const res = await changeRepresentative(newRepAccount, account);
                console.log(res);
            } catch (e) {
                console.log(e);
            }
        }
        isChanging.current = false;
    };

    if (!defaultWallet || !defaultKeyPair) return null;
    return (
        <BottomSheetModal
            enablePanDownToClose
            backgroundStyle={styles.container}
            handleIndicatorStyle={styles.indicator}
            ref={ref}
            onChange={handleSheetPositionChange}
            backdropComponent={renderBackdrop}
            snapPoints={snapPoints}>
            <ModalHeader title={'Change Representative'} onClose={onClose} />
            <View style={styles.innerWrap}>
                <Text>Your new representative</Text>
                <Separator space={spacing.m} />
                {newRep && (
                    <Text weight={'700'} style={styles.name}>
                        {newRep?.alias}
                    </Text>
                )}
                <Text style={styles.repAddress}>{newRepAccount}</Text>

                <Separator space={spacing.xl} color={theme.colors.textSecondary} />
                <Text weight={'600'}>Change for</Text>

                <TouchableOpacity
                    style={styles.radioItem}
                    onPress={() => {
                        setIsAllAccounts(false);
                    }}>
                    <View style={[styles.radioWrap, !isAllAccounts && styles.radioWrapSelected]}>
                        {!isAllAccounts && <View style={styles.radio} />}
                    </View>
                    <Text>Current Account</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.radioItem}
                    onPress={() => {
                        setIsAllAccounts(true);
                    }}>
                    <View style={[styles.radioWrap, isAllAccounts && styles.radioWrapSelected]}>
                        {isAllAccounts && <View style={styles.radio} />}
                    </View>
                    <Text>This wallet ({defaultWallet.keyPairsAddresses.length} accounts)</Text>
                </TouchableOpacity>

                <Separator space={spacing.l} />
                <Button title={'Change Representative'} onPress={onChange} />
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
            marginHorizontal: spacing.th,
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
    });

export default React.forwardRef(ChangeRepModal);
