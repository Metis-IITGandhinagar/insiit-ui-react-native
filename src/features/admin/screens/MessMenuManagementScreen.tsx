import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Save, Utensils, Link2, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '@core/theme';
import { Card } from '@shared/components/Card';
import { PermissionGate } from '../components/PermissionGate';
import { useAdminPermissions } from '../hooks/useAdminPermissions';
import { apiClient } from '@core/api/apiClient';

export interface BackendMessMenuEntry {
    day: number;
    breakfast: string[];
    lunch: string[];
    snacks: string[];
    dinner: string[];
}

export const MessMenuManagementScreen: React.FC = () => {
    const { colors, spacing, typography, radius } = useTheme();
    const { canManageMessMenu } = useAdminPermissions();

    const [sheetUrl, setSheetUrl] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [parsedMenu, setParsedMenu] = useState<BackendMessMenuEntry[] | null>(null);

    const parseCSVText = (text: string) => {
        let rows: string[][] = [];
        let currentRow: string[] = [];
        let quote = false;
        let col = '';
        for (let i = 0; i < text.length; i++) {
            let cc = text[i], nc = text[i + 1];
            if (cc === '"' && quote && nc === '"') { col += '"'; i++; continue; }
            if (cc === '"') { quote = !quote; continue; }
            if (cc === ',' && !quote) { currentRow.push(col.trim()); col = ''; continue; }
            if ((cc === '\r' || cc === '\n') && !quote) {
                if (cc === '\r' && nc === '\n') i++;
                currentRow.push(col.trim());
                rows.push(currentRow);
                currentRow = [];
                col = '';
                continue;
            }
            col += cc;
        }
        if (col !== '' || currentRow.length > 0) {
            currentRow.push(col.trim());
            rows.push(currentRow);
        }
        return rows;
    };

    const mapDayToInt = (dayStr: string): number => {
        const d = dayStr.toLowerCase().trim();
        if (d.includes('mon')) return 1;
        if (d.includes('tue')) return 2;
        if (d.includes('wed')) return 3;
        if (d.includes('thu')) return 4;
        if (d.includes('fri')) return 5;
        if (d.includes('sat')) return 6;
        if (d.includes('sun')) return 7;
        return parseInt(d) || 0;
    };

    const handleFetchAndParse = async () => {
        if (!sheetUrl) return Alert.alert('Error', 'Please enter a Google Sheets URL');

        const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (!match) return Alert.alert('Error', 'Invalid Google Sheets URL. Make sure it contains /d/DOCUMENT_ID');

        setIsProcessing(true);
        setParsedMenu(null);

        try {
            const csvUrl = `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv`;
            const response = await fetch(csvUrl);

            if (!response.ok) throw new Error('Failed to fetch the spreadsheet. Ensure link sharing is turned on.');
            const csvText = await response.text();
            const rows = parseCSVText(csvText);

            if (rows.length < 40) throw new Error('Spreadsheet seems incomplete or malformed.');

            const formattedData: BackendMessMenuEntry[] = [];

            for (let dayCol = 1; dayCol <= 7; dayCol++) {

                const breakfast: string[] = [];
                for (let r = 3; r <= 12; r++) {
                    const val = rows[r]?.[dayCol]?.trim();
                    if (val && val !== '-' && val.toLowerCase() !== 'nan') breakfast.push(val);
                }

                const lunch: string[] = [];
                for (let r = 15; r <= 23; r++) {
                    const val = rows[r]?.[dayCol]?.trim();
                    if (val && val !== '-' && val.toLowerCase() !== 'nan') lunch.push(val);
                }

                const snacks: string[] = [];
                for (let r = 26; r <= 29; r++) {
                    const val = rows[r]?.[dayCol]?.trim();
                    if (val && val !== '-' && val.toLowerCase() !== 'nan') snacks.push(val);
                }

                const dinner: string[] = [];
                for (let r = 32; r <= 39; r++) {
                    const val = rows[r]?.[dayCol]?.trim();
                    if (val && val !== '-' && val.toLowerCase() !== 'nan') dinner.push(val);
                }

                formattedData.push({
                    day: dayCol,
                    breakfast,
                    lunch,
                    snacks,
                    dinner,
                });
            }

            if (formattedData.length === 0) {
                throw new Error("Could not parse menu data. Ensure the spreadsheet follows the exact row/column layout.");
            }

            setParsedMenu(formattedData);
            Alert.alert('Success', `Parsed ${formattedData.length} days of menu data, ignoring extra forms.`);

        } catch (err: any) {
            Alert.alert('Parsing Error', err?.message || 'Failed to process spreadsheet.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSaveMenu = async () => {
        if (!parsedMenu) return;
        setIsSaving(true);
        try {
            await apiClient.post('/mess-menu', parsedMenu);
            Alert.alert('Success', 'Mess menu updated successfully in the database!');
            setSheetUrl('');
            setParsedMenu(null);
        } catch (err: any) {
            Alert.alert('Error', err?.message || 'Failed to update mess menu.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <PermissionGate hasPermission={canManageMessMenu}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <ScrollView contentContainerStyle={[styles.contentContainer, { padding: spacing.lg }]}>
                    <View style={styles.header}>
                        <Utensils size={24} color={colors.primary} style={styles.headerIcon} />
                        <Text style={[styles.headerTitle, { color: colors.text }]}>Update Weekly Menu</Text>
                    </View>

                    <Card variant="surface" style={styles.cardOverride}>
                        <Text style={[styles.label, { color: colors.text }]}>
                            Google Sheets URL
                        </Text>
                        <Text style={[styles.subText, { color: colors.textSecondary }]}>
                            Ensure the spreadsheet is set to "Anyone with the link can view". Expected columns: Day, Breakfast, Lunch, Snacks, Dinner.
                        </Text>

                        <TextInput
                            style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                            placeholder="https://docs.google.com/spreadsheets/d/..."
                            placeholderTextColor={colors.textSecondary || '#999'}
                            value={sheetUrl}
                            onChangeText={setSheetUrl}
                            autoCapitalize="none"
                        />

                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: colors.primary, borderColor: colors.primary }]}
                            onPress={handleFetchAndParse}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <ActivityIndicator size="small" color={colors.primary} />
                            ) : (
                                <>
                                    <Link2 size={18} color={colors.background} style={{ marginRight: 8 }} />
                                    <Text style={{ color: colors.background, fontWeight: '600' }}>Save</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        {parsedMenu && (
                            <View style={styles.successBox}>
                                <CheckCircle2 size={20} color="#10B981" style={{ marginRight: 8 }} />
                                <Text style={{ color: '#10B981', fontWeight: '600', flex: 1 }}>
                                    Ready to upload {parsedMenu.length} days of data.
                                </Text>
                            </View>
                        )}
                    </Card>

                    <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: parsedMenu ? colors.primary : colors.primary }]}
                        onPress={handleSaveMenu}
                        disabled={isSaving || !parsedMenu}
                        activeOpacity={0.8}
                    >
                        {isSaving ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <>
                                <Save size={18} color={'#FFFFFF' } style={{ marginRight: 8 }} />
                                <Text style={{ color:'#FFFFFF', fontWeight: '700', fontSize: 16 }}>
                                    Save to Database
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </PermissionGate>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    contentContainer: { flexGrow: 1 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    headerIcon: { marginRight: 10 },
    headerTitle: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
    cardOverride: { marginBottom: 24, padding: 16 },
    label: { fontWeight: '600', fontSize: 16, marginBottom: 4 },
    subText: { fontSize: 13, marginBottom: 12, lineHeight: 18 },
    input: {
        fontSize: 15,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 12,
        marginBottom: 16,
    },
    successBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D1FAE5',
        padding: 12,
        borderRadius: 8,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 14,
    }
});