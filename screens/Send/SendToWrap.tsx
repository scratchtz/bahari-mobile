import AddressThumbnail from '@components/AddressThumbnail/AddressThumbnail';
import {StyleSheet, View} from 'react-native';
import Text from '@components/Text/Text';
import {checkAddressValidity, shortenAddress} from '@utils/helper/address';
import {Searching} from '@components/Animation/Searching';
import Success from '@components/Animation/Success';
import {Warning} from '@components/Animation/Warning';
import React, {useEffect, useMemo, useState} from 'react';
import {useAppTheme} from '@hooks/useAppTheme';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {AppTheme, spacing} from '@utils/styles';
import {tools} from 'nanocurrency-web';
import {getAddressDetails} from '@hooks/useContacts';

type AddressState = 'checking' | 'valid' | 'unknown' | 'invalid';

export const SendToWrap = React.memo(({address}: {address: string}) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const [addressState, setAddressState] = useState<AddressState>('checking');

    const checkAddress = async () => {
        setAddressState('checking');
        if (!tools.validateAddress(address)) {
            setAddressState('invalid');
            return;
        }
        const isAddressValid = await checkAddressValidity(address);
        if (isAddressValid) {
            setAddressState('valid');
            return;
        }
        setAddressState('unknown');
    };

    const toName = useMemo(() => {
        const data = getAddressDetails(address);
        if (data) {
            return data.name;
        }
        return '';
    }, [address]);

    useEffect(() => {
        void checkAddress();
    }, []);

    return (
        <>
            <View style={styles.sendToContainer}>
                <AddressThumbnail address={address} size={40} containerStyle={styles.sendToThumbnail} />
                <View style={styles.sendToMidContainer}>
                    <Text style={styles.sendToTitle} weight="600">
                        Send to {toName}
                    </Text>
                    <Text style={styles.sendToAddress} weight="600">
                        {shortenAddress(address)}
                    </Text>
                    {addressState === 'checking' && <Text style={styles.verificationText}>Verifying Address...</Text>}
                    {addressState === 'unknown' && (
                        <Text style={styles.verificationTextFailed} weight="500">
                            Address is valid but has no single transaction.
                        </Text>
                    )}
                    {addressState === 'invalid' && (
                        <Text style={styles.verificationTextFailed} weight="500">
                            Address is invalid. You can still try to send but make sure it's correct.
                        </Text>
                    )}
                </View>
                {addressState === 'checking' && <Searching size={40} color={theme.colors.secondaryLight} />}
                {addressState === 'valid' && <Success size={40} color={theme.colors.success} />}
                {(addressState === 'unknown' || addressState === 'invalid') && <Warning size={32} />}
            </View>
        </>
    );
});

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        sendToContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.th,
            marginHorizontal: -spacing.th,
        },
        sendToThumbnail: {
            marginRight: spacing.l,
        },
        sendToMidContainer: {
            flex: 1,
        },
        sendToTitle: {
            color: theme.colors.textSecondary,
            fontSize: 13,
        },
        sendToAddress: {
            color: theme.colors.textPrimary,
        },
        verifyingAddressContainer: {},
        verificationText: {
            color: theme.colors.secondaryLight,
            fontSize: 12,
            marginTop: spacing.xs,
        },
        verificationTextFailed: {
            fontSize: 12,
            color: theme.colors.warning,
            marginTop: spacing.xs,
        },
        verificationAnimation: {
            height: 30,
        },
    });
