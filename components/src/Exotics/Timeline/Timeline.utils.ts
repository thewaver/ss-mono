import type { CarrierZone, Carry, CarryPlace } from "../../Abstracts/Carrier/Carrier.types";
import { CarrierUtils } from "../../Abstracts/Carrier/Carrier.utils";
import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import type {
    TimelineEdge,
    TimelineEdgeCarry,
    TimelineEdgeZoneDefs,
    TimelineGestureDefs,
    TimelineItemBox,
    TimelineKeyAction,
    TimelineMarker,
    TimelinePlacement,
    TimelineSpan,
    TimelineStep,
    TimelineStepPair,
    TimelineStop,
    TimelineTick,
} from "./Timeline.types";

/** Zero, as a count, an index or an extent. */
const NOTHING = 0;
/** One step or one item. */
const SINGLE = 1;
/** The base tick steps climb in. */
const DECADE = 10;
/** The tick steps within one decade: ones, twos and fives. Anything else gives labels nobody can read off — nobody counts in sevens. */
const MANTISSAS = [1, 2, 5];
/** How much coarser a major tick should be than a minor one before it is worth labeling. */
const MAJOR_FACTOR = 3;
/** A cap on how many ticks are produced, in case a view and a step disagree wildly. */
const MAX_TICKS = 512;
/** Slack for comparing values that arrived by division, where a whole number may be off in its last bits. */
const EPSILON = 1e-9;
/** How many steps an edge looks ahead for the next snapped value before giving up. */
const MAX_SNAP_PROBES = 256;
/** How many times the gap before the next snapped value is halved, which is past the precision of a double. */
const MAX_HALVINGS = 64;

/** Where a zoom or a pointer reading centers when there is nothing better to go on: the middle. */
const MIDDLE_RATIO = 0.5;
/** How much one pixel of wheel travel zooms by, as an exponent, so equal wheel travel is equal zoom either way. */
const ZOOM_RATE = 0.0015;
/** How many pointers make a pinch. */
const PINCH_POINTERS = 2;
/** How far a press travels before it counts as a pan rather than a press, the same slop `Carrier` uses. */
const DRAG_SLOP = 4;
/** The primary mouse button. */
const PRIMARY_BUTTON = 0;
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
    ArrowDown: "laneAfter",
    ArrowUp: "laneBefore",
    Home: "first",
    End: "last",
};

/** Whether a value falls on a step, allowing for floating-point drift. */
const isMultipleOf = (value: number, step: number) => Math.abs(value / step - Math.round(value / step)) < EPSILON;

/**
 * Picks which step gets the labeled ticks.
 *
 * It must be a whole multiple of the minor step, or the major ticks would not line up with the minor
 * ones, and it must fit in the view or nothing would be labeled at all. Comfortably coarser than
 * the minor step is preferred, falling back to the next one up.
 */
const chooseMajorStep = (step: number, entries: number[], viewExtent: number) => {
    const fitting = entries.filter((entry) => entry > step && entry <= viewExtent && isMultipleOf(entry, step));

    return fitting.find((entry) => entry >= step * MAJOR_FACTOR) ?? fitting[NOTHING] ?? step;
};

/**
 * Zooming, panning, lane packing and tick marks for a timeline.
 *
 * Two spans matter throughout and it is worth keeping them apart: the range is everything the
 * timeline covers, and the view is the part of it currently on screen. Values are plain numbers, so
 * the same code serves dates, durations, frame counts or anything else laid out along a line.
 */
export namespace TimelineUtils {
    /** How much a span covers. */
    export const getExtent = (span: TimelineSpan) => span.end - span.start;

    /**
     * Where a value sits in a span, as a fraction.
     *
     * @param value The value to place.
     * @param span The span to place it in.
     * @returns `0` at the start and `1` at the end, reaching outside that range for a value outside the
     * span. A span of no extent reports `0` rather than dividing by zero.
     */
    export const toRatio = (value: number, span: TimelineSpan) => {
        const extent = getExtent(span);

        return extent === NOTHING ? NOTHING : (value - span.start) / extent;
    };

    /**
     * The value at a fraction along a span.
     *
     * @param ratio The fraction.
     * @param span The span.
     */
    export const toValue = (ratio: number, span: TimelineSpan) => span.start + ratio * getExtent(span);

    /**
     * Holds a view inside the range, keeping it a sensible size.
     *
     * The size is settled before the position, so a view wider than the range is shrunk to fit rather
     * than being left hanging off one end.
     *
     * @param view The view to correct.
     * @param range Everything the timeline covers.
     * @param minExtent The narrowest the view may get. Itself capped by the range, since a range narrower
     * than the minimum cannot be honored.
     */
    export const clampView = (view: TimelineSpan, range: TimelineSpan, minExtent: number): TimelineSpan => {
        const available = Math.max(getExtent(range), NOTHING);
        const extent = Math.min(Math.max(getExtent(view), Math.min(minExtent, available)), available);
        const start = Math.min(Math.max(view.start, range.start), range.end - extent);

        return { start, end: start + extent };
    };

    /**
     * Zooms the view about a point.
     *
     * The value under the focus stays under it, which is what makes a scroll-wheel zoom feel anchored to
     * the pointer rather than to the middle of the screen.
     *
     * @param view The view before zooming.
     * @param factor Below `1` to zoom in, above to zoom out.
     * @param focusRatio Where the zoom is centered, as a fraction across the view.
     * @param range Everything the timeline covers.
     * @param minExtent The narrowest the view may get.
     */
    export const zoomView = (
        view: TimelineSpan,
        factor: number,
        focusRatio: number,
        range: TimelineSpan,
        minExtent: number,
    ): TimelineSpan => {
        const available = Math.max(getExtent(range), NOTHING);
        const anchor = toValue(focusRatio, view);
        const extent = Math.min(Math.max(getExtent(view) * factor, Math.min(minExtent, available)), available);
        const start = anchor - focusRatio * extent;

        return clampView({ start, end: start + extent }, range, extent);
    };

    /**
     * Slides the view along.
     *
     * @param view The view before panning.
     * @param ratio How far to move, as a fraction of the view's own width — so a pan means the same
     * gesture at any zoom.
     * @param range Everything the timeline covers.
     */
    export const panView = (view: TimelineSpan, ratio: number, range: TimelineSpan): TimelineSpan => {
        const shift = getExtent(view) * ratio;

        return clampView({ start: view.start + shift, end: view.end + shift }, range, getExtent(view));
    };

    /**
     * Slides the view just far enough to bring a span into it.
     *
     * The view is not zoomed and not centered; it moves the minimum needed, which is what keeps a keyboard
     * walk through the items from lurching. A span too wide to fit is aligned to its start.
     *
     * @param span The span to reveal.
     * @param view The current view.
     * @param range Everything the timeline covers.
     * @returns The view unchanged when the span is already visible.
     */
    export const revealView = (span: TimelineSpan, view: TimelineSpan, range: TimelineSpan): TimelineSpan => {
        const extent = getExtent(view);
        const shift =
            span.start < view.start
                ? span.start - view.start
                : span.end > view.end
                  ? Math.min(span.end - view.end, span.start - view.start)
                  : NOTHING;

        if (shift === NOTHING) return view;

        return clampView({ start: view.start + shift, end: view.end + shift }, range, extent);
    };

    /**
     * Assigns each span to a lane so that no two overlapping spans share one.
     *
     * Spans are taken in start order and each goes into the first lane already free at that point, which
     * is the standard greedy packing — it uses no more lanes than the busiest moment needs, and adding a
     * span cannot reshuffle the ones before it.
     *
     * @param spans The spans, in the caller's own order.
     * @returns One lane number per span, in that same order.
     */
    export const packLanes = (spans: TimelineSpan[]): number[] => {
        const lanes: number[] = spans.map(() => NOTHING);
        const ends: number[] = [];

        spans
            .map((span, index) => ({ span, index }))
            .sort((first, second) => first.span.start - second.span.start || first.index - second.index)
            .forEach((entry) => {
                const free = ends.findIndex((end) => end <= entry.span.start);
                const lane = free === -SINGLE ? ends.length : free;

                ends[lane] = entry.span.end;
                lanes[entry.index] = lane;
            });

        return lanes;
    };

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
    export const computeOrder = (spans: TimelineSpan[], lanes: number[]): number[] =>
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
        spans: TimelineSpan[],
        lanes: number[],
        order: number[],
        view: TimelineSpan,
    ): TimelinePlacement[] =>
        order.map((index, position) => ({
            index,
            order: position,
            lane: lanes[index],
            startRatio: toRatio(spans[index].start, view),
            endRatio: toRatio(spans[index].end, view),
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
        spans: TimelineSpan[],
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
     * @param step `"first"`, `"last"`, `"previous"`, `"next"`, `"laneBefore"` or `"laneAfter"`.
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
        const isAfter = step === "laneAfter";

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
    export const computeMarkers = (values: number[], view: TimelineSpan): TimelineMarker[] =>
        values.map((value) => ({
            value,
            ratio: toRatio(value, view),
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
    export const moveEdge = (span: TimelineSpan, edge: TimelineEdge, value: number, range: TimelineSpan) => {
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
        range: TimelineSpan,
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
     * Picks the tick spacing for the current zoom.
     *
     * The spacing has to come from how much room a tick has on screen, not from the values themselves,
     * which is why the view's width in pixels is needed. From that, the coarsest step that still leaves
     * the ticks far enough apart is chosen — from ones, twos and fives within each decade, since those
     * are the only intervals people read off a scale without counting.
     *
     * @param viewExtent How much the view covers.
     * @param width The view's width in pixels.
     * @param minTickGap The closest two ticks may be, in pixels.
     * @param ladder Steps to choose from instead of the ones-twos-fives ladder, for a scale with its own
     * natural intervals — seconds, minutes, hours, days.
     * @returns The minor step and the coarser major step, which is always a whole multiple of it so the
     * labeled ticks line up with the unlabeled ones.
     */
    export const chooseSteps = (
        viewExtent: number,
        width: number,
        minTickGap: number,
        ladder?: number[],
    ): TimelineStepPair => {
        const needed = width <= NOTHING ? viewExtent : (viewExtent * minTickGap) / width;

        if (ladder?.length) {
            const ascending = [...ladder].sort((first, second) => first - second);
            const step = ascending.find((entry) => entry >= needed) ?? ascending[ascending.length - SINGLE];

            return { step, majorStep: chooseMajorStep(step, ascending, viewExtent) };
        }

        const exponent = Math.floor(Math.log10(Math.max(needed, Number.MIN_VALUE)));
        const base = DECADE ** exponent;
        const mantissa = needed / base;
        const at = MANTISSAS.findIndex((entry) => entry >= mantissa);
        const place = at === -SINGLE ? MANTISSAS.length : at;
        const stepOf = (position: number) =>
            MANTISSAS[position % MANTISSAS.length] * base * DECADE ** Math.floor(position / MANTISSAS.length);
        const step = stepOf(place);
        const decades = Array.from({ length: MANTISSAS.length }, (_unused, ahead) => stepOf(place + ahead + SINGLE));

        return { step, majorStep: chooseMajorStep(step, decades, viewExtent) };
    };

    /**
     * The ticks to draw in the current view.
     *
     * @param view The part of the range on screen.
     * @param steps The minor and major steps from {@link TimelineUtils.chooseSteps}.
     * @returns One tick per step within the view, each carrying its value, its position as a fraction of
     * the view, and whether it is a major tick and so gets a label. Capped in number, so a mismatched
     * step and view cannot produce a runaway list.
     */
    export const computeTicks = (view: TimelineSpan, steps: TimelineStepPair): TimelineTick[] => {
        const extent = getExtent(view);

        if (steps.step <= NOTHING || extent <= NOTHING) return [];

        const first = Math.ceil(view.start / steps.step - EPSILON) * steps.step;
        const count = Math.min(Math.floor((view.end - first) / steps.step) + SINGLE, MAX_TICKS);
        const ticks: TimelineTick[] = [];

        for (let index = NOTHING; index < count; index++) {
            const value = first + index * steps.step;

            ticks.push({
                value,
                ratio: (value - view.start) / extent,
                isMajor: isMultipleOf(value, steps.majorStep),
            });
        }

        return ticks;
    };

    /**
     * Whether a press should be answered at all: any touch or pen, and the primary button of a mouse.
     *
     * @param e The press, or anything carrying its `button` and `pointerType`.
     */
    export const getIsPrimaryPress = (e: { button: number; pointerType: string }) =>
        e.button === PRIMARY_BUTTON || e.pointerType !== "mouse";

    /**
     * Where a pointer sits across the timeline, as a fraction of its width.
     *
     * @param clientX The pointer's horizontal position in the window.
     * @param rect The timeline's box in the window. Missing, or of no width, reads as the middle.
     * @returns `0` at the left edge and `1` at the right, reaching outside that for a pointer outside the box.
     */
    export const computePointerRatio = (clientX: number, rect: { left: number; width: number } | undefined) => {
        if (rect === undefined || rect.width === NOTHING) return MIDDLE_RATIO;

        return (clientX - rect.left) / rect.width;
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
    export const computeShownSpans = (
        spans: TimelineSpan[],
        heldIndex: number | undefined,
        heldSpan: TimelineSpan | undefined,
    ) => {
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
     * How much one wheel event zooms by.
     *
     * @param deltaY The event's vertical travel. Down zooms out and up zooms in.
     * @returns The factor to scale the visible extent by.
     */
    export const computeWheelFactor = (deltaY: number) => Math.exp(deltaY * ZOOM_RATE);

    /**
     * Drag to pan, pinch to zoom, and the wheel, for one timeline.
     *
     * A press that stays within four pixels of where it went down is left alone, so its click still reaches the
     * item under it; past that, the pointer is captured and every move pans. Capturing only then is the whole trick:
     * capture taken on the press would redirect the click as well, and no item could ever be pressed. Two pointers
     * down make a pinch, which zooms by the change in their gap and pans by the change in their midpoint.
     *
     * @param defs Whether each gesture is on, the timeline's width, where a pointer sits across it, and the zoom and
     * pan commands, all read at the moment a gesture needs them.
     * @returns Handlers for the timeline root's pointer and wheel events. The move and release handlers take the
     * root, which is what holds the capture.
     */
    export const createGestureTracker = (defs: TimelineGestureDefs) => {
        const pointerXs = new Map<number, number>();

        let isGrabbing = false;
        let panFrom: number | undefined;
        let pinchGap: number | undefined;
        let pinchCenter: number | undefined;

        const pinch = () => {
            const [first, second] = [...pointerXs.values()];
            const gap = Math.abs(second - first);
            const center = (first + second) * MIDDLE_RATIO;

            if (pinchGap !== undefined && gap > NOTHING && pinchCenter !== undefined) {
                const ratio = defs.computePointerRatio(center);
                const width = defs.getWidth();

                if (defs.getIsZoomable()) defs.zoomBy(pinchGap / gap, ratio);
                if (defs.getIsPannable() && width > NOTHING) defs.panBy((pinchCenter - center) / width);
            }

            pinchGap = gap;
            pinchCenter = center;
        };

        return {
            press: (e: PointerEvent) => {
                if (!getIsPrimaryPress(e)) return;
                if (!defs.getIsPannable() && !defs.getIsZoomable()) return;

                pointerXs.set(e.pointerId, e.clientX);
                panFrom = pointerXs.size === SINGLE ? e.clientX : undefined;
                pinchGap = undefined;
            },
            move: (e: PointerEvent, element: HTMLElement) => {
                if (!pointerXs.has(e.pointerId)) return;

                pointerXs.set(e.pointerId, e.clientX);

                if (pointerXs.size >= PINCH_POINTERS) {
                    pinch();

                    return;
                }

                if (panFrom === undefined || !defs.getIsPannable()) return;

                const traveled = e.clientX - panFrom;

                if (!isGrabbing && Math.abs(traveled) < DRAG_SLOP) return;

                if (!isGrabbing) {
                    isGrabbing = true;
                    element.setPointerCapture(e.pointerId);
                }

                const width = defs.getWidth();

                if (width > NOTHING) defs.panBy(-traveled / width);

                panFrom = e.clientX;
            },
            release: (e: PointerEvent, element: HTMLElement) => {
                pointerXs.delete(e.pointerId);
                pinchGap = undefined;

                if (pointerXs.size < PINCH_POINTERS) panFrom = pointerXs.values().next().value;

                if (isGrabbing && pointerXs.size === NOTHING) {
                    isGrabbing = false;
                    element.releasePointerCapture(e.pointerId);
                }
            },
            wheel: (e: WheelEvent) => {
                if (!defs.getIsZoomable()) return;

                e.preventDefault();
                defs.zoomBy(computeWheelFactor(e.deltaY), defs.computePointerRatio(e.clientX));
            },
        };
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
        const asSpan = (place: CarryPlace) => place as TimelineSpan;

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

                const value = toValue(defs.computePointerRatio(point.x), defs.getView()) - defs.getGrabOffset();
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
