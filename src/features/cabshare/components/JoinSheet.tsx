import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useTheme } from '@/core/theme';
import { apiClient } from '@/core/api/apiClient';
import SheetModal from '@/shared/components/SheetModal';
import { cabshareError, cabshareService } from '../services/cabshareService';
import type { Card, Ride, Stop, TripFare, VehicleInfo } from '../services/cabshareTypes';
import { dayLabel, rupees, timeLabel, vehicleLabel } from '../utils/format';
import { FareBreakdown, StopsLine } from './RideParts';
import { Button, Chip, SectionTitle, Stepper } from './ui';

interface OpenTime {
    departure: string;
    seats_left: number;
    suitcases_left: number;
    handbags_left: number;
    stops: Stop[];
    fare: TripFare;
}

/**
 * Joining a ride from the feed: pick the time (a lone rider may offer several), where
 * you get off, and what you carry. The share shown is the backend's own answer for
 * exactly that, refreshed as the choices change.
 */
export default function JoinSheet({
    ride,
    vehicle,
    onClose,
    onJoined,
}: {
    ride: Ride | null;
    vehicle?: VehicleInfo;
    onClose: () => void;
    onJoined: (card: Card) => void;
}) {
    const { colors, radius } = useTheme();
    const [time, setTime] = useState<string>('');
    const [stop, setStop] = useState<string>('');
    const [party, setParty] = useState(1);
    const [handbags, setHandbags] = useState(0);
    const [suitcases, setSuitcases] = useState(0);
    const [quote, setQuote] = useState('');
    const [note, setNote] = useState('');
    const [open, setOpen] = useState<OpenTime[] | null>(null);
    const [checking, setChecking] = useState(false);
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        if (!ride) return;
        setTime(ride.times[0]);
        setStop(ride.destination);
        setParty(1);
        setHandbags(0);
        setSuitcases(0);
        setQuote('');
        setNote('');
    }, [ride]);

    // every stop on this ride's road: its riders' stops and the ones it passes
    const stopOptions = useMemo(() => {
        if (!ride) return [];
        const all = [...ride.stops.map((s) => ({ place: s.place, name: s.name })), ...ride.passes];
        const seen = new Set<string>();
        return all.filter((s) => (seen.has(s.place) ? false : (seen.add(s.place), true)));
    }, [ride]);

    useEffect(() => {
        if (!ride || !stop) return;
        let live = true;
        setChecking(true);
        apiClient
            .get('/cabshare/open-times', {
                params: { destination: stop, direction: ride.direction, handbags, suitcases, party, vehicle: ride.vehicle },
            })
            .then(({ data }) => live && setOpen(data))
            .catch(() => live && setOpen(null))
            .finally(() => live && setChecking(false));
        return () => {
            live = false;
        };
    }, [ride, stop, handbags, suitcases, party]);

    if (!ride) return <SheetModal visible={false} onClose={onClose}>{null}</SheetModal>;

    const chosen = open?.find((o) => o.departure === time) ?? null;
    const full = open !== null && !checking && !chosen;
    const cap = vehicle ?? { seats: 4, suitcases: 3, handbags: 4 };

    const join = async () => {
        const q = quote.trim() ? Number(quote.trim()) : null;
        if (q !== null && (!Number.isInteger(q) || q <= 0)) {
            Alert.alert('Ola/Uber price', 'Enter the price in whole rupees, or leave it empty.');
            return;
        }
        setJoining(true);
        try {
            const card = await cabshareService.join({
                destination: stop,
                direction: ride.direction,
                departure: time,
                handbags,
                suitcases,
                party,
                vehicle: ride.vehicle,
                quote: q,
                place_note: note.trim() || null,
            });
            onJoined(card);
        } catch (e) {
            Alert.alert('Could not join', cabshareError(e));
        } finally {
            setJoining(false);
        }
    };

    return (
        <SheetModal visible={!!ride} onClose={onClose} avoidKeyboard>
            <ScrollView style={{ maxHeight: 620 }} contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
                <Text style={[styles.title, { color: colors.text }]}>
                    {vehicleLabel(ride.vehicle)} {ride.direction === 'from_campus' ? 'to' : 'from'} {ride.final_name}
                </Text>
                <Text style={[styles.sub, { color: colors.textSecondary }]}>
                    {ride.going} going · {ride.seats_free} seats free. You see who once you're in, from 15 minutes before.
                </Text>

                <SectionTitle>{ride.times.length > 1 ? 'Pick a time' : 'Time'}</SectionTitle>
                <View style={styles.wrap}>
                    {ride.times.map((t) => (
                        <Chip key={t} label={`${dayLabel(t)} ${timeLabel(t)}`} selected={t === time} onPress={() => setTime(t)} />
                    ))}
                </View>

                <SectionTitle>{ride.direction === 'from_campus' ? 'Where you get off' : 'Where you get on'}</SectionTitle>
                <View style={styles.wrap}>
                    {stopOptions.map((s) => (
                        <Chip key={s.place} label={s.name} selected={s.place === stop} onPress={() => setStop(s.place)} />
                    ))}
                </View>

                <SectionTitle>Who and what</SectionTitle>
                <Stepper label="People" hint="You plus friends on this booking" value={party} min={1} max={cap.seats - 1} onChange={setParty} />
                <Stepper label="Suitcases" value={suitcases} max={cap.suitcases} onChange={setSuitcases} />
                <Stepper label="Handbags / backpacks" value={handbags} max={cap.handbags} onChange={setHandbags} />

                <SectionTitle>Optional</SectionTitle>
                <TextInput
                    value={quote}
                    onChangeText={setQuote}
                    keyboardType="number-pad"
                    placeholder="Ola/Uber price you see now, ₹"
                    placeholderTextColor={colors.textSecondary}
                    style={[styles.input, { color: colors.text, borderColor: colors.border, borderRadius: radius.md }]}
                />
                <TextInput
                    value={note}
                    onChangeText={setNote}
                    maxLength={60}
                    placeholder="Where exactly (e.g. Gate 2, Terminal 1)"
                    placeholderTextColor={colors.textSecondary}
                    style={[styles.input, { color: colors.text, borderColor: colors.border, borderRadius: radius.md }]}
                />

                <View style={[styles.fareBox, { borderColor: colors.border, borderRadius: radius.lg }]}>
                    {checking && !chosen ? (
                        <ActivityIndicator color={colors.primary} />
                    ) : chosen ? (
                        <>
                            <StopsLine stops={chosen.stops} direction={ride.direction} />
                            <View style={{ height: 12 }} />
                            <FareBreakdown fare={chosen.fare} />
                        </>
                    ) : full ? (
                        <Text style={{ color: colors.warning }}>
                            No room at {timeLabel(time)} for {party > 1 ? `${party} people` : 'you'}
                            {suitcases || handbags ? ' with this luggage' : ''}. Try fewer bags or another time.
                        </Text>
                    ) : (
                        <Text style={{ color: colors.textSecondary }}>About {rupees(ride.fare.your_share)} each.</Text>
                    )}
                </View>

                <Button title={`Join at ${timeLabel(time)}`} onPress={join} busy={joining} disabled={full} />
            </ScrollView>
        </SheetModal>
    );
}

const styles = StyleSheet.create({
    body: { padding: 20, paddingBottom: 32, gap: 6 },
    title: { fontSize: 20, fontWeight: '800' },
    sub: { fontSize: 13, lineHeight: 18, marginBottom: 6 },
    wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    input: { borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, marginBottom: 8 },
    fareBox: { borderWidth: 1, padding: 14, marginVertical: 10 },
});
