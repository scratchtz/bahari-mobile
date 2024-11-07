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
import {useTranslation} from 'react-i18next';

const Contact = ({navigation, route}: CommonStackScreenProps<'Contact'>) => {
    const {t} = useTranslation();
    const {contact} = route.params;
    const [thumbnail, setThumbnail] = useState(contact.thumbnail || '');
    const [name, setName] = useState(contact.name);
    const [address, setAddress] = useState(contact.address);
    const {editContact, deleteContact} = useContacts();

    const onAdd = () => {
        if (!address) {
            ToastController.show({kind: 'error', content: `${t('contact.error_no_address')}`});
            return;
        }
        if (!name) {
            ToastController.show({kind: 'error', content: `${t('contact.error_no_name')}`});
            return;
        }
        if (!tools.validateAddress(address)) {
            ToastController.show({kind: 'error', content: `${t('contact.error_invalid_address')}`});
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
        Alert.alert(`${t('contact.delete_alert_title')}`, `${t('contact.delete_alert_description')} ${contact.name}`, [
            {
                text: `${t('contact.delete_alert_cancel')}`,
                style: 'cancel',
            },
            {
                text: `${t('contact.delete_alert_delete')}`,
                style: 'destructive',
                onPress: () => handleDeleteConfirmed(),
            },
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
                    {t('contact.delete_title')}
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
            <Text style={styles.label}>{t('contact.name_label')}</Text>
            <TextInput
                placeholder={t('contact.name_placeholder')}
                value={name}
                onChangeText={setName}
                returnKeyType="done"
                containerStyle={styles.textInputContainer}
            />

            <Separator space={spacing.xl} />
            <View style={styles.labelContainer}>
                <Text style={styles.label}>{t('screens.contact.address_label')}</Text>
                <TouchableOpacity onPress={onPaste} style={styles.pasteContainer}>
                    <FontAwesome name="paste" style={styles.pasteIcon} />
                    <Text style={styles.paste}>{t('contact.paste_action')}</Text>
                </TouchableOpacity>
            </View>
            <TextInput
                placeholder={t('contact.address_placeholder')}
                value={address}
                onChangeText={setAddress}
                returnKeyType="done"
                containerStyle={styles.textInputContainer}
            />

            <Separator space={spacing.xl} />
            <View style={styles.actionsContainer}>
                <Button
                    title={t('contact.cancel_button')}
                    variant="secondary"
                    onPress={onCancel}
                    containerStyle={[styles.actionButton, {marginRight: spacing.m}]}
                />
                <Button
                    title={t('contact.save_button')}
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
