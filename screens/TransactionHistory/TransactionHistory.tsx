import React, {useMemo} from 'react';
import {SectionList, StyleSheet, View} from 'react-native';
import {CommonStackScreenProps} from '@navigation/types';
import {useTransactionHistory} from '@hooks/useTransactionHistory';
import {useDefaultKeyPair} from '@hooks/useKeyPair';
import {AppTheme, rounded, spacing} from '@utils/styles';
import {useThemeStyleSheet} from '@hooks/useThemeStyleSheet';
import Separator from '@components/Separator/Separator';
import {format} from 'date-fns';
import {History} from '@utils/rpc/types';
import {getDateFromStringUnixTime} from '@utils/helper/date';
import Text from '@components/Text/Text';
import TransactionItem from '@screens/Main/Wallet/TransactionItem';

const TransactionHistory = ({navigation}: CommonStackScreenProps<'TransactionHistory'>) => {
    const {defaultKeyPair} = useDefaultKeyPair();
    if (!defaultKeyPair) return null;

    const {data} = useTransactionHistory(true, defaultKeyPair.address, 150);
    const styles = useThemeStyleSheet(dynamicStyles);

    const sectionData = useMemo(() => splitDataPerDate(data?.history), [data?.history]);

    return (
        <SectionList
            windowSize={20}
            sections={sectionData}
            keyExtractor={item => item.hash}
            ItemSeparatorComponent={() => <Separator space={spacing.m} />}
            contentContainerStyle={styles.container}
            renderSectionHeader={item => (
                <View style={styles.dateWrap}>
                    <Text style={styles.date} weight={'600'}>
                        {item.section.title}
                    </Text>
                </View>
            )}
            renderItem={({item}) => <TransactionItem {...item} />}
        />
    );
};

export const splitDataPerDate = (data?: History[]) => {
    let returnData: {title: string; data: History[]}[] = [];
    if (!data || data.length === 0) {
        return returnData;
    }
    let addDate = format(getDateFromStringUnixTime(data[0].local_timestamp), 'yyyy MMM dd');
    let addData = [];
    for (let i = 0; i < data.length; i++) {
        const curr = data[i];
        let currDate = format(getDateFromStringUnixTime(curr.local_timestamp), 'yyyy MMM dd');
        if (currDate === addDate) {
            addData.push(curr);
        } else {
            returnData.push({title: addDate, data: addData});
            addDate = currDate;
            addData = [];
            addData.push(curr);
        }
    }
    if (addData.length > 0) {
        returnData.push({title: addDate, data: addData});
    }

    return returnData;
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            marginHorizontal: spacing.th,
            marginBottom: spacing.xxl,
            paddingBottom: spacing.xxl,
        },
        dateWrap: {
            marginTop: spacing.l,
            marginBottom: spacing.m,
            marginLeft: spacing.xs,
            borderRadius: rounded.full,
            backgroundColor: theme.colors.cardBackgroundLight + '50',
            alignSelf: 'flex-start',
            paddingHorizontal: spacing.m,
            paddingVertical: spacing.xs,
        },
        date: {
            color: theme.colors.textSecondary,
        },
    });

export default TransactionHistory;
