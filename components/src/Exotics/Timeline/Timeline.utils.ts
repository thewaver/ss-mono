import type {
    TimelinePlacement,
    TimelineSpan,
    TimelineStep,
    TimelineStepPair,
    TimelineStop,
    TimelineTick,
} from "./Timeline.types";

const NOTHING = 0;
const SINGLE = 1;
const DECADE = 10;
const MANTISSAS = [1, 2, 5];
const MAJOR_FACTOR = 3;
const MAX_TICKS = 512;
const EPSILON = 1e-9;

const isMultipleOf = (value: number, step: number) => Math.abs(value / step - Math.round(value / step)) < EPSILON;

const chooseMajorStep = (step: number, entries: number[], viewExtent: number) => {
    const fitting = entries.filter((entry) => entry > step && entry <= viewExtent && isMultipleOf(entry, step));

    return fitting.find((entry) => entry >= step * MAJOR_FACTOR) ?? fitting[NOTHING] ?? step;
};

export namespace TimelineUtils {
    export const getExtent = (span: TimelineSpan) => span.end - span.start;

    export const toRatio = (value: number, span: TimelineSpan) => {
        const extent = getExtent(span);

        return extent === NOTHING ? NOTHING : (value - span.start) / extent;
    };

    export const toValue = (ratio: number, span: TimelineSpan) => span.start + ratio * getExtent(span);

    export const clampView = (view: TimelineSpan, range: TimelineSpan, minExtent: number): TimelineSpan => {
        const available = Math.max(getExtent(range), NOTHING);
        const extent = Math.min(Math.max(getExtent(view), Math.min(minExtent, available)), available);
        const start = Math.min(Math.max(view.start, range.start), range.end - extent);

        return { start, end: start + extent };
    };

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

    export const panView = (view: TimelineSpan, ratio: number, range: TimelineSpan): TimelineSpan => {
        const shift = getExtent(view) * ratio;

        return clampView({ start: view.start + shift, end: view.end + shift }, range, getExtent(view));
    };

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

    export const computeStops = (
        spans: TimelineSpan[],
        lanes: number[],
        order: number[],
        isDisabled: boolean[],
    ): TimelineStop[] =>
        order
            .map((index, position) => ({ index, order: position, lane: lanes[index], span: spans[index] }))
            .filter((stop) => !isDisabled[stop.index]);

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
