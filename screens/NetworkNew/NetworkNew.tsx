import React, {useState} from 'react';
import {CommonStackScreenProps} from '@navigation/types';
import {AppTheme, rounded, spacing} from '@utils/styles';
import {useThemeStyleSheet} from '@hooks/useThemeStyleSheet';
import Text from '@components/Text/Text';
import {ToastController} from '@components/Toast/Toast';
import TextInput from '@components/TextInput/TextInput';
import Button from '@components/Button/Button';
import Separator from '@components/Separator/Separator';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useNetworks} from '@hooks/useNetworks';
import {useTranslation} from 'react-i18next';

const NetworkNew = ({navigation}: CommonStackScreenProps<'NetworkNew'>) => {
    const [label, setLabel] = useState('');
    const [endpoint, setEndpoint] = useState('');
    const {appendNetwork} = useNetworks();
    const {t} = useTranslation();

    const onAdd = () => {
        if (!label) {
            ToastController.show({kind: 'error', content: `${t('network_new.error_no_label')}`});
            return;
        }
        if (!endpoint) {
            ToastController.show({kind: 'error', content: `${t('network_new.error_no_endpoint')}`});
            return;
        }

        const success = appendNetwork({label, endpoint});
        if (success) {
            navigation.goBack();
        }
    };

    const styles = useThemeStyleSheet(dynamicStyles);

    return (
        <ScrollView style={{flex: 1}} contentContainerStyle={styles.container} keyboardDismissMode="interactive">
            <Separator space={spacing.xl} />
            <Text style={styles.label}>{t('network_new.label')}</Text>
            <TextInput
                autoCapitalize="none"
                placeholder={t('network_new.label_placeholder')}
                value={label}
                onChangeText={setLabel}
                autoCorrect={false}
                returnKeyType="done"
                containerStyle={styles.textInputContainer}
            />

            <Separator space={spacing.xl} />
            <Text style={styles.label}>{t('network_new.url')}</Text>
            <TextInput
                autoCapitalize="none"
                placeholder={t('network_new.url_placeholder')}
                value={endpoint}
                textContentType={'URL'}
                autoCorrect={false}
                onChangeText={setEndpoint}
                returnKeyType="done"
                containerStyle={styles.textInputContainer}
            />

            <Separator space={spacing.xl} />
            <Button title={t('network_new.button')} onPress={onAdd} disabled={!label || !endpoint} />
            <View style={{height: 300}} />
        </ScrollView>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
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
    });

export default NetworkNew;
