import React, {useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {CommonStackScreenProps} from '@navigation/types';
import {AppTheme, rounded, spacing} from '@utils/styles';
import {useThemeStyleSheet} from '@hooks/useThemeStyleSheet';
import Text from '@components/Text/Text';
import {useContacts} from '@hooks/useContacts';
import {ToastController} from '@components/Toast/Toast';
import TextInput from '@components/TextInput/TextInput';
import Button from '@components/Button/Button';
import Separator from '@components/Separator/Separator';
import {Entypo, FontAwesome} from '@expo/vector-icons';
import {tools} from 'nanocurrency-web';
import * as Clipboard from 'expo-clipboard';
import AddressThumbnail from '@components/AddressThumbnail/AddressThumbnail';
import ThumbnailSelector from '@components/ThumbnailSelector/ThumbnailSelector';
import {useTranslation} from 'react-i18next';

const ContactNew = ({navigation, route}: CommonStackScreenProps<'ContactNew'>) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState(route && route.params && route.params.address ? route.params.address : '');
    const [thumbnail, setThumbnail] = useState('');

    const {t} = useTranslation();

    const onAdd = () => {
        if (!name) {
            ToastController.show({kind: 'error', content: `${t('contact_new.error_no_name')}`});
            return;
        }
        if (!address) {
            ToastController.show({kind: 'error', content: `${t('contact_new.error_no_address')}`});
            return;
        }
        if (!tools.validateAddress(address)) {
            ToastController.show({kind: 'error', content: `${t('contact_new.error_invalid_address')}`});
            return;
        }

        const valid = appendContact({
            name,
            address,
            thumbnail,
        });
        if (valid) {
            navigation.goBack();
            return;
        }
    };

    const onPaste = async () => {
        const string = await Clipboard.getStringAsync();
        setAddress(string);
    };

    const styles = useThemeStyleSheet(dynamicStyles);
    const {appendContact} = useContacts();

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.flex}
            contentContainerStyle={styles.container}
            keyboardDismissMode="interactive">
            <ThumbnailSelector style={styles.imageContainer} onImageSuccess={setThumbnail}>
                <AddressThumbnail uri={thumbnail} size={100} address={address} />
                <View style={styles.editIconContainer}>
                    <Entypo name="edit" style={styles.editIcon} />
                </View>
            </ThumbnailSelector>

            <Separator space={spacing.xl} />
            <Text style={styles.label}>{t('contact_new.name_label')}</Text>
            <TextInput
                placeholder={t('contact_new.name_placeholder')}
                value={name}
                onChangeText={setName}
                returnKeyType="done"
                containerStyle={styles.textInputContainer}
            />

            <Separator space={spacing.xl} />
            <View style={styles.labelContainer}>
                <Text style={styles.label}>{t("contact_new.address_label")}</Text>
                <TouchableOpacity onPress={onPaste} style={styles.pasteContainer}>
                    <FontAwesome name="paste" style={styles.pasteIcon} />
                    <Text style={styles.paste}>{t('contact_new.paste')}</Text>
                </TouchableOpacity>
            </View>
            <TextInput
                placeholder={t('contact_new.address_placeholder')}
                value={address}
                onChangeText={setAddress}
                returnKeyType="done"
                containerStyle={styles.textInputContainer}
            />

            <Separator space={spacing.xl} />
            <Button title={t('contact_new.button')} onPress={onAdd} disabled={!name || !address} />
            <View style={{height: 300}} />
        </ScrollView>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        flex: {
            flex: 1,
        },
        container: {
            marginHorizontal: spacing.th,
            marginTop: spacing.xl,
            marginBottom: spacing.xxl,
            paddingBottom: spacing.xxl,
        },
        textInputContainer: {
            marginTop: spacing.s,
        },
        imageContainer: {
            alignSelf: 'center',
        },
        editIconContainer: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: theme.colors.cardBackgroundLight,
            borderRadius: rounded.full,
            padding: spacing.s,
            borderWidth: 2,
            borderColor: theme.colors.borderLight,
        },
        editIcon: {
            fontSize: 14,
            color: theme.colors.textPrimary,
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
    });

export default ContactNew;
