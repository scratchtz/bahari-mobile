import React, {useCallback, useMemo, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useBottomSheetBackHandler} from '@hooks/hooksbottomsheet/useBottomSheetBackHandler';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {AppTheme, rounded, spacing} from '@utils/styles';
import Text from '@components/Text/Text';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ModalHeader} from '@components/ModalHeader/ModalHeader';
import {useMMKVString} from 'react-native-mmkv';
import {StorageKeys} from '@constants/storage';
import {encryptedStorage} from '@storage/mmkv';
import SupportedLanguages, {SupportedLanguage} from '@constants/languages';
import {Feather} from '@expo/vector-icons';
import {navigate, navigateDispatch} from '@navigation/shared';
import {CommonActions} from '@react-navigation/native';
import {hasAtLeastSingleWallet} from '@storage/wallet';
import {modalOpacity} from '@constants/variables';

const ChangeLanguageModal = (props: {}, ref: any) => {
    const {handleSheetPositionChange} = useBottomSheetBackHandler(ref);

    const snapPoints = useMemo(() => ['60%', '94%'], []);
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} opacity={modalOpacity} disappearsOnIndex={-1} appearsOnIndex={0} />
        ),
        [],
    );
    const [savedLanguage, setLanguage] = useMMKVString(StorageKeys.language, encryptedStorage);
    const language = (savedLanguage || 'en') as SupportedLanguage;

    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);
    const onClose = () => {
        ref.current.close();
    };

    const hasWallet = hasAtLeastSingleWallet();
    const resetRoute = hasWallet ? 'Main' : 'Setup';
    const onSelect = (iso: SupportedLanguage) => {
        if (iso !== savedLanguage) {
            setLanguage(iso);
            setTimeout(() => {
                navigateDispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [{name: resetRoute}],
                    }),
                );
            }, 100);
            return;
        }
        onClose();
    };

    const allLanguages = useMemo(() => {
        let res: {iso: SupportedLanguage; label: string}[] = [];
        for (const [key, value] of Object.entries(SupportedLanguages)) {
            res.push({
                iso: key as SupportedLanguage,
                label: value,
            });
        }
        return res;
    }, []);

    return (
        <BottomSheetModal
            enablePanDownToClose
            backgroundStyle={styles.modal}
            handleIndicatorStyle={styles.indicator}
            ref={ref}
            onChange={handleSheetPositionChange}
            backdropComponent={renderBackdrop}
            snapPoints={snapPoints}>
            <ModalHeader title={'Change Language'} onClose={onClose} />
            <BottomSheetScrollView contentContainerStyle={styles.scrollView}>
                {allLanguages.map(l => {
                    const isSelected = l.iso === language;
                    return (
                        <TouchableOpacity
                            style={[styles.itemContainer, isSelected && styles.itemContainerSelected]}
                            key={l.iso}
                            onPress={() => {
                                onSelect(l.iso);
                            }}>
                            <Text style={styles.languageText}>{l.label}</Text>
                            {isSelected && <Feather name="check" style={styles.checkMark} />}
                        </TouchableOpacity>
                    );
                })}
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        modal: {
            backgroundColor: theme.colors.modalBackground,
        },
        indicator: {
            backgroundColor: theme.colors.modalIndicator,
        },
        scrollView: {
            marginHorizontal: spacing.th,
        },
        languageItem: {
            padding: spacing.l,
            marginTop: spacing.s,
        },
        languageText: {
            color: theme.colors.textSecondary,
            flex: 1,
        },
        checkMark: {
            fontSize: 18,
            color: theme.colors.textPrimary,
        },
        itemContainer: {
            ...theme.cardVariants.simple,
            backgroundColor: theme.colors.cardBackground,
            marginTop: spacing.l,
            borderRadius: rounded.l,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
        },
        itemContainerSelected: {
            borderColor: theme.colors.primary,
            borderWidth: 2,
        },
    });

export default React.forwardRef(ChangeLanguageModal);
