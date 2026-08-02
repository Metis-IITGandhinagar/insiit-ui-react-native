import React, { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
    TextInput,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { BlurView } from "expo-blur";
import { QrCode, LogOut, X, KeyRound, User, Eye, EyeOff } from "lucide-react-native";
import { useTheme } from "@/core/theme";
import QRCode from "react-native-qrcode-svg";
import { qrService } from "../services/qrService";
import { QRSession } from "../services/qrTypes";

export type QRBottomSheetRef = {
    expand: () => void;
    close: () => void;
};

const QRBottomSheet = forwardRef<QRBottomSheetRef>((_, ref) => {
    const [visible, setVisible] = useState(false);
    const [session, setSession] = useState<QRSession | null>(null);
    const [uiLoading, setUiLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [campusPassword, setCampusPassword] = useState("");
    const [validationMessage, setValidationMessage] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
        expand() { setVisible(true); },
        close() { setVisible(false); },
    }));

    useEffect(() => {
        if (visible) {
            checkActiveAuthenticationState();
        }
    }, [visible]);

    const checkActiveAuthenticationState = async () => {
        const storedUser = await qrService.getSession();
        setSession(storedUser);
    };

    const runInstituteSignInFlow = async () => {
        if (!email.trim() || !campusPassword.trim()) {
            setValidationMessage("Email and password are required.");
            return;
        }

        try {
            setUiLoading(true);
            setValidationMessage(null);

            const qrSession = await qrService.refreshQR(
                email.trim(),
                campusPassword
            );

            setSession(qrSession);
            setCampusPassword("");
        } catch (err) {
            console.log("QR ERROR:", err);
            if (err instanceof Error) {
                console.log("MESSAGE:", err.message);
            }
            setValidationMessage("Unable to fetch your mess QR.");
        } finally {
            setUiLoading(false);
        }
    };

    const executeDisconnect = async () => {
        await qrService.clearSession();
        setSession(null);
    };

    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.absoluteViewContainer}
            >
                <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill}>
                    <Pressable style={styles.dismissalCatch} onPress={() => setVisible(false)} />
                </BlurView>

                <View style={styles.sheetLayout}>
                    <View style={styles.headerRow}>
                        <View style={styles.titleGroup}>
                            <QrCode size={22} color={colors.primary} />
                            <Text style={styles.titleText}>{session ? "Mess Pass" : "IITGN Login"}</Text>
                        </View>
                        <Pressable onPress={() => setVisible(false)}>
                            <X size={22} color={colors.textSecondary} />
                        </Pressable>
                    </View>

                    {!session ? (
                        <View style={styles.innerForm}>
                            <Text style={styles.descParagraph}>
                                Log in with your mess portal credentials
                            </Text>

                            {validationMessage && <Text style={styles.errBanner}>{validationMessage}</Text>}

                            <View style={styles.inputControlRow}>
                                <User size={18} color={colors.textSecondary} style={styles.iconMargin} />
                                <TextInput
                                    style={styles.fieldStyle}
                                    placeholder="Email ID"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    autoCorrect={false}
                                />
                            </View>

                            <View style={styles.inputControlRow}>
                                <KeyRound size={18} color={colors.textSecondary} style={styles.iconMargin} />
                                <TextInput
                                    style={styles.fieldStyle}
                                    placeholder="Password"
                                    secureTextEntry={!showPassword}
                                    value={campusPassword}
                                    onChangeText={setCampusPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    textContentType="password"
                                    autoComplete="password"
                                />
                                <Pressable
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIconContainer}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} color={colors.textSecondary} />
                                    ) : (
                                        <Eye size={18} color={colors.textSecondary} />
                                    )}
                                </Pressable>
                            </View>

                            <Pressable style={styles.submitCta} onPress={runInstituteSignInFlow} disabled={uiLoading}>
                                {uiLoading ? <ActivityIndicator color="white" /> : <Text style={styles.ctaText}>Secure Login</Text>}
                            </Pressable>
                        </View>
                    ) : (
                        <View style={styles.activeInterface}>
                            <Text style={styles.descParagraph}>
                                Scan this barcode token at your mess entrance
                            </Text>

                            <View style={styles.qrCenteredWrapper}>
                                <View style={styles.barcodeFrameBox}>
                                    <QRCode
                                        value={session.qrData}
                                        size={180}
                                    />
                                </View>
                            </View>

                            <Pressable style={styles.logoutButtonCta} onPress={executeDisconnect}>
                                <LogOut size={18} color={colors.danger} />
                                <Text style={styles.logoutButtonText}>Login Again</Text>
                            </Pressable>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
});

export default QRBottomSheet;

const getStyles = ({ colors, radius, shadows, spacing, typography }: any) => StyleSheet.create({
    absoluteViewContainer: {
        flex: 1,
        justifyContent: "flex-end",
    },
    dismissalCatch: {
        flex: 1,
    },
    sheetLayout: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
        padding: spacing.xl,
        paddingBottom: 64,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.sm,
    },
    titleGroup: {
        flexDirection: "row",
        alignItems: "center",
    },
    titleText: {
        marginLeft: 10,
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
    },
    descParagraph: {
        color: colors.textSecondary,
        fontSize: 16,
        lineHeight: 20,
        marginBottom: spacing.lg,
        textAlign:"center",
    },
    innerForm: {
        marginTop: spacing.xs,
    },
    errBanner: {
        color: colors.danger,
        backgroundColor: "#FEE2E2",
        padding: spacing.sm,
        borderRadius: radius.sm,
        marginBottom: spacing.md,
        fontSize: 13,
        fontWeight: "500",
    },
    inputControlRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surfaceAlt,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: radius.md,
        marginBottom: spacing.md,
        paddingHorizontal: spacing.md,
        height: 50,
    },
    iconMargin: {
        marginRight: spacing.sm,
    },
    fieldStyle: {
        flex: 1,
        color: colors.text,
        fontSize: 15,
    },
    eyeIconContainer: {
        paddingLeft: spacing.sm,
        justifyContent: "center",
        alignItems: "center",
    },
    submitCta: {
        backgroundColor: colors.primary,
        borderRadius: radius.lg,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginTop: spacing.sm,
    },
    ctaText: {
        color: "white",
        ...typography.body,
        fontWeight: "600",
    },
    activeInterface: {
        alignItems: "stretch",
    },
    qrCenteredWrapper: {
        alignItems: "center",
        marginVertical: spacing.md,
    },
    barcodeFrameBox: {
        width: 240,
        height: 250,
        borderRadius: radius.xl,
        backgroundColor: colors.surfaceAlt,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    tokenFooterString: {
        marginTop: 12,
        fontSize: 11,
        fontWeight: "600",
        color: colors.textSecondary,
        letterSpacing: 1,
    },
    logoutButtonCta: {
        flexDirection: "row",
        backgroundColor: "#FEE2E2",
        borderWidth: 1,
        borderColor: "#FCA5A5",
        borderRadius: radius.lg,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        marginTop: spacing.sm,
    },
    logoutButtonText: {
        color: colors.danger,
        fontWeight: "600",
    },
});