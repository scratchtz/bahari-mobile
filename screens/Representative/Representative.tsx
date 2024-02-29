import React, {useCallback, useMemo} from 'react';
import {Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import {CommonStackScreenProps} from '@navigation/types';
import {AppTheme, palette, rounded, spacing} from '@utils/styles';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import Separator from '@components/Separator/Separator';
import Button from '@components/Button/Button';
import Text from '@components/Text/Text';
import {ScrollView} from 'react-native-gesture-handler';
import CurrentAccount from '@components/CurrentAccount/CurrentAccount';
import {useDefaultKeyPair} from '@hooks/useKeyPair';
import {useRepresentative, useRepresentatives} from '@hooks/useRepresentatives';
import Loading from '@components/Animation/Loading';
import {useAppTheme} from '@hooks/useAppTheme';
import BigNumber from 'bignumber.js';
import {shortenAddress} from '@utils/helper/address';

const REP_EXPLAIN_URL = 'https://nano.org/en/blog/how-to-choose-your-nano-representative--74f4c8c4';
const Representative = ({navigation}: CommonStackScreenProps<'Representative'>) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);
    const {defaultKeyPair} = useDefaultKeyPair();
    const {data, isLoading} = useRepresentative(defaultKeyPair?.address);
    const representative = data?.representative || '';

    const {data: representatives} = useRepresentatives();

    const myRep = useMemo(() => {
        const reps = representatives?.data;
        if (!reps || !data?.representative) return null;
        return reps.find(rep => rep.account === data?.representative);
    }, [representatives, data?.representative]);

    const onReadMore = useCallback(async () => {
        try {
            const canOpen = await Linking.canOpenURL(REP_EXPLAIN_URL);
            if (canOpen) {
                void Linking.openURL(REP_EXPLAIN_URL);
            }
        } catch (e) {}
    }, []);

    const onChangeRep = useCallback(() => {
        navigation.navigate('ChangeRepresentative');
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <CurrentAccount />
            <Separator space={spacing.l} />
            <Text weight={'500'}>Representative for your account</Text>
            <Separator space={spacing.s} />

            {isLoading ? (
                <View style={[styles.representativeWrap, {justifyContent: 'center'}]}>
                    <Loading color={theme.colors.textPrimary} />
                </View>
            ) : (
                <View style={styles.representativeWrap}>
                    <View style={styles.repNameWrap}>
                        {myRep && (
                            <View>
                                <Text weight={'600'}>{myRep.alias}</Text>
                                <Text>Voting weight: {new BigNumber(myRep.weight_percent).toFormat(2)}%</Text>
                                <Text>Last week uptime: {new BigNumber(myRep.uptime_percent).toFormat(2)}%</Text>
                                <Separator space={spacing.s} />
                            </View>
                        )}
                        <Text style={styles.representative}>{shortenAddress(representative)}</Text>
                    </View>
                    <Button title={'Change'} variant={'secondary'} onPress={onChangeRep} />
                </View>
            )}

            <Separator space={spacing.xl} />

            <Text style={styles.explain}>
                It's recommended to select a representative with high uptime and low voting weight to improve
                decentralisation
            </Text>

            <TouchableOpacity onPress={onReadMore}>
                <Text style={styles.readMore}>Read More...</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            marginHorizontal: spacing.th,
            marginTop: spacing.l,
        },
        explain: {
            color: theme.colors.textSecondary,
            marginBottom: spacing.m,
        },
        chevron: {
            fontSize: 24,
            color: theme.colors.textSecondary,
        },
        accountWrap: {
            ...theme.cardVariants.simple,
            padding: spacing.m,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: rounded.l,
        },
        thumbnail: {
            marginRight: spacing.m,
        },
        representativeWrap: {
            ...theme.cardVariants.simple,
            padding: spacing.l,
            borderRadius: rounded.l,
            gap: spacing.m,
            flexDirection: 'row',
            alignItems: 'center',
        },
        repNameWrap: {
            flex: 1,
        },
        representative: {
            color: theme.colors.textSecondary,
        },
        readMore: {
            color: palette.teal500,
            textDecorationLine: 'underline',
        },
    });

export default Representative;
