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

    const MEAL_KEYWORDS: { pattern: RegExp; key: keyof Omit<BackendMessMenuEntry, 'day'> }[] = [
        { pattern: /breakfast/i, key: 'breakfast' },
        { pattern: /lunch/i, key: 'lunch' },
        { pattern: /snacks?/i, key: 'snacks' },
        { pattern: /dinner/i, key: 'dinner' },
    ];

    const DAY_NAME_TO_INT: Record<string, number> = {
        monday: 1, tuesday: 2, wednesday: 3, thursday: 4,
        friday: 5, saturday: 6, sunday: 7,
    };

    const isBlankOrDash = (v?: string) => {
        if (!v) return true;
        const t = v.trim().toLowerCase();
        return t === '' || t === '-' || t === 'nan';
    };

    const parseMessMenuRows = (rows: string[][]): BackendMessMenuEntry[] => {
        type MealKey = 'breakfast' | 'lunch' | 'snacks' | 'dinner';
        const dayItems: Record<number, Record<MealKey, string[]>> = {};
        for (let d = 1; d <= 7; d++) {
            dayItems[d] = { breakfast: [], lunch: [], snacks: [], dinner: [] };
        }

        let currentMeal: MealKey | null = null;
        let dayColumnMap: Record<number, number> | null = null;

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const label = (row[0] || '').trim();
            if (!label) continue;

            const nextRow = rows[i + 1];
            const nextIsDayHeader = nextRow && (nextRow[0] || '').trim().toLowerCase() === 'day';

            if (nextIsDayHeader) {
                const matched = MEAL_KEYWORDS.find(m => m.pattern.test(label));
                if (matched) {
                    currentMeal = matched.key;
                    dayColumnMap = {};
                    nextRow.forEach((cell, colIdx) => {
                        const dayInt = DAY_NAME_TO_INT[(cell || '').trim().toLowerCase()];
                        if (dayInt) dayColumnMap![colIdx] = dayInt;
                    });
                    i++;
                    continue;
                }
            }

            if (currentMeal && dayColumnMap) {
                const hasAnyValue = Object.keys(dayColumnMap).some(
                    colIdx => !isBlankOrDash(row[Number(colIdx)])
                );
                if (!hasAnyValue) continue;

                for (const [colIdxStr, dayInt] of Object.entries(dayColumnMap)) {
                    const value = (row[Number(colIdxStr)] || '').trim();
                    if (isBlankOrDash(value)) continue;
                    dayItems[dayInt][currentMeal].push(`${label}: ${value}`);
                }
            }
        }

        return Array.from({ length: 7 }, (_, idx) => {
            const day = idx + 1;
            return { day, ...dayItems[day] };
        });
    };

    const extractSheetInfo = (rawUrl: string): { id: string; gid: string } | null => {
        const url = rawUrl.trim();
        const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (!idMatch) return null;

        const gidMatch = url.match(/[?#&]gid=(\d+)/);
        const gid = gidMatch ? gidMatch[1] : '0';

        return { id: idMatch[1], gid };
    };

    const handleFetchAndParse = async () => {
        if (!sheetUrl) return Alert.alert('Error', 'Please enter a Google Sheets URL');

        const sheetInfo = extractSheetInfo(sheetUrl);
        if (!sheetInfo) return Alert.alert('Error', 'Invalid Google Sheets URL. Make sure it contains /d/DOCUMENT_ID');

        setIsProcessing(true);
        setParsedMenu(null);

        try {
            const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetInfo.id}/export?format=csv&gid=${sheetInfo.gid}`;
            const response = await fetch(csvUrl);

            if (!response.ok) throw new Error('Failed to fetch the spreadsheet. Ensure link sharing is turned on.');
            const csvText = await response.text();
            const rows = parseCSVText(csvText);

            const formattedData = parseMessMenuRows(rows);

            const totalItems = formattedData.reduce(
                (sum, d) => sum + d.breakfast.length + d.lunch.length + d.snacks.length + d.dinner.length,
                0
            );
            if (totalItems === 0) {
                throw new Error("Couldn't find any meal sections. Check that section rows (e.g. 'Breakfast - ...') are followed directly by a 'Day' row.");
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