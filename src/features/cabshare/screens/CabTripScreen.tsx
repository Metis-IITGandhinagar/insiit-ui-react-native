import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Briefcase, CheckCircle2, MapPin, Send, UserRound } from 'lucide-react-native';

import { useTheme } from '@/core/theme';
import { FareBreakdown, StopsLine } from '../components/RideParts';
import { Banner, Button, Card, SectionTitle, Segmented } from '../components/ui';
import { usePolled } from '../hooks/useCabshare';
import { cabshareError, cabshareService } from '../services/cabshareService';
import type { Card as CardT, ChatPage, Message, RequestCard, TripCard } from '../services/cabshareTypes';
import { genderLabel, noticeText, rupees, timeLabel, untilLabel, vehicleLabel, whenLabel } from '../utils/format';
import { currentPosition } from '../utils/location';

type Pane = 'ride' | 'chat' | 'fare';

export default function CabTripScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<any>();
    const { request } = useRoute<any>().params as { request: number };
    const card = usePolled<CardT>(() => cabshareService.card(request), 15000);
    const [pane, setPane] = useState<Pane>('ride');
    const c = card.data;

    useLayoutEffect(() => {
        if (!c || c.kind === 'cancelled') return;
        navigation.setOptions({
            title: c.direction === 'from_campus' ? `To ${c.destination_name}` : `From ${c.destination_name}`,
        });
    }, [navigation, c]);

    if (!c) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.background }}>
                {card.error ? <Banner tone="warn" text={card.error} /> : <ActivityIndicator style={{ marginTop: 60 }} color={colors.primary} />}
            </View>
        );
    }
    if (c.kind === 'cancelled') {
        return (
            <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
                <Banner text={`You cancelled this ride to ${c.destination_name}.`} />
            </View>
        );
    }

    const replace = (next: CardT) => card.setData(next);

    if (c.kind === 'request') {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['left', 'right']}>
                <WaitingView card={c} onChange={replace} refreshing={card.refreshing} onRefresh={card.refresh} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['left', 'right', 'bottom']}>
            <Summary card={c} />
            <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
                <Segmented
                    value={pane}
                    onChange={setPane}
                    options={[
                        { value: 'ride', label: 'Ride' },
                        { value: 'chat', label: 'Chat' },
                        { value: 'fare', label: 'Fare' },
                    ]}
                />
            </View>
            {pane === 'ride' ? (
                <RidePane card={c} onChange={replace} refreshing={card.refreshing} onRefresh={card.refresh} onCancelled={() => navigation.goBack()} />
            ) : pane === 'chat' ? (
                <ChatPane request={c.request} />
            ) : (
                <FarePane card={c} onChange={replace} />
            )}
        </SafeAreaView>
    );
}

function Summary({ card }: { card: TripCard }) {
    const { colors, radius } = useTheme();
    return (
        <View style={[styles.summary, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '25', borderRadius: radius.lg }]}>
            <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontSize: 22, fontWeight: '800' }}>{timeLabel(card.departure)}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                    {whenLabel(card.departure)} · {card.departed ? 'left' : untilLabel(card.departure)}
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                    {vehicleLabel(card.vehicle)} · {card.people} going · {card.seats_left} seats free
                </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Your share</Text>
                <Text style={{ color: colors.text, fontSize: 22, fontWeight: '800' }}>{rupees(card.fare.your_share)}</Text>
                <Text style={{ color: colors.success, fontSize: 12, fontWeight: '700' }}>save {rupees(card.fare.you_save)}</Text>
            </View>
        </View>
    );
}

function RidePane({
    card,
    onChange,
    refreshing,
    onRefresh,
    onCancelled,
}: {
    card: TripCard;
    onChange: (c: CardT) => void;
    refreshing: boolean;
    onRefresh: () => void;
    onCancelled: () => void;
}) {
    const { colors } = useTheme();
    const [busy, setBusy] = useState<string | null>(null);

    const act = async (key: string, fn: () => Promise<CardT | void>, failTitle: string) => {
        setBusy(key);
        try {
            const next = await fn();
            if (next) onChange(next);
        } catch (e: any) {
            Alert.alert(failTitle, e?.isAxiosError ? cabshareError(e) : e?.message || cabshareError(e));
        } finally {
            setBusy(null);
        }
    };

    const checkIn = () =>
        act(
            'checkin',
            async () => {
                const { lat, lng } = await currentPosition();
                return cabshareService.checkIn(card.request, lat, lng);
            },
            'Could not check in'
        );

    const report = (handle: string, label: string) =>
        Alert.alert(
            `${label} didn't turn up?`,
            "Their score only drops if they didn't check in and enough of the ride reports them. Report only if they really didn't come.",
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Report', style: 'destructive', onPress: () => act(handle, () => cabshareService.report(card.request, handle), 'Could not report') },
            ]
        );

    const cancel = () =>
        Alert.alert(
            'Cancel this ride?',
            card.late_cancel
                ? 'It leaves within 2 hours, so cancelling now costs 10 credibility. Your co-riders are told a seat opened.'
                : 'Free to cancel now. Your co-riders are told a seat opened.',
            [
                { text: 'Keep it', style: 'cancel' },
                {
                    text: 'Cancel ride',
                    style: 'destructive',
                    onPress: () =>
                        act('cancel', async () => {
                            await cabshareService.cancel(card.request);
                            onCancelled();
                        }, 'Could not cancel'),
                },
            ]
        );

    const notice = noticeText(card.notice);
    const ci = card.checkin;

    return (
        <ScrollView
            contentContainerStyle={{ padding: 16, paddingTop: 4, paddingBottom: 40, gap: 12 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        >
            {notice ? (
                <Banner
                    tone="warn"
                    text={notice}
                    onClose={() => act('notice', async () => {
                        await cabshareService.dismissNotice(card.request);
                        return { ...card, notice: null };
                    }, 'Could not dismiss')}
                />
            ) : null}

            {/* the one thing to do next */}
            {!card.departed && ci.open && !ci.done ? (
                <Card style={{ gap: 8 }}>
                    <Text style={{ color: colors.text, fontWeight: '700', fontSize: 15 }}>You're at the pickup?</Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                        Check in within {Math.round(ci.radius_m)} m of the pickup. Once you check in, nobody can report you as a no-show.
                    </Text>
                    <Button title="Check in here" icon={<MapPin size={16} color={colors.onPrimary} />} onPress={checkIn} busy={busy === 'checkin'} />
                </Card>
            ) : ci.done ? (
                <Banner text="You checked in at the pickup." />
            ) : !card.departed ? (
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                    {card.revealed
                        ? `Check-in opens at ${timeLabel(ci.opens)}.`
                        : `Names show 15 minutes before leaving. Check-in opens at ${timeLabel(ci.opens)}. Say hello in Chat meanwhile.`}
                </Text>
            ) : !card.settled && !card.rode ? (
                <Card style={{ gap: 8 }}>
                    <Text style={{ color: colors.text, fontWeight: '700', fontSize: 15 }}>Did you take this ride?</Text>
                    <Button title="I took this ride" onPress={() => act('rode', () => cabshareService.confirm(card.request), 'Could not confirm')} busy={busy === 'rode'} />
                </Card>
            ) : card.settled ? (
                <Banner text="This ride is settled." />
            ) : (
                <Banner text="Thanks for confirming. The ride settles 2 hours after it left." />
            )}

            <SectionTitle>Stops</SectionTitle>
            <Card>
                <StopsLine stops={card.stops} direction={card.direction} />
            </Card>

            <SectionTitle>{`Riders (${card.people})`}</SectionTitle>
            <Card style={{ paddingVertical: 4 }}>
                {card.riders.map((r, i) => (
                    <View key={i} style={[styles.rider, i ? { borderTopWidth: StyleSheet.hairlineWidth, borderColor: colors.border } : null]}>
                        <View style={[styles.avatar, { backgroundColor: (r.you ? colors.primary : colors.textSecondary) + '20' }]}>
                            <UserRound size={18} color={r.you ? colors.primary : colors.textSecondary} />
                        </View>
                        <View style={{ flex: 1, gap: 2 }}>
                            <Text style={{ color: colors.text, fontWeight: '700' }}>
                                {r.name ?? r.label}
                                {r.party > 1 ? ` +${r.party - 1}` : ''}
                                {genderLabel(r.gender) ? `  · ${genderLabel(r.gender)}` : ''}
                            </Text>
                            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                                {card.direction === 'from_campus' ? 'Gets off at' : 'Gets on at'} {r.stop_name}
                                {r.place_note ? ` (${r.place_note})` : ''}
                            </Text>
                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                <Briefcase size={12} color={colors.textSecondary} />
                                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                                    {r.suitcases} suitcase{r.suitcases === 1 ? '' : 's'}, {r.handbags} bag{r.handbags === 1 ? '' : 's'}
                                </Text>
                                {r.checked_in ? <CheckCircle2 size={14} color={colors.success} /> : null}
                            </View>
                            {r.contact && !r.you ? (
                                <Text selectable style={{ color: colors.textSecondary, fontSize: 11 }}>{r.contact}</Text>
                            ) : null}
                        </View>
                        {card.departed && !card.settled && !r.you && r.contact && !r.checked_in ? (
                            r.reported ? (
                                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Reported</Text>
                            ) : (
                                <Pressable onPress={() => report(r.contact!, r.name ?? r.label)} hitSlop={6} disabled={busy === r.contact}>
                                    <Text style={{ color: colors.danger, fontSize: 12, fontWeight: '700' }}>Didn't come</Text>
                                </Pressable>
                            )
                        ) : null}
                    </View>
                ))}
            </Card>

            {card.can_cancel ? (
                <Button title="Cancel my seat" kind="danger" onPress={cancel} busy={busy === 'cancel'} />
            ) : !card.departed ? (
                <Text style={{ color: colors.textSecondary, fontSize: 12, textAlign: 'center' }}>
                    The group is fixed 15 minutes before leaving. Can't make it? Tell your co-riders in Chat.
                </Text>
            ) : null}
        </ScrollView>
    );
}

function ChatPane({ request }: { request: number }) {
    const { colors, radius } = useTheme();
    const chat = usePolled<ChatPage>(() => cabshareService.messages(request), 5000);
    const [older, setOlder] = useState<Message[]>([]);
    const [olderCursor, setOlderCursor] = useState<string | null | undefined>(undefined);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const list = useRef<FlatList<Message>>(null);

    const cursor = olderCursor === undefined ? chat.data?.older ?? null : olderCursor;
    const all = [...older, ...(chat.data?.messages ?? [])].filter((m, i, a) => a.findIndex((x) => x.id === m.id) === i);
    const shown = [...all].reverse(); // inverted list: newest at the bottom

    const loadOlder = async () => {
        if (!cursor) return;
        try {
            const page = await cabshareService.messages(request, cursor);
            setOlder((o) => [...page.messages, ...o]);
            setOlderCursor(page.older);
        } catch (e) {
            Alert.alert('Could not load older messages', cabshareError(e));
        }
    };

    const send = useCallback(async () => {
        const body = text.trim();
        if (!body || sending) return;
        setSending(true);
        try {
            chat.setData(await cabshareService.send(request, body));
            setText('');
            list.current?.scrollToOffset({ offset: 0, animated: true });
        } catch (e) {
            Alert.alert('Could not send', cabshareError(e));
        } finally {
            setSending(false);
        }
    }, [text, sending, request, chat]);

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={110}>
            <FlatList
                ref={list}
                inverted
                data={shown}
                keyExtractor={(m) => String(m.id)}
                contentContainerStyle={{ padding: 16, gap: 6 }}
                onEndReached={loadOlder}
                onEndReachedThreshold={0.2}
                ListEmptyComponent={
                    chat.loading ? null : (
                        <Text style={{ color: colors.textSecondary, textAlign: 'center', transform: [{ scaleY: -1 }] }}>
                            Say hello and agree where to meet. Everyone shows as a relay handle until names reveal.
                        </Text>
                    )
                }
                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.bubble,
                            {
                                alignSelf: item.mine ? 'flex-end' : 'flex-start',
                                backgroundColor: item.mine ? colors.primary : colors.surface,
                                borderColor: colors.border,
                                borderRadius: radius.lg,
                            },
                        ]}
                    >
                        {!item.mine ? (
                            <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '700' }}>{item.from.split('@')[0]}</Text>
                        ) : null}
                        <Text style={{ color: item.mine ? colors.onPrimary : colors.text, fontSize: 15 }}>{item.body}</Text>
                        <Text style={{ color: item.mine ? colors.onPrimary + 'B0' : colors.textSecondary, fontSize: 10, alignSelf: 'flex-end' }}>
                            {timeLabel(item.at)}
                        </Text>
                    </View>
                )}
            />
            <View style={[styles.composer, { borderColor: colors.border, backgroundColor: colors.background }]}>
                <TextInput
                    value={text}
                    onChangeText={setText}
                    placeholder="Message your ride"
                    placeholderTextColor={colors.textSecondary}
                    multiline
                    maxLength={500}
                    style={[styles.compose, { color: colors.text, borderColor: colors.border, borderRadius: radius.lg, backgroundColor: colors.surface }]}
                />
                <Pressable
                    onPress={send}
                    disabled={!text.trim() || sending}
                    accessibilityLabel="Send"
                    style={[styles.send, { backgroundColor: colors.primary, opacity: text.trim() ? 1 : 0.4 }]}
                >
                    {sending ? <ActivityIndicator color={colors.onPrimary} /> : <Send size={18} color={colors.onPrimary} />}
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}

function QuoteEditor({ request, quote, onChange }: { request: number; quote: number | null; onChange: (c: CardT) => void }) {
    const { colors, radius } = useTheme();
    const [value, setValue] = useState(quote ? String(quote) : '');
    const [busy, setBusy] = useState(false);
    useEffect(() => setValue(quote ? String(quote) : ''), [quote]);
    const save = async () => {
        const q = value.trim() ? Number(value.trim()) : null;
        if (q !== null && (!Number.isInteger(q) || q <= 0)) {
            Alert.alert('Ola/Uber price', 'Enter the price in whole rupees, or leave it empty.');
            return;
        }
        setBusy(true);
        try {
            onChange(await cabshareService.setQuote(request, q));
        } catch (e) {
            Alert.alert('Could not save the price', cabshareError(e));
        } finally {
            setBusy(false);
        }
    };
    return (
        <Card style={{ gap: 8 }}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>Ola/Uber price</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                Seeing a different price in Ola or Uber for your stop? Enter it and everyone's split follows the real price.
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput
                    value={value}
                    onChangeText={setValue}
                    keyboardType="number-pad"
                    placeholder="₹"
                    placeholderTextColor={colors.textSecondary}
                    style={[styles.quote, { color: colors.text, borderColor: colors.border, borderRadius: radius.md }]}
                />
                <Button title="Save" onPress={save} busy={busy} style={{ paddingHorizontal: 20 }} />
            </View>
        </Card>
    );
}

function FarePane({ card, onChange }: { card: TripCard; onChange: (c: CardT) => void }) {
    return (
        <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, paddingBottom: 40, gap: 12 }} keyboardShouldPersistTaps="handled">
            <Card>
                <FareBreakdown fare={card.fare} />
            </Card>
            {!card.departed ? <QuoteEditor request={card.request} quote={card.quote} onChange={onChange} /> : null}
        </ScrollView>
    );
}

function WaitingView({
    card,
    onChange,
    refreshing,
    onRefresh,
}: {
    card: RequestCard;
    onChange: (c: CardT) => void;
    refreshing: boolean;
    onRefresh: () => void;
}) {
    const { colors } = useTheme();
    const navigation = useNavigation<any>();
    const [busy, setBusy] = useState(false);
    const notice = noticeText(card.notice);
    const cancel = () =>
        Alert.alert('Cancel this request?', 'Nobody has joined yet, so it is free.', [
            { text: 'Keep it', style: 'cancel' },
            {
                text: 'Cancel request',
                style: 'destructive',
                onPress: async () => {
                    setBusy(true);
                    try {
                        await cabshareService.cancel(card.request);
                        navigation.goBack();
                    } catch (e) {
                        Alert.alert('Could not cancel', cabshareError(e));
                    } finally {
                        setBusy(false);
                    }
                },
            },
        ]);
    return (
        <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 12 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
            keyboardShouldPersistTaps="handled"
        >
            {notice ? (
                <Banner
                    tone="warn"
                    text={notice}
                    onClose={() => cabshareService.dismissNotice(card.request).then(() => onChange({ ...card, notice: null })).catch(() => {})}
                />
            ) : null}
            <Card style={{ gap: 6 }}>
                <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800' }}>
                    {card.over ? 'Nobody joined this time' : 'Waiting for company'}
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 18 }}>
                    {card.over
                        ? 'Every time you offered has passed. Post again with more times to match more people.'
                        : "Anyone going your way at one of these times is grouped with you automatically. We'll notify you."}
                </Text>
                {card.slots.map((s) => (
                    <Text key={s} style={{ color: colors.text, fontWeight: '600' }}>
                        • {whenLabel(s)} <Text style={{ color: colors.textSecondary, fontWeight: '400' }}>({untilLabel(s)})</Text>
                    </Text>
                ))}
            </Card>
            <Card style={{ gap: 4 }}>
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                    {vehicleLabel(card.vehicle)} · {card.party} {card.party === 1 ? 'person' : 'people'} · {card.suitcases} suitcases ·{' '}
                    {card.handbags} bags{card.place_note ? ` · ${card.place_note}` : ''}
                </Text>
                <Text style={{ color: colors.text, fontSize: 15 }}>
                    Whole {card.vehicle} about <Text style={{ fontWeight: '800' }}>{rupees(card.fare.total)}</Text>; with a full{' '}
                    {card.vehicle}, about <Text style={{ fontWeight: '800' }}>{rupees(card.fare.full_cab_share)}</Text> each.
                </Text>
            </Card>
            {!card.over ? <QuoteEditor request={card.request} quote={card.quote} onChange={onChange} /> : null}
            {!card.over ? <Button title="Cancel request" kind="danger" onPress={cancel} busy={busy} /> : null}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    summary: { flexDirection: 'row', margin: 16, marginBottom: 12, padding: 16, borderWidth: 1 },
    rider: { flexDirection: 'row', gap: 12, paddingVertical: 12, alignItems: 'flex-start' },
    avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    bubble: { maxWidth: '80%', paddingHorizontal: 12, paddingVertical: 8, borderWidth: StyleSheet.hairlineWidth, gap: 2 },
    composer: { flexDirection: 'row', gap: 8, alignItems: 'flex-end', padding: 10, borderTopWidth: StyleSheet.hairlineWidth },
    compose: { flex: 1, borderWidth: 1, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 10, fontSize: 15, maxHeight: 120 },
    send: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    quote: { flex: 1, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15 },
});
