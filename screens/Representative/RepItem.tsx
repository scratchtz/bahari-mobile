import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Text from '@components/Text/Text';
import {Representative} from '@utils/api/representatives';
import {useAppTheme} from '@hooks/useAppTheme';
import {AppTheme, palette, rounded, spacing} from '@utils/styles';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import BigNumber from 'bignumber.js';
import {useTranslation} from 'react-i18next';

type Props = {
    onPress: () => void;
} & Representative;

export const RepItem = React.memo(
    ({alias, uptime_percent, account, version, weight_percent, last_seen, onPress}: Props) => {
        const theme = useAppTheme();
        const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

        const {t} = useTranslation();

        const voteWeight = new BigNumber(weight_percent).toFormat();
        const uptime = new BigNumber(uptime_percent);

        const uptimeColor = uptime.isGreaterThan(95) ? palette.teal600 : theme.colors.warning;

        return (
            <TouchableOpacity onPress={onPress} style={styles.container}>
                <View style={styles.innerWrap}>
                    <Text weight={'600'} style={styles.name}>
                        {alias}
                    </Text>
                    <Text>{t('settings.general.representative.change.list.voting_weight',{number:voteWeight})}</Text>
                    <Text>{t('settings.general.representative.change.list.last_uptime',{number:uptime.toFormat(2)})}</Text>
                    <Text>{t('settings.general.representative.change.list.node_version',{version:version})}</Text>
                </View>
                <View style={[styles.uptimeWrap, {backgroundColor: uptimeColor}]}>
                    <Text weight={'800'} style={styles.uptime}>
                        {uptime.toFormat(0)}%
                    </Text>
                </View>
            </TouchableOpacity>
        );
    },
);

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            ...theme.cardVariants.simple,
            borderRadius: rounded.l,
            padding: spacing.l,
            flexDirection: 'row',
            alignItems: 'center',
        },
        innerWrap: {
            flex: 1,
        },
        name: {
            fontSize: 18,
        },
        uptimeWrap: {
            borderRadius: rounded.full,
            alignItems: 'center',
            justifyContent: 'center',
            height: 50,
            width: 50,
        },
        uptime: {
            color: 'white',
        },
    });
