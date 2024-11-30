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
import {modalOpacity} from '@constants/variables';
import {useBottomSheetBackHandler} from '@hooks/hooksbottomsheet/useBottomSheetBackHandler';
import {ModalHeader} from '@components/ModalHeader/ModalHeader';
import {useTranslation} from 'react-i18next';

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
                        <MaterialIcons name="support-agent" style={[styles.settingIcon]} />
                    </View>
                }
                title={t('others.support.title')}
            />
            <SupportModal ref={ref} />
        </>
    );
};

const SupportModal = React.forwardRef((props: any, ref: any) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);
    const {handleSheetPositionChange} = useBottomSheetBackHandler(ref);
    const {t} = useTranslation();
    const snapPoints = useMemo(() => [300, '80%'], []);
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} opacity={modalOpacity} disappearsOnIndex={-1} appearsOnIndex={0} />
        ),
        [],
    );

    const openGithub = async () => {
        const url = 'https://github.com/scratchtz/bahari-mobile';
        try {
            await Linking.openURL(url);
        } catch (error) {
            console.error('Error opening the link', error);
        }
    };

    return (
        <BottomSheetModal
            enablePanDownToClose
            backgroundStyle={styles.container}
            handleIndicatorStyle={styles.indicator}
            ref={ref}
            onChange={handleSheetPositionChange}
            backdropComponent={renderBackdrop}
            snapPoints={snapPoints}>
            <ModalHeader title={t('others.support.modal_title')} onClose={() => ref.current.close()} />
            <View style={styles.innerContainer}>
                <Text>{t('others.support.offer')}</Text>
                <Separator space={spacing.s} />
                <TouchableOpacity onPress={openGithub}>
                    <Text style={styles.link} variant={'subheader'}>
                        {t('others.support.github')}
                    </Text>
                </TouchableOpacity>
                <Separator space={spacing.s} />
                <Text>{t('others.support.nano')}</Text>
                <Separator space={spacing.s} />
                <Text variant={'subheader'}>Nano address....</Text>
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
    });

export default React.memo(SupportUs);
