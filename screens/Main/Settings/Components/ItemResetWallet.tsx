import {useThemeStyleSheet, useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import SettingsItem, {sharedStyles} from '@screens/Main/Settings/Components/SettingsItem';
import {StyleSheet, View} from 'react-native';
import {Feather} from '@expo/vector-icons';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {AppTheme, palette, spacing} from '@utils/styles';
import Text from '@components/Text/Text';
import {useBottomSheetBackHandler} from '@hooks/hooksbottomsheet/useBottomSheetBackHandler';
import {useAppTheme} from '@hooks/useAppTheme';
import {ModalHeader} from '@components/ModalHeader/ModalHeader';
import Button from '@components/Button/Button';

const ItemResetWallet = () => {
    const styles = useThemeStyleSheet(sharedStyles);
    const resetWalletModal = useRef<BottomSheetModal>(null);
    const openResetWalletModal = useCallback(() => {
        resetWalletModal.current?.present();
    }, []);

    return (
        <>
            <SettingsItem
                onPress={openResetWalletModal}
                title="Reset Wallet"
                leftItem={
                    <View style={[styles.settingIconBack, {backgroundColor: palette.rose500}]}>
                        <Feather name="delete" style={[styles.settingIcon]} />
                    </View>
                }
            />
            <ResetWalletModal ref={resetWalletModal} />
        </>
    );
};

const LOCK_TIMEOUT = 4;
const ResetWalletModal = React.forwardRef(({}, ref: any) => {
    const {handleSheetPositionChange} = useBottomSheetBackHandler(ref);

    const countdownStarted = useRef(false);
    const [timeout, setTimeLeft] = useState(LOCK_TIMEOUT);
    useEffect(() => {
        if (!countdownStarted.current) {
            return;
        }
        if (timeout <= 0) return;
        const interval = setInterval(() => {
            setTimeLeft(t => t - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timeout]);
    const handlePositionChange = (index: number) => {
        handleSheetPositionChange(index);
        if (index === -1) {
            setTimeLeft(LOCK_TIMEOUT);
            countdownStarted.current = false;
            return;
        }
        if (index >= 0) {
            if (countdownStarted.current) return;
            countdownStarted.current = true;
            setTimeLeft(t => t - 1);
        }
    };

    const snapPoints = useMemo(() => ['36%', '60%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} opacity={0.5} disappearsOnIndex={-1} appearsOnIndex={0} />,
        [],
    );

    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, deleteStyles);

    return (
        <BottomSheetModal
            enablePanDownToClose
            backgroundStyle={styles.container}
            handleIndicatorStyle={styles.indicator}
            ref={ref}
            onChange={handlePositionChange}
            backdropComponent={renderBackdrop}
            snapPoints={snapPoints}>
            <ModalHeader title={'Reset Wallet'} onClose={() => ref.current.close()} />
            <View style={styles.innerContainer}>
                <Text style={styles.info} weight="500">
                    Are you sure you want to reset your wallet?
                </Text>
                <Text style={styles.otherInfo} weight="500">
                    If you don't have your recovery keys we can't recover the wallet for you.
                </Text>
                <View style={styles.buttonsContainer}>
                    <Button
                        title={'Cancel'}
                        onPress={() => {
                            ref.current.close();
                        }}
                        variant="secondary"
                        containerStyle={styles.button}
                    />
                    <Button
                        title={timeout > 0 ? `Reset (${timeout})` : 'Reset'}
                        variant="primary"
                        disabled={timeout > 0}
                        onPress={() => {}}
                        containerStyle={[
                            styles.button,
                            {marginLeft: spacing.s},
                            timeout === 0 && {backgroundColor: theme.colors.warning},
                        ]}
                    />
                </View>
            </View>
        </BottomSheetModal>
    );
});

const deleteStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.modalBackground,
        },
        indicator: {
            backgroundColor: theme.colors.modalIndicator,
        },
        innerContainer: {
            marginHorizontal: spacing.th,
        },
        info: {
            fontSize: 16,
        },
        otherInfo: {
            color: theme.colors.warning,
            marginTop: spacing.l,
            fontSize: 16,
        },
        buttonsContainer: {
            flexDirection: 'row',
            marginTop: spacing.xl,
        },
        button: {
            flex: 1,
        },
    });

export default React.memo(ItemResetWallet);
