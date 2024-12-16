import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {AppTheme, rounded, spacing} from '@utils/styles';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {Network} from '@utils/types/network';
import Text from '@components/Text/Text';
import {Entypo, Feather} from '@expo/vector-icons';
import {MenuView} from '@react-native-menu/menu';
import {BAHARI_RPC_URL} from '@constants/endpoints';
import {useAppTheme} from '@hooks/useAppTheme';
import {useWorkServer} from '@hooks/useWorkServer';

interface Props extends Network {
    isSelected: boolean;
}

type MenuAction = 'makeDefault' | 'delete';

const ServerItem = ({label, endpoint, isSelected}: Props) => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);
    const {changeCurrentNetwork, deleteNetwork} = useWorkServer();

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

    return (
        <View style={[styles.container, isSelected && styles.containerSelected]}>
            <View style={styles.midContainer}>
                <Text weight={'600'}>{label}</Text>
                <Text style={styles.endpoint}>{endpoint}</Text>
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
            marginTop: spacing.xs,
        },
        version: {
            color: theme.colors.textSecondary,
        },
        checkMark: {
            padding: spacing.m,
            fontSize: 24,
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
            fontSize: 14,
            marginRight: spacing.xs,
            color: theme.colors.textSecondary,
        },
        ping: {
            fontSize: 14,
        },
    });

export default React.memo(ServerItem);
