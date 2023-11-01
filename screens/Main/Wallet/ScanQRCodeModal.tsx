import React, {useCallback, useMemo, useRef} from 'react';
import {View, StyleSheet, Dimensions, Linking} from 'react-native';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {useBottomSheetBackHandler} from '@hooks/hooksbottomsheet/useBottomSheetBackHandler';
import {palette, rounded, spacing} from '@utils/styles';
import Text from '@components/Text/Text';
import {Feather, FontAwesome5} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Canvas, Mask, Group, RoundedRect, Rect} from '@shopify/react-native-skia';
import {NanoUriParams, parseNanoUri} from '@utils/helper/uri';
import {Camera, useCameraDevice, useCameraPermission, Code, useCodeScanner} from 'react-native-vision-camera';

interface Props {
    onClose: (params: NanoUriParams | undefined) => void;
}

export const ScanQRCodeModal = React.forwardRef((props: Props, ref: any) => {
    const {hasPermission, requestPermission} = useCameraPermission();
    const device = useCameraDevice('back');

    const isScanned = useRef<boolean>(false);

    const scanLock = useRef(false);
    const handleScannedCodes = (codes: Code[]) => {
        if (scanLock.current) {
            return;
        }
        scanLock.current = true;
        for (let i = 0; i < codes.length; i++) {
            try {
                const curr = codes[i];
                const params = parseNanoUri(curr.value || '');
                if (params.kind == 'nano') {
                    onClose(params);
                    return;
                }
            } catch (e) {}
        }
        setTimeout(() => {
            scanLock.current = false;
        }, 2000);
    };

    const {handleSheetPositionChange} = useBottomSheetBackHandler(ref);

    const snapPoints = useMemo(() => ['100%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} opacity={0.8} disappearsOnIndex={-1} appearsOnIndex={0} />,
        [],
    );

    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: handleScannedCodes,
    });

    const onClose = (params?: NanoUriParams) => {
        if (params) {
            if (props.onClose) {
                props.onClose(params);
                return;
            }
        }
        ref.current.close();
    };
    const insets = useSafeAreaInsets();
    const {width, height} = Dimensions.get('screen');

    const size = 250;
    const x = width / 2 - size / 2;
    const y = height / 2 - size / 2;

    const onSheetPosition = (index: number) => {
        if (index === -1) {
            isScanned.current = false;
            scanLock.current = false;
        } else {
            if (!hasPermission) {
                void requestPermission();
            }
        }
        handleSheetPositionChange(index);
    };

    return (
        <BottomSheetModal
            enablePanDownToClose
            ref={ref}
            onChange={onSheetPosition}
            backdropComponent={renderBackdrop}
            handleComponent={null}
            handleHeight={0}
            backgroundComponent={() => null}
            snapPoints={snapPoints}>
            <View style={styles.container}>
                {hasPermission && device && (
                    <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} codeScanner={codeScanner} />
                )}
                {!hasPermission && (
                    <View style={styles.enableCameraContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                void Linking.openSettings();
                            }}>
                            <Text style={styles.enableCamera} weight={'600'}>
                                Enable Camera to Scan QR code
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                <Canvas style={{width, height}}>
                    <Mask
                        mode="luminance"
                        mask={
                            <Group>
                                <Rect x={0} y={0} width={width} height={height} color="white" />
                                <RoundedRect x={x} y={y} width={size} height={size} r={rounded.xl} color="black" />
                            </Group>
                        }
                        clip>
                        <Rect x={0} y={0} width={width} height={height} color="rgba(0,0,0,0.8)" />
                    </Mask>
                    <RoundedRect
                        style="stroke"
                        strokeWidth={4}
                        x={x}
                        y={y}
                        width={size}
                        height={size}
                        r={rounded.xxl}
                        color={'white'}
                    />
                </Canvas>

                <View style={[styles.innerContainer, {paddingTop: insets.top}]}>
                    <View style={styles.headerContainer}>
                        <Text variant="subheader" style={styles.head} weight={'600'}>
                            Scan QR Code
                        </Text>
                        <TouchableOpacity
                            style={styles.closeWrap}
                            onPress={() => {
                                onClose();
                            }}>
                            <Feather name="x" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </BottomSheetModal>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        position: 'absolute',
        right: 0,
        left: 0,
        paddingRight: spacing.th,
        paddingLeft: spacing.th,
        bottom: 0,
        flex: 1,
        top: 0,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    midContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    head: {
        color: 'white',
        fontSize: 18,
    },
    indicator: {
        position: 'absolute',
        backgroundColor: 'red',
        padding: 0,
        margin: 0,
    },
    actionButtons: {
        marginTop: spacing.xl,
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginRight: spacing.m,
        paddingVertical: spacing.m,
        paddingHorizontal: spacing.l,
        borderRadius: rounded.xl,
        borderWidth: 1,
        borderColor: palette.gray800,
    },
    actionIcon: {
        fontSize: 14,
        marginRight: spacing.m,
        color: palette.gray100,
    },
    actionText: {
        fontSize: 14,
        color: palette.gray100,
    },
    enableCameraContainer: {
        position: 'absolute',
        zIndex: 999999,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    enableCamera: {
        color: 'white',
        textDecorationLine: 'underline',
        fontSize: 16,
    },
    closeWrap: {
        backgroundColor: '#111111',
        borderRadius: rounded.full,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
