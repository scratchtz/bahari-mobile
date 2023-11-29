import React from 'react';
import {spacing} from '@utils/styles';
import {AppTheme} from '@utils/styles/theme';
import {StyleSheet, View} from 'react-native';
import useRecentAddresses from '@hooks/useRecentAddresses';
import RecentAddressItem from '@screens/Send/RecentAddressItem';
import Lottie from 'lottie-react-native';
import Text from '@components/Text/Text';
import {useThemeStyleSheet} from '@hooks/useThemeStyleSheet';
import {useDefaultKeyPair} from '@hooks/useKeyPair';

interface Props {
    onPress: (address: string) => void;
}
//TODO change address
const RecentAddresses = ({onPress}: Props) => {
    const {defaultKeyPair} = useDefaultKeyPair();
    const {recentAddresses} = useRecentAddresses();
    const styles = useThemeStyleSheet(dynamicStyles);
    return (
        <>
            {recentAddresses?.map((c, i) => {
                //ignoring current default address, we don't want to send money to it
                if (defaultKeyPair?.address === c) return null;
                return (
                    <View key={c}>
                        <RecentAddressItem
                            address={c}
                            onPress={() => {
                                onPress(c);
                            }}
                        />
                    </View>
                );
            })}
            {recentAddresses?.length === 0 && (
                <View style={styles.container}>
                    <Lottie
                        style={styles.animation}
                        resizeMode="cover"
                        colorFilters={[]}
                        source={require('@assets/animation/astronaut-falling.json')}
                        autoPlay
                        loop={true}
                    />
                    <Text color={'tertiary'} style={styles.noAddresses}>
                        No Recent Addresses.{'\n'}All sent recent addresses will appear here
                    </Text>
                </View>
            )}
        </>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            marginTop: spacing.xl,
            alignItems: 'center',
        },
        animation: {
            height: 120,
            opacity: 0.8,
        },
        noAddresses: {
            color: theme.colors.textSecondary,
            marginTop: spacing.l,
            fontSize: 12,
            textAlign: 'center',
        },
    });

export default React.memo(RecentAddresses, () => true);
