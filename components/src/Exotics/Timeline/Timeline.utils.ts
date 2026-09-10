import type {
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
/** How much coarser a major tick should be than a minor one before it is worth labelling. */
const MAJOR_FACTOR = 3;
/** A cap on how many ticks are produced, in case a view and a step disagree wildly. */
const MAX_TICKS = 512;
/** Slack for comparing values that arrived by division, where a whole number may be off in its last bits. */
const EPSILON = 1e-9;

/** Whether a value falls on a step, allowing for floating-point drift. */
const isMultipleOf = (value: number, step: number) => Math.abs(value / step - Math.round(value / step)) < EPSILON;

/**
 * Picks which step gets the labelled ticks.
 *
 * It must be a whole multiple of the minor step, or the major ticks would not line up with the minor
 * ones, and it must fit in the view or nothing would be labelled at all. Comfortably coarser than
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
     * than the minimum cannot be honoured.
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
     * @param focusRatio Where the zoom is centred, as a fraction across the view.
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
     * The view is not zoomed and not centred; it moves the minimum needed, which is what keeps a keyboard
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
     * labelled ticks line up with the unlabelled ones.
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
}
