import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {AppTheme, palette, rounded, spacing} from '@utils/styles';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {Network} from '@utils/types/network';
import Text from '@components/Text/Text';
import {Entypo, Feather, MaterialIcons} from '@expo/vector-icons';
import {MenuView} from '@react-native-menu/menu';
import {BAHARI_RPC_URL} from '@constants/endpoints';
import {useNetworks} from '@hooks/useNetworks';
import {useAppTheme} from '@hooks/useAppTheme';

interface Props extends Network {
    isSelected: boolean;
}

type MenuAction = 'makeDefault' | 'delete';
const NetworkItem = ({label, endpoint, isSelected}: Props) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);
    const {changeCurrentNetwork, deleteNetwork} = useNetworks();
    const [ping, setPing] = useState<number>(0);

    const menuActions = useMemo(() => {
        let actions: {id: MenuAction; title: string}[] = [];
        if (!isSelected) {
            actions.push({id: 'makeDefault', title: 'Set as Default'});
            if (endpoint !== BAHARI_RPC_URL) {
                actions.push({id: 'delete', title: 'Delete'});
            }
        }
        return actions;
    }, [isSelected]);

    useEffect(() => {
        void fakePing();
        const interval = setInterval(fakePing, 10000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const fakePing = async () => {
        try {
            const body = JSON.stringify({
                action: 'version',
            });
            const start = new Date().getTime();
            await fetch(endpoint, {method: 'POST', body});
            const elapsed = new Date().getTime() - start;
            if (elapsed < ping || !ping) {
                setPing(elapsed);
            }
        } catch (e) {
            setPing(0);
        }
    };

    const onMenuAction = ({nativeEvent}: {nativeEvent: {event: string}}) => {
        const action = nativeEvent.event as MenuAction;
        if (action === 'makeDefault') {
            changeCurrentNetwork(endpoint);
            return;
        }
        if (action === 'delete') {
            deleteNetwork(endpoint);
            return;
        }
    };

    const pingColor = useMemo(() => {
        if (ping === 0) return theme.colors.textTertiary;
        if (ping < 100) return palette.sky500;
        if (ping < 200) return palette.blue500;
        if (ping < 500) return palette.amber500;
        return palette.rose500;
    }, [theme, ping]);

    return (
        <View style={[styles.container, isSelected && styles.containerSelected]}>
            <View style={styles.midContainer}>
                <Text weight={'600'}>{label}</Text>
                <Text style={styles.endpoint}>{endpoint}</Text>
                <TouchableOpacity style={styles.pingContainer} onPress={fakePing}>
                    <MaterialIcons name="network-check" style={[styles.pingIcon, {color: pingColor}]} />
                    <Text weight="500" style={[styles.ping, {color: pingColor}]}>
                        {ping === 0 ? '?' : `${ping}ms`}
                    </Text>
                </TouchableOpacity>
            </View>
            {isSelected && <Feather name="check" style={styles.checkMark} />}
            {menuActions.length > 0 && (
                <MenuView onPressAction={onMenuAction} actions={menuActions}>
                    <Entypo name="dots-three-vertical" style={styles.menuDots} />
                </MenuView>
            )}
        </View>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            ...theme.cardVariants.simple,
            backgroundColor: theme.colors.cardBackground,
            borderRadius: rounded.l,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
        },
        containerSelected: {
            borderColor: theme.colors.primary,
            borderWidth: 2,
        },
        labelContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        midContainer: {
            flex: 1,
        },
        endpoint: {
            color: theme.colors.textSecondary,
        },
        checkMark: {
            padding: spacing.m,
            fontSize: 18,
            color: theme.colors.textPrimary,
        },
        menuDots: {
            padding: spacing.m,
            fontSize: 18,
            color: theme.colors.textSecondary,
        },
        pingContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-end',
        },
        pingIcon: {
            fontSize: 12,
            marginRight: spacing.xs,
            color: theme.colors.textSecondary,
        },
        ping: {
            fontSize: 12,
        },
    });

export default React.memo(NetworkItem);
