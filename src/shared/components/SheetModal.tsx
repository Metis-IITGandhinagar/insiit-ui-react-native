import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    Keyboard,
    Modal,
    Platform,
    Pressable,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@core/theme';

interface SheetModalProps {
    visible: boolean;
    onClose: () => void;
    /** The sheet itself. Anchored to the bottom edge and slid up into place. */
    children: React.ReactNode;
    /** `blur` frosts the content behind the sheet; `dim` is a plain scrim. */
    backdrop?: 'dim' | 'blur';
    blurIntensity?: number;
    /** Lifts the sheet above the keyboard. For sheets containing inputs. */
    avoidKeyboard?: boolean;
    /** Set false for a sheet that must be dismissed explicitly. */
    dismissOnBackdropPress?: boolean;
    sheetStyle?: StyleProp<ViewStyle>;
}

const OPEN_DURATION = 240;
const CLOSE_DURATION = 180;

/**
 * A bottom sheet whose backdrop fades while the sheet slides.
 *
 * `<Modal animationType="slide">` animates its entire subtree, so the dim/blur layer
 * slid up as a visible rectangle alongside the sheet — reading as a grey block moving
 * over the screen rather than as a scrim. The two need different motion: the backdrop
 * belongs to the whole screen and should only change opacity, while the sheet is the
 * thing that actually travels.
 *
 * So the Modal itself animates nothing, and both layers are driven from one shared
 * progress value on the native thread. It stays mounted until the close animation
 * finishes, otherwise the sheet would vanish instantly instead of sliding out.
 */
const SheetModal: React.FC<SheetModalProps> = ({
    visible,
    onClose,
    children,
    backdrop = 'dim',
    blurIntensity = 30,
    avoidKeyboard = false,
    dismissOnBackdropPress = true,
    sheetStyle,
}) => {
    const theme = useTheme();
    const styles = getStyles(theme);

    const [mounted, setMounted] = useState(visible);
    const progress = useRef(new Animated.Value(visible ? 1 : 0)).current;

    /**
     * iOS only, and deliberately not KeyboardAvoidingView.
     *
     * KAV measures its own frame to decide how much padding to add, and inside a Modal
     * that measurement is off by the safe-area inset — it left a permanent strip of
     * scrim below the sheet even with the keyboard closed. Reading the keyboard frame
     * directly is exact, and costs one listener.
     *
     * Android needs none of this: the window is resized for the keyboard by the
     * system, so adding padding here would double-count it.
     */
    const [keyboardInset, setKeyboardInset] = useState(0);

    useEffect(() => {
        if (!avoidKeyboard || Platform.OS !== 'ios') return;

        const show = Keyboard.addListener('keyboardWillShow', (event) =>
            setKeyboardInset(event.endCoordinates.height)
        );
        const hide = Keyboard.addListener('keyboardWillHide', () => setKeyboardInset(0));

        return () => {
            show.remove();
            hide.remove();
        };
    }, [avoidKeyboard]);

    // Falls back to the screen height until the sheet has been measured, so the first
    // frame starts fully offscreen rather than popping in from halfway.
    const travel = useRef(Dimensions.get('window').height);
    const [, forceMeasure] = useState(0);

    useEffect(() => {
        if (visible) {
            setMounted(true);
            Animated.timing(progress, {
                toValue: 1,
                duration: OPEN_DURATION,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }).start();
            return;
        }

        Animated.timing(progress, {
            toValue: 0,
            duration: CLOSE_DURATION,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
        }).start(({ finished }) => {
            // Only unmount on a completed close; an interrupted one means the sheet was
            // reopened mid-animation and must stay on screen.
            if (finished) setMounted(false);
        });
    }, [progress, visible]);

    const translateY = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [travel.current, 0],
    });

    const anchor = (
        <View
            style={[styles.anchor, keyboardInset > 0 && { paddingBottom: keyboardInset }]}
            pointerEvents="box-none"
        >
            <Animated.View
                style={[styles.sheet, sheetStyle, { transform: [{ translateY }] }]}
                onLayout={(event) => {
                    const { height } = event.nativeEvent.layout;
                    if (height > 0 && Math.abs(height - travel.current) > 1) {
                        travel.current = height;
                        // Re-render so the interpolation picks up the measured height;
                        // a sheet shorter than the screen would otherwise slide in from
                        // much further down than it needs to.
                        forceMeasure((n) => n + 1);
                    }
                }}
            >
                {children}
            </Animated.View>
        </View>
    );

    return (
        <Modal
            visible={mounted}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={StyleSheet.absoluteFill}>
                <Animated.View style={[StyleSheet.absoluteFill, { opacity: progress }]}>
                    {backdrop === 'blur' ? (
                        <BlurView intensity={blurIntensity} tint="dark" style={StyleSheet.absoluteFill} />
                    ) : (
                        <View style={styles.scrim} />
                    )}
                </Animated.View>

                {dismissOnBackdropPress && (
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={onClose}
                        accessibilityLabel="Close"
                    />
                )}

                {anchor}
            </View>
        </Modal>
    );
};

export default SheetModal;

const getStyles = (_theme: any) =>
    StyleSheet.create({
        anchor: {
            flex: 1,
            justifyContent: 'flex-end',
        },
        sheet: {
            width: '100%',
        },
        scrim: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
    });
