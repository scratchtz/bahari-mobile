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
import {useNativeCurrency} from '@hooks/useNativeCurrency';
import {modalOpacity} from '@constants/variables';

interface Props {}

const NativeCurrencyModal = (props: Props, ref: any) => {
    const {handleSheetPositionChange} = useBottomSheetBackHandler(ref);

    const {nativeCurrency, setNativeCurrency} = useNativeCurrency();

    const snapPoints = useMemo(() => ['60%', '94%'], []);
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} opacity={modalOpacity} disappearsOnIndex={-1} appearsOnIndex={0} />
        ),
        [],
    );

    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    return (
        <BottomSheetModal
            enablePanDownToClose
            backgroundStyle={styles.container}
            handleIndicatorStyle={styles.indicator}
            ref={ref}
            android_keyboardInputMode={'adjustResize'}
            onChange={handleSheetPositionChange}
            backdropComponent={renderBackdrop}
            snapPoints={snapPoints}>
            <ModalHeader
                title={'Native Currency'}
                onClose={() => {
                    ref.current.close();
                }}
            />

            <View style={styles.flex}>
                <Text style={styles.pick}>Pick a currency used to display native values</Text>

                {/*TODO don't be lazy array and map*/}
                <TouchableOpacity
                    style={[styles.section, nativeCurrency === 'XNO' && styles.sectionSelected]}
                    onPress={() => {
                        setNativeCurrency('XNO');
                    }}>
                    <View style={styles.sectionInner}>
                        <Text style={styles.symbol} weight="500">
                            XNO
                        </Text>
                        <Text style={styles.explainer}>
                            XNO also known as Nano, is the default currency on Nano blockchain.
                        </Text>
                    </View>
                    {nativeCurrency === 'XNO' && <Feather name="check" style={styles.checkMark} />}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.section, nativeCurrency === 'NYANO' && styles.sectionSelected]}
                    onPress={() => {
                        setNativeCurrency('NYANO');
                    }}>
                    <View style={styles.sectionInner}>
                        <Text style={styles.symbol} weight="500">
                            NYANO
                        </Text>
                        <Text style={styles.explainer}>
                            1,000,000 NYANO = 1 XNO{'\n'}NYANO isn't a separate token. It's just a conversion
                        </Text>
                    </View>
                    {nativeCurrency === 'NYANO' && <Feather name="check" style={styles.checkMark} />}
                </TouchableOpacity>
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
        sectionSelected: {
            borderWidth: 2,
            borderColor: theme.colors.primary,
        },
        flex: {
            flex: 1,
            marginHorizontal: spacing.th,
        },
        pick: {
            fontSize: 13,
            color: theme.colors.textSecondary,
        },
        section: {
            ...theme.cardVariants.simple,
            padding: spacing.l,
            marginTop: spacing.l,
            borderRadius: rounded.l,
            flexDirection: 'row',
            alignItems: 'center',
        },
        sectionInner: {
            flex: 1,
            marginRight: spacing.l,
        },
        symbol: {
            fontSize: 18,
        },
        explainer: {
            color: theme.colors.textSecondary,
            marginTop: spacing.s,
            fontSize: 12,
        },
        checkMark: {
            fontSize: 24,
            color: theme.colors.textPrimary,
        },
    });

export default React.forwardRef(NativeCurrencyModal);
