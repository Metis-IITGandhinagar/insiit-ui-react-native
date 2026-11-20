import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Bell, CalendarDays, Car, History, MapPin, Plus, ShieldCheck, UserX, X } from 'lucide-react-native';

import { useTheme } from '@/core/theme';
import { useAuth } from '@/core/auth/useAuth';
import { useAuthGate } from '@/core/auth/useAuthGate';
import SheetModal from '@/shared/components/SheetModal';
import CalendarPicker, { parseDateString, toDateString } from '@/shared/components/CalendarPicker';
import JoinSheet from '../components/JoinSheet';
import { RideCard } from '../components/RideParts';
import { Banner, Button, Card, Chip, Empty, SectionTitle, Segmented } from '../components/ui';
import { useCatalogue, usePolled } from '../hooks/useCabshare';
import { cabshareError, cabshareService } from '../services/cabshareService';
import type {
    Direction,
    NotificationPage,
    NotifyPrefs,
    Profile,
    Ride,
    RequestCard,
    TripCard,
} from '../services/cabshareTypes';
import { dayLabel, onDay, pickableStops, rupees, timeLabel, untilLabel, vehicleLabel, whenLabel } from '../utils/format';

type Tab = 'find' | 'trips' | 'settings';
type Day = 'all' | 'today' | 'tomorrow' | string; // or YYYY-MM-DD

const PREF_LABELS: Record<keyof NotifyPrefs, [string, string]> = {
    group: ['Your rides', 'Grouped, someone joined or left, ride changed'],
    messages: ['Group chat', 'New messages from your co-riders'],
    checkins: ['Check-ins', 'A co-rider reached the pickup'],
    reminders: ['Reminders', 'An hour to go, names are in, check in, did you ride'],
    score: ['Credibility', 'When a ride settles and your score changes'],
};

export default function CabshareScreen() {
    const theme = useTheme();
    const { colors } = theme;
    const navigation = useNavigation<any>();
    const { user } = useAuth();
    const { ensureSignedIn } = useAuthGate();
    const signedIn = !!user && user.email.toLowerCase().endsWith('@iitgn.ac.in');
    const [tab, setTab] = useState<Tab>('find');
    const [notesOpen, setNotesOpen] = useState(false);

    const notes = usePolled<NotificationPage>(() => cabshareService.notifications(), 30000, signedIn);
    const unread = notes.data?.unread ?? 0;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                signedIn ? (
                    <Pressable
                        onPress={() => setNotesOpen(true)}
                        hitSlop={10}
                        accessibilityLabel={unread ? `Notifications, ${unread} unread` : 'Notifications'}
                        style={{ padding: 4 }}
                    >
                        <Bell size={22} color={colors.text} />
                        {unread ? (
                            <View style={[styles.badge, { backgroundColor: colors.danger }]}>
                                <Text style={styles.badgeText}>{unread > 9 ? '9+' : unread}</Text>
                            </View>
                        ) : null}
                    </Pressable>
                ) : null,
        });
    }, [navigation, signedIn, unread, colors]);

    if (!signedIn) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['left', 'right']}>
                <Empty
                    icon={<Car size={36} color={colors.primary} />}
                    title="Share cabs and autos from campus"
                    body="Post when you're leaving, or join someone going your way, and split the fare. Sign in with your IITGN account to start."
                    action={<Button title="Sign in" onPress={() => ensureSignedIn('share a cab')} style={{ marginTop: 12, alignSelf: 'stretch' }} />}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['left', 'right']}>
            <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
            <View style={styles.tabs}>
                <Segmented
                    value={tab}
                    onChange={setTab}
                    options={[
                        { value: 'find', label: 'Find a ride' },
                        { value: 'trips', label: 'My trips' },
                        { value: 'settings', label: 'Settings' },
                    ]}
                />
            </View>
            {tab === 'find' ? <FindTab /> : tab === 'trips' ? <TripsTab /> : <SettingsTab />}
            <NotificationsSheet
                visible={notesOpen}
                page={notes.data}
                onClose={() => setNotesOpen(false)}
                onRead={(n) => notes.setData((p) => (p ? { ...p, unread: n, notifications: p.notifications.map((x) => ({ ...x, read: true })) } : p))}
                onOpen={(request) => {
                    setNotesOpen(false);
                    navigation.navigate('CabTrip', { request });
                }}
            />
        </SafeAreaView>
    );
}

// --- Find a ride ----------------------------------------------------------------------

function FindTab() {
    const { colors, radius } = useTheme();
    const navigation = useNavigation<any>();
    const catalogue = useCatalogue();
    const [direction, setDirection] = useState<Direction>('from_campus');
    const [to, setTo] = useState<string | null>(null);
    const [day, setDay] = useState<Day>('all');
    const [calendar, setCalendar] = useState(false);
    const [stopsOpen, setStopsOpen] = useState(false);
    const [ride, setRide] = useState<Ride | null>(null);
    const [extra, setExtra] = useState<Ride[]>([]);
    const [next, setNext] = useState<string | null>(null);
    const [more, setMore] = useState(false);

    const feed = usePolled(
        () => cabshareService.feed({ direction, to: to ?? undefined }),
        20000
    );
    // a new filter starts from the first page
    useEffect(() => {
        void feed.refresh();
        setExtra([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [direction, to]);
    // a refresh replaces the first page; pages already loaded stay
    useEffect(() => {
        if (!extra.length) setNext(feed.data?.next ?? null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [feed.data]);

    const stops = useMemo(
        () => (catalogue.data ? pickableStops(catalogue.data.places, catalogue.data.campus) : []),
        [catalogue.data]
    );
    const stopName = (id: string | null) => stops.find((s) => s.id === id)?.name ?? 'Anywhere';

    const rideKey = (r: Ride) => `${r.direction}-${r.vehicle}-${r.departure}-${r.final}-${r.destination}`;
    const all = [...(feed.data?.rides ?? []), ...extra].filter(
        (r, i, list) => list.findIndex((x) => rideKey(x) === rideKey(r)) === i
    );
    const shown = all.filter((r) => {
        if (day === 'all') return true;
        const date =
            day === 'today' ? new Date() : day === 'tomorrow' ? new Date(Date.now() + 86400000) : parseDateString(day);
        return !!date && r.times.some((t) => onDay(t, date));
    });

    const loadMore = async () => {
        if (!next || more) return;
        setMore(true);
        try {
            const page = await cabshareService.feed({ direction, to: to ?? undefined, after: next });
            setExtra((e) => [...e, ...page.rides]);
            setNext(page.next);
        } catch (e) {
            Alert.alert('Could not load more rides', cabshareError(e));
        } finally {
            setMore(false);
        }
    };

    const header = (
        <View style={{ gap: 12, paddingBottom: 8 }}>
            <Segmented
                value={direction}
                onChange={setDirection}
                options={[
                    { value: 'from_campus', label: 'Leaving campus' },
                    { value: 'to_campus', label: 'Coming back' },
                ]}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                <Chip
                    label={direction === 'from_campus' ? `To: ${stopName(to)}` : `From: ${stopName(to)}`}
                    selected={!!to}
                    onPress={() => setStopsOpen(true)}
                    icon={<MapPin size={14} color={to ? colors.onPrimary : colors.text} />}
                />
                <Chip label="All days" selected={day === 'all'} onPress={() => setDay('all')} />
                <Chip label="Today" selected={day === 'today'} onPress={() => setDay('today')} />
                <Chip label="Tomorrow" selected={day === 'tomorrow'} onPress={() => setDay('tomorrow')} />
                <Chip
                    label={day.includes('-') ? dayLabel(parseDateString(day)!.toISOString()) : 'Pick a day'}
                    selected={day.includes('-')}
                    onPress={() => setCalendar(true)}
                    icon={<CalendarDays size={14} color={day.includes('-') ? colors.onPrimary : colors.text} />}
                />
            </ScrollView>
            {feed.error && !feed.data ? <Banner tone="warn" text={feed.error} /> : null}
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={shown}
                keyExtractor={rideKey}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120, gap: 10 }}
                ListHeaderComponent={header}
                refreshControl={<RefreshControl refreshing={feed.refreshing} onRefresh={feed.refresh} tintColor={colors.primary} />}
                renderItem={({ item }) => <RideCard ride={item} onPress={() => setRide(item)} />}
                ListEmptyComponent={
                    feed.loading ? (
                        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
                    ) : (
                        <Empty
                            icon={<Car size={32} color={colors.textSecondary} />}
                            title="No rides to join yet"
                            body={
                                to
                                    ? `Nobody is going ${direction === 'from_campus' ? 'to' : 'from'} ${stopName(to)} at a time you can join. Post your times and we'll match you as people join.`
                                    : 'Post when you are going; anyone heading the same way can join you.'
                            }
                        />
                    )
                }
                ListFooterComponent={
                    next ? (
                        <Button title={more ? 'Loading…' : 'Show more rides'} kind="secondary" onPress={loadMore} busy={more} />
                    ) : all.length ? (
                        <Text style={[styles.foot, { color: colors.textSecondary }]}>That's every ride you can join.</Text>
                    ) : null
                }
            />
            <Pressable
                onPress={() => navigation.navigate('CabPost', { direction, destination: to ?? undefined })}
                accessibilityRole="button"
                style={[styles.fab, { backgroundColor: colors.primary, borderRadius: radius.round }]}
            >
                <Plus size={20} color={colors.onPrimary} />
                <Text style={[styles.fabText, { color: colors.onPrimary }]}>Post a ride</Text>
            </Pressable>

            <SheetModal visible={calendar} onClose={() => setCalendar(false)}>
                <View style={{ padding: 20 }}>
                    <CalendarPicker
                        value={day.includes('-') ? day : ''}
                        minDate={new Date()}
                        onChange={(v) => {
                            setDay(v);
                            setCalendar(false);
                        }}
                    />
                </View>
            </SheetModal>

            <SheetModal visible={stopsOpen} onClose={() => setStopsOpen(false)}>
                <ScrollView style={{ maxHeight: 520 }} contentContainerStyle={{ padding: 20, gap: 4 }}>
                    <Text style={[styles.sheetTitle, { color: colors.text }]}>
                        {direction === 'from_campus' ? 'Where are you going?' : 'Where are you coming from?'}
                    </Text>
                    {[{ id: null as string | null, name: 'Anywhere', km: 0 }, ...stops].map((s) => (
                        <Pressable
                            key={s.id ?? 'any'}
                            onPress={() => {
                                setTo(s.id);
                                setStopsOpen(false);
                            }}
                            style={[styles.stopRow, { borderColor: colors.border }]}
                        >
                            <Text style={{ color: colors.text, fontSize: 15, fontWeight: s.id === to ? '800' : '500', flex: 1 }}>
                                {s.name}
                            </Text>
                            {s.id ? <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{s.km} km</Text> : null}
                        </Pressable>
                    ))}
                </ScrollView>
            </SheetModal>

            <JoinSheet
                ride={ride}
                vehicle={catalogue.data?.vehicles.find((v) => v.id === ride?.vehicle)}
                onClose={() => setRide(null)}
                onJoined={(card) => {
                    setRide(null);
                    void feed.refresh();
                    navigation.navigate('CabTrip', { request: card.request });
                }}
            />
        </View>
    );
}

// --- My trips --------------------------------------------------------------------------

function TripsTab() {
    const { colors } = useTheme();
    const navigation = useNavigation<any>();
    const mine = usePolled(() => cabshareService.myTrips(), 15000);
    const [older, setOlder] = useState<(TripCard | RequestCard)[]>([]);
    const [olderNext, setOlderNext] = useState<string | null | undefined>(undefined);

    useEffect(() => {
        setOlder([]);
        setOlderNext(undefined);
    }, [mine.data?.past_next]);

    const pastNext = olderNext === undefined ? mine.data?.past_next ?? null : olderNext;

    const loadOlder = async () => {
        try {
            const page = await cabshareService.myTrips(pastNext);
            setOlder((o) => [...o, ...page.past]);
            setOlderNext(page.past_next);
        } catch (e) {
            Alert.alert('Could not load older trips', cabshareError(e));
        }
    };

    const clear = () =>
        Alert.alert('Clear finished trips?', 'Settled rides and requests nobody joined leave this list. Your score and its history stay.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Clear',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await cabshareService.clearHistory();
                        await mine.refresh();
                    } catch (e) {
                        Alert.alert('Could not clear', cabshareError(e));
                    }
                },
            },
        ]);

    const open = (request: number) => navigation.navigate('CabTrip', { request });
    const d = mine.data;
    const past = [...(d?.past ?? []), ...older];

    return (
        <ScrollView
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 60 }}
            refreshControl={<RefreshControl refreshing={mine.refreshing} onRefresh={mine.refresh} tintColor={colors.primary} />}
        >
            {mine.loading ? <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} /> : null}
            {mine.error && !d ? <Banner tone="warn" text={mine.error} /> : null}
            {d && !d.trips.length && !d.requests.length ? (
                <Empty
                    icon={<Car size={32} color={colors.textSecondary} />}
                    title="No upcoming trips"
                    body="Rides you post or join show here, with your group chat and fare split."
                />
            ) : null}
            {d?.trips.length ? <SectionTitle>Upcoming rides</SectionTitle> : null}
            {d?.trips.map((t) => <TripRow key={t.request} card={t} onPress={() => open(t.request)} />)}
            {d?.requests.length ? <SectionTitle>Waiting for company</SectionTitle> : null}
            {d?.requests.map((r) => <TripRow key={r.request} card={r} onPress={() => open(r.request)} />)}
            {past.length ? (
                <SectionTitle
                    right={
                        <Pressable onPress={clear} hitSlop={8}>
                            <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>Clear</Text>
                        </Pressable>
                    }
                >
                    Past
                </SectionTitle>
            ) : null}
            {past.map((p) => <TripRow key={p.request} card={p} onPress={() => open(p.request)} past />)}
            {pastNext ? (
                <Button title="Show older trips" kind="ghost" icon={<History size={16} color={colors.primary} />} onPress={loadOlder} />
            ) : null}
        </ScrollView>
    );
}

function TripRow({ card, onPress, past }: { card: TripCard | RequestCard; onPress: () => void; past?: boolean }) {
    const { colors, radius } = useTheme();
    const when = card.kind === 'trip' ? card.departure : card.slots[0];
    const status =
        card.kind === 'trip'
            ? past
                ? card.settled
                    ? 'Settled'
                    : 'Rode? Confirm or report'
                : `${card.people} going · ${untilLabel(card.departure)}`
            : past
              ? 'Nobody joined'
              : card.slots.length > 1
                ? `Waiting · ${card.slots.length} times offered`
                : `Waiting · ${untilLabel(card.slots[0])}`;
    const share = card.kind === 'trip' ? card.fare.your_share : card.fare.total;
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.tripRow,
                { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, opacity: past ? 0.75 : pressed ? 0.9 : 1 },
            ]}
        >
            <View style={[styles.tripIcon, { backgroundColor: (card.kind === 'trip' ? colors.success : colors.warning) + '18' }]}>
                <Car size={18} color={card.kind === 'trip' ? colors.success : colors.warning} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ color: colors.text, fontSize: 15, fontWeight: '700' }} numberOfLines={1}>
                    {card.direction === 'from_campus' ? `To ${card.destination_name}` : `From ${card.destination_name}`}
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                    {when ? whenLabel(when) : ''} · {vehicleLabel(card.vehicle)}
                </Text>
                <Text style={{ color: card.notice ? colors.warning : colors.textSecondary, fontSize: 12 }}>
                    {card.notice ? 'Something changed. Tap to see.' : status}
                </Text>
            </View>
            <Text style={{ color: colors.text, fontWeight: '800' }}>{rupees(share)}</Text>
        </Pressable>
    );
}

// --- Settings --------------------------------------------------------------------------

function SettingsTab() {
    const { colors, radius } = useTheme();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [prefs, setPrefs] = useState<NotifyPrefs | null>(null);
    const [blocked, setBlocked] = useState<string[] | null>(null);
    const [email, setEmail] = useState('');
    const [busy, setBusy] = useState(false);

    const load = useCallback(async () => {
        try {
            const [p, n, b] = await Promise.all([cabshareService.profile(), cabshareService.notifyPrefs(), cabshareService.blocks()]);
            setProfile(p);
            setPrefs(n);
            setBlocked(b);
        } catch (e) {
            Alert.alert('Could not load settings', cabshareError(e));
        }
    }, []);
    useEffect(() => {
        void load();
    }, [load]);

    const setGender = async (g: Profile['gender']) => {
        try {
            setProfile(await cabshareService.setGender(g));
        } catch (e) {
            Alert.alert('Could not save', cabshareError(e));
        }
    };
    const toggle = async (k: keyof NotifyPrefs, v: boolean) => {
        setPrefs((p) => (p ? { ...p, [k]: v } : p));
        try {
            setPrefs(await cabshareService.setNotifyPrefs({ [k]: v }));
        } catch (e) {
            setPrefs((p) => (p ? { ...p, [k]: !v } : p));
            Alert.alert('Could not save', cabshareError(e));
        }
    };
    const block = async () => {
        if (!email.trim()) return;
        setBusy(true);
        try {
            setBlocked(await cabshareService.block(email.trim()));
            setEmail('');
        } catch (e) {
            Alert.alert('Could not block', cabshareError(e));
        } finally {
            setBusy(false);
        }
    };
    const unblock = (who: string) =>
        Alert.alert(`Unblock ${who}?`, 'You could be grouped with them again.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Unblock',
                onPress: async () => {
                    try {
                        setBlocked(await cabshareService.unblock(who));
                    } catch (e) {
                        Alert.alert('Could not unblock', cabshareError(e));
                    }
                },
            },
        ]);

    if (!profile || !prefs || !blocked) return <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />;

    return (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60, gap: 12 }} keyboardShouldPersistTaps="handled">
            <Card>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <ShieldCheck size={28} color={colors.primary} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>Credibility {profile.score}</Text>
                        <Text style={{ color: colors.textSecondary, fontSize: 12, lineHeight: 17 }}>
                            Everyone starts at {profile.start}. Riding earns +5; a no-show reported by your co-riders costs 20; cancelling within 2 hours costs 10. Old mistakes fade.
                        </Text>
                    </View>
                </View>
                {profile.history.slice(0, 5).map((h, i) => (
                    <View key={i} style={[styles.histRow, { borderColor: colors.border }]}>
                        <Text style={{ color: colors.textSecondary, fontSize: 12, flex: 1 }}>
                            {h.reason.replace(/_/g, ' ')} · {dayLabel(h.at)}
                        </Text>
                        <Text style={{ color: h.change > 0 ? colors.success : h.change < 0 ? colors.danger : colors.textSecondary, fontWeight: '700', fontSize: 12 }}>
                            {h.change > 0 ? '+' : ''}
                            {h.change}
                        </Text>
                    </View>
                ))}
            </Card>

            <SectionTitle>Shown to co-riders with your name</SectionTitle>
            <Card>
                <Text style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 10 }}>
                    Optional. Co-riders see it with your name from 15 minutes before the ride.
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {(
                        [
                            [null, 'Not shown'],
                            ['woman', 'Woman'],
                            ['man', 'Man'],
                            ['non_binary', 'Non-binary'],
                        ] as const
                    ).map(([v, label]) => (
                        <Chip key={label} label={label} selected={profile.gender === v} onPress={() => setGender(v)} />
                    ))}
                </View>
            </Card>

            <SectionTitle>Notifications</SectionTitle>
            <Card style={{ paddingVertical: 4 }}>
                {(Object.keys(PREF_LABELS) as (keyof NotifyPrefs)[]).map((k) => (
                    <View key={k} style={styles.prefRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: colors.text, fontSize: 15, fontWeight: '600' }}>{PREF_LABELS[k][0]}</Text>
                            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{PREF_LABELS[k][1]}</Text>
                        </View>
                        <Switch value={prefs[k]} onValueChange={(v) => toggle(k, v)} trackColor={{ true: colors.primary }} />
                    </View>
                ))}
            </Card>

            <SectionTitle>Never ride with</SectionTitle>
            <Card>
                <Text style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 10, lineHeight: 17 }}>
                    You'll never be grouped with these students, and they're never told. If you share a ride now, you move out of it for free.
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholder="name@iitgn.ac.in"
                        placeholderTextColor={colors.textSecondary}
                        style={[styles.input, { color: colors.text, borderColor: colors.border, borderRadius: radius.md }]}
                        onSubmitEditing={block}
                    />
                    <Button title="Block" onPress={block} busy={busy} style={{ paddingHorizontal: 18 }} />
                </View>
                {blocked.map((b) => (
                    <View key={b} style={[styles.histRow, { borderColor: colors.border }]}>
                        <UserX size={16} color={colors.textSecondary} />
                        <Text style={{ color: colors.text, flex: 1 }}>{b}</Text>
                        <Pressable onPress={() => unblock(b)} hitSlop={8} accessibilityLabel={`Unblock ${b}`}>
                            <X size={18} color={colors.textSecondary} />
                        </Pressable>
                    </View>
                ))}
            </Card>
        </ScrollView>
    );
}

// --- Notifications -----------------------------------------------------------------------

function NotificationsSheet({
    visible,
    page,
    onClose,
    onRead,
    onOpen,
}: {
    visible: boolean;
    page: NotificationPage | null;
    onClose: () => void;
    onRead: (unread: number) => void;
    onOpen: (request: number) => void;
}) {
    const { colors } = useTheme();
    useEffect(() => {
        if (visible && page?.unread) {
            cabshareService.readNotifications().then(onRead).catch(() => {});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);
    return (
        <SheetModal visible={visible} onClose={onClose}>
            <ScrollView style={{ maxHeight: 560 }} contentContainerStyle={{ padding: 20, gap: 4 }}>
                <Text style={[styles.sheetTitle, { color: colors.text }]}>Cabshare updates</Text>
                {!page?.notifications.length ? (
                    <Text style={{ color: colors.textSecondary, paddingVertical: 20 }}>Nothing yet. Updates about your rides show here.</Text>
                ) : null}
                {page?.notifications.map((n) => (
                    <Pressable
                        key={n.id}
                        disabled={!n.request}
                        onPress={() => n.request && onOpen(n.request)}
                        style={[styles.noteRow, { borderColor: colors.border }]}
                    >
                        {!n.read ? <View style={[styles.dot, { backgroundColor: colors.primary }]} /> : <View style={styles.dot} />}
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: colors.text, fontWeight: '700' }}>{n.title}</Text>
                            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{n.body}</Text>
                            <Text style={{ color: colors.textSecondary, fontSize: 11, marginTop: 2 }}>
                                {dayLabel(n.at)} {timeLabel(n.at)}
                            </Text>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
        </SheetModal>
    );
}

const styles = StyleSheet.create({
    tabs: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12 },
    badge: { position: 'absolute', top: -2, right: -4, minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
    fab: { position: 'absolute', right: 16, bottom: 28, flexDirection: 'row', gap: 8, alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
    fabText: { fontSize: 15, fontWeight: '800' },
    foot: { textAlign: 'center', fontSize: 12, paddingVertical: 16 },
    sheetTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
    stopRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
    tripRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderWidth: 1, marginBottom: 10 },
    tripIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
    histRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 10, marginTop: 10, borderTopWidth: StyleSheet.hairlineWidth },
    prefRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
    input: { flex: 1, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15 },
    noteRow: { flexDirection: 'row', gap: 10, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
    dot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
});
