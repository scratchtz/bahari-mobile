import React, {useState} from 'react';

import {useAppTheme} from '@hooks/useAppTheme';
import {AppTheme, palette, rounded, spacing} from '@utils/styles';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import Text from '@components/Text/Text';
import {Wallet} from '@utils/types';
import {StyleSheet, View} from 'react-native';
import CopyTag from '@components/Tag/CopyTag';
import Tag from '@components/Tag/Tag';
import {MaterialIcons} from '@expo/vector-icons';
import EncryptText from '@components/EncryptText/EncryptText';
import Separator from '@components/Separator/Separator';
import {useTranslation} from 'react-i18next';
interface Props {
    wallet: Wallet;
}
const ShowSecret = ({secret, derivationPath}: {secret: string; derivationPath?: string}) => {
    const theme = useAppTheme();
    const [showEncrypt, setShowEncrypt] = useState(false);
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);
    const {t} = useTranslation();

    return (
        <>
            <View style={styles.container}>
                <View style={styles.secretContainer}>
                    <Text style={styles.secret} weight="500">
                        {secret}
                    </Text>
                </View>
                {derivationPath && (
                    <View style={styles.pathContainer}>
                        <Text style={styles.pathTitle}>{t('pick_account_modal.show_passphrase.derivation')} {derivationPath}</Text>
                    </View>
                )}
                <Separator space={spacing.m} />
                <Text style={styles.warningTitle} weight={'600'}>
                    {t('pick_account_modal.show_passphrase.title')}
                </Text>
                <Text>{t('pick_account_modal.show_passphrase.description')}</Text>

                <View style={styles.actionsContainer}>
                    <CopyTag content={secret || ''} />
                    <Tag
                        icon={
                            <MaterialIcons
                                name="enhanced-encryption"
                                style={[styles.actionIcon, {color: palette.teal500}]}
                            />
                        }
                        onPress={() => {
                            setShowEncrypt(true);
                        }}
                        title={t('pick_account_modal.show_passphrase.encrypt')}
                    />
                </View>
                {showEncrypt && <EncryptText passphrase={secret} />}
            </View>
        </>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {},
        secretContainer: {
            ...theme.cardVariants.simple,
            borderRadius: rounded.xl,
            padding: spacing.xl,
        },
        secret: {
            fontSize: 18,
        },
        actionsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginTop: spacing.l,
            gap: spacing.m,
        },
        actionIcon: {
            fontSize: 18,
            marginRight: spacing.s,
            color: theme.colors.textSecondary,
        },
        pathContainer: {
            marginTop: spacing.m,
            alignItems: 'flex-end',
        },
        pathTitle: {
            color: theme.colors.textSecondary,
            fontSize: 10,
            marginLeft: spacing.l,
        },
        path: {
            marginLeft: spacing.s,
            color: theme.colors.textSecondary,
            fontSize: 11,
        },
        warningTitle: {
            fontSize: 18,
            color: theme.colors.warning,
        },
    });

export default React.memo(ShowSecret, (prev, next) => prev.secret === next.secret);
