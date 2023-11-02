import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {useBottomSheetBackHandler} from '@hooks/hooksbottomsheet/useBottomSheetBackHandler';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {AppTheme, rounded, spacing} from '@utils/styles';
import Text from '@components/Text/Text';
import {ModalHeader} from '@components/ModalHeader/ModalHeader';
import {Feather} from '@expo/vector-icons';
import {useMMKVNumber} from 'react-native-mmkv';
import {StorageKeys} from '@constants/storage';
import {encryptedStorage} from '@storage/mmkv';

interface Props {}

const AutolockModal = (props: Props, ref: any) => {
    const {handleSheetPositionChange} = useBottomSheetBackHandler(ref);

    const snapPoints = useMemo(() => ['70%', '94%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} opacity={0.5} disappearsOnIndex={-1} appearsOnIndex={0} />,
        [],
    );

    const [autolockTime, setAutolockTime] = useMMKVNumber(StorageKeys.autolockSeconds, encryptedStorage);

    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const AUTOLOCK_OPTIONS = useMemo(() => {
        return [
            {label: '5s', value: 5},
            {label: '30s', value: 30},
            {label: '1min', value: 60},
            {label: '5min', value: 300},
            {label: '30min', value: 1800},
            {label: '1hr', value: 3600},
            {label: 'Never', value: -1},
        ];
    }, []);

    return (
        <BottomSheetModal
            enablePanDownToClose
            backgroundStyle={styles.container}
            handleIndicatorStyle={styles.indicator}
            ref={ref}
            onChange={handleSheetPositionChange}
            backdropComponent={renderBackdrop}
            snapPoints={snapPoints}>
            <>
                <ModalHeader
                    title={'Autolock'}
                    onClose={() => {
                        ref.current.close();
                    }}
                />
                <View style={styles.innerContainer}>
                    <Text>Automatically lock your phone when the app goes in the background after</Text>
                    {AUTOLOCK_OPTIONS.map(option => {
                        const isSelected = option.value === autolockTime;
                        return (
                            <TouchableOpacity
                                key={option.label}
                                style={[styles.listItem, isSelected && styles.listItemSelected]}
                                onPress={() => {
                                    setAutolockTime(option.value);
                                }}>
                                <Text>{option.label}</Text>
                                {isSelected && <Feather name="check" style={styles.checkMark} />}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </>
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
        innerContainer: {
            marginHorizontal: spacing.th,
        },
        listItem: {
            ...theme.cardVariants.simple,
            padding: spacing.l,
            marginTop: spacing.m,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: rounded.l,
        },
        listItemSelected: {
            borderColor: theme.colors.primary,
            borderWidth: 2,
        },
        checkMark: {
            fontSize: 20,
            color: theme.colors.textSecondary,
        },
    });

export default React.forwardRef(AutolockModal);
