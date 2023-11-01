import React, {useImperativeHandle, useLayoutEffect, useRef, useState, MutableRefObject, useMemo} from 'react';
import {spacing, AppTheme, rounded} from '@utils/styles';
import {StyleSheet, View} from 'react-native';
import {useAppTheme} from '@hooks/useAppTheme';
import Text from '@components/Text/Text';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Feather} from '@expo/vector-icons';
import Animated, {FadeInUp, FadeOutUp} from 'react-native-reanimated';

type ToastProps = {
    title?: string;
    content: string;
    kind: 'success' | 'error' | 'info';
    autohide?: boolean;
    timeout?: number;
};

export type ToastRef = {
    show: (props: ToastProps) => void;
    hide: () => void;
};

export class ToastController {
    static modalRef: MutableRefObject<ToastRef>;
    static setRef = (ref: any) => {
        this.modalRef = ref;
    };
    static show = (props: ToastProps) => {
        this.modalRef.current?.show(props);
    };
    static hide = () => {
        this.modalRef.current?.hide();
    };
}

const Toast = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [props, setProps] = useState<ToastProps | null>(null);

    const timeout = useRef<any>();

    const modalRef = useRef<ToastRef>();
    useLayoutEffect(() => {
        ToastController.setRef(modalRef);
    }, []);

    useImperativeHandle(
        modalRef,
        () => ({
            show: (props: ToastProps) => {
                //resetting time again in case we double call this method.
                if (timeout.current) {
                    clearTimeout(timeout.current);
                }
                setProps(props);
                setModalVisible(true);
                let autohideTime = props.timeout || 3000;
                if (props.autohide === false) {
                    autohideTime = 60000;
                }
                timeout.current = setTimeout(() => {
                    setModalVisible(false);
                }, autohideTime);
            },
            hide: () => {
                setModalVisible(false);
                setProps(null);
            },
        }),
        [],
    );

    const insets = useSafeAreaInsets();
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const icon = useMemo(() => {
        switch (props?.kind) {
            case 'success':
                return <Feather name="check" style={styles.icon} />;
            case 'error':
                return <Feather name="x" style={styles.icon} />;
            case 'info':
                return <Feather name="info" style={styles.icon} />;
        }
    }, [theme, props]);

    const bg = useMemo(() => {
        switch (props?.kind) {
            case 'success':
                return theme.colors.success;
            case 'error':
                return theme.colors.warning;
            case 'info':
                return theme.colors.secondary;
        }
    }, [theme, props]);

    if (!modalVisible || !props) return null;
    return (
        <Animated.View
            entering={FadeInUp.duration(500)}
            exiting={FadeOutUp.duration(500)}
            style={[styles.toast, {top: insets.top}]}>
            <View style={[styles.container, {backgroundColor: bg}]}>
                {icon}
                <View style={styles.midContainer}>
                    {props.title && (
                        <Text style={styles.content} weight="600">
                            {props.title}
                        </Text>
                    )}
                    {props.content && <Text style={styles.message}>{props.content}</Text>}
                </View>
            </View>
        </Animated.View>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        toast: {
            position: 'absolute',
            alignItems: 'center',
            right: 0,
            left: 0,
        },
        container: {
            backgroundColor: theme.colors.warning,
            borderRadius: rounded.xxl,
            flexDirection: 'row',
            alignItems: 'center',
            maxWidth: 350,
            minWidth: 200,
            padding: spacing.l,
            alignSelf: 'center',
        },
        midContainer: {
            flex: 1,
            minWidth: 200,
            maxWidth: 300,
        },
        content: {
            fontSize: 14,
            color: 'white',
        },
        message: {
            fontSize: 14,
            color: 'white',
        },
        icon: {
            fontSize: 24,
            color: 'white',
            marginRight: spacing.l,
        },
    });

export default React.forwardRef(Toast);
