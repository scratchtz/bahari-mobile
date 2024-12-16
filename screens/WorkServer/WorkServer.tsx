import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {CommonStackScreenProps} from '@navigation/types';
import {AppTheme, spacing} from '@utils/styles';
import {useThemeStyleSheet} from '@hooks/useThemeStyleSheet';
import Separator from '@components/Separator/Separator';
import Button from '@components/Button/Button';
import Text from '@components/Text/Text';
import {useTranslation} from 'react-i18next';
import {useWorkServer} from '@hooks/useWorkServer';
import ServerItem from './ServerItem';

const WorkServer = ({navigation}: CommonStackScreenProps<'WorkServer'>) => {
    const {allNetworks, currentNetwork} = useWorkServer();

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
                        <Text style={styles.recommend}>{t('network.description')}</Text>
                        <Button
                            containerStyle={styles.addButton}
                            variant="primary"
                            title={t('network.button')}
                            onPress={() => {
                                navigation.navigate('WorkServerNew');
                            }}
                        />
                    </>
                }
                contentContainerStyle={styles.contentContainer}
                renderItem={({item}) => <ServerItem {...item} isSelected={currentNetwork === item.endpoint} />}
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

export default WorkServer;
