import React, {useCallback, useMemo, useRef} from 'react';
import {Switch, View, StyleSheet, TouchableOpacity} from 'react-native';
import {useMMKVBoolean} from 'react-native-mmkv';
import {StorageKeys} from '@constants/storage';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import Text from '@components/Text/Text';
import {AppTheme, rounded, spacing} from '@utils/styles';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {FontAwesome6} from '@expo/vector-icons';
import {hitSlop, modalOpacity} from '@constants/variables';
import {ModalHeader} from '@components/ModalHeader/ModalHeader';
import {encryptedStorage} from '@storage/mmkv';
import {useTranslation} from 'react-i18next';
export const UseTorSetting = React.memo(() => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const {t} = useTranslation();

    const [useTor, setUseTor] = useMMKVBoolean(StorageKeys.useTor, encryptedStorage);

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const openBottomSheet = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} opacity={modalOpacity} disappearsOnIndex={-1} appearsOnIndex={0} />
        ),
        [],
    );
    const closeBottomSheet = useCallback(() => {
        bottomSheetModalRef.current?.close();
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.textWrap}>
                <Text style={styles.text}>{'network.tor.title'}</Text>
                <TouchableOpacity onPress={openBottomSheet} hitSlop={hitSlop} style={styles.questionWrap}>
                    <FontAwesome6 name="circle-question" style={styles.question} />
                </TouchableOpacity>
            </View>
            <Switch value={useTor} onValueChange={setUseTor} />
            <BottomSheetModal
                backgroundStyle={styles.bottomSheetModal}
                handleIndicatorStyle={styles.indicator}
                ref={bottomSheetModalRef}
                backdropComponent={renderBackdrop}
                snapPoints={[300]}>
                <ModalHeader title={t('network.tor.modal_title')} onClose={closeBottomSheet} />
                <View style={styles.bottomSheetInner}>
                    <Text>
                        {t('network.tor.hide_ip')}
                    </Text>
                    <Text>{t('network.tor.slow')}</Text>
                    <Text color={'secondary'}>{t('network.tor.note')}</Text>
                </View>
            </BottomSheetModal>
        </View>
    );
});

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            ...theme.cardVariants.simple,
            padding: spacing.m,
            borderRadius: rounded.l,
            flexDirection: 'row',
            alignItems: 'center',
        },
        textWrap: {
            flexDirection: 'row',
            flex: 1,
        },
        questionWrap: {},
        question: {
            color: theme.colors.textSecondary,
            fontSize: 13,
        },
        text: {
            marginRight: spacing.xs,
        },
        bottomSheetModal: {
            backgroundColor: theme.colors.modalBackground,
        },
        indicator: {
            backgroundColor: theme.colors.modalIndicator,
        },
        bottomSheetInner: {
            marginHorizontal: spacing.th,
            gap: spacing.m,
        },
    });
