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
import {modalOpacity} from '@constants/variables';
import {useTranslation} from 'react-i18next';

interface Props {}

const AUTOLOCK_OPTIONS=[1,5,30,60,300,1800,3600,-1]
const AutolockModal = (props: Props, ref: any) => {
    const {handleSheetPositionChange} = useBottomSheetBackHandler(ref);

    const snapPoints = useMemo(() => ['70%', '94%'], []);
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} opacity={modalOpacity} disappearsOnIndex={-1} appearsOnIndex={0} />
        ),
        [],
    );
    const {t} = useTranslation();

    const [autolockTime, setAutolockTime] = useMMKVNumber(StorageKeys.autolockSeconds, encryptedStorage);

    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);


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
                    title={t('settings.security.auto_lock.modal.label')}
                    onClose={() => {
                        ref.current.close();
                    }}
                />
                <View style={styles.innerContainer}>
                    <Text>{t('settings.security.auto_lock.modal.description')}</Text>
                    {AUTOLOCK_OPTIONS.map(option => {
                        const isSelected = option === autolockTime;
                        return (
                            <TouchableOpacity
                                key={option}
                                style={[styles.listItem, isSelected && styles.listItemSelected]}
                                onPress={() => {
                                    setAutolockTime(option);
                                }}>
                                <Text>{t(`settings.security.auto_lock.interval.${option}`)}</Text>
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
