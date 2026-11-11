import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Briefcase, Car, ChevronRight, Users } from 'lucide-react-native';

import { useTheme } from '@/core/theme';
import type { Ride, Stop, TripFare } from '../services/cabshareTypes';
import { dayLabel, priceNote, rupees, timeLabel, vehicleLabel } from '../utils/format';

/** The ride's stops in the order it reaches them, campus at the campus end. */
export function StopsLine({ stops, direction, passes = [] }: { stops: Stop[]; direction: string; passes?: { name: string }[] }) {
    const { colors } = useTheme();
    const campus = { name: 'IITGN campus', you: false, people: 0, place: 'iitgn', campus: true };
    const list = direction === 'from_campus' ? [campus, ...stops] : [...stops, campus];
    return (
        <View>
            {list.map((s, i) => {
                const isCampus = 'campus' in s;
                return (
                    <View key={`${s.place}-${i}`} style={styles.stopRow}>
                        <View style={styles.rail}>
                            <View
                                style={[
                                    styles.dot,
                                    {
                                        backgroundColor: s.you ? colors.primary : isCampus ? colors.text : colors.surface,
                                        borderColor: s.you ? colors.primary : colors.textSecondary,
                                    },
                                ]}
                            />
                            {i < list.length - 1 ? <View style={[styles.line, { backgroundColor: colors.border }]} /> : null}
                        </View>
                        <View style={{ flex: 1, paddingBottom: i < list.length - 1 ? 14 : 0 }}>
                            <Text style={[styles.stopName, { color: colors.text, fontWeight: s.you ? '700' : '500' }]}>
                                {s.name}
                                {s.you ? '  · you' : ''}
                            </Text>
                            {!isCampus && s.people > 0 ? (
                                <Text style={[styles.stopMeta, { color: colors.textSecondary }]}>
                                    {s.people} {s.people === 1 ? 'person' : 'people'}{' '}
                                    {direction === 'from_campus' ? 'get off' : 'get on'}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                );
            })}
            {passes.length ? (
                <Text style={[styles.passes, { color: colors.textSecondary }]}>
                    Also passes {passes.map((p) => p.name).join(', ')}: you can get {direction === 'from_campus' ? 'off' : 'on'} there too.
                </Text>
            ) : null}
        </View>
    );
}

/** A feed entry: when, where, how full, what you'd pay. Never who. */
export function RideCard({ ride, onPress }: { ride: Ride; onPress: () => void }) {
    const { colors, radius } = useTheme();
    const where = ride.direction === 'from_campus' ? ride.final_name : ride.final_name;
    const via = ride.stops.filter((s) => s.place !== ride.final).map((s) => s.name);
    const more = ride.times.length > 1 ? ` +${ride.times.length - 1} more time${ride.times.length > 2 ? 's' : ''}` : '';
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`${vehicleLabel(ride.vehicle)} to ${where}, ${dayLabel(ride.departure)} ${timeLabel(ride.departure)}, about ${rupees(ride.fare.your_share)} each`}
            style={({ pressed }) => [
                styles.card,
                { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, opacity: pressed ? 0.9 : 1 },
            ]}
        >
            <View style={[styles.when, { backgroundColor: colors.primary + '12', borderRadius: radius.md }]}>
                <Text style={[styles.whenTime, { color: colors.primary }]}>{timeLabel(ride.departure)}</Text>
                <Text style={[styles.whenDay, { color: colors.primary }]}>{dayLabel(ride.departure)}</Text>
            </View>
            <View style={{ flex: 1, gap: 3 }}>
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                    {ride.direction === 'from_campus' ? `To ${where}` : `From ${where}`}
                </Text>
                {via.length || ride.passes.length ? (
                    <Text style={[styles.meta, { color: colors.textSecondary }]} numberOfLines={1}>
                        via {[...via, ...ride.passes.map((p) => p.name)].join(', ')}
                    </Text>
                ) : null}
                <View style={styles.badges}>
                    <View style={styles.badge}>
                        <Car size={13} color={colors.textSecondary} />
                        <Text style={[styles.meta, { color: colors.textSecondary }]}>{vehicleLabel(ride.vehicle)}</Text>
                    </View>
                    <View style={styles.badge}>
                        <Users size={13} color={colors.textSecondary} />
                        <Text style={[styles.meta, { color: colors.textSecondary }]}>
                            {ride.going} going · {ride.seats_free} free
                        </Text>
                    </View>
                    {ride.suitcases_free === 0 ? (
                        <View style={styles.badge}>
                            <Briefcase size={13} color={colors.warning} />
                            <Text style={[styles.meta, { color: colors.warning }]}>no suitcase room</Text>
                        </View>
                    ) : null}
                </View>
                {more ? <Text style={[styles.meta, { color: colors.primary }]}>{more}</Text> : null}
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.price, { color: colors.text }]}>{rupees(ride.fare.your_share)}</Text>
                <Text style={[styles.meta, { color: colors.success }]}>save {rupees(ride.fare.you_save)}</Text>
                <ChevronRight size={18} color={colors.textSecondary} style={{ marginTop: 4 }} />
            </View>
        </Pressable>
    );
}

/** How the fare splits, leg by leg, and where the price came from. */
export function FareBreakdown({ fare }: { fare: TripFare }) {
    const { colors } = useTheme();
    return (
        <View style={{ gap: 10 }}>
            <View style={styles.fareTop}>
                <View>
                    <Text style={[styles.meta, { color: colors.textSecondary }]}>Your share</Text>
                    <Text style={[styles.bigPrice, { color: colors.text }]}>{rupees(fare.your_share)}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.meta, { color: colors.textSecondary }]}>Alone it would be</Text>
                    <Text style={[styles.alone, { color: colors.textSecondary }]}>{rupees(fare.alone)}</Text>
                    <Text style={[styles.meta, { color: colors.success, fontWeight: '700' }]}>You save {rupees(fare.you_save)}</Text>
                </View>
            </View>
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
                Whole {fare.vehicle} {rupees(fare.total)} for {fare.km} km, {fare.riders}{' '}
                {fare.riders === 1 ? 'person' : 'people'}. {priceNote(fare.price_source, fare.quotes)}.
            </Text>
            {fare.legs.length > 1
                ? fare.legs.map((leg, i) => (
                      <View key={i} style={[styles.leg, { borderColor: colors.border }]}>
                          <Text style={[styles.legName, { color: leg.you ? colors.text : colors.textSecondary }]} numberOfLines={1}>
                              {leg.from_name} → {leg.to_name}
                          </Text>
                          <Text style={[styles.meta, { color: colors.textSecondary }]}>
                              {leg.km} km · {rupees(leg.cost)} ÷ {leg.people}
                          </Text>
                          <Text style={[styles.legPart, { color: leg.you ? colors.text : colors.textSecondary }]}>
                              {leg.you ? rupees(leg.your_part) : 'not you'}
                          </Text>
                      </View>
                  ))
                : null}
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
                An estimate to split fairly. Book and pay the driver as usual; INSIIT never takes money.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    stopRow: { flexDirection: 'row', gap: 12 },
    rail: { width: 14, alignItems: 'center' },
    dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, marginTop: 3 },
    line: { width: 2, flex: 1, marginTop: 2 },
    stopName: { fontSize: 15 },
    stopMeta: { fontSize: 12, marginTop: 2 },
    passes: { fontSize: 12, marginTop: 10, lineHeight: 17 },
    card: { flexDirection: 'row', gap: 12, alignItems: 'center', padding: 12, borderWidth: 1 },
    when: { width: 74, alignItems: 'center', paddingVertical: 10 },
    whenTime: { fontSize: 15, fontWeight: '800' },
    whenDay: { fontSize: 11, fontWeight: '600', marginTop: 2 },
    title: { fontSize: 16, fontWeight: '700' },
    meta: { fontSize: 12 },
    badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    badge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    price: { fontSize: 17, fontWeight: '800' },
    fareTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    bigPrice: { fontSize: 30, fontWeight: '800' },
    alone: { fontSize: 15, textDecorationLine: 'line-through' },
    leg: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, borderTopWidth: StyleSheet.hairlineWidth },
    legName: { flex: 1, fontSize: 13, fontWeight: '600' },
    legPart: { width: 64, textAlign: 'right', fontSize: 13, fontWeight: '700' },
});
