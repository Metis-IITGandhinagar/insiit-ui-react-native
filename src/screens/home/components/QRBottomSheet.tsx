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
                            color="#2563EB"
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
                            color="#64748B"
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
                        color="#FFFFFF"
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
        backgroundColor: "#FFF",

        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,

        padding: 24,
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
        color: "#64748B",
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
        backgroundColor: "#F8FAFC",

        justifyContent: "center",
        alignItems: "center",

        borderWidth: 1,
        borderColor: "#E2E8F0",
    },

    expiry: {
        textAlign: "center",
        color: "#64748B",
        marginBottom: 22,
        fontSize: 14,
    },

    refreshButton: {
        backgroundColor: "#2563EB",
        borderRadius: 16,

        paddingVertical: 15,

        justifyContent: "center",
        alignItems: "center",

        flexDirection: "row",
    },

    refreshText: {
        marginLeft: 8,
        color: "#FFF",
        fontWeight: "700",
        fontSize: 16,
    },

    note: {
        marginTop: 16,
        textAlign: "center",
        color: "#94A3B8",
        fontSize: 13,
        lineHeight: 20,
    },
});