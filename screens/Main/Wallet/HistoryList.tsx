import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {AppTheme, spacing} from '@utils/styles';
import {useAppTheme} from '@hooks/useAppTheme';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import Text from '@components/Text/Text';
import TransactionItem from '@screens/Main/Wallet/TransactionItem';
import Lottie from 'lottie-react-native';
import {useDefaultKeyPair} from '@hooks/useKeyPair';
import {useTransactionHistory} from '@hooks/useTransactionHistory';
import {Entypo} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import intl from 'react-intl-universal';
import Separator from '@components/Separator/Separator';
import {ToastController} from '@components/Toast/Toast';
import {apiFaucet} from '@utils/api/faucet';
import {useAccountBalance} from '@hooks/useAccountBalance';
import Loading from '@components/Animation/Loading';

const HistoryList = () => {
    const {defaultKeyPair} = useDefaultKeyPair();
    const navigation = useNavigation<any>(); //?wtf can't get it to take props

    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const {refetch} = useAccountBalance(defaultKeyPair?.address || '', true);

    const [isGettingFreeNano, setIsGettingFreeNano] = useState(false);

    const onGetFreeNano = async () => {
        setIsGettingFreeNano(true);
        try {
            if (!defaultKeyPair) return;
            await apiFaucet(defaultKeyPair.address);
            setTimeout(() => {
                void refetch({cancelRefetch: true});
                ToastController.show({kind: 'success', content: 'Nano has been sent to this address'});
                setIsGettingFreeNano(false);
            }, 2000);
        } catch (e: any) {
            ToastController.show({kind: 'error', content: e.toString()});
            setIsGettingFreeNano(false);
        }
    };

    const {data, isLoading} = useTransactionHistory(true, defaultKeyPair?.address || '', 5);

    if (defaultKeyPair == null) return null;
    if (data === undefined || isLoading) return null;
    return (
        <>
            <View style={styles.headerContainer}>
                <Text variant="subheader" style={{flex: 1}}>
                    {intl.get('screens.main.wallet.historyList.title')}
                </Text>
                {data?.history?.length >= 5 && (
                    <TouchableOpacity
                        style={styles.seeAllButton}
                        onPress={() => {
                            navigation.navigate('TransactionHistory');
                        }}>
                        <Text style={styles.seeAll} weight="600">
                            See All
                        </Text>
                        <Entypo name="chevron-right" style={styles.seeAllChevron} />
                    </TouchableOpacity>
                )}
            </View>
            <View>
                {data?.history?.length > 0 ? (
                    data.history.map(h => <TransactionItem key={h.hash} {...h} />)
                ) : (
                    <View style={styles.container}>
                        <Lottie
                            style={styles.animation}
                            resizeMode="cover"
                            source={require('@assets/animation/astronaut-falling.json')}
                            autoPlay
                            loop={true}
                        />
                        <Text color={'tertiary'} style={styles.noTxText}>
                            No Transactions history yet.
                        </Text>
                        <Separator space={spacing.m} />

                        {isGettingFreeNano ? (
                            <Loading size={32} />
                        ) : (
                            <>
                                <Text variant="small">Curious to try nano?</Text>
                                <TouchableOpacity onPress={onGetFreeNano}>
                                    <Text style={styles.getFreeText}>Get Free Nano</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                )}
            </View>
        </>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            padding: spacing.xl,
            alignItems: 'center',
        },
        headerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        animation: {
            width: 80,
            height: 80,
        },
        noTxText: {
            fontSize: 12,
            marginTop: spacing.s,
            textAlign: 'center',
        },
        seeAllButton: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: spacing.xs,
            marginRight: -spacing.xs,
        },
        seeAll: {
            marginRight: spacing.xs,
        },
        seeAllChevron: {
            fontSize: 18,
            color: theme.colors.textSecondary,
        },
        getFreeText: {
            padding: spacing.xs,
            paddingHorizontal: spacing.m,
            color: theme.colors.secondaryLight,
        },
    });

export default React.memo(HistoryList, () => true);
