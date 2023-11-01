import React, {useCallback, useState} from 'react';
import {Alert, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {CommonStackScreenProps} from '@navigation/types';
import {AppTheme, rounded, spacing} from '@utils/styles';
import {useThemeStyleSheet} from '@hooks/useThemeStyleSheet';
import Text from '@components/Text/Text';
import {useContacts} from '@hooks/useContacts';
import {ToastController} from '@components/Toast/Toast';
import TextInput from '@components/TextInput/TextInput';
import Button from '@components/Button/Button';
import Separator from '@components/Separator/Separator';
import {AntDesign, Entypo, FontAwesome} from '@expo/vector-icons';
import {tools} from 'nanocurrency-web';
import * as Clipboard from 'expo-clipboard';
import AddressThumbnail from '@components/AddressThumbnail/AddressThumbnail';
import ThumbnailSelector from '@components/ThumbnailSelector/ThumbnailSelector';

const Contact = ({navigation, route}: CommonStackScreenProps<'Contact'>) => {
    const {contact} = route.params;
    const [thumbnail, setThumbnail] = useState(contact.thumbnail || '');
    const [name, setName] = useState(contact.name);
    const [address, setAddress] = useState(contact.address);
    const {editContact, deleteContact} = useContacts();

    const onAdd = () => {
        if (!address) {
            ToastController.show({kind: 'error', content: 'Address is required'});
            return;
        }
        if (!name) {
            ToastController.show({kind: 'error', content: 'Name is required'});
            return;
        }
        if (!tools.validateAddress(address)) {
            ToastController.show({kind: 'error', content: 'Address is invalid'});
            return;
        }

        editContact(contact.address, {
            ...contact,
            name,
            address,
            thumbnail,
        });

        navigation.goBack();
    };

    const onPaste = async () => {
        const string = await Clipboard.getStringAsync();
        setAddress(string);
    };

    const onCancel = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const onDelete = () => {
        Alert.alert(`Delete contact`, `Are you sure you want to delete ${contact.name}`, [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {text: 'Delete', style: 'destructive', onPress: () => handleDeleteConfirmed()},
        ]);
    };

    const handleDeleteConfirmed = () => {
        deleteContact(contact.address);
        navigation.goBack();
    };

    const styles = useThemeStyleSheet(dynamicStyles);

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={styles.container}
            keyboardDismissMode="interactive">
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                <AntDesign name="deleteuser" style={styles.deleteIcon} />
                <Text style={styles.deleteText} weight="500">
                    Delete Contact
                </Text>
            </TouchableOpacity>

            <Separator space={spacing.xl} />

            <ThumbnailSelector style={styles.imageContainer} onImageSuccess={setThumbnail}>
                <AddressThumbnail uri={thumbnail} size={100} address={address} />
                <View style={styles.editIconContainer}>
                    <Entypo name="edit" style={styles.editIcon} />
                </View>
            </ThumbnailSelector>

            <Separator space={spacing.xl} />
            <Text style={styles.label}>Name</Text>
            <TextInput
                placeholder={'Name'}
                value={name}
                onChangeText={setName}
                returnKeyType="done"
                containerStyle={styles.textInputContainer}
            />

            <Separator space={spacing.xl} />
            <View style={styles.labelContainer}>
                <Text style={styles.label}>Address</Text>
                <TouchableOpacity onPress={onPaste} style={styles.pasteContainer}>
                    <FontAwesome name="paste" style={styles.pasteIcon} />
                    <Text style={styles.paste}>Paste</Text>
                </TouchableOpacity>
            </View>
            <TextInput
                placeholder={'Address'}
                value={address}
                onChangeText={setAddress}
                returnKeyType="done"
                containerStyle={styles.textInputContainer}
            />

            <Separator space={spacing.xl} />
            <View style={styles.actionsContainer}>
                <Button
                    title={'Cancel'}
                    variant="secondary"
                    onPress={onCancel}
                    containerStyle={[styles.actionButton, {marginRight: spacing.m}]}
                />
                <Button
                    title={'Save'}
                    onPress={onAdd}
                    disabled={!name || !address}
                    containerStyle={styles.actionButton}
                />
            </View>
            <View style={{height: 300}} />
        </ScrollView>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        scrollView: {
            flex: 1,
        },
        container: {
            marginHorizontal: spacing.th,
            marginBottom: spacing.xxl,
            paddingBottom: spacing.xxl,
        },
        deleteButton: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-end',
            paddingVertical: spacing.m,
        },
        deleteIcon: {
            fontSize: 18,
            color: theme.colors.warning,
            marginRight: spacing.s,
        },
        deleteText: {
            color: theme.colors.warning,
        },
        textInputContainer: {
            marginTop: spacing.s,
        },
        imageContainer: {
            alignSelf: 'center',
        },
        labelContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        label: {
            color: theme.colors.textSecondary,
            marginLeft: spacing.xs,
            fontSize: 14,
        },
        pasteContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        pasteIcon: {
            color: theme.colors.textPrimary,
            fontSize: 12,
            marginRight: spacing.s,
        },
        paste: {
            fontSize: 14,
            textDecorationLine: 'underline',
        },
        thumbnail: {
            width: 100,
            height: 100,
            borderRadius: rounded.full,
        },
        editIconContainer: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: theme.colors.cardBackgroundLight,
            borderRadius: rounded.full,
            padding: spacing.s,
            borderWidth: 0.5,
            borderColor: theme.colors.borderLight,
        },
        editIcon: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        actionsContainer: {
            flexDirection: 'row',
        },
        actionButton: {
            flex: 1,
        },
    });

export default Contact;
