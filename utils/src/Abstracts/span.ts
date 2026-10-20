const DECADE = 10;
const MANTISSAS = [1, 2, 5];
const MAJOR_FACTOR = 3;
const MAX_TICKS = 512;
const EPSILON = 1e-9;

/**
 * A stretch of a line, from one value to another.
 *
 * The values are plain numbers in whatever unit the caller works in — pixels, seconds, dates, frame counts — so
 * one span serves a scroll position, a stretch of a timeline or the part of a range shown in a window.
 */
export type Span = {
    /** Where the stretch begins. */
    start: number;
    /** Where it ends, in the same unit. */
    end: number;
};

/** One mark along a scale, from {@link SpanUtils.getTicks}. */
export type SpanTick = {
    /** The value the mark stands at. */
    value: number;
    /** Where it sits along the span it was asked for, `0` at the start and `1` at the end. */
    ratio: number;
    /** Whether it falls on the coarser of the two steps, and so is the kind that gets a label. */
    isMajor: boolean;
};

/** The two spacings of a scale's marks, from {@link SpanUtils.chooseTickSteps}. */
export type SpanTickSteps = {
    /** The spacing of every mark. */
    step: number;
    /** The spacing of the labeled marks, always a whole multiple of `step`. */
    majorStep: number;
};

const isMultipleOf = (value: number, step: number) => Math.abs(value / step - Math.round(value / step)) < EPSILON;

const chooseMajorStep = (step: number, entries: number[], extent: number) => {
    const fitting = entries.filter((entry) => entry > step && entry <= extent && isMultipleOf(entry, step));

    return fitting.find((entry) => entry >= step * MAJOR_FACTOR) ?? fitting[0] ?? step;
};

/**
 * Measuring, moving and marking a {@link Span}.
 *
 * Two spans matter wherever a window looks at part of something larger, and the functions that move one keep them
 * apart: the range is all there is, and the span is the part of it in the window.
 */
export namespace SpanUtils {
    /** Measures how much a span covers. A span running backwards covers a negative amount. */
    export const getExtent = (span: Span) => span.end - span.start;

    /** Finds the middle of a span. */
    export const getCenter = (span: Span) => (span.start + span.end) * 0.5;

    /**
     * Builds a span of a given extent about a middle.
     *
     * @param center The middle.
     * @param extent How much it covers.
     */
    export const fromCenter = (center: number, extent: number): Span => ({
        start: center - extent * 0.5,
        end: center + extent * 0.5,
    });

    /**
     * Finds where a value sits in a span, as a share of it.
     *
     * @param value The value to place.
     * @param span The span to place it in.
     * @returns `0` at the start and `1` at the end, reaching outside that range for a value outside the span. A
     * span of no extent reports `0`.
     */
    export const toRatio = (value: number, span: Span) => {
        const extent = getExtent(span);

        return extent === 0 ? 0 : (value - span.start) / extent;
    };

    /**
     * Finds the value at a share along a span — the reverse of {@link toRatio}.
     *
     * @param ratio The share. Outside `0..1` it reaches past the span's ends.
     * @param span The span.
     */
    export const toValue = (ratio: number, span: Span) => span.start + ratio * getExtent(span);

    /**
     * Holds a span inside a range, keeping it a sensible size.
     *
     * The size is settled before the position, so a span wider than the range is shrunk to fit rather than being
     * left hanging off one end.
     *
     * @param span The span to correct.
     * @param range All there is.
     * @param minExtent The narrowest the span may get. Itself capped by the range, since a range narrower than the
     * minimum cannot be honored.
     */
    export const clamp = (span: Span, range: Span, minExtent: number): Span => {
        const available = Math.max(getExtent(range), 0);
        const extent = Math.min(Math.max(getExtent(span), Math.min(minExtent, available)), available);
        const start = Math.min(Math.max(span.start, range.start), range.end - extent);

        return { start, end: start + extent };
    };

    /**
     * Zooms a span about a point inside it.
     *
     * The value under the focus stays under it, which is what keeps a zoom anchored to the pointer rather than to
     * the middle. The answer is held inside the range by {@link clamp}.
     *
     * @param span The span before zooming.
     * @param factor Below `1` to zoom in, above to zoom out.
     * @param focusRatio Where the zoom is centered, as a share along the span.
     * @param range All there is.
     * @param minExtent The narrowest the span may get.
     */
    export const zoom = (span: Span, factor: number, focusRatio: number, range: Span, minExtent: number): Span => {
        const available = Math.max(getExtent(range), 0);
        const anchor = toValue(focusRatio, span);
        const extent = Math.min(Math.max(getExtent(span) * factor, Math.min(minExtent, available)), available);
        const start = anchor - focusRatio * extent;

        return clamp({ start, end: start + extent }, range, extent);
    };

    /**
     * Slides a span along, held inside the range.
     *
     * @param span The span before sliding.
     * @param ratio How far to move, as a share of the span's own extent, so the same move means the same at any
     * zoom.
     * @param range All there is.
     */
    export const pan = (span: Span, ratio: number, range: Span): Span => {
        const shift = getExtent(span) * ratio;

        return clamp({ start: span.start + shift, end: span.end + shift }, range, getExtent(span));
    };

    /**
     * Slides a span just far enough to bring another inside it, held inside the range.
     *
     * The span is neither zoomed nor centered: it moves the least that shows the target. A target too wide to fit
     * is lined up by its start.
     *
     * @param target The span to show.
     * @param span The span before sliding.
     * @param range All there is.
     * @returns `span` itself when the target is already inside it.
     */
    export const reveal = (target: Span, span: Span, range: Span): Span => {
        const shift =
            target.start < span.start
                ? target.start - span.start
                : target.end > span.end
                  ? Math.min(target.end - span.end, target.start - span.start)
                  : 0;

        if (shift === 0) return span;

        return clamp({ start: span.start + shift, end: span.end + shift }, range, getExtent(span));
    };

    /**
     * Puts spans on rows so that no two overlapping spans share one, using as few rows as the busiest moment needs.
     *
     * Spans are taken in start order and each goes on the first row already free where it starts, so adding a span
     * never moves the ones that start before it. Two spans that only touch, one ending where the other starts, may
     * share a row.
     *
     * @param spans The spans, in the caller's own order.
     * @returns One row number per span, counting from `0`, in that same order.
     */
    export const packLanes = (spans: readonly Span[]): number[] => {
        const lanes: number[] = spans.map(() => 0);
        const ends: number[] = [];

        spans
            .map((span, index) => ({ span, index }))
            .sort((first, second) => first.span.start - second.span.start || first.index - second.index)
            .forEach((entry) => {
                const free = ends.findIndex((end) => end <= entry.span.start);
                const lane = free === -1 ? ends.length : free;

                ends[lane] = entry.span.end;
                lanes[entry.index] = lane;
            });

        return lanes;
    };

    /**
     * Chooses how far apart a scale's marks go, so they are as close as they can be without crowding.
     *
     * The smallest step that keeps the marks `minGap` apart on screen is chosen from ones, twos and fives within
     * each power of ten — the spacings people read off a scale without counting — and a coarser step for the
     * labeled marks, preferring one at least three times the first.
     *
     * @param extent How much of the scale is shown.
     * @param length How long the shown part is drawn, in pixels.
     * @param minGap The closest two marks may be, in pixels.
     * @param ladder Steps to choose from instead, for a scale with its own natural spacings — seconds, minutes,
     * hours, days.
     * @returns The two steps. The labeled one is always a whole multiple of the other, so labeled marks line up with
     * the rest, and never wider than `extent` while a fitting one exists.
     */
    export const chooseTickSteps = (
        extent: number,
        length: number,
        minGap: number,
        ladder?: readonly number[],
    ): SpanTickSteps => {
        const needed = length <= 0 ? extent : (extent * minGap) / length;

        if (ladder?.length) {
            const ascending = [...ladder].sort((first, second) => first - second);
            const step = ascending.find((entry) => entry >= needed) ?? ascending[ascending.length - 1];

            return { step, majorStep: chooseMajorStep(step, ascending, extent) };
        }

        const exponent = Math.floor(Math.log10(Math.max(needed, Number.MIN_VALUE)));
        const base = DECADE ** exponent;
        const mantissa = needed / base;
        const at = MANTISSAS.findIndex((entry) => entry >= mantissa);
        const place = at === -1 ? MANTISSAS.length : at;
        const stepOf = (position: number) =>
            MANTISSAS[position % MANTISSAS.length] * base * DECADE ** Math.floor(position / MANTISSAS.length);
        const step = stepOf(place);
        const coarser = Array.from({ length: MANTISSAS.length }, (_unused, ahead) => stepOf(place + ahead + 1));

        return { step, majorStep: chooseMajorStep(step, coarser, extent) };
    };

    /**
     * Lists the marks a scale draws inside a span.
     *
     * @param span The part of the scale shown.
     * @param steps The spacings, from {@link chooseTickSteps}.
     * @returns One mark per step inside the span, in order. A step or a span of no size answers none, and the
     * list is capped at 512 marks, so a step far too small for the span cannot run away.
     */
    export const getTicks = (span: Span, steps: SpanTickSteps): SpanTick[] => {
        const extent = getExtent(span);

        if (steps.step <= 0 || extent <= 0) return [];

        const first = Math.ceil(span.start / steps.step - EPSILON) * steps.step;
        const count = Math.min(Math.floor((span.end - first) / steps.step) + 1, MAX_TICKS);
        const ticks: SpanTick[] = [];

        for (let index = 0; index < count; index++) {
            const value = first + index * steps.step;

            ticks.push({ value, ratio: (value - span.start) / extent, isMajor: isMultipleOf(value, steps.majorStep) });
        }

        return ticks;
    };
}
