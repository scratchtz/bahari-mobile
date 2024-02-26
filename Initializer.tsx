import {useAllCurrenciesValue} from '@hooks/useDisplayCurrency';
import {useSimplePrice} from '@hooks/useSimplePrice';

export const Initializer = () => {
    useAllCurrenciesValue(true);
    useSimplePrice(true);

    return null;
};
