import React, {
    forwardRef,
    useImperativeHandle,
    useState,
} from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    QrCode,
    RefreshCcw,
    X,
} from "lucide-react-native";
import { colors, radius, spacing, typography } from "@/theme";

export type QRBottomSheetRef = {
    expand: () => void;
    close: () => void;
};

const QRBottomSheet = forwardRef<QRBottomSheetRef>((_, ref) => {
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
        expand() {
            setVisible(true);
        },
        close() {
            setVisible(false);
        },
    }));

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
        >
            <Pressable
                style={styles.overlay}
                onPress={() => setVisible(false)}
            />

            <View style={styles.sheet}>
                <View style={styles.header}>
                    <View style={styles.titleRow}>
                        <QrCode
                            size={22}
                            color={colors.primary}
                        />

                        <Text style={styles.title}>
                            Mess QR
                        </Text>
                    </View>

                    <Pressable
                        onPress={() => setVisible(false)}
                    >
                        <X
                            size={22}
                            color={colors.textSecondary}
                        />
                    </Pressable>
                </View>

                <Text style={styles.subtitle}>
                    Scan this QR at the mess entrance.
                </Text>

                <View style={styles.qrContainer}>
                    {/* Replace with generated QR later */}
                    <View style={styles.fakeQR}>
                        <QrCode
                            size={170}
                            color="#0F172A"
                        />
                    </View>
                </View>

                <Text style={styles.expiry}>
                    Valid until 31 Aug 2026
                </Text>

                <Pressable style={styles.refreshButton}>
                    <RefreshCcw
                        size={18}
                        color={colors.surface}
                    />

                    <Text style={styles.refreshText}>
                        Refresh QR
                    </Text>
                </Pressable>

                <Text style={styles.note}>
                    You'll only need to log in again when the QR expires.
                </Text>
            </View>
        </Modal>
    );
});

export default QRBottomSheet;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
    },

    sheet: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: colors.surface,
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
        padding: spacing.xl,
        paddingBottom: 40,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    titleRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    title: {
        marginLeft: 10,
        fontSize: 22,
        fontWeight: "700",
        color: "#0F172A",
    },

    subtitle: {
        marginTop: 10,
        textAlign: "center",
        color: colors.textSecondary,
        fontSize: 15,
    },

    qrContainer: {
        alignItems: "center",
        marginVertical: 28,
    },

    fakeQR: {
        width: 240,
        height: 240,
        borderRadius: 24,
        backgroundColor: colors.surfaceAlt,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.borderSoft,
    },

    expiry: {
        textAlign: "center",
        color: colors.textSecondary,
        marginBottom: 22,
        fontSize: 14,
    },

    refreshButton: {
        backgroundColor: colors.primary,
        borderRadius: radius.lg,
        paddingVertical: 15,

        justifyContent: "center",
        alignItems: "center",

        flexDirection: "row",
    },

    refreshText: {
        marginLeft: 8,
        color: colors.surface,
        ...typography.body,
    },

    note: {
        marginTop: 16,
        textAlign: "center",
        color: colors.inactive,
        fontSize: 13,
        lineHeight: 20,
    },
});