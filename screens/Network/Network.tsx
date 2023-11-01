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

const Network = ({navigation}: CommonStackScreenProps<'Network'>) => {
    const {allNetworks, currentNetwork} = useNetworks();
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
                            We recommend you add your own node for better speed, reduced load to our nodes and increased
                            the security of the network.
                        </Text>
                        <Button
                            containerStyle={styles.addButton}
                            variant="primary"
                            title={'Add Node'}
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
