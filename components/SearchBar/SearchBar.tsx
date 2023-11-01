import React, {useState} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle, TextInput} from 'react-native';
import {BottomSheetFlatList, BottomSheetModal, BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {AppTheme, rounded, spacing} from '@utils/styles';
import {ModalHeader} from '@components/ModalHeader/ModalHeader';
import CurrencyItem from '@components/CurrencyModal/CurrencyItem';
import Separator from '@components/Separator/Separator';
import {Feather} from '@expo/vector-icons';
import {useAppTheme} from '@hooks/useAppTheme';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';

interface Props {
    placeholder: string;
    value: string;
    onChangeText: (t: string) => void;

    containerStyle?: StyleProp<ViewStyle>;
}
const SearchBar = ({value, placeholder, onChangeText, containerStyle}: Props) => {
    const [isFocused, setIsFocused] = useState(false);
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    return (
        <View style={[styles.container, isFocused ? styles.containerFocused : {}, containerStyle]}>
            <TextInput
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textSecondary}
                autoCapitalize={'none'}
                value={value}
                onChangeText={onChangeText}
                style={styles.searchInput}
                returnKeyType="done"
            />
            <Feather name="search" style={styles.searchIcon} />
        </View>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacing.l,
            backgroundColor: theme.colors.cardBackground,
            borderRadius: rounded.l,
            borderWidth: 0.5,
            borderColor: theme.colors.border,
            marginBottom: spacing.l,
        },
        containerFocused: {
            borderColor: theme.colors.primary,
        },
        searchInput: {
            ...theme.textVariants.body,
            padding: spacing.l,
            flex: 1,
        },
        searchIcon: {
            fontSize: 18,
            color: theme.colors.textSecondary,
            marginRight: spacing.m,
        },
        flatList: {
            marginBottom: spacing.xxl,
            paddingBottom: spacing.xxl,
        },
    });

export default SearchBar;
