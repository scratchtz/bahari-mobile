import React, {useEffect, useMemo, useRef, useState} from 'react';
import {rounded, size, spacing} from '@utils/styles';
import {AppTheme} from '@utils/styles/theme';
import {FlatList, StyleSheet, TextInput, View} from 'react-native';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {useContacts} from '@hooks/useContacts';
import ContactItem from '@screens/Send/ContactItem';
import {Contact} from '@utils/types';
import {Feather} from '@expo/vector-icons';
import Separator from '@components/Separator/Separator';
import Text from '@components/Text/Text';
import {useTranslation} from 'react-i18next';

interface Props {
    onPress: (c: Contact) => void;
}
const ContactList = ({onPress}: Props) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const {t} = useTranslation();

    const {contacts: allContacts} = useContacts();
    const [searchText, setSearchText] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const contacts = useMemo(() => {
        if (!allContacts) return [];
        if (searchText) {
            return allContacts.filter(
                c =>
                    c.name.toLowerCase().includes(searchText.toLowerCase()) ||
                    c.address.toLowerCase().includes(searchText.toLowerCase()),
            );
        }
        return allContacts;
    }, [searchText, allContacts]);

    return (
        <View style={styles.container}>
            <View style={[styles.searchInputContainer, isSearchFocused ? styles.searchInputContainerFocused : {}]}>
                <TextInput
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder={t('send.contact_search')}
                    placeholderTextColor={theme.colors.textSecondary}
                    autoCapitalize={'none'}
                    onChangeText={setSearchText}
                    style={styles.searchInput}
                />
                <Feather name="search" style={styles.searchIcon} />
            </View>
            <Separator space={spacing.m} />
            <FlatList
                data={contacts}
                ListHeaderComponent={
                    <Text variant="subheader" style={styles.subHeader}>
                        {t('send.contact_header')}
                    </Text>
                }
                renderItem={({item}) => {
                    return (
                        <ContactItem
                            {...item}
                            onPress={() => {
                                onPress(item);
                            }}
                        />
                    );
                }}
            />
        </View>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        searchInputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacing.l,
            backgroundColor: theme.colors.cardBackground,
            borderRadius: rounded.l,
            borderWidth: 0.5,
            borderColor: theme.colors.border,
        },
        subHeader: {
            marginTop: spacing.l,
            marginBottom: spacing.l,
        },
        searchInputContainerFocused: {
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
    });

export default ContactList;
