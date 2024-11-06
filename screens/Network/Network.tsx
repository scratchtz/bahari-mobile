import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {CommonStackScreenProps} from '@navigation/types';
import {AppTheme, spacing} from '@utils/styles';
import {useThemeStyleSheet} from '@hooks/useThemeStyleSheet';
import Separator from '@components/Separator/Separator';
import {useNetworks} from '@hooks/useNetworks';
import NetworkItem from '@screens/Network/NetworkItem';
import Button from '@components/Button/Button';
import Text from '@components/Text/Text';
import {UseTorSetting} from '@screens/Network/UseTorSetting';
import {useTranslation} from 'react-i18next';

const Network = ({navigation}: CommonStackScreenProps<'Network'>) => {
    const {allNetworks, currentNetwork} = useNetworks();

    const {t} = useTranslation();
    const styles = useThemeStyleSheet(dynamicStyles);

    return (
        <View style={styles.container}>
            <FlatList
                data={allNetworks}
                keyExtractor={item => item.endpoint}
                ItemSeparatorComponent={() => <Separator space={spacing.l} />}
                ListFooterComponent={
                    <>
                        <Text style={styles.recommend}>
                            {t('settings.general.network.description')}
                        </Text>
                        <Button
                            containerStyle={styles.addButton}
                            variant="primary"
                            title={t('settings.general.network.button')}
                            onPress={() => {
                                navigation.navigate('NetworkNew');
                            }}
                        />
                    </>
                }
                contentContainerStyle={styles.contentContainer}
                renderItem={({item}) => <NetworkItem {...item} isSelected={currentNetwork === item.endpoint} />}
            />
        </View>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        contentContainer: {
            marginHorizontal: spacing.th,
            marginTop: spacing.l,
        },
        addButton: {
            marginTop: spacing.l,
        },
        recommend: {
            fontSize: 12,
            padding: spacing.m,
            color: theme.colors.textSecondary,
        },
    });

export default Network;
