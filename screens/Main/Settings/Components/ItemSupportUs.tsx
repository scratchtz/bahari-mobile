import SettingsItem, {sharedStyles} from './SettingsItem';
import React, {useCallback, useMemo, useRef} from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useThemeStyleSheet, useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {AppTheme, palette, spacing} from '@utils/styles';
import Text from '@components/Text/Text';
import Separator from '@components/Separator/Separator';
import {useAppTheme} from '@hooks/useAppTheme';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {useBottomSheetBackHandler} from '@hooks/hooksbottomsheet/useBottomSheetBackHandler';
import {ModalHeader} from '@components/ModalHeader/ModalHeader';
import {useTranslation} from 'react-i18next';
import {Feather, FontAwesome5} from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import {ToastController} from '@components/Toast/Toast';
import {navigate} from '@navigation/shared';
import {SUPPORT_NANO_ADDRESS} from '@constants/others';

const SupportUs = () => {
    const styles = useThemeStyleSheet(sharedStyles);
    const {t} = useTranslation();

    const ref = useRef<BottomSheetModal>(null);
    const openRef = useCallback(() => {
        ref.current?.present();
    }, []);

    return (
        <>
            <SettingsItem
                onPress={openRef}
                leftItem={
                    <View style={[styles.settingIconBack, {backgroundColor: palette.teal400}]}>
                        <FontAwesome5 name="handshake" style={[styles.settingIcon]} />
                    </View>
                }
                title={t('others.support.title')}
            />
            <SupportModal ref={ref} />
        </>
    );
};

const SupportModal = React.forwardRef(({}, ref: any) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);
    const {handleSheetPositionChange} = useBottomSheetBackHandler(ref);
    const {t} = useTranslation();
    const snapPoints = useMemo(() => [300, '50%', '80%'], []);

    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} opacity={0.5} disappearsOnIndex={-1} appearsOnIndex={0} />,
        [],
    );

    const openGithub = useCallback(async () => {
        const url = 'https://github.com/scratchtz/bahari-mobile';
        try {
            await Linking.openURL(url);
        } catch (error) {
            console.error('Failed to open GitHub link:', error);
        }
    }, []);

    const copyToClipboard = useCallback(() => {
        Clipboard.setStringAsync(SUPPORT_NANO_ADDRESS);
        ToastController.show({
            kind: 'success',
            content: t('others.support.copy_success'),
        });
    }, [t]);

    const sendToNanoAddress = useCallback(() => {
        navigate('SendAmount', {address: SUPPORT_NANO_ADDRESS});
        ref.current?.close();
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
            <ModalHeader title={t('others.support.modal_title')} onClose={() => ref.current?.close()} />
            <View style={styles.innerContainer}>
                <Text>{t('others.support.offer')}</Text>
                <Separator space={spacing.s} />
                <TouchableOpacity onPress={openGithub}>
                    <Text style={styles.link} variant="subheader">
                        {t('others.support.github')}
                    </Text>
                </TouchableOpacity>
                <Separator space={spacing.s} />
                <Text>{t('others.support.nano')}</Text>
                <Separator space={spacing.s} />
                <View style={styles.nanoAddressContainer}>
                    <Text variant="subheader" style={styles.nanoAddress}>
                        {SUPPORT_NANO_ADDRESS}
                    </Text>
                    <TouchableOpacity onPress={copyToClipboard}>
                        <Feather name="copy" style={styles.actionIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={sendToNanoAddress}>
                        <MaterialIcons name="send" style={styles.actionIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        </BottomSheetModal>
    );
});

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.modalBackground,
        },
        link: {
            textDecorationLine: 'underline',
        },
        indicator: {
            backgroundColor: theme.colors.modalIndicator,
        },
        innerContainer: {
            paddingHorizontal: spacing.th,
        },
        nanoAddressContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.s,
        },
        nanoAddress: {
            flex: 1,
        },
        actionIcon: {
            fontSize: 18,
            color: theme.colors.textPrimary,
            padding: spacing.s,
        },
    });

export default React.memo(SupportUs);
