import React, {useMemo} from 'react';
import {palette, rounded, spacing} from '@utils/styles';

import {AppTheme} from '@utils/styles/theme';
import {Dimensions, StyleSheet, View} from 'react-native';
import Text from '@components/Text/Text';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {Image} from 'expo-image';
import QRCode from 'react-native-qrcode-svg';
import {Canvas, Rect, LinearGradient, vec} from '@shopify/react-native-skia';
const NanoIDCard = () => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const gradients = useMemo(() => {
        if (theme.isDark) {
            return [theme.colors.primary, theme.colors.secondary];
        }
        return [palette.violet500, palette.teal400];
    }, [theme]);

    const width = Dimensions.get('window').width;
    return (
        <View style={{...theme.cardVariants.simple, flex: 1, height: 150, borderRadius: rounded.l, overflow: 'hidden'}}>
            <Canvas style={{flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
                <Rect x={0} y={0} width={width} height={150}>
                    <LinearGradient start={vec(0, 0)} end={vec(width, 150)} colors={gradients} />
                </Rect>
            </Canvas>
            <View style={styles.container}>
                <Text style={styles.nanoid} weight="500">
                    NANO ID
                </Text>
                <View>
                    <Image
                        source={{uri: 'https://i.pinimg.com/736x/cf/c8/1a/cfc81aa0f2442f80a5174db505f6d250.jpg'}}
                        style={styles.thumbnail}
                    />
                </View>
                <View style={{marginLeft: spacing.m, justifyContent: 'center'}}>
                    <Text style={styles.name}>Bahati Bakari</Text>
                    <Text style={styles.handle}>@bahati</Text>
                </View>
                <View style={{flex: 1}} />
                <View style={styles.qrCodeContainer}>
                    <QRCode value={'TODOTODOTODO'} size={46} color={'white'} backgroundColor="transparent" />
                </View>
            </View>
        </View>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            // ...theme.cardVariants.simple,
            // borderRadius: rounded.m,
            // backgroundColor: theme.colors.cardBackground,
            padding: spacing.xl,
            flexDirection: 'row',
            alignItems: 'center',
            zIndex: 10,
            flex: 1,
        },
        thumbnail: {
            width: 64,
            height: 64,
            borderRadius: rounded.full,
        },
        title: {
            fontSize: 25,
            color: 'white',
        },
        name: {
            opacity: 0.7,
            fontSize: 16,
            color: 'white',
        },
        handle: {
            fontSize: 18,
            color: 'white',
        },
        nanoid: {
            fontSize: 10,
            position: 'absolute',
            top: spacing.s,
            right: spacing.s,
            opacity: 0.5,
            color: 'white',
        },
        qrCodeContainer: {
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

export default React.memo(NanoIDCard);
