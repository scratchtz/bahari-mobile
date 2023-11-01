import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
import {BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal} from '@gorhom/bottom-sheet';
import {useBottomSheetBackHandler} from '@hooks/hooksbottomsheet/useBottomSheetBackHandler';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {AppTheme, spacing} from '@utils/styles';
import {ModalHeader} from '@components/ModalHeader/ModalHeader';
import Currencies from '@constants/currencies';
import CurrencyItem from '@components/CurrencyModal/CurrencyItem';
import Separator from '@components/Separator/Separator';
import {useDisplayCurrency} from '@hooks/useDisplayCurrency';
import SearchBar from '@components/SearchBar/SearchBar';

interface Props {}

const CurrencyModal = (props: Props, ref: any) => {
    const {handleSheetPositionChange} = useBottomSheetBackHandler(ref);
    const {displayCurrency, setDisplayCurrency} = useDisplayCurrency();

    const snapPoints = useMemo(() => ['90%', '96%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} opacity={0.5} disappearsOnIndex={-1} appearsOnIndex={0} />,
        [],
    );

    const [searchText, setSearchText] = useState('');
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const onClose = () => {
        ref.current.close();
    };

    const onPress = (code: string) => {
        setDisplayCurrency(code);
        onClose();
        setSearchText('');
    };

    const currencyList = useMemo(() => {
        const allCurrencies = [];
        for (const [_, value] of Object.entries(Currencies)) {
            if (searchText) {
                if (
                    value.name.toLowerCase().includes(searchText.toLowerCase()) ||
                    value.code.toLowerCase().includes(searchText.toLowerCase())
                ) {
                    allCurrencies.push(value);
                }
            } else {
                allCurrencies.push(value);
            }
        }
        allCurrencies.sort((a, b) => a.name.localeCompare(b.name));
        return allCurrencies;
    }, [searchText]);

    return (
        <BottomSheetModal
            enablePanDownToClose
            backgroundStyle={styles.container}
            handleIndicatorStyle={styles.indicator}
            ref={ref}
            android_keyboardInputMode={'adjustResize'}
            onChange={handleSheetPositionChange}
            backdropComponent={renderBackdrop}
            snapPoints={snapPoints}>
            <ModalHeader title={'Display Currency'} onClose={onClose} />
            <SearchBar
                placeholder="Search Currency"
                value={searchText}
                onChangeText={setSearchText}
                containerStyle={styles.searchBar}
            />
            <BottomSheetFlatList
                data={currencyList}
                contentContainerStyle={styles.flatList}
                keyExtractor={item => item.code}
                ItemSeparatorComponent={() => <Separator space={spacing.m} />}
                renderItem={({item}) => (
                    <CurrencyItem
                        {...item}
                        isSelected={displayCurrency === item.code}
                        onPress={() => {
                            onPress(item.code);
                        }}
                    />
                )}
            />
        </BottomSheetModal>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.modalBackground,
        },
        indicator: {
            backgroundColor: theme.colors.modalIndicator,
        },
        flatList: {
            marginBottom: spacing.xxl,
            paddingBottom: spacing.xxl,
        },
        searchBar: {
            marginHorizontal: spacing.th,
        },
    });

export default React.forwardRef(CurrencyModal);
