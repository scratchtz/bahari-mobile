import React, {useState} from 'react';
import {rounded, spacing} from '@utils/styles';

import {AppTheme} from '@utils/styles/theme';
import {ScrollView, StyleSheet, TouchableOpacity, View, SafeAreaView} from 'react-native';
import Text from '@components/Text/Text';
import {CommonStackScreenProps} from '@navigation/types';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {Image} from 'expo-image';
import Separator from '@components/Separator/Separator';
import {ToastController} from '@components/Toast/Toast';
import SearchBar from '@components/SearchBar/SearchBar';

const Discover: React.FC<CommonStackScreenProps<'Discover'>> = ({navigation}) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const [searchUrl, setSearchURL] = useState('');

    const showComingSoon = () => {
        ToastController.show({kind: 'info', content: 'Coming Soon', timeout: 3000});
    };
    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text variant="subheader">Browser</Text>
                <Text variant="small">Revolutionizing Transactions, One Nano Block at a Time</Text>

                <SearchBar placeholder={'Search or enter website'} value={searchUrl} onChangeText={setSearchURL} />

                <Separator space={spacing.l} />
                <TouchableOpacity
                    style={{flex: 1, ...theme.cardVariants.simple, borderRadius: rounded.l}}
                    onPress={showComingSoon}>
                    <Image
                        source={require('@assets/images/nanoquest.jpg')}
                        style={{width: '100%', height: 150, borderRadius: rounded.l}}
                    />
                    <View style={{padding: spacing.l}}>
                        <Text weight="700">Nano Quest</Text>
                        <Text style={{marginTop: spacing.xs}}>Complete different quests to earn nano</Text>
                    </View>
                </TouchableOpacity>
                <Separator space={spacing.l} />
                <TouchableOpacity
                    style={{flex: 1, ...theme.cardVariants.simple, borderRadius: rounded.l}}
                    onPress={showComingSoon}>
                    <Image
                        source={require('@assets/images/rockpaperscissors.jpg')}
                        style={{width: '100%', height: 150, borderRadius: rounded.l}}
                    />
                    <View style={{padding: spacing.l}}>
                        <Text weight="700">Rock, Paper, Scissors</Text>
                        <Text style={{marginTop: spacing.xs}}>
                            Compete on rock, paper, scissors the winner receives nano
                        </Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            marginHorizontal: spacing.xl,
        },
    });

export default Discover;
