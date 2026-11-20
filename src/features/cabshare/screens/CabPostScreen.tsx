import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CalendarDays, Clock, X } from 'lucide-react-native';

import { useTheme } from '@/core/theme';
import SheetModal from '@/shared/components/SheetModal';
import CalendarPicker, { parseDateString, toDateString } from '@/shared/components/CalendarPicker';
import TimePicker, { parseTimeString } from '@/shared/components/TimePicker';
import { Button, Card, Chip, SectionTitle, Segmented, Stepper } from '../components/ui';
import { useCatalogue } from '../hooks/useCabshare';
import { cabshareError, cabshareService } from '../services/cabshareService';
import type { Direction, Vehicle } from '../services/cabshareTypes';
import { dayLabel, pickableStops, rupees, timeLabel, toInstant } from '../utils/format';

/**
 * Post a ride: where, every time you could leave, and what you carry. Offering more
 * times makes a match likelier; once grouped, the other times are released. If
 * someone is already going at one of them, posting seats you with them straight away.
 */
export default function CabPostScreen() {
    const { colors, radius } = useTheme();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const catalogue = useCatalogue();
    const [direction, setDirection] = useState<Direction>(route.params?.direction ?? 'from_campus');
    const [destination, setDestination] = useState<string | null>(route.params?.destination ?? null);
    const [day, setDay] = useState<string>(toDateString(new Date()));
    const [time, setTime] = useState('');
    const [slots, setSlots] = useState<string[]>([]);
    const [vehicle, setVehicle] = useState<Vehicle>('cab');
    const [party, setParty] = useState(1);
    const [suitcases, setSuitcases] = useState(0);
    const [handbags, setHandbags] = useState(0);
    const [quote, setQuote] = useState('');
    const [note, setNote] = useState('');
    const [calendar, setCalendar] = useState(false);
    const [posting, setPosting] = useState(false);

    const cat = catalogue.data;
    const stops = useMemo(() => (cat ? pickableStops(cat.places, cat.campus) : []), [cat]);
    const cap = cat?.vehicles.find((v) => v.id === vehicle);
    const maxSlots = cat?.limits.max_slots ?? 12;
    const place = stops.find((s) => s.id === destination);
    const estimate = place && cap ? Math.round(cap.base + cap.per_km * Math.max(0, place.km - cap.included_km)) : null;

    const today = toDateString(new Date());
    const tomorrow = toDateString(new Date(Date.now() + 86400000));

    const addTime = () => {
        const parts = parseTimeString(time);
        const date = parseDateString(day);
        if (!parts || !date) {
            Alert.alert('Pick a time', 'Choose the time you could leave first.');
            return;
        }
        const hour = (parts.hour % 12) + (parts.meridiem === 'PM' ? 12 : 0);
        const at = toInstant(date, hour, parts.minute);
        if (new Date(at).getTime() <= Date.now() + 15 * 60000) {
            Alert.alert('Too soon', 'Pick a time at least 15 minutes from now; groups are fixed 15 minutes before leaving.');
            return;
        }
        if (slots.includes(at)) return;
        if (slots.length >= maxSlots) {
            Alert.alert('That is plenty', `Offer at most ${maxSlots} times on one trip.`);
            return;
        }
        setSlots((s) => [...s, at].sort());
    };

    // cap luggage when switching to the smaller vehicle
    const pickVehicle = (v: Vehicle) => {
        setVehicle(v);
        const c = cat?.vehicles.find((x) => x.id === v);
        if (c) {
            setParty((p) => Math.min(p, c.seats - 1));
            setSuitcases((n) => Math.min(n, c.suitcases));
            setHandbags((n) => Math.min(n, c.handbags));
        }
    };

    const post = async () => {
        if (!destination) {
            Alert.alert('Where to?', 'Pick your stop.');
            return;
        }
        if (!slots.length) {
            Alert.alert('When?', 'Add at least one time you could leave.');
            return;
        }
        const q = quote.trim() ? Number(quote.trim()) : null;
        if (q !== null && (!Number.isInteger(q) || q <= 0)) {
            Alert.alert('Ola/Uber price', 'Enter the price in whole rupees, or leave it empty.');
            return;
        }
        setPosting(true);
        try {
            const card = await cabshareService.post({
                destination,
                direction,
                slots,
                handbags,
                suitcases,
                party,
                vehicle,
                quote: q,
                place_note: note.trim() || null,
            });
            navigation.replace('CabTrip', { request: card.request });
        } catch (e) {
            Alert.alert('Could not post', cabshareError(e));
        } finally {
            setPosting(false);
        }
    };

    if (!cat) {
        return <ActivityIndicator style={{ marginTop: 60 }} color={colors.primary} />;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['left', 'right', 'bottom']}>
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 6 }} keyboardShouldPersistTaps="handled">
                <Segmented
                    value={direction}
                    onChange={setDirection}
                    options={[
                        { value: 'from_campus', label: 'Leaving campus' },
                        { value: 'to_campus', label: 'Coming back' },
                    ]}
                />

                <SectionTitle>{direction === 'from_campus' ? 'Going to' : 'Coming from'}</SectionTitle>
                <View style={styles.wrap}>
                    {stops.map((s) => (
                        <Chip key={s.id} label={s.name} selected={s.id === destination} onPress={() => setDestination(s.id)} />
                    ))}
                </View>

                <SectionTitle>Every time you could leave</SectionTitle>
                <Card style={{ gap: 12 }}>
                    <View style={styles.wrap}>
                        <Chip label="Today" selected={day === today} onPress={() => setDay(today)} />
                        <Chip label="Tomorrow" selected={day === tomorrow} onPress={() => setDay(tomorrow)} />
                        <Chip
                            label={day !== today && day !== tomorrow ? dayLabel(parseDateString(day)!.toISOString()) : 'Another day'}
                            selected={day !== today && day !== tomorrow}
                            onPress={() => setCalendar(true)}
                            icon={<CalendarDays size={14} color={day !== today && day !== tomorrow ? colors.onPrimary : colors.text} />}
                        />
                    </View>
                    <TimePicker value={time} onChange={setTime} />
                    <Button title="Add this time" kind="secondary" icon={<Clock size={16} color={colors.primary} />} onPress={addTime} />
                    {slots.length ? (
                        <View style={styles.wrap}>
                            {slots.map((s) => (
                                <Chip
                                    key={s}
                                    label={`${dayLabel(s)} ${timeLabel(s)}`}
                                    selected
                                    onPress={() => setSlots((all) => all.filter((x) => x !== s))}
                                    icon={<X size={14} color={colors.onPrimary} />}
                                />
                            ))}
                        </View>
                    ) : (
                        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                            Add a few times: the more you offer, the likelier someone matches. Tap a time to remove it.
                        </Text>
                    )}
                </Card>

                <SectionTitle>Vehicle</SectionTitle>
                <Segmented
                    value={vehicle}
                    onChange={pickVehicle}
                    options={cat.vehicles.map((v) => ({ value: v.id, label: `${v.id === 'auto' ? 'Auto' : 'Cab'} · ${v.seats} seats` }))}
                />

                <SectionTitle>Who and what</SectionTitle>
                <Card style={{ paddingVertical: 6 }}>
                    <Stepper label="People" hint="You plus friends on this booking" value={party} min={1} max={(cap?.seats ?? 4) - 1} onChange={setParty} />
                    <Stepper label="Suitcases" value={suitcases} max={cap?.suitcases ?? 3} onChange={setSuitcases} />
                    <Stepper label="Handbags / backpacks" value={handbags} max={cap?.handbags ?? 4} onChange={setHandbags} />
                </Card>

                <SectionTitle>Optional</SectionTitle>
                <TextInput
                    value={quote}
                    onChangeText={setQuote}
                    keyboardType="number-pad"
                    placeholder={`Ola/Uber price you see now, ₹${estimate ? ` (we estimate ${rupees(estimate)})` : ''}`}
                    placeholderTextColor={colors.textSecondary}
                    style={[styles.input, { color: colors.text, borderColor: colors.border, borderRadius: radius.md }]}
                />
                <TextInput
                    value={note}
                    onChangeText={setNote}
                    maxLength={cat.limits.note_max}
                    placeholder="Where exactly (e.g. Terminal 1, Gate 2)"
                    placeholderTextColor={colors.textSecondary}
                    style={[styles.input, { color: colors.text, borderColor: colors.border, borderRadius: radius.md }]}
                />

                {estimate ? (
                    <Text style={{ color: colors.textSecondary, fontSize: 13, marginVertical: 8 }}>
                        A whole {vehicle} costs about {rupees(estimate)}; shared by {cap?.seats} it's about{' '}
                        {rupees(estimate / (cap?.seats ?? 4))} each.
                    </Text>
                ) : null}

                <Button
                    title={slots.length > 1 ? `Post with ${slots.length} times` : 'Post ride'}
                    onPress={post}
                    busy={posting}
                />
                <Text style={{ color: colors.textSecondary, fontSize: 12, textAlign: 'center', marginTop: 8 }}>
                    Free to cancel until 2 hours before. Co-riders see your name 15 minutes before leaving.
                </Text>
            </ScrollView>

            <SheetModal visible={calendar} onClose={() => setCalendar(false)}>
                <Pressable style={{ padding: 20 }}>
                    <CalendarPicker
                        value={day}
                        minDate={new Date()}
                        onChange={(v) => {
                            setDay(v);
                            setCalendar(false);
                        }}
                    />
                </Pressable>
            </SheetModal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    input: { borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, marginBottom: 8 },
});
