import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {useBottomSheetBackHandler} from '@hooks/hooksbottomsheet/useBottomSheetBackHandler';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {AppTheme, rounded, spacing} from '@utils/styles';
import Text from '@components/Text/Text';
import {useAppColorScheme, useAppColorSchemeChanger, useAppColorSettings} from '@hooks/useAppColorScheme';
import {DISPLAY_THEMES, DisplayTheme} from '@utils/types';
import {ModalHeader} from '@components/ModalHeader/ModalHeader';
import {Entypo, Feather, MaterialCommunityIcons} from '@expo/vector-icons';

interface Props {}

const ThemeChangeModal = (props: Props, ref: any) => {
    const {handleSheetPositionChange} = useBottomSheetBackHandler(ref);

    const snapPoints = useMemo(() => ['60%', '94%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} opacity={0.5} disappearsOnIndex={-1} appearsOnIndex={0} />,
        [],
    );

    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const {setColorScheme} = useAppColorSchemeChanger();

    const onClose = () => {
        ref.current.close();
    };

    const onPickColorScheme = (t: DisplayTheme) => {
        setColorScheme(t);
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
            <ModalHeader title={'Theme'} onClose={onClose} />
            <View style={styles.innerContainer}>
                {DISPLAY_THEMES.map(t => {
                    return (
                        <ThemeItem
                            key={t}
                            name={t}
                            onPress={() => {
                                onPickColorScheme(t);
                            }}
                        />
                    );
                })}
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
        innerContainer: {
            marginHorizontal: spacing.th,
        },
    });

const ThemeItem = React.memo(
    ({name, onPress}: {name: DisplayTheme; onPress: () => void}) => {
        const currentScheme = useAppColorSettings();
        const theme = useAppTheme();
        const styles = useThemeStyleSheetProvided(theme, themeItemStyle);

        const icon = useMemo(() => {
            switch (name) {
                case 'dark':
                    return <Entypo name="moon" style={styles.icon} />;
                case 'dark-zero':
                    return <MaterialCommunityIcons name="lightbulb-multiple-off" style={styles.icon} />;
                case 'light':
                    return <MaterialCommunityIcons name="lightbulb-on-outline" style={styles.icon} />;
                case 'system':
                    return <MaterialCommunityIcons name="theme-light-dark" style={styles.icon} />;
            }
        }, [name, theme]);

        const isSelected = currentScheme === name;
        return (
            <TouchableOpacity style={[styles.container, isSelected && styles.containerSelected]} onPress={onPress}>
                {icon}
                <Text style={styles.name}>{name}</Text>
                {isSelected && <Feather name="check" style={styles.checkMark} />}
            </TouchableOpacity>
        );
    },
    () => true,
);

const themeItemStyle = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            ...theme.cardVariants.simple,
            backgroundColor: theme.colors.cardBackground,
            marginTop: spacing.l,
            borderRadius: rounded.l,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
        },
        containerSelected: {
            borderColor: theme.colors.primary,
            borderWidth: 2,
        },
        name: {
            flex: 1,
        },
        icon: {
            fontSize: 18,
            color: theme.colors.textTertiary,
            marginRight: spacing.m,
        },
        checkMark: {
            fontSize: 18,
            color: theme.colors.textPrimary,
        },
    });

export default React.forwardRef(ThemeChangeModal);
