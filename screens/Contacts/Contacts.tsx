import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {CommonStackScreenProps} from '@navigation/types';
import {useContacts} from '@hooks/useContacts';
import SearchBar from '@components/SearchBar/SearchBar';
import ContactCell from '@components/ContactCell/ContactCell';
import {Contact} from '@utils/types';
import {AppTheme, spacing} from '@utils/styles';
import {useThemeStyleSheet} from '@hooks/useThemeStyleSheet';
import {Ionicons} from '@expo/vector-icons';
import Separator from '@components/Separator/Separator';
import Lottie from 'lottie-react-native';
import Button from '@components/Button/Button';
import Text from '@components/Text/Text';

const Contacts = ({navigation}: CommonStackScreenProps<'Contacts'>) => {
    const [searchText, setSearchText] = useState('');
    const {contacts: allContacts} = useContacts();
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

    const onPressContact = useCallback((contact: Contact) => {
        navigation.navigate('Contact', {contact});
    }, []);

    const onNewContact = useCallback(() => {
        navigation.navigate('ContactNew');
    }, []);

    const styles = useThemeStyleSheet(dynamicStyles);

    return (
        <View style={styles.container}>
            <SearchBar placeholder={'Search contacts'} value={searchText} onChangeText={setSearchText} />
            <FlatList
                style={styles.flatList}
                data={contacts}
                keyExtractor={item => item.address}
                ItemSeparatorComponent={() => <Separator space={spacing.xl} />}
                ListEmptyComponent={
                    <View style={styles.listEmpty}>
                        <Lottie
                            style={styles.emptyAnimation}
                            resizeMode="cover"
                            source={require('@assets/animation/empty-state.json')}
                            autoPlay
                            loop
                        />
                        <Text style={styles.noContactText}>
                            You don't have anyone in your contact list.{'\n'}Click the button below to add someone
                        </Text>
                    </View>
                }
                contentContainerStyle={styles.contentContainer}
                ListFooterComponent={
                    <Button
                        containerStyle={styles.contactAddButton}
                        title={'New Contact'}
                        onPress={onNewContact}
                        leftChild={<Ionicons name="person-add" style={styles.contactAddIcon} />}
                    />
                }
                renderItem={({item}) => (
                    <ContactCell
                        {...item}
                        onPress={() => {
                            onPressContact(item);
                        }}
                    />
                )}
            />
        </View>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            marginHorizontal: spacing.th,
            flex: 1,
        },
        flatList: {
            flex: 1,
            marginTop: spacing.l,
        },
        listEmpty: {
            alignItems: 'center',
        },
        noContactText: {
            color: theme.colors.textSecondary,
            textAlign: 'center',
            fontSize: 12,
            marginVertical: spacing.m,
        },
        contentContainer: {
            marginTop: spacing.m,
        },
        contactAddButton: {
            marginTop: spacing.xl,
        },
        contactAddIcon: {
            fontSize: 14,
            color: '#FFFFFF',
            marginRight: spacing.m,
        },
        emptyAnimation: {
            height: 100,
        },
    });

export default Contacts;
