import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {CommonStackScreenProps} from '@navigation/types';
import {AppTheme, spacing} from '@utils/styles';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import Separator from '@components/Separator/Separator';
import Text from '@components/Text/Text';
import {useRepresentatives} from '@hooks/useRepresentatives';
import {useAppTheme} from '@hooks/useAppTheme';
import TextInput from '@components/TextInput/TextInput';
import {RepItem} from '@screens/Representative/RepItem';
import {FlashList} from '@shopify/flash-list';
import {FontAwesome6} from '@expo/vector-icons';
import {tools} from 'nanocurrency-web';
import ChangeRepModal from '@screens/Representative/ChangeRepModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import * as Clipboard from 'expo-clipboard';
import {hitSlop} from '@constants/variables';
import {ToastController} from '@components/Toast/Toast';
import {useTranslation} from 'react-i18next';

const FILTER_MIN_WEIGHT = 2;
const FILTER_MIN_UPTIME = 90;
const ChangeRepresentative = ({navigation}: CommonStackScreenProps<'ChangeRepresentative'>) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const {t} = useTranslation();

    const changeRepModal = useRef<BottomSheetModal>(null);
    const [newRepAccount, setNewRepAccount] = useState('');

    const {data: representatives} = useRepresentatives();

    const reps = useMemo(() => {
        if (!representatives?.data) return [];
        return representatives.data.filter(
            rep =>
                parseFloat(rep.weight_percent) < FILTER_MIN_WEIGHT &&
                parseFloat(rep.uptime_percent) > FILTER_MIN_UPTIME,
        );
    }, [representatives]);

    useEffect(() => {
        if (!newRepAccount) {
            return;
        }
        if (!tools.validateAddress(newRepAccount)) {
            return;
        }
        void openChangeRepModal();
    }, [newRepAccount]);

    const openChangeRepModal = useCallback(() => {
        changeRepModal?.current?.present();
    }, []);

    const onPasteAddress = async () => {
        const text = await Clipboard.getStringAsync();
        if (!tools.validateAddress(text)) {
            ToastController.show({kind: 'error', content: `${t('representative.change.invalid_address')}`});
            return;
        }
        setNewRepAccount(text);
    };

    return (
        <>
            <FlashList
                contentContainerStyle={styles.container}
                estimatedItemSize={200}
                ListHeaderComponent={
                    <>
                        <Text>{t('representative.change.representative_address')}</Text>
                        <TextInput
                            rightItem={
                                newRepAccount ? (
                                    <TouchableOpacity>
                                        <FontAwesome6 name="delete-left" size={24} color="black" />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity hitSlop={hitSlop} onPress={onPasteAddress}>
                                        <FontAwesome6 name="paste" style={styles.pasteIcon} />
                                    </TouchableOpacity>
                                )
                            }
                        />
                        <Separator space={spacing.l} />
                        <Text>{t('representative.change.pick')}</Text>
                        <Separator space={spacing.l} />
                    </>
                }
                ItemSeparatorComponent={() => <Separator space={spacing.l} />}
                data={reps}
                keyExtractor={item => item.account}
                renderItem={({item}) => (
                    <RepItem
                        {...item}
                        onPress={() => {
                            setNewRepAccount(item.account);
                        }}
                    />
                )}
            />
            <ChangeRepModal newRepAccount={newRepAccount} ref={changeRepModal} />
        </>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            padding: spacing.th,
        },
        pasteIcon: {
            fontSize: 20,
            color: theme.colors.textPrimary,
            padding: spacing.m,
        },
    });

export default ChangeRepresentative;
