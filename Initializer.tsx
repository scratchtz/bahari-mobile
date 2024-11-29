import {useAllCurrenciesValue} from '@hooks/useDisplayCurrency';
import {useSimplePrice} from '@hooks/useSimplePrice';
import useTranslationInit from '@hooks/useTranslationInit';

export const Initializer = () => {
    useAllCurrenciesValue(true);
    useSimplePrice(true);
    useTranslationInit();

    return null;
};
