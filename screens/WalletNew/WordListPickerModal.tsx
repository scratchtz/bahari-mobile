import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useBottomSheetBackHandler} from '@hooks/hooksbottomsheet/useBottomSheetBackHandler';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {AppTheme, rounded, spacing} from '@utils/styles';
import Text from '@components/Text/Text';

import {Wordlists} from '@dreson4/react-native-quick-bip39';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {collectManifestSchemes} from 'expo-linking';

export type SupportedWordList = 'cs' | 'en' | 'es' | 'fr' | 'ja' | 'it' | 'ko' | 'pt' | 'zh';
export type WordListPick = {label: string; value: SupportedWordList};
//TODO check these translations. Not sure at all except English and Korean
const LANGUAGES: WordListPick[] = [
    {label: 'English', value: 'en'},
    {label: 'čeština', value: 'cs'},
    {label: 'Española', value: 'es'},
    {label: 'Française', value: 'fr'},
    {label: '日本語', value: 'ja'},
    {label: 'italiano', value: 'it'},
    {label: '한국어', value: 'ko'},
    {label: 'Português', value: 'pt'},
    {label: '中文', value: 'zh'},
];

interface Props {
    onWordListPick(pick: WordListPick): void;
}

const WordListPickerModal = (props: Props, ref: any) => {
    const {handleSheetPositionChange} = useBottomSheetBackHandler(ref);

    const snapPoints = useMemo(() => ['70%', '94%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} opacity={0.5} disappearsOnIndex={-1} appearsOnIndex={0} />,
        [],
    );

    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    return (
        <BottomSheetModal
            enablePanDownToClose
            backgroundStyle={styles.modal}
            handleIndicatorStyle={styles.indicator}
            ref={ref}
            onChange={handleSheetPositionChange}
            backdropComponent={renderBackdrop}
            snapPoints={snapPoints}>
            <View style={styles.container}>
                <Text variant="subheader">Change Passphrase Language</Text>
                <Text style={styles.warning}>
                    Some other wallet applications might not support importing any passphrase that's not in English
                </Text>

                <BottomSheetScrollView>
                    <Text>Hallo World</Text>
                </BottomSheetScrollView>

                {LANGUAGES.map(l => {
                    return (
                        <TouchableOpacity
                            style={styles.languageItem}
                            key={l.value}
                            onPress={() => {
                                props.onWordListPick(l);
                                ref.current.close();
                            }}>
                            <Text style={styles.languageText}>{l.label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </BottomSheetModal>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        modal: {
            backgroundColor: theme.colors.modalBackground,
        },
        indicator: {
            backgroundColor: theme.colors.modalIndicator,
        },
        container: {
            padding: spacing.th,
        },
        languageItem: {
            padding: spacing.l,
            marginTop: spacing.s,
        },
        languageText: {},
        warning: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
    });

export default React.forwardRef(WordListPickerModal);
