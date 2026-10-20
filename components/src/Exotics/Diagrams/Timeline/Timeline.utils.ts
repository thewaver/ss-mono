import { type Span, SpanUtils } from "@thewaver/ss-utils";

import type { CarrierZone, Carry, CarryPlace } from "../../../Abstracts/Carrier/Carrier.types";
import { CarrierUtils } from "../../../Abstracts/Carrier/Carrier.utils";
import { NavigatorUtils } from "../../../Abstracts/Navigator/Navigator.utils";
import type {
    TimelineEdge,
    TimelineEdgeCarry,
    TimelineEdgeZoneDefs,
    TimelineItemBox,
    TimelineKeyAction,
    TimelineMarker,
    TimelinePlacement,
    TimelineStep,
    TimelineStop,
} from "./Timeline.types";

/** Zero, as a count, an index or an extent. */
const NOTHING = 0;
/** One step or one item. */
const SINGLE = 1;
/** Slack for comparing values that arrived by division, where a whole number may be off in its last bits. */
const EPSILON = 1e-9;
/** How many steps an edge looks ahead for the next snapped value before giving up. */
const MAX_SNAP_PROBES = 256;
/** How many times the gap before the next snapped value is halved, which is past the precision of a double. */
const MAX_HALVINGS = 64;

/** The key that takes hold of an item's end, while edges are on. */
const HOLD_KEY = "Enter";
/** One percent in a ratio. */
const PERCENT = 100;

/** The keys that choose which edge is held. */
const EDGE_BY_KEY: Record<string, TimelineEdge> = {
    Home: "start",
    End: "end",
};

/** The keys that move a held edge, and which way. */
const NUDGE_BY_KEY: Record<string, number> = {
    ArrowRight: SINGLE,
    ArrowLeft: -SINGLE,
};

/** The keys that walk the items, and where each one goes. */
const STEP_BY_KEY: Record<string, TimelineStep> = {
    ArrowRight: "next",
    ArrowLeft: "previous",
    ArrowDown: "lane_after",
    ArrowUp: "lane_before",
    Home: "first",
    End: "last",
};

/**
 * Placing, walking and editing the items of a timeline. Lane packing and tick marks are `SpanUtils`'.
 *
 * Two spans matter throughout and it is worth keeping them apart: the range is everything the
 * timeline covers, and the view is the part of it currently on screen. Values are plain numbers, so
 * the same code serves dates, durations, frame counts or anything else laid out along a line.
 */
export namespace TimelineUtils {
    /**
     * The order a keyboard should walk the spans.
     *
     * By start, then by lane, then by end — so the walk goes left to right and, where several spans start
     * together, top to bottom. Ties fall back to the caller's order, which keeps the walk stable as spans
     * are added.
     *
     * @param spans The spans.
     * @param lanes Their lanes.
     * @returns The span indices in that order.
     */
    export const computeOrder = (spans: Span[], lanes: number[]): number[] =>
        spans
            .map((_unused, index) => index)
            .sort(
                (first, second) =>
                    spans[first].start - spans[second].start ||
                    lanes[first] - lanes[second] ||
                    spans[first].end - spans[second].end ||
                    first - second,
            );

    /**
     * Where each span is drawn in the current view.
     *
     * @param spans The spans.
     * @param lanes Their lanes.
     * @param order The keyboard order.
     * @param view The part of the range on screen.
     * @returns One placement per span, in keyboard order, carrying its lane, its start and end as
     * fractions of the view, and whether it is in view at all — fractions outside `0` to `1` are normal
     * and are how a span running off the edge gets drawn.
     */
    export const computePlacements = (
        spans: Span[],
        lanes: number[],
        order: number[],
        view: Span,
    ): TimelinePlacement[] =>
        order.map((index, position) => ({
            index,
            order: position,
            lane: lanes[index],
            startRatio: SpanUtils.toRatio(spans[index].start, view),
            endRatio: SpanUtils.toRatio(spans[index].end, view),
            isInView: spans[index].end >= view.start && spans[index].start <= view.end,
        }));

    /**
     * The spans a keyboard can land on.
     *
     * @param spans The spans.
     * @param lanes Their lanes.
     * @param order The keyboard order.
     * @param isDisabled One entry per span. Disabled spans are left out, so stepping skips them rather
     * than stalling on them.
     */
    export const computeStops = (
        spans: Span[],
        lanes: number[],
        order: number[],
        isDisabled: boolean[],
    ): TimelineStop[] =>
        order
            .map((index, position) => ({ index, order: position, lane: lanes[index], span: spans[index] }))
            .filter((stop) => !isDisabled[stop.index]);

    /**
     * Which span a keyboard step moves to.
     *
     * Moving between lanes goes to the nearest lane in that direction and, within it, the span nearest in
     * time — so moving down from a span lands under it rather than at the start of the lane below.
     *
     * @param step `"first"`, `"last"`, `"previous"`, `"next"`, `"lane_before"` or `"lane_after"`.
     * @param fromIndex Where the cursor is now. An index that is not a stop starts from the first one.
     * @param stops The stops from {@link TimelineUtils.computeStops}.
     * @returns The span's index, or `undefined` when there is none that way.
     */
    export const computeStepIndex = (step: TimelineStep, fromIndex: number, stops: TimelineStop[]) => {
        if (!stops.length) return undefined;

        if (step === "first") return stops[NOTHING].index;
        if (step === "last") return stops[stops.length - SINGLE].index;

        const at = stops.findIndex((stop) => stop.index === fromIndex);

        if (at === -SINGLE) return stops[NOTHING].index;

        if (step === "previous" || step === "next") {
            return stops[step === "next" ? at + SINGLE : at - SINGLE]?.index;
        }

        const from = stops[at];
        const isAfter = step === "lane_after";

        return stops
            .filter((stop) => (isAfter ? stop.lane > from.lane : stop.lane < from.lane))
            .sort(
                (first, second) =>
                    Math.abs(first.lane - from.lane) - Math.abs(second.lane - from.lane) ||
                    Math.abs(first.span.start - from.span.start) - Math.abs(second.span.start - from.span.start) ||
                    first.order - second.order,
            )[NOTHING]?.index;
    };

    /**
     * Where each marker falls in the current view.
     *
     * @param values The marked points in time.
     * @param view The part of the range on screen.
     * @returns One marker per value, in the same order, carrying its value, its position as a fraction of the
     * view — outside `0` to `1` when it is off screen — and whether it is in view, ends included.
     */
    export const computeMarkers = (values: number[], view: Span): TimelineMarker[] =>
        values.map((value) => ({
            value,
            ratio: SpanUtils.toRatio(value, view),
            isInView: value >= view.start && value <= view.end,
        }));

    /**
     * Moves one edge of a span to a value, keeping the span whole.
     *
     * The value is held inside the range, and an edge is stopped at the other one rather than passing it, so the
     * result is never inside out; at the limit the span has no extent at all.
     *
     * @param span The span before the move.
     * @param edge Which edge to move.
     * @param value Where to move it.
     * @param range Everything the timeline covers.
     * @returns A new span. The edge not being moved is left where it was.
     */
    export const moveEdge = (span: Span, edge: TimelineEdge, value: number, range: Span) => {
        const held = Math.min(Math.max(value, range.start), range.end);

        return edge === "start"
            ? { start: Math.min(held, span.end), end: span.end }
            : { start: span.start, end: Math.max(held, span.start) };
    };

    /**
     * Where one key press should move an edge.
     *
     * Without a snap it is one step along. With one, it is the nearest value the snap gives beyond the current one
     * in that direction — the next notch, however fine or coarse the snap is against the step, so one press is
     * always one notch.
     *
     * @param value Where the edge is.
     * @param direction `1` for later, `-1` for earlier.
     * @param step How far one press travels when nothing snaps, such as the ruler's tick step, and how far ahead
     * the next notch is looked for at a time when something does. Zero or less moves nothing.
     * @param range Everything the timeline covers. Nothing is looked for beyond it.
     * @param computeSnapValue Rounds a value to where an edge may land. Expected never to decrease as its input
     * grows, which every rounding does.
     * @returns The new value, held inside the range, or `value` itself when there is nowhere further to go.
     */
    export const computeSteppedEdgeValue = (
        value: number,
        direction: number,
        step: number,
        range: Span,
        computeSnapValue?: (value: number) => number,
    ) => {
        if (step <= NOTHING || direction === NOTHING) return value;

        const toward = Math.sign(direction);
        const clampToRange = (next: number) => Math.min(Math.max(next, range.start), range.end);

        if (!computeSnapValue) return clampToRange(value + toward * step);

        const snapAt = (distance: number) => clampToRange(computeSnapValue(value + toward * distance));
        const getHasMoved = (distance: number) => (snapAt(distance) - value) * toward > EPSILON;

        let reached: number | undefined;

        for (let probe = SINGLE; probe <= MAX_SNAP_PROBES && reached === undefined; probe++) {
            const distance = step * probe;

            if (getHasMoved(distance)) reached = distance;
            else if (value + toward * distance < range.start || value + toward * distance > range.end) break;
        }

        if (reached === undefined) return value;

        let short = reached - step;
        let far = reached;

        for (let halving = NOTHING; halving < MAX_HALVINGS; halving++) {
            const middle = (short + far) * 0.5;

            if (getHasMoved(middle)) far = middle;
            else short = middle;
        }

        return snapAt(far);
    };

    /**
     * How many lanes the items reach, when nobody has said how many there are.
     *
     * @param lanes One lane number per item.
     * @returns One more than the highest lane, and never fewer than one, so an empty timeline still has a row.
     */
    export const computeLaneCount = (lanes: number[]) =>
        lanes.reduce((most, lane) => Math.max(most, lane + SINGLE), SINGLE);

    /**
     * How tall the whole timeline is drawn: the ruler's band on top of every lane and the gaps between them.
     *
     * @param axisSize How much room the ruler takes.
     * @param laneCount How many lanes there are.
     * @param laneSize How thick one lane is.
     * @param laneGap The space between one lane and the next, which is not left after the last.
     */
    export const computeHeight = (axisSize: number, laneCount: number, laneSize: number, laneGap: number) =>
        axisSize + laneCount * (laneSize + laneGap) - laneGap;

    /**
     * Where one item's box is drawn.
     *
     * Across the axis it is a share of the view, written as percentages so a resize needs no work at all; down it
     * is its lane, below the ruler's band, in pixels.
     *
     * @param placement Where the item was placed, from {@link TimelineUtils.computePlacements}.
     * @param axisSize How much room the ruler takes.
     * @param laneSize How thick one lane is.
     * @param laneGap The space between one lane and the next.
     * @returns `left` and `width` in percent of the timeline's width, `top` and `height` in pixels.
     */
    export const computeItemBox = (
        placement: TimelinePlacement,
        axisSize: number,
        laneSize: number,
        laneGap: number,
    ): TimelineItemBox => ({
        left: placement.startRatio * PERCENT,
        width: (placement.endRatio - placement.startRatio) * PERCENT,
        top: axisSize + placement.lane * (laneSize + laneGap),
        height: laneSize,
    });

    /**
     * The placement of an item nobody has placed, which is where an index missing from the placements reads.
     *
     * @param index The item's index.
     * @returns A placement at the very start of the first lane, of no width, and out of view.
     */
    export const getBlankPlacement = (index: number): TimelinePlacement => ({
        index,
        order: NOTHING,
        lane: NOTHING,
        startRatio: NOTHING,
        endRatio: NOTHING,
        isInView: false,
    });

    /**
     * Which item holds the timeline's one tab stop.
     *
     * @param stops The stops from {@link TimelineUtils.computeStops}.
     * @param focusedIndex The item last focused, if any.
     * @returns That item while it is still a stop, the first stop otherwise, or `undefined` when there are none.
     */
    export const computeRovingIndex = (stops: TimelineStop[], focusedIndex: number | undefined) => {
        if (focusedIndex !== undefined && stops.some((stop) => stop.index === focusedIndex)) return focusedIndex;

        return stops[NOTHING]?.index;
    };

    /**
     * Which items to build.
     *
     * Only what the view can show, plus whichever item holds the tab stop, so a walk never focuses something that
     * is not there.
     *
     * @param placements The placements from {@link TimelineUtils.computePlacements}.
     * @param rovingIndex The item holding the tab stop.
     * @returns Item indices, in keyboard order.
     */
    export const computeRenderedIndices = (placements: TimelinePlacement[], rovingIndex: number | undefined) =>
        placements
            .filter((placement) => placement.isInView || placement.index === rovingIndex)
            .map((placement) => placement.index);

    /**
     * The spans as they should be drawn while an edge is held, which puts the held item at its proposed span.
     *
     * @param spans Every item's own span.
     * @param heldIndex The item whose edge is held, if any.
     * @param heldSpan The span that item would have if dropped now, if any.
     * @returns `spans` itself when nothing is held, so an unchanged list keeps its identity.
     */
    export const computeShownSpans = (spans: Span[], heldIndex: number | undefined, heldSpan: Span | undefined) => {
        if (heldIndex === undefined || heldSpan === undefined) return spans;

        return spans.map((span, at) => (at === heldIndex ? heldSpan : span));
    };

    /**
     * What a carry is told about an item whose edge is picked up.
     *
     * @param groupId The timeline's own group, so no other zone can take it.
     * @param index The item.
     * @param label The item's name, as it is announced.
     */
    export const computeEdgeCarry = (groupId: string, index: number, label: string): Carry => ({
        groupId,
        key: `${index}`,
        label,
        value: { index } satisfies TimelineEdgeCarry,
    });

    /**
     * Which item a carry from {@link TimelineUtils.computeEdgeCarry} holds an edge of.
     *
     * @param carry The carry, or `undefined` when nothing is carried.
     * @returns The item's index, or `undefined`.
     */
    export const getCarriedIndex = (carry: Carry | undefined) =>
        carry === undefined ? undefined : (carry.value as TimelineEdgeCarry).index;

    /**
     * What a key pressed on the timeline does.
     *
     * While an edge is held by key or by tap, `Escape` puts it back, `Enter` and `Space` drop it, `Home` and `End`
     * choose which edge is held and the left and right arrows move it; the up and down arrows are taken and do
     * nothing, so a hold never walks away from its item. Otherwise `Enter` takes hold of the item's end when edges
     * are on, `Enter` and `Space` activate, and the arrows, `Home` and `End` walk. `Tab` is never taken.
     *
     * @param key The `key` of the keyboard event.
     * @param opts.isHolding Whether an edge of this timeline is held by key or by tap. A drag is left to the
     * pointer.
     * @param opts.isEditable Whether edges are on.
     * @returns What to do, or `undefined` when the key is not the timeline's and should be left alone. Every
     * action but `"ignore"` and `"step"` has its default prevented; a step prevents it only when it goes somewhere.
     */
    export const computeKeyAction = (
        key: string,
        opts: { isHolding: boolean; isEditable: boolean },
    ): TimelineKeyAction | undefined => {
        if (opts.isHolding) {
            const edge = EDGE_BY_KEY[key];
            const nudge = NUDGE_BY_KEY[key];

            if (key === "Escape") return { kind: "cancel" };
            if (NavigatorUtils.getIsActivationKey(key)) return { kind: "drop" };
            if (edge !== undefined || nudge !== undefined) return { kind: "aim", edge, nudge };
            if (STEP_BY_KEY[key] !== undefined) return { kind: "ignore" };
        }

        if (key === HOLD_KEY && opts.isEditable) return { kind: "hold" };
        if (NavigatorUtils.getIsActivationKey(key)) return { kind: "activate" };

        const step = STEP_BY_KEY[key];

        return step === undefined ? undefined : { kind: "step", step };
    };

    /**
     * The zone a timeline offers its own edge carries.
     *
     * The carried item is an index and the place is the whole proposed span, so the item can be drawn at its new
     * size while held and the consumer is told only on the drop. Which edge is held is the timeline's own state,
     * read through `getHeldEdge`, rather than part of the place — so switching ends and dropping without moving is
     * "left in place" rather than a change. A point lands on the value under it, less the offset the pointer was
     * grabbed at and snapped when a snap is given; a nudge is one notch through
     * {@link TimelineUtils.computeSteppedEdgeValue}.
     *
     * @param defs The timeline's state and answers, read at the moment a carry needs them. `computeSnapValue` is
     * read then too, so an object whose member is a getter follows the consumer's prop.
     * @returns The zone, to register with the carrier.
     */
    export const createEdgeZone = (defs: TimelineEdgeZoneDefs): CarrierZone => {
        const asSpan = (place: CarryPlace) => place as Span;

        return {
            getGroupId: defs.getGroupId,
            getLabel: defs.getLabel,
            getRootRef: defs.getRootRef,
            getIsDisabled: () => !defs.getIsEditable(),
            getKeyHint: () => defs.getAnnouncements().heldKeyHint,
            getAnnouncements: defs.getAnnouncements,
            computeCanAccept: () => defs.getIsEditable(),
            computePlaceAtPoint: (point) => {
                const place = CarrierUtils.getTargetPlace();

                if (place === undefined) return undefined;

                const value =
                    SpanUtils.toValue(defs.computePointerRatio(point.x), defs.getView()) - defs.getGrabOffset();
                const snapped = defs.computeSnapValue?.(value) ?? value;

                return moveEdge(asSpan(place), defs.getHeldEdge(), snapped, defs.getRange());
            },
            computeNudgedPlace: (place, nudge) => {
                const span = asSpan(place);
                const edge = defs.getHeldEdge();
                const value = computeSteppedEdgeValue(
                    span[edge],
                    nudge.x ?? NOTHING,
                    defs.getStep(),
                    defs.getRange(),
                    defs.computeSnapValue,
                );

                return moveEdge(span, edge, value, defs.getRange());
            },
            computeEntryPlace: (carry) => defs.getSpans()[getCarriedIndex(carry)!],
            computeIsSamePlace: (first, second) =>
                asSpan(first).start === asSpan(second).start && asSpan(first).end === asSpan(second).end,
            computeIsPlaceAllowed: () => true,
            computePlaceLabel: (place) => defs.getAnnouncements().computePlaceLabel(defs.getHeldEdge(), asSpan(place)),
            takeAt: () => undefined,
            putAt: () => undefined,
            moveAt: (_unusedFrom, toPlace, carry) => defs.onSpanChange(getCarriedIndex(carry)!, asSpan(toPlace)),
        };
    };
}
